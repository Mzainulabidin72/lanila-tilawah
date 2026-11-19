import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export function EmptyState({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-brand">
        <Icon className="h-7 w-7" aria-hidden />
      </span>
      <h2 className="mt-5 text-lg font-semibold">{title}</h2>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-strong">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
