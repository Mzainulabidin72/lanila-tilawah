import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark disabled:bg-primary/60',
  secondary: 'border border-line bg-surface text-ink hover:bg-primary-soft',
  ghost: 'text-muted-strong hover:bg-primary-soft hover:text-brand-strong',
  danger: 'border border-danger/30 text-danger hover:bg-danger-soft',
}

/** Kelas tombol yang bisa dipakai juga untuk <Link> agar tampilan konsisten. */
export function buttonStyles(variant: ButtonVariant = 'primary', fullWidth = false, className?: string): string {
  return cn(
    'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-colors disabled:cursor-not-allowed',
    VARIANTS[variant],
    fullWidth && 'w-full',
    className,
  )
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  loading?: boolean
  fullWidth?: boolean
}

export function Button({ variant = 'primary', loading, fullWidth, className, children, disabled, type = 'button', ...rest }: Props) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonStyles(variant, fullWidth, className)}
      {...rest}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  )
}
