import type { ReactNode } from 'react'

interface Props {
  value: number | null
  label: string
  size?: number
  stroke?: number
  children?: ReactNode
}

export function ProgressRing({ value, label, size = 112, stroke = 10, children }: Props) {
  const pct = value === null ? 0 : Math.max(0, Math.min(100, value))
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value === null ? undefined : pct}
      aria-valuetext={value === null ? 'Belum ada data' : `${Math.round(pct)} persen`}
      className="relative shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-line" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct / 100)}
          className="stroke-primary transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-center">{children}</div>
    </div>
  )
}
