import { memo } from 'react'
import { Bookmark, MoreHorizontal } from 'lucide-react'
import { IconButton } from '@/components/ui/IconButton'
import type { QuranVerse } from '@/types/quran'
import { cn } from '@/lib/utils/cn'

interface Props {
  verse: QuranVerse
  bookmarked: boolean
  showTranslation: boolean
  arabicRem: number
  translationRem: number
  onToggleBookmark: (ayah: number) => void
  onOpenActions: (ayah: number) => void
}

/**
 * Teks Arab dirender apa adanya dalam <p lang="ar" dir="rtl">. Nomor ayat berada di elemen terpisah
 * (bukan disisipkan ke teks Arab) agar tidak mengganggu urutan bidi/shaping. Tidak ada CSS transform.
 */
export const VerseCard = memo(function VerseCard({ verse, bookmarked, showTranslation, arabicRem, translationRem, onToggleBookmark, onOpenActions }: Props) {
  const n = verse.ayah_number
  return (
    <article
      id={`ayah-${n}`}
      data-ayah={n}
      className={cn('scroll-mt-[9.5rem] rounded-2xl border bg-surface p-4 sm:p-5', bookmarked ? 'border-accent/60' : 'border-line')}
    >
      <header className="flex items-center justify-between gap-2">
        <span
          aria-label={`Ayat ${n}`}
          className="flex h-9 min-w-[2.25rem] items-center justify-center rounded-full border border-primary/40 bg-primary-soft px-2 text-sm font-bold text-brand-strong"
        >
          {n}
        </span>
        <div className="-mr-2 flex items-center">
          <IconButton
            icon={Bookmark}
            label={bookmarked ? `Hapus penanda ayat ${n}` : `Tandai ayat ${n}`}
            aria-pressed={bookmarked}
            onClick={() => onToggleBookmark(n)}
            className={bookmarked ? 'text-accent' : undefined}
          />
          <IconButton icon={MoreHorizontal} label={`Aksi lain untuk ayat ${n}`} onClick={() => onOpenActions(n)} />
        </div>
      </header>

      <p lang="ar" dir="rtl" className="quran-text mt-3 text-ink" style={{ fontSize: `${arabicRem}rem` }}>
        {verse.arabic_text}
      </p>

      {showTranslation && verse.translation && (
        <p lang="id" className="mt-4 leading-relaxed text-muted-strong" style={{ fontSize: `${translationRem}rem` }}>
          {verse.translation}
        </p>
      )}
    </article>
  )
})
