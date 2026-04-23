interface EarningsChartProps {
  data: { month: string; amount: number }[];
}

export function EarningsChart({ data }: EarningsChartProps) {
  const max = Math.max(...data.map((d) => d.amount));
  return (
    <div className="flex h-48 items-end justify-between gap-3">
      {data.map((d) => {
        const h = (d.amount / max) * 100;
        return (
          <div key={d.month} className="flex flex-1 flex-col items-center gap-2">
            <div className="relative flex w-full flex-1 items-end">
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-primary via-secondary to-success/80 transition-all hover:opacity-90"
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
