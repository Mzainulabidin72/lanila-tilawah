import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

const TONES = {
  neutral: 'bg-canvas text-muted-strong border border-line',
  brand: 'bg-primary-soft text-brand-strong',
  gold: 'bg-accent-soft text-ink',
}

export function Badge({ tone = 'neutral', children, className }: { tone?: keyof typeof TONES; children: ReactNode; className?: string }) {
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', TONES[tone], className)}>{children}</span>
}
