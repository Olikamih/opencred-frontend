import { Building2, Wallet, Briefcase, Check, Plus, Unlink } from "lucide-react";
import type { Institution } from "@/lib/types";

const categoryMeta = {
  bank_data: { label: "Banco", Icon: Building2, tone: "from-primary/30 to-primary/5" },
  wallet: { label: "Carteira Digital", Icon: Wallet, tone: "from-secondary/30 to-secondary/5" },
  work_platform: { label: "Plataforma de Trabalho", Icon: Briefcase, tone: "from-success/25 to-success/5" },
} as const;

interface InstitutionCardProps {
  inst: Institution;
  onConnect?: (i: Institution) => void;
  onDisconnect?: (i: Institution) => void;
}

export function InstitutionCard({ inst, onConnect, onDisconnect }: InstitutionCardProps) {
  const meta = categoryMeta[inst.institution_category];
  const { Icon } = meta;

  return (
    <div className="glass group relative overflow-hidden rounded-2xl p-5 transition hover:border-white/20">
      <div className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${meta.tone} blur-2xl`} />

      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">{inst.institution_name}</p>
            <p className="text-xs text-muted-foreground">{meta.label}</p>
          </div>
        </div>
        {inst.connected && (
          <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-neon">
            <Check className="h-3 w-3" /> Conectado
          </span>
        )}
      </div>

      <div className="relative mt-5 flex gap-2">
        {inst.connected ? (
          <>
            <button
              onClick={() => onConnect?.(inst)}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium transition hover:bg-white/10"
            >
              Reconectar
            </button>
            <button
              onClick={() => onDisconnect?.(inst)}
              title="Remover conexão"
              className="inline-flex items-center justify-center rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-destructive transition hover:bg-destructive/20"
            >
              <Unlink className="h-4 w-4" />
            </button>
          </>
        ) : (
          <button
            onClick={() => onConnect?.(inst)}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium transition hover:bg-white/10"
          >
            <Plus className="h-4 w-4" /> Conectar
          </button>
        )}
      </div>
    </div>
  );
}