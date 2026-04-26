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

type Transaction = {
  id?: string | number;
  type: "entrada" | "saida" | string;
  amount: number | string;
  createdAt?: string;
  institution_name?: string;
  userId?: string | number;
  user?: {
    id?: string | number;
  };
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function brl(v: number) {
  return v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function groupByMonth(transactions: Transaction[]) {
  const labels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const months: Record<string, number> = {};

  transactions
    .filter((t) => t.type === "entrada")
    .forEach((t) => {
      const date = new Date(t.createdAt || Date.now());
      const key = labels[date.getMonth()];
      months[key] = (months[key] || 0) + Number(t.amount || 0);
    });

  return Object.entries(months).map(([month, amount]) => ({ month, amount }));
}

function CreditModal({ limit, onClose }: { limit: number; onClose: () => void }) {
  const [step, setStep] = React.useState<"form" | "success">("form");
  const [valor, setValor] = React.useState("");
  const [parcelas, setParcelas] = React.useState("12");
  const [loading, setLoading] = React.useState(false);

  const valorNum = parseFloat(valor.replace(",", ".")) || 0;
  const parcelasNum = parseInt(parcelas, 10);
  const parcela = valorNum > 0 ? valorNum / parcelasNum : 0;

  async function handleSubmit() {
    if (valorNum <= 0 || valorNum > limit) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      await fetch(`${API_URL}/credit/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          userId,
          amount: valorNum,
          installments: parcelasNum,
        }),
      });
    } catch (error) {
      console.error("Erro ao solicitar crédito:", error);
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
      <div className="glass relative mx-4 w-full max-w-md rounded-3xl p-8 shadow-glow-purple">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground transition hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </button>

        {step === "form" ? (
          <>
            <h2 className="mb-1 text-xl font-bold">Solicitar crédito</h2>

            <p className="mb-6 text-sm text-muted-foreground">
              Limite disponível:{" "}
              <span className="font-semibold text-neon">{brl(limit)}</span>
            </p>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
                  Valor desejado
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
                <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
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
                  <p className="text-xs text-muted-foreground">
                    Valor da parcela estimado
                  </p>

                  <p className="text-2xl font-bold text-neon">
                    {brl(parcela)}
                    <span className="text-sm font-normal text-muted-foreground">
                      /mês
                    </span>
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || valorNum <= 0 || valorNum > limit}
                className="w-full rounded-xl bg-gradient-primary py-3 text-sm font-semibold text-white shadow-glow transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
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

            <p className="max-w-xs text-sm text-muted-foreground">
              Sua solicitação de {brl(valorNum)} em {parcelas}x foi registrada
              com sucesso.
            </p>

            <button
              type="button"
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

  const [realScore, setRealScore] = React.useState(720);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showCreditModal, setShowCreditModal] = React.useState(false);

  React.useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      navigate({ to: "/login" });
      return;
    }

    async function loadDashboard() {
      try {
        const [scoreRes, transRes] = await Promise.all([
          fetch(`${API_URL}/transactions/score/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/transactions`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (scoreRes.ok) {
          const scoreData = await scoreRes.json();
          setRealScore(Number(scoreData?.score || 720));
        }

        if (transRes.ok) {
          const transData = await transRes.json();
          const list: Transaction[] = Array.isArray(transData) ? transData : [];

          const userTrans = list.filter((t) => {
            return (
              String(t.user?.id) === String(userId) ||
              String(t.userId) === String(userId)
            );
          });

          setTransactions(userTrans);
        }
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [navigate]);

  const demoTransactions: Transaction[] = [
    {
      id: "demo-1",
      type: "entrada",
      amount: 4200,
      institution_name: "Banco Simulado",
      createdAt: new Date().toISOString(),
    },
    {
      id: "demo-2",
      type: "entrada",
      amount: 1800,
      institution_name: "Carteira Digital",
      createdAt: new Date().toISOString(),
    },
    {
      id: "demo-3",
      type: "saida",
      amount: 650,
      institution_name: "Pagamento mensal",
      createdAt: new Date().toISOString(),
    },
  ];

  const dashboardTransactions =
    transactions.length > 0 ? transactions : demoTransactions;

  const totalGanhosReais = dashboardTransactions
    .filter((t) => t.type === "entrada")
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const totalSaidas = dashboardTransactions
    .filter((t) => t.type === "saida")
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const creditLimit = realScore * 10.5;

  const chartData = React.useMemo(() => {
    const real = groupByMonth(dashboardTransactions);

    if (real.length > 0) return real;

    return [
      { month: "Jan", amount: 1200 },
      { month: "Fev", amount: 1800 },
      { month: "Mar", amount: 2400 },
      { month: "Abr", amount: 4200 },
    ];
  }, [dashboardTransactions]);

  const recentTransactions = dashboardTransactions.slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="mx-auto flex max-w-7xl items-center justify-center px-6 py-20">
          <p className="text-sm text-muted-foreground">
            Carregando painel financeiro...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {showCreditModal && (
        <CreditModal
          limit={creditLimit}
          onClose={() => setShowCreditModal(false)}
        />
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

        <section className="grid gap-5 md:grid-cols-3">
          <div className="glass rounded-3xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Score OpenCred</p>
              <BarChart3 className="h-5 w-5 text-neon" />
            </div>

            <div className="flex items-center justify-center">
              <ScoreGauge score={realScore} />
            </div>
          </div>

          <div className="glass rounded-3xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Ganhos registrados</p>
              <ArrowUpRight className="h-5 w-5 text-neon" />
            </div>

            <p className="text-3xl font-bold">{brl(totalGanhosReais)}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Entradas identificadas ou simuladas para demonstração.
            </p>
          </div>

          <div className="glass rounded-3xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Limite estimado</p>
              <Wallet className="h-5 w-5 text-neon" />
            </div>

            <p className="text-3xl font-bold">{brl(creditLimit)}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Baseado no score financeiro atual.
            </p>

            <button
              type="button"
              onClick={() => setShowCreditModal(true)}
              className="mt-5 w-full rounded-xl bg-gradient-primary py-3 text-sm font-semibold text-white shadow-glow"
            >
              Solicitar crédito
            </button>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="glass rounded-3xl p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Ganhos por mês</h2>
                <p className="text-sm text-muted-foreground">
                  Evolução das entradas financeiras.
                </p>
              </div>
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
            </div>

            <EarningsChart data={chartData} />
          </div>

          <div className="glass rounded-3xl p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Resumo</h2>
                <p className="text-sm text-muted-foreground">
                  Visão geral da sua conta.
                </p>
              </div>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-muted-foreground">Total de entradas</p>
                <p className="mt-1 text-2xl font-bold text-neon">
                  {brl(totalGanhosReais)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-muted-foreground">Total de saídas</p>
                <p className="mt-1 text-2xl font-bold">{brl(totalSaidas)}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-muted-foreground">
                  Transações encontradas
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {dashboardTransactions.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <div className="glass rounded-3xl p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Transações recentes</h2>
                <p className="text-sm text-muted-foreground">
                  Últimos registros do dashboard.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {recentTransactions.map((t, index) => {
                const isEntrada = t.type === "entrada";

                return (
                  <div
                    key={t.id || index}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                        {isEntrada ? (
                          <ArrowUpRight className="h-5 w-5 text-neon" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-destructive" />
                        )}
                      </div>

                      <div>
                        <p className="font-medium">
                          {t.institution_name || "Instituição conectada"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t.createdAt
                            ? new Date(t.createdAt).toLocaleDateString("pt-BR")
                            : "Data não informada"}
                        </p>
                      </div>
                    </div>

                    <p
                      className={`font-bold ${
                        isEntrada ? "text-neon" : "text-destructive"
                      }`}
                    >
                      {isEntrada ? "+" : "-"} {brl(Number(t.amount || 0))}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}