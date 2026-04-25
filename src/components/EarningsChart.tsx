interface EarningsChartProps {
  data: { month: string; amount: number }[];
}

export function EarningsChart({ data }: EarningsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        Nenhum dado disponível
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.amount));

  return (
    <div className="flex h-48 items-end justify-between gap-3">
      {data.map((d) => {
        const h = max > 0 ? (d.amount / max) * 100 : 0;
        return (
          <div key={d.month} className="group flex flex-1 flex-col items-center gap-2">
            <div className="relative flex w-full flex-1 flex-col items-center justify-end">
              {/* Tooltip on hover */}
              <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-white/10 px-2 py-1 text-[11px] font-medium opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                {d.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </div>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-primary via-secondary to-success/80 transition-all duration-500 hover:opacity-90"
                style={{ height: `${h}%`, minHeight: 6 }}
              />
            </div>
            <span className="text-[11px] text-muted-foreground">{d.month}</span>
          </div>
        );
      })}
    </div>
  );
}