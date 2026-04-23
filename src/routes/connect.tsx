import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { InstitutionCard } from "@/components/InstitutionCard";
import { MOCK_INSTITUTIONS } from "@/lib/mock-data";
import type { Institution, InstitutionCategory } from "@/lib/types";

export const Route = createFileRoute("/connect")({
  head: () => ({
    meta: [
      { title: "Conectar instituições — OpenCred" },
      {
        name: "description",
        content: "Conecte plataformas de trabalho, bancos e carteiras para fortalecer seu score.",
      },
    ],
  }),
  component: ConnectPage,
});

const TABS: { value: "all" | InstitutionCategory; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "work_platform", label: "Plataformas" },
  { value: "bank_data", label: "Bancos" },
  { value: "wallet", label: "Carteiras" },
];

function ConnectPage() {
  const [tab, setTab] = useState<"all" | InstitutionCategory>("all");
  const [items, setItems] = useState<Institution[]>(MOCK_INSTITUTIONS);

  const visible = useMemo(
    () => (tab === "all" ? items : items.filter((i) => i.institution_category === tab)),
    [items, tab],
  );

  const connected = items.filter((i) => i.connected).length;

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="glass relative overflow-hidden rounded-3xl p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-secondary/30 blur-3xl" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Conectar instituições</h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Quanto mais fontes conectadas, mais preciso e justo fica o seu Score OpenCred.
                Conexão regulada por Open Finance.
              </p>
            </div>
            <div className="glass rounded-2xl px-5 py-3 text-right">
              <p className="text-xs text-muted-foreground">Conectadas</p>
              <p className="text-2xl font-bold text-neon">
                {connected}<span className="text-muted-foreground text-base">/{items.length}</span>
              </p>
            </div>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-neon" />
            Criptografia ponta a ponta · regulado pelo Banco Central
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex flex-wrap gap-2">
          {TABS.map((t) => {
            const active = tab === t.value;
            return (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  active
                    ? "bg-gradient-primary text-white shadow-glow"
                    : "glass hover:bg-white/10 text-muted-foreground"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((inst) => (
            <InstitutionCard
              key={inst.institution_name}
              inst={inst}
              onConnect={(i) =>
                setItems((prev) =>
                  prev.map((p) =>
                    p.institution_name === i.institution_name ? { ...p, connected: true } : p,
                  ),
                )
              }
            />
          ))}
        </div>
      </main>
    </div>
  );
}
