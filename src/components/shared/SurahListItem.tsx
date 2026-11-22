import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils/cn'

export interface SurahItemData {
  number: number
  name: string
  verses: number
  revelation: string
  /** nama Arab dari dataset tervalidasi; kosong = tampilkan penanda placeholder */
  arabicName?: string
}

interface Props {
  surah: SurahItemData
  onSelect?: () => void
  /** tautan navigasi (mis. ke pembaca) */
  to?: string
  trailing?: ReactNode
}

export function SurahListItem({ surah, onSelect, to, trailing }: Props) {
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
      {trailing ??
        (surah.arabicName ? (
          <span lang="ar" dir="rtl" className="font-quran shrink-0 text-xl leading-loose text-ink">
            {surah.arabicName}
          </span>
        ) : (
          // Placeholder: nama Arab tervalidasi tampil setelah dataset diimpor.
          <span aria-hidden className="shrink-0 rounded-lg border border-dashed border-line px-2.5 py-1 text-xs text-muted">
            Teks Arab
          </span>
        ))}
    </>
  )
  const base = 'flex min-h-[64px] w-full items-center gap-3 rounded-2xl border border-line bg-surface p-3 text-left'
  const interactive = cn(base, 'transition-colors hover:border-primary/40')
  if (to) return <Link to={to} className={interactive}>{body}</Link>
  if (onSelect) return <button type="button" onClick={onSelect} className={interactive}>{body}</button>
  return <div className={base}>{body}</div>
}
