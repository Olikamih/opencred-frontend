import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, TrendingUp, Zap, Building2, Briefcase, Wallet } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OpenCred — Seu trabalho diário é o seu novo Score" },
      {
        name: "description",
        content:
          "Score de crédito justo para motoristas de app, entregadores e MEIs, baseado no seu fluxo de caixa real via Open Finance.",
      },
      { property: "og:title", content: "OpenCred — Score justo para autônomos" },
      { property: "og:description", content: "Conecte suas plataformas e bancos. Ganhe um score baseado no seu trabalho real." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-6 pt-20 pb-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Open Finance · Score em tempo real
          </span>
          <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            Seu trabalho diário é o<br />
            <span className="text-gradient">seu novo Score</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Crédito justo para motoristas de app, entregadores e MEIs. Conecte
            suas plataformas e bancos — sem burocracia, sem injustiça.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3.5 font-medium text-white shadow-glow transition hover:opacity-90"
            >
              Simular meu Score
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link
              to="/dashboard"
              className="glass rounded-xl px-6 py-3.5 font-medium hover:bg-white/10 transition"
            >
              Ver demo do Dashboard
            </Link>
          </div>
        </div>

        {/* Floating preview card */}
        <div className="relative mx-auto mt-20 max-w-4xl">
          <div className="glass-strong rounded-3xl p-8 shadow-glow-purple">
            <div className="grid gap-6 md:grid-cols-3">
              <Stat icon={TrendingUp} label="Score médio" value="782" tone="neon" />
              <Stat icon={Wallet} label="Limite pré-aprovado" value="R$ 8.450" tone="neon" />
              <Stat icon={ShieldCheck} label="Instituições" value="+30" tone="muted" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 pb-28">
        <div className="grid gap-6 md:grid-cols-3">
          <Feature
            Icon={Briefcase}
            title="Plataformas de trabalho"
            text="Uber, iFood, 99, Rappi. Cada corrida e entrega vira histórico."
          />
          <Feature
            Icon={Building2}
            title="Open Finance"
            text="Conecte Nubank, Itaú e outros bancos com segurança regulada."
          />
          <Feature
            Icon={Zap}
            title="Score em segundos"
            text="Algoritmo justo que entende o fluxo de caixa do trabalhador autônomo."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 pb-28">
        <div className="glass relative overflow-hidden rounded-3xl p-12 text-center">
          <div className="pointer-events-none absolute inset-0 bg-gradient-primary opacity-20" />
          <div className="relative">
            <h2 className="text-3xl font-bold md:text-4xl">Pronto para descobrir seu score?</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Leva menos de 2 minutos. 100% gratuito, sem afetar seu CPF.
            </p>
            <Link
              to="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3.5 font-medium text-white shadow-glow"
            >
              Começar agora <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} OpenCred · Open Finance para quem trabalha de verdade.
      </footer>
    </div>
  );
}

function Stat({ icon: Icon, label, value, tone }: { icon: typeof TrendingUp; label: string; value: string; tone: "neon" | "muted" }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className={`text-2xl font-bold ${tone === "neon" ? "text-neon" : ""}`}>{value}</p>
      </div>
    </div>
  );
}

function Feature({ Icon, title, text }: { Icon: typeof TrendingUp; title: string; text: string }) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
