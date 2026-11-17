import type { ReactNode } from 'react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export function Alert({ kind, children }: { kind: 'error' | 'success'; children: ReactNode }) {
  const Icon = kind === 'error' ? AlertCircle : CheckCircle2
  return (
    <div
      role={kind === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex items-start gap-3 rounded-xl border px-4 py-3 text-sm',
        kind === 'error' ? 'border-danger/30 bg-danger-soft text-danger' : 'border-primary/30 bg-primary-soft text-primary-dark',
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div className="leading-snug">{children}</div>
    </div>
  )
}
