import type { ReactNode } from 'react'
import type { Surah } from '@/data/surahs'
import { cn } from '@/lib/utils/cn'

export function SurahListItem({ surah, onSelect, trailing }: { surah: Surah; onSelect?: () => void; trailing?: ReactNode }) {
  const body = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-sm font-bold text-brand-strong">
        {surah.number}
      </span>
      <span className="min-w-0 flex-1">
        <span className="type-card-title block truncate">{surah.name}</span>
        <span className="type-caption block truncate">
          {surah.verses} ayat · {surah.revelation}
        </span>
      </span>
      {trailing ?? (
        // Placeholder: nama Arab tervalidasi baru ditampilkan di Part 03.
        <span aria-hidden className="shrink-0 rounded-lg border border-dashed border-line px-2.5 py-1 text-xs text-muted">
          Teks Arab
        </span>
      )}
    </>
  )
  const base = 'flex min-h-[64px] w-full items-center gap-3 rounded-2xl border border-line bg-surface p-3 text-left'
  return onSelect ? (
    <button type="button" onClick={onSelect} className={cn(base, 'transition-colors hover:border-primary/40')}>
      {body}
    </button>
  ) : (
    <div className={base}>{body}</div>
  )
}
