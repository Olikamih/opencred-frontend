import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, Sparkles, Plus } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { ScoreGauge } from "@/components/ScoreGauge";
import { EarningsChart } from "@/components/EarningsChart";
import {
  MOCK_LIMIT,
  MOCK_MONTHLY_EARNINGS,
  MOCK_SCORE,
  MOCK_TRANSACTIONS,
} from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — OpenCred" },
      { name: "description", content: "Acompanhe seu Score OpenCred e seu limite pré-aprovado." },
    ],
  }),
  component: DashboardPage,
});

function brl(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function DashboardPage() {
  const monthTotal = MOCK_TRANSACTIONS.filter((t) => t.type === "entrada").reduce(
    (s, t) => s + t.amount,
    0,
  );

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Olá, autônomo 👋</p>
            <h1 className="text-3xl font-bold">Seu painel financeiro</h1>
          </div>
          <Link
            to="/connect"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-medium text-white shadow-glow"
          >
            <Plus className="h-4 w-4" /> Conectar instituição
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Score */}
          <section className="glass relative overflow-hidden rounded-3xl p-8 lg:col-span-2">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-secondary/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
            <div className="relative flex flex-col items-center md:flex-row md:items-center md:gap-12">
              <ScoreGauge score={MOCK_SCORE} />
              <div className="mt-4 flex-1 md:mt-0">
                <h2 className="text-xl font-semibold">Score OpenCred</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Calculado a partir do seu fluxo de caixa real. Quanto mais
                  instituições conectadas, mais preciso fica.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <Mini label="Variação 30d" value="+38" tone="neon" Icon={TrendingUp} />
                  <Mini label="Tendência" value="Subindo" tone="neon" Icon={ArrowUpRight} />
                </div>
              </div>
            </div>
          </section>

          {/* Limite pré-aprovado */}
          <section className="glass relative overflow-hidden rounded-3xl p-8">
            <div className="pointer-events-none absolute inset-0 bg-gradient-primary opacity-15" />
            <div className="relative">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wallet className="h-4 w-4" /> Limite pré-aprovado
              </div>
              <p className="mt-3 text-4xl font-bold text-neon">{brl(MOCK_LIMIT)}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Disponível em até 24h após contratação.
              </p>
              <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium hover:bg-white/15 transition">
                <Sparkles className="h-4 w-4" /> Solicitar crédito
              </button>
            </div>
          </section>
        </div>

        {/* Earnings + transactions */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <section className="glass rounded-3xl p-6 lg:col-span-2">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h3 className="text-lg font-semibold">Ganhos mensais</h3>
                <p className="text-xs text-muted-foreground">Últimos 6 meses</p>
              </div>
              <p className="text-2xl font-bold text-neon">{brl(monthTotal * 4)}</p>
            </div>
            <EarningsChart data={MOCK_MONTHLY_EARNINGS} />
          </section>

          <section className="glass rounded-3xl p-6">
            <h3 className="text-lg font-semibold">Últimas transações</h3>
            <ul className="mt-4 divide-y divide-white/5">
              {MOCK_TRANSACTIONS.map((t, i) => {
                const positive = t.type === "entrada";
                return (
                  <li key={i} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                          positive ? "bg-success/15 text-neon" : "bg-destructive/15 text-destructive"
                        }`}
                      >
                        {positive ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t.institution_name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{t.type}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${positive ? "text-neon" : "text-foreground"}`}>
                      {positive ? "+" : "-"}
                      {brl(t.amount)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}

function Mini({ label, value, tone, Icon }: { label: string; value: string; tone?: "neon"; Icon: typeof TrendingUp }) {
  return (
    <div className="glass rounded-xl p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <p className={`mt-1 text-lg font-semibold ${tone === "neon" ? "text-neon" : ""}`}>{value}</p>
    </div>
  );
}
