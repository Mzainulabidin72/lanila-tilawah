import type { LucideIcon } from 'lucide-react'
import { Card } from './Card'
import { Badge } from './Badge'
import { cn } from '@/lib/utils/cn'

/** value = null berarti belum ada data. sample menandai nilai demonstrasi (bukan aktivitas nyata). */
export function StatCard({ icon: Icon, label, value, hint, sample }: { icon: LucideIcon; label: string; value: string | null; hint?: string; sample?: boolean }) {
  return (
    <Card className="h-full p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-brand">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        {sample && <Badge tone="gold">Contoh</Badge>}
      </div>
      <p className={cn('mt-4 text-2xl font-extrabold', value === null ? 'text-muted' : 'text-ink')} aria-label={value === null ? 'Belum ada data' : undefined}>
        {value ?? '—'}
      </p>
      <p className="type-caption mt-1">{label}</p>
      {hint && <p className="type-caption mt-0.5">{hint}</p>}
    </Card>
  )
}
