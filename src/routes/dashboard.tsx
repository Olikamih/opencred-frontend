import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Plus,
  BarChart3,
  Clock,
  X,
  CheckCircle2,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { ScoreGauge } from "@/components/ScoreGauge";
import { EarningsChart } from "@/components/EarningsChart";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function brl(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function groupByMonth(transactions: any[]) {
  const labels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const months: Record<string, number> = {};
  transactions
    .filter((t) => t.type === "entrada")
    .forEach((t) => {
      const date = new Date(t.createdAt || Date.now());
      const key = labels[date.getMonth()];
      months[key] = (months[key] || 0) + Number(t.amount);
    });
  return Object.entries(months).map(([month, amount]) => ({ month, amount }));
}

function CreditModal({ limit, onClose }: { limit: number; onClose: () => void }) {
  const [step, setStep] = React.useState<"form" | "success">("form");
  const [valor, setValor] = React.useState("");
  const [parcelas, setParcelas] = React.useState("12");
  const [loading, setLoading] = React.useState(false);

  const valorNum = parseFloat(valor.replace(",", ".")) || 0;
  const parcelasNum = parseInt(parcelas);
  const parcela = valorNum > 0 ? valorNum / parcelasNum : 0;

  async function handleSubmit() {
    if (valorNum <= 0 || valorNum > limit) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      await fetch("http://localhost:1818/credit/request", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, amount: valorNum, installments: parcelasNum }),
      });
    } catch {
      // demo: mostra sucesso mesmo sem backend
    } finally {
      setLoading(false);
      setStep("success");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="glass relative w-full max-w-md rounded-3xl p-8 shadow-glow-purple mx-4">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-white/10 transition"
        >
          <X className="h-4 w-4" />
        </button>

        {step === "form" ? (
          <>
            <h2 className="text-xl font-bold mb-1">Solicitar crédito</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Limite disponível:{" "}
              <span className="font-semibold text-neon">{brl(limit)}</span>
            </p>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs text-muted-foreground uppercase tracking-wider">
                  Valor desejado (R$)
                </label>
                <input
                  type="number"
                  placeholder="Ex: 3000"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  max={limit}
                  min={100}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                />
                {valorNum > limit && (
                  <p className="mt-1 text-xs text-destructive">
                    Valor excede seu limite disponível.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs text-muted-foreground uppercase tracking-wider">
                  Parcelas
                </label>
                <select
                  value={parcelas}
                  onChange={(e) => setParcelas(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-primary/50 focus:outline-none"
                >
                  {[3, 6, 12, 18, 24].map((n) => (
                    <option key={n} value={n} className="bg-background">
                      {n}x
                    </option>
                  ))}
                </select>
              </div>

              {valorNum > 0 && valorNum <= limit && (
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs text-muted-foreground">Valor da parcela estimado</p>
                  <p className="text-2xl font-bold text-neon">{brl(parcela)}<span className="text-sm font-normal text-muted-foreground">/mês</span></p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading || valorNum <= 0 || valorNum > limit}
                className="w-full rounded-xl bg-gradient-primary py-3 text-sm font-semibold text-white shadow-glow transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? "Processando..." : "Confirmar solicitação"}
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
              <CheckCircle2 className="h-8 w-8 text-neon" />
            </div>
            <h2 className="text-xl font-bold">Solicitação enviada</h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              Sua solicitação de {brl(valorNum)} em {parcelas}x foi registrada com sucesso. Você receberá uma resposta em breve.
            </p>
            <button
              onClick={onClose}
              className="mt-2 w-full rounded-xl bg-gradient-primary py-3 text-sm font-semibold text-white shadow-glow"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  const [realScore, setRealScore] = React.useState(0);
  const [transactions, setTransactions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showCreditModal, setShowCreditModal] = React.useState(false);

  React.useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      navigate({ to: "/login" });
      return;
    }

    Promise.all([
      fetch(`http://localhost:1818/transactions/score/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
      fetch(`http://localhost:1818/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
    ])
      .then(([scoreData, transData]) => {
        setRealScore(scoreData.score || 0);
        const userTrans = transData.filter(
          (t: any) => t.user?.id === userId || t.userId === userId
        );
        setTransactions(userTrans);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [navigate]);

  const totalGanhosReais = transactions
    .filter((t) => t.type === "entrada")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const creditLimit = realScore * 10.5;

  // 🧠 GRÁFICO INTELIGENTE (SEM DADOS FALSOS)
  const chartData = (() => {
    const real = groupByMonth(transactions);
    if (real.length > 0) return real;
    
    // Se não tiver transações, cria um gráfico vazio (zerado) para os últimos 6 meses
    const labels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const currentMonth = new Date().getMonth();
    const emptyData = [];
    for (let i = 5; i >= 0; i--) {
      let m = currentMonth - i;
      if (m < 0) m += 12;
      emptyData.push({ month: labels[m], amount: 0 });
    }
    return emptyData;
  })();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      {showCreditModal && (
        <CreditModal limit={creditLimit} onClose={() => setShowCreditModal(false)} />
      )}

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Autônomo</p>
            <h1 className="text-3xl font-bold">Painel financeiro</h1>
          </div>
          <Link
            to="/connect"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-medium text-white shadow-glow"
          >
            <Plus className="h-4 w-4" />
            Conectar instituição
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="glass rounded-3xl p-8 lg:col-span-2">
            <ScoreGauge score={realScore} />
          </section>

          <section className="glass rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Wallet className="h-4 w-4 shrink-0" />
                <span>Limite pré-aprovado</span>
              </div>
              <p className="mt-3 text-4xl font-bold text-neon">{brl(creditLimit)}</p>
            </div>
            <button
              onClick={() => setShowCreditModal(true)}
              disabled={creditLimit <= 0}
              className="mt-6 w-full rounded-xl bg-gradient-primary py-3 text-sm font-semibold text-white shadow-glow transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Solicitar crédito
            </button>
          </section>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <section className="glass rounded-3xl p-6 lg:col-span-2">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-base font-semibold">Ganhos identificados</h3>
                </div>
                <p className="text-xs text-muted-foreground">Via Open Finance</p>
              </div>
              <p className="text-2xl font-bold text-neon">{brl(totalGanhosReais)}</p>
            </div>
            <EarningsChart data={chartData} />
          </section>

          <section className="glass rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-base font-semibold">Últimas transações</h3>
            </div>
            <ul className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
              {transactions.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  Você ainda não conectou nenhuma instituição.
                </p>
              ) : (
                transactions.map((t, i) => {
                  const positive = t.type === "entrada";
                  return (
                    <li key={i} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                            positive ? "bg-success/15 text-neon" : "bg-destructive/15 text-destructive"
                          }`}
                        >
                          {positive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{t.institution_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(t.createdAt || Date.now()).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                      <span className={`text-sm font-semibold ${positive ? "text-neon" : "text-foreground"}`}>
                        {positive ? "+" : "−"} {brl(Number(t.amount))}
                      </span>
                    </li>
                  );
                })
              )}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}