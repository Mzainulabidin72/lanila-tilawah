import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react'
import { Hammer } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

export type ComingSoonFn = (feature: string, detail?: string) => void
export const ComingSoonContext = createContext<ComingSoonFn | null>(null)

/** Satu dialog global untuk semua fitur yang dijadwalkan di fase berikutnya. */
export function ComingSoonProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ feature: string; detail?: string } | null>(null)
  const notify = useCallback<ComingSoonFn>((feature, detail) => setState({ feature, detail }), [])
  const close = useCallback(() => setState(null), [])
  const value = useMemo(() => notify, [notify])

  return (
    <ComingSoonContext.Provider value={value}>
      {children}
      <Modal
        open={state !== null}
        onClose={close}
        title={state?.feature ?? ''}
        footer={
          <Button onClick={close} fullWidth data-autofocus>
            Mengerti
          </Button>
        }
      >
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-ink">
            <Hammer className="h-5 w-5" aria-hidden />
          </span>
          <p className="type-body">
            {state?.detail ?? 'Fitur ini sedang disiapkan dan akan tersedia di fase pengembangan berikutnya.'}
          </p>
        </div>
      </Modal>
    </ComingSoonContext.Provider>
  )
}
