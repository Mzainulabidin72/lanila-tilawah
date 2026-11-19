import { cn } from '@/lib/utils/cn'

export function Avatar({ name, className }: { name: string; className?: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || '?'
  return (
    <span
      aria-hidden
      className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white', className)}
    >
      {initial}
    </span>
  )
}
