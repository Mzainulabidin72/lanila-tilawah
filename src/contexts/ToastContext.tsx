import { createContext, useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

type ToastKind = 'success' | 'error' | 'info'
interface ToastItem {
  id: number
  kind: ToastKind
  message: string
}

export interface ToastApi {
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
}

export const ToastContext = createContext<ToastApi | null>(null)

const STYLES: Record<ToastKind, string> = {
  success: 'border-primary/30 bg-primary-soft text-brand-strong',
  error: 'border-danger/30 bg-danger-soft text-danger',
  info: 'border-line bg-surface text-ink',
}
const ICONS = { success: CheckCircle2, error: AlertCircle, info: Info }

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => setItems((l) => l.filter((t) => t.id !== id)), [])

  const push = useCallback(
    (kind: ToastKind, message: string) => {
      const id = nextId.current++
      setItems((l) => [...l.slice(-2), { id, kind, message }])
      window.setTimeout(() => dismiss(id), 5000)
    },
    [dismiss],
  )

  const api = useMemo<ToastApi>(
    () => ({
      success: (m) => push('success', m),
      error: (m) => push('error', m),
      info: (m) => push('info', m),
    }),
    [push],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[80] flex flex-col items-center gap-2 px-4 pt-4"
        aria-live="polite"
      >
        {items.map((t) => {
          const Icon = ICONS[t.kind]
          return (
            <div
              key={t.id}
              role={t.kind === 'error' ? 'alert' : 'status'}
              className={cn(
                'pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-card',
                STYLES[t.kind],
              )}
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <p className="flex-1 leading-snug">{t.message}</p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Tutup notifikasi"
                className="-m-1 rounded p-1 opacity-70 hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
