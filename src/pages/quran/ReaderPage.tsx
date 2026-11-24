import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { BookMarked, ChevronLeft, ChevronRight, ListTree, SearchX, SlidersHorizontal } from 'lucide-react'
import { Button, buttonStyles } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { IconButton } from '@/components/ui/IconButton'
import { PageSkeleton } from '@/components/ui/LoadingState'
import { PlaceholderNote } from '@/components/shared/PlaceholderNote'
import { QuranUnavailable } from '@/components/quran/QuranUnavailable'
import { QuranAttribution } from '@/components/quran/QuranAttribution'
import { GuestBookmarkNotice } from '@/components/quran/GuestBookmarkNotice'
import { VerseCard } from '@/components/quran/VerseCard'
import { VerseActionsSheet } from '@/components/quran/VerseActionsSheet'
import { BookmarkNoteDialog } from '@/components/quran/BookmarkNoteDialog'
import { ReaderSettingsSheet } from '@/components/quran/ReaderSettingsSheet'
import { SurahJuzSheet } from '@/components/quran/SurahJuzSheet'
import { useAsync } from '@/hooks/useAsync'
import { useQuranStatus } from '@/hooks/useQuranStatus'
import { useBookmarks } from '@/hooks/useBookmarks'
import { useReadingPosition } from '@/hooks/useReadingPosition'
import { useReaderPrefs } from '@/hooks/useReaderPrefs'
import { quranService } from '@/services/quranService'
import { ARABIC_SIZES_REM, TRANSLATION_SIZES_REM } from '@/contexts/ReaderPrefsContext'
import { verseReference } from '@/lib/utils/verseText'

export function ReaderPage() {
  const { surahId: param } = useParams()
  const id = /^\d+$/.test(param ?? '') ? Number(param) : NaN
  const valid = id >= 1 && id <= 114
  const [search] = useSearchParams()
  const ayahParam = search.get('ayah')

  const { status, loading: statusLoading, error: statusError, reload: reloadStatus } = useQuranStatus()
  const ready = status?.state === 'ready'
  const surahsQ = useAsync(() => quranService.getSurahs(), [], ready)
  // Hasil dibungkus bersama id-nya agar data surah sebelumnya tidak pernah dipakai untuk surah yang baru.
  const versesQ = useAsync(async () => ({ id, verses: await quranService.getSurahVerses(id) }), [id], ready && valid)
  const bismQ = useAsync(() => quranService.getBismillah(), [], ready)

  const { prefs } = useReaderPrefs()
  const bookmarks = useBookmarks()
  const { position, savePosition } = useReadingPosition()

  const [actionsAyah, setActionsAyah] = useState<number | null>(null)
  const [noteAyah, setNoteAyah] = useState<number | null>(null)
  const [navOpen, setNavOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [resumedAt, setResumedAt] = useState<number | null>(null)

  const positionRef = useRef(position)
  positionRef.current = position
  const interacted = useRef(false)
  const ignoreScrollUntil = useRef(0)

  const verses = versesQ.data?.id === id ? versesQ.data.verses : null
  const surah = surahsQ.data?.find((s) => s.id === id)

  // Buka surah: mulai dari ?ayah=, atau lanjutkan posisi tersimpan pada surah yang sama, atau ayat 1.
  useEffect(() => {
    if (!verses) return
    interacted.current = false
    const p = Number(ayahParam)
    let target = 1
    let restored: number | null = null
    if (Number.isInteger(p) && p >= 1 && p <= verses.length) target = p
    else {
      const pos = positionRef.current
      if (pos && pos.surahId === id && pos.ayahNumber > 1 && pos.ayahNumber <= verses.length) {
        target = pos.ayahNumber
        restored = target
      }
    }
    setResumedAt(restored)
    ignoreScrollUntil.current = performance.now() + 1000
    requestAnimationFrame(() => {
      const el = document.getElementById(`ayah-${target}`)
      if (target > 1 && el) el.scrollIntoView({ block: 'start' })
      else window.scrollTo(0, 0)
    })
    savePosition(id, target)
  }, [verses, id, ayahParam, savePosition])

  // Deteksi interaksi pengguna (bukan scroll programatik) lalu lacak ayat yang sedang dibaca.
  useEffect(() => {
    const onScroll = () => {
      if (performance.now() >= ignoreScrollUntil.current) interacted.current = true
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!verses) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting || !interacted.current) continue
          savePosition(id, Number((e.target as HTMLElement).dataset.ayah))
        }
      },
      { rootMargin: '-160px 0px -75% 0px' },
    )
    document.querySelectorAll('[data-ayah]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [verses, id, savePosition])

  const toggleBookmark = bookmarks.toggle
  const onToggle = useCallback((ayah: number) => void toggleBookmark(id, ayah), [toggleBookmark, id])
  const onMore = useCallback((ayah: number) => setActionsAyah(ayah), [])

  // ---------- state halaman ----------
  if (!valid) {
    return (
      <Card>
        <EmptyState icon={SearchX} title="Surah tidak ditemukan" description="Nomor surah harus antara 1 dan 114." action={<Link to="/quran" className={buttonStyles('primary')}>Daftar surah</Link>} />
      </Card>
    )
  }
  if (statusLoading) return <PageSkeleton />
  if (statusError) return <ErrorPanel message={statusError} onRetry={reloadStatus} />
  if (!status || status.state === 'unavailable') return <QuranUnavailable reason={status?.state === 'unavailable' ? status.reason : undefined} />
  if (versesQ.loading || surahsQ.loading || !verses || !surah) {
    if (versesQ.error || surahsQ.error) {
      return <ErrorPanel message={(versesQ.error ?? surahsQ.error) as string} onRetry={() => { versesQ.reload(); surahsQ.reload() }} />
    }
    return <PageSkeleton />
  }

  const placeholder = status.placeholder
  const arabicRem = ARABIC_SIZES_REM[prefs.arabicSize - 1]
  const translationRem = TRANSLATION_SIZES_REM[prefs.translationSize - 1]
  const actionsVerse = verses.find((v) => v.ayah_number === actionsAyah) ?? null
  const noteItem = bookmarks.items.find((i) => i.surahId === id && i.ayahNumber === noteAyah)
  const showBismillah = id !== 1 && id !== 9 && !!bismQ.data && !verses[0]?.basmalah_inline

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {/* Bilah atas ringkas; tetap menempel agar navigasi surah selalu terjangkau tanpa menutupi teks. */}
      <div className="sticky top-[calc(4rem+env(safe-area-inset-top))] z-10 -mx-4 flex items-center gap-1 border-b border-line bg-canvas/95 px-2 py-1 backdrop-blur sm:-mx-6 sm:px-4 lg:-mx-10 lg:px-8">
        {id > 1 ? (
          <Link to={`/quran/${id - 1}`} aria-label="Surah sebelumnya" className="flex h-11 w-11 items-center justify-center rounded-xl text-muted-strong hover:bg-primary-soft">
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </Link>
        ) : (
          <IconButton icon={ChevronLeft} label="Surah sebelumnya" disabled />
        )}
        <button type="button" onClick={() => setNavOpen(true)} className="flex min-h-[44px] min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-2 hover:bg-primary-soft">
          <span className="truncate text-sm font-bold">
            {surah.id}. {surah.name_latin}
          </span>
          <ListTree className="h-4 w-4 shrink-0 text-muted-strong" aria-hidden />
          <span className="sr-only">Buka navigasi surah dan juz</span>
        </button>
        {id < 114 ? (
          <Link to={`/quran/${id + 1}`} aria-label="Surah berikutnya" className="flex h-11 w-11 items-center justify-center rounded-xl text-muted-strong hover:bg-primary-soft">
            <ChevronRight className="h-5 w-5" aria-hidden />
          </Link>
        ) : (
          <IconButton icon={ChevronRight} label="Surah berikutnya" disabled />
        )}
      </div>

      {placeholder && <PlaceholderNote>MODE PLACEHOLDER (hanya pengembangan): teks di halaman ini BUKAN Al-Qur’an dan hanya untuk menguji tampilan.</PlaceholderNote>}
      <GuestBookmarkNotice />

      <header className="space-y-3 rounded-2xl border border-line bg-surface p-5 text-center">
        {surah.name_arabic && (
          <p lang="ar" dir="rtl" className="quran-text text-ink" style={{ fontSize: '2rem' }}>
            {surah.name_arabic}
          </p>
        )}
        <h1 className="type-page-title">{surah.name_latin}</h1>
        <p className="type-caption">
          Surah ke-{surah.id} · {surah.total_ayah} ayat · {surah.revelation_type}
          {verses[0]?.juz_number ? ` · Juz ${verses[0].juz_number}` : ''}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <Button variant="secondary" onClick={() => setNavOpen(true)}>
            <ListTree className="h-4 w-4" aria-hidden />
            Surah / Juz
          </Button>
          <Button variant="secondary" onClick={() => setSettingsOpen(true)}>
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            Tampilan
          </Button>
          <Link to="/quran/penanda" className={buttonStyles('secondary')}>
            <BookMarked className="h-4 w-4" aria-hidden />
            Penanda
          </Link>
        </div>
      </header>

      {resumedAt && (
        <div role="status" className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-primary/30 bg-primary-soft px-4 py-3 text-sm">
          <span>Dilanjutkan dari ayat {resumedAt}.</span>
          <button
            type="button"
            className="min-h-[44px] font-semibold text-brand-strong underline"
            onClick={() => {
              setResumedAt(null)
              ignoreScrollUntil.current = performance.now() + 1000
              window.scrollTo(0, 0)
              savePosition(id, 1)
            }}
          >
            Mulai dari awal
          </button>
        </div>
      )}

      {showBismillah && (
        <p lang="ar" dir="rtl" className="quran-text py-2 text-center text-ink" style={{ fontSize: `${arabicRem}rem` }}>
          {bismQ.data}
        </p>
      )}

      <div className="space-y-3">
        {verses.map((v) => (
          <VerseCard
            key={v.id}
            verse={v}
            bookmarked={bookmarks.keys.has(`${id}:${v.ayah_number}`)}
            showTranslation={prefs.showTranslation}
            arabicRem={arabicRem}
            translationRem={translationRem}
            onToggleBookmark={onToggle}
            onOpenActions={onMore}
          />
        ))}
      </div>

      <nav aria-label="Navigasi surah" className="flex items-center justify-between gap-2 pt-2">
        {id > 1 ? <Link to={`/quran/${id - 1}`} className={buttonStyles('secondary')}>← Surah sebelumnya</Link> : <span />}
        {id < 114 ? <Link to={`/quran/${id + 1}`} className={buttonStyles('primary')}>Surah berikutnya →</Link> : <span />}
      </nav>

      <QuranAttribution info={status.info} placeholder={placeholder} />

      <VerseActionsSheet
        verse={actionsVerse}
        surah={surah}
        bookmarked={actionsVerse ? bookmarks.keys.has(`${id}:${actionsVerse.ayah_number}`) : false}
        copyDisabled={placeholder}
        onClose={() => setActionsAyah(null)}
        onToggleBookmark={onToggle}
        onEditNote={(a) => setNoteAyah(a)}
      />
      <BookmarkNoteDialog
        open={noteAyah !== null && !!noteItem}
        onClose={() => setNoteAyah(null)}
        reference={noteAyah ? verseReference(surah.name_latin, id, noteAyah) : ''}
        initialNote={noteItem?.note ?? null}
        onSave={(n) => bookmarks.updateNote(id, noteAyah as number, n)}
      />
      <SurahJuzSheet open={navOpen} onClose={() => setNavOpen(false)} currentSurahId={id} />
      <ReaderSettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}

function ErrorPanel({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Card>
      <EmptyState icon={SearchX} title="Gagal memuat" description={message} action={<Button onClick={onRetry}>Coba lagi</Button>} />
    </Card>
  )
}
