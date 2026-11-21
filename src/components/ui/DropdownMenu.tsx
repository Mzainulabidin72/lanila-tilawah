import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface Props {
  label: string
  trigger: ReactNode
  triggerClassName?: string
  panelClassName?: string
  children: (close: () => void) => ReactNode
}

export function DropdownMenu({ label, trigger, triggerClassName, panelClassName, children }: Props) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn('flex min-h-[44px] items-center gap-2 rounded-xl hover:bg-primary-soft', triggerClassName)}
      >
        {trigger}
      </button>
      {open && (
        <div className={cn('absolute right-0 z-40 mt-2 w-72 rounded-2xl border border-line bg-elevated p-2 shadow-card', panelClassName)}>
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  )
}
