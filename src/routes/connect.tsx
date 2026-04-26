import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { InstitutionCard } from "@/components/InstitutionCard";
import { MOCK_INSTITUTIONS } from "@/lib/mock-data";
import type { Institution, InstitutionCategory } from "@/lib/types";

export const Route = createFileRoute("/connect")({
  component: ConnectPage,
});

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const TABS: { value: "all" | InstitutionCategory; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "work_platform", label: "Plataformas" },
  { value: "bank_data", label: "Bancos" },
  { value: "wallet", label: "Carteiras" },
];

function gerarTransacoesFake(inst: Institution, userId: string) {
  const entradasBase =
    inst.institution_category === "work_platform"
      ? [1800, 2200, 2500, 3100, 2800, 3400]
      : inst.institution_category === "bank_data"
      ? [2500, 2700, 3000, 3200, 2900, 3500]
      : [900, 1200, 1500, 1800, 1600, 2100];

  const saidasBase = [180, 250, 320, 450, 600];

  const hoje = new Date();

  const entradas = entradasBase.map((amount, index) => {
    const date = new Date(hoje);
    date.setMonth(hoje.getMonth() - (entradasBase.length - 1 - index));

    return {
      userId,
      institution_name: inst.institution_name,
      institution_category: inst.institution_category,
      amount,
      type: "entrada",
      description: `Recebimento via ${inst.institution_name}`,
      createdAt: date.toISOString(),
    };
  });

  const saidas = saidasBase.map((amount, index) => {
    const date = new Date(hoje);
    date.setMonth(hoje.getMonth() - index);
    date.setDate(15);

    return {
      userId,
      institution_name: inst.institution_name,
      institution_category: inst.institution_category,
      amount,
      type: "saida",
      description: `Movimentação de saída - ${inst.institution_name}`,
      createdAt: date.toISOString(),
    };
  });

  return [...entradas, ...saidas];
}

function ConnectPage() {
  const navigate = useNavigate();

  const [tab, setTab] = useState<"all" | InstitutionCategory>("all");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  const [items, setItems] = useState<Institution[]>(() => {
    try {
      const saved = localStorage.getItem("connected_items");
      return saved ? JSON.parse(saved) : MOCK_INSTITUTIONS;
    } catch {
      return MOCK_INSTITUTIONS;
    }
  });

  useEffect(() => {
    localStorage.setItem("connected_items", JSON.stringify(items));
  }, [items]);

  const visible = useMemo(() => {
    if (tab === "all") return items;
    return items.filter((i) => i.institution_category === tab);
  }, [items, tab]);

  const connectedCount = items.filter((i) => i.connected).length;

  async function simularConexao(inst: Institution) {
    if (isSyncing || inst.connected) return;

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!userId || !token) {
      navigate({ to: "/login" });
      return;
    }

    setIsSyncing(true);
    setSyncMessage(`Conectando ${inst.institution_name}...`);

    try {
      const transacoes = gerarTransacoesFake(inst, userId);

      // tenta salvar no backend
      for (const transacao of transacoes) {
        try {
          await fetch(`${API_URL}/transactions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(transacao),
          });
        } catch (error) {
          console.warn("Falha no backend, seguindo com modo visual:", error);
        }
      }

      // atualização visual imediata do dashboard
      let user = savedUser ? JSON.parse(savedUser) : {};

      const novoScore = Number(user?.credit_score ?? 300) + 120;
      const novoLimite = Number(user?.current_limit ?? 0) + 2500;

      user = {
        ...user,
        credit_score: novoScore,
        current_limit: novoLimite,
      };

      localStorage.setItem("user", JSON.stringify(user));

      setItems((prev) =>
        prev.map((p) =>
          p.institution_name === inst.institution_name
            ? { ...p, connected: true }
            : p
        )
      );

      setSyncMessage("Dados sincronizados com sucesso!");

      setTimeout(() => {
        navigate({ to: "/dashboard" });
      }, 1200);
    } catch (err) {
      console.error("Falha geral:", err);

      // fallback visual obrigatório
      let user = savedUser ? JSON.parse(savedUser) : {};

      user = {
        ...user,
        credit_score: 720,
        current_limit: 2500,
      };

      localStorage.setItem("user", JSON.stringify(user));

      setSyncMessage("Conexão simulada com sucesso!");

      setTimeout(() => {
        navigate({ to: "/dashboard" });
      }, 1200);
    } finally {
      setTimeout(() => {
        setIsSyncing(false);
      }, 1200);
    }
  }

  async function desconectar(inst: Institution) {
    const token = localStorage.getItem("token");

    setItems((prev) =>
      prev.map((p) =>
        p.institution_name === inst.institution_name
          ? { ...p, connected: false }
          : p
      )
    );

    try {
      await fetch(`${API_URL}/institutions/disconnect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({
          institution_name: inst.institution_name,
        }),
      });
    } catch (err) {
      console.error("Falha ao desconectar:", err);
    }
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="glass relative mb-8 overflow-hidden rounded-3xl p-8">
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                Conectar instituições
              </h1>

              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Escolha uma instituição para simular uma conexão Open Finance.
                Ao conectar, o sistema gera entradas, saídas, score e limite
                estimado no dashboard.
              </p>
            </div>

            <div className="glass rounded-2xl px-5 py-3 text-right">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Conectadas
              </p>

              <p className="text-2xl font-bold text-neon">
                {connectedCount}/{items.length}
              </p>
            </div>
          </div>
        </div>

        {isSyncing && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/10 px-5 py-3.5 text-sm text-neon">
            <RefreshCw className="h-4 w-4 shrink-0 animate-spin" />
            {syncMessage || "Sincronizando dados com segurança..."}
          </div>
        )}

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTab(t.value)}
              className={`whitespace-nowrap rounded-full px-6 py-2 text-sm transition ${
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