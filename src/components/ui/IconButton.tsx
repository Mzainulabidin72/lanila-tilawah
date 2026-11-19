import type { ButtonHTMLAttributes } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: LucideIcon
  /** Wajib: nama aksesibel tombol ikon. */
  label: string
  variant?: 'ghost' | 'soft'
}

export function IconButton({ icon: Icon, label, variant = 'ghost', className, type = 'button', ...rest }: Props) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'soft' ? 'bg-primary-soft text-brand-strong hover:bg-primary-soft/70' : 'text-muted-strong hover:bg-primary-soft hover:text-brand-strong',
        className,
      )}
      {...rest}
    >
      <Icon className="h-5 w-5" aria-hidden />
    </button>
  )
}
