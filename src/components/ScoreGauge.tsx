interface ScoreGaugeProps {
  score: number; // 0-1000
  max?: number;
}

export function ScoreGauge({ score, max = 1000 }: ScoreGaugeProps) {
  const pct = Math.min(Math.max(score / max, 0), 1);
  const radius = 110;
  const stroke = 18;
  const circumference = Math.PI * radius; // half circle
  const offset = circumference * (1 - pct);

  const rating =
    score >= 800 ? "Excelente" : score >= 650 ? "Bom" : score >= 450 ? "Regular" : "Baixo";

  return (
    <div className="relative flex flex-col items-center">
      <svg width={radius * 2 + stroke} height={radius + stroke + 10} viewBox={`0 0 ${radius * 2 + stroke} ${radius + stroke + 10}`}>
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.65 0.25 25)" />
            <stop offset="50%" stopColor="oklch(0.5 0.24 300)" />
            <stop offset="100%" stopColor="oklch(0.85 0.22 145)" />
          </linearGradient>
        </defs>
        {/* track */}
        <path
          d={`M ${stroke / 2} ${radius + stroke / 2} A ${radius} ${radius} 0 0 1 ${radius * 2 + stroke / 2} ${radius + stroke / 2}`}
          fill="none"
          stroke="oklch(1 0 0 / 8%)"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {/* progress */}
        <path
          d={`M ${stroke / 2} ${radius + stroke / 2} A ${radius} ${radius} 0 0 1 ${radius * 2 + stroke / 2} ${radius + stroke / 2}`}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">Score OpenCred</span>
        <span className="mt-1 text-6xl font-bold text-gradient leading-none">{score}</span>
        <span className="mt-1 text-sm text-neon font-medium">{rating}</span>
        <span className="text-[10px] text-muted-foreground">de {max}</span>
      </div>
    </div>
  );
}
