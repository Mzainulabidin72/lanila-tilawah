import { cn } from '@/lib/utils/cn'

/** value: 0–100, atau null bila belum ada data. */
export function ProgressBar({ value, label, className }: { value: number | null; label: string; className?: string }) {
  const pct = value === null ? 0 : Math.max(0, Math.min(100, value))
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value === null ? undefined : pct}
      aria-valuetext={value === null ? 'Belum ada data' : `${Math.round(pct)} persen`}
      className={cn('h-2.5 w-full overflow-hidden rounded-full bg-line', className)}
    >
      <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${pct}%` }} />
    </div>
  )
}
