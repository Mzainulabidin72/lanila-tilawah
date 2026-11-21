import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

/** Tooltip visual (hover/fokus). Nama aksesibel tetap berasal dari aria-label elemen di dalamnya. */
export function Tooltip({ label, children, side = 'bottom', className }: { label: string; children: ReactNode; side?: 'bottom' | 'right'; className?: string }) {
  return (
    <span className={cn('group relative inline-flex', className)}>
      {children}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute z-50 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-xs font-medium text-canvas opacity-0 shadow-card transition-opacity group-focus-within:opacity-100 group-hover:opacity-100',
          side === 'right' ? 'left-full top-1/2 ml-2 -translate-y-1/2' : 'right-0 top-full mt-2',
        )}
      >
        {label}
      </span>
    </span>
  )
}
