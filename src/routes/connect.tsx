import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { InstitutionCard } from "@/components/InstitutionCard";
import { MOCK_INSTITUTIONS } from "@/lib/mock-data";
import type { Institution, InstitutionCategory } from "@/lib/types";

export const Route = createFileRoute("/connect")({
  component: ConnectPage,
});

const TABS: { value: "all" | InstitutionCategory; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "work_platform", label: "Plataformas" },
  { value: "bank_data", label: "Bancos" },
  { value: "wallet", label: "Carteiras" },
];

function ConnectPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"all" | InstitutionCategory>("all");

  const [items, setItems] = useState<Institution[]>(() => {
    const saved = localStorage.getItem("connected_items");
    return saved ? JSON.parse(saved) : MOCK_INSTITUTIONS;
  });

  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    localStorage.setItem("connected_items", JSON.stringify(items));
  }, [items]);

  const visible = useMemo(
    () => (tab === "all" ? items : items.filter((i) => i.institution_category === tab)),
    [items, tab]
  );

  const connectedCount = items.filter((i) => i.connected).length;

  const simularConexao = async (inst: Institution) => {
    if (isSyncing || inst.connected) return;
    setIsSyncing(true);

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    setItems((prev) =>
      prev.map((p) =>
        p.institution_name === inst.institution_name ? { ...p, connected: true } : p
      )
    );

    try {
      await fetch("http://localhost:1818/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          institution_name: inst.institution_name,
          institution_category: inst.institution_category,
          amount: 2500.0,
          type: "entrada",
          description: `Conexão Open Finance: ${inst.institution_name}`,
        }),
      });
    } catch (err) {
      console.error("Falha na conexão com a API.", err);
    } finally {
      setTimeout(() => {
        setIsSyncing(false);
        navigate({ to: "/dashboard" });
      }, 1200);
    }
  };

  const desconectar = async (inst: Institution) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    // Atualiza UI imediatamente
    setItems((prev) =>
      prev.map((p) =>
        p.institution_name === inst.institution_name ? { ...p, connected: false } : p
      )
    );

    // Tenta avisar o backend (sem bloquear a UI)
    try {
      await fetch(`http://localhost:1818/institutions/disconnect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          institution_name: inst.institution_name,
        }),
      });
    } catch {
      // silencioso — a UI já reflete o estado correto
    }
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-10">

        <div className="glass relative overflow-hidden rounded-3xl p-8 mb-8">
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Conectar instituições</h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Sincronize seus dados para aumentar seu limite de crédito.
              </p>
            </div>
            <div className="glass rounded-2xl px-5 py-3 text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Conectadas</p>
              <p className="text-2xl font-bold text-neon">{connectedCount}/{items.length}</p>
            </div>
          </div>
        </div>

        {isSyncing && (
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-primary/10 border border-primary/20 px-5 py-3.5 text-sm text-neon">
            <RefreshCw className="h-4 w-4 animate-spin shrink-0" />
            Sincronizando dados com segurança via Open Finance...
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`rounded-full px-6 py-2 text-sm whitespace-nowrap transition ${
                tab === t.value
                  ? "bg-gradient-primary text-white"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((inst) => (
            <InstitutionCard
              key={inst.institution_name}
              inst={inst}
              onConnect={() => simularConexao(inst)}
              onDisconnect={() => desconectar(inst)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}