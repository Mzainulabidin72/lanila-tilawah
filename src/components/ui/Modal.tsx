import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { IconButton } from './IconButton'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
}

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

/** Bottom sheet di mobile, dialog terpusat di md ke atas. */
export function Modal({ open, onClose, title, description, children, footer }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    if (!panel) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    ;(panel.querySelector<HTMLElement>('[data-autofocus]') ?? panel).focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        closeRef.current()
        return
      }
      if (e.key !== 'Tab') return
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (items.length === 0) return e.preventDefault()
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      previouslyFocused?.focus?.()
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center md:items-center md:p-4">
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="safe-bottom relative flex max-h-[90dvh] w-full flex-col rounded-t-3xl border border-line bg-surface shadow-card focus:outline-none md:max-w-md md:rounded-2xl"
      >
        <div className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-line md:hidden" aria-hidden />
        <div className="flex items-start justify-between gap-3 px-5 pb-2 pt-4">
          <div className="min-w-0">
            <h2 className="type-section-title">{title}</h2>
            {description && <p className="type-caption mt-1">{description}</p>}
          </div>
          <IconButton icon={X} label="Tutup" onClick={onClose} className="-mr-2 -mt-1" />
        </div>
        <div className="overflow-y-auto px-5 py-3">{children}</div>
        {footer && <div className="px-5 pb-5 pt-2">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
