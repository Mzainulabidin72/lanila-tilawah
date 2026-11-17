import { useId, useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string
  error?: string | null
  hint?: string
  icon?: ReactNode
  /** Tampilkan tombol lihat/sembunyikan; hanya untuk type="password" */
  revealable?: boolean
}

export function TextField({ label, error, hint, icon, revealable, type = 'text', className, id, ...rest }: Props) {
  const autoId = useId()
  const inputId = id ?? autoId
  const describedBy = error ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined
  const [visible, setVisible] = useState(false)
  const effectiveType = revealable && visible ? 'text' : type

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-muted" aria-hidden>
            {icon}
          </span>
        )}
        <input
          id={inputId}
          type={effectiveType}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            // text-base (16px) mencegah zoom otomatis di iOS saat fokus
            'min-h-[48px] w-full rounded-xl border bg-surface text-base text-ink placeholder:text-muted',
            'transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25',
            icon ? 'pl-11' : 'pl-4',
            revealable ? 'pr-12' : 'pr-4',
            error ? 'border-danger' : 'border-line',
            className,
          )}
          {...rest}
        />
        {revealable && type === 'password' && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
            aria-pressed={visible}
            className="absolute inset-y-0 right-1 my-auto flex h-10 w-10 items-center justify-center rounded-lg text-muted-strong hover:bg-primary-soft"
          >
            {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error ? (
        <p id={`${inputId}-err`} className="text-sm text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-sm text-muted-strong">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
