import { useRef, type KeyboardEvent } from 'react'
import { cn } from '@/lib/utils/cn'

export const tabId = (id: string) => `tab-${id}`
export const panelId = (id: string) => `panel-${id}`

interface Props<T extends string> {
  tabs: ReadonlyArray<{ id: T; label: string }>
  value: T
  onChange: (id: T) => void
  label: string
  className?: string
}

/** Tab dengan navigasi keyboard (panah, Home, End). Panel dirender oleh pemanggil: role="tabpanel", id={panelId(id)}, aria-labelledby={tabId(id)}. */
export function Tabs<T extends string>({ tabs, value, onChange, label, className }: Props<T>) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = tabs.findIndex((t) => t.id === value)
    let n = i
    if (e.key === 'ArrowRight') n = (i + 1) % tabs.length
    else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length
    else if (e.key === 'Home') n = 0
    else if (e.key === 'End') n = tabs.length - 1
    else return
    e.preventDefault()
    const next = tabs[n]
    onChange(next.id)
    refs.current[next.id]?.focus()
  }

  return (
    <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className={cn('flex gap-1 rounded-xl border border-line bg-canvas p-1', className)}>
      {tabs.map((t) => {
        const active = t.id === value
        return (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[t.id] = el
            }}
            id={tabId(t.id)}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={panelId(t.id)}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(t.id)}
            className={cn(
              'min-h-[44px] flex-1 rounded-lg px-4 text-sm font-semibold transition-colors',
              active ? 'bg-surface text-brand-strong shadow-card' : 'text-muted-strong hover:text-ink',
            )}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}
