import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookMarked, LayoutList, SearchX, TextSearch } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { SearchInput } from '@/components/ui/SearchInput'
import { EmptyState } from '@/components/ui/EmptyState'
import { Card } from '@/components/ui/Card'
import { Button, buttonStyles } from '@/components/ui/Button'
import { Tabs, panelId, tabId } from '@/components/ui/Tabs'
import { PageSkeleton, LoadingState } from '@/components/ui/LoadingState'
import { PlaceholderNote } from '@/components/shared/PlaceholderNote'
import { SurahListItem } from '@/components/shared/SurahListItem'
import { QuranUnavailable } from '@/components/quran/QuranUnavailable'
import { QuranAttribution } from '@/components/quran/QuranAttribution'
import { matchSurah } from '@/components/quran/SurahJuzSheet'
import { useAsync } from '@/hooks/useAsync'
import { useQuranStatus } from '@/hooks/useQuranStatus'
import { quranService } from '@/services/quranService'
import { cn } from '@/lib/utils/cn'
import type { RevelationType } from '@/types/quran'

type View = 'surah' | 'juz' | 'ayat'
type Filter = 'all' | RevelationType

const VIEWS = [
  { id: 'surah', label: 'Surah' },
  { id: 'juz', label: 'Juz' },
  { id: 'ayat', label: 'Cari ayat' },
] as const

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: 'all', label: 'Semua' },
  { value: 'Makkiyah', label: 'Makkiyah' },
  { value: 'Madaniyah', label: 'Madaniyah' },
]

export function QuranPage() {
  const { status, loading, error, reload } = useQuranStatus()
  const ready = status?.state === 'ready'
  const [view, setView] = useState<View>('surah')

  const header = (
    <PageHeader
      title="Al-Qur'an"
      description="Telusuri surah dan juz, lalu mulai membaca."
      action={
        <Link to="/quran/penanda" className={buttonStyles('secondary')}>
          <BookMarked className="h-4 w-4" aria-hidden />
          Penanda
        </Link>
      }
    />
  )

  if (loading) return <PageSkeleton />
  if (error) {
    return (
      <div className="space-y-6">
        {header}
        <Card>
          <EmptyState icon={SearchX} title="Gagal memuat" description={error} action={<Button onClick={reload}>Coba lagi</Button>} />
        </Card>
      </div>
    )
  }
  if (!ready) {
    return (
      <div className="space-y-6">
        {header}
        <QuranUnavailable reason={status?.state === 'unavailable' ? status.reason : undefined} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {header}
      {status.placeholder && <PlaceholderNote>MODE PLACEHOLDER (hanya pengembangan): daftar ini bukan dari dataset tervalidasi.</PlaceholderNote>}
      <Tabs tabs={VIEWS} value={view} onChange={setView} label="Tampilan daftar" className="max-w-md" />

      {view === 'surah' && <SurahTab />}
      {view === 'juz' && <JuzTab />}
      {view === 'ayat' && <VerseSearchTab hasTranslation={!!status.info.translation_language} />}

      <QuranAttribution info={status.info} placeholder={status.placeholder} />
    </div>
  )
}

function SurahTab() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const surahs = useAsync(() => quranService.getSurahs(), [])

  const results = useMemo(
    () => (surahs.data ?? []).filter((s) => (filter === 'all' || s.revelation_type === filter) && matchSurah(s, query)),
    [surahs.data, query, filter],
  )

  return (
    <div role="tabpanel" id={panelId('surah')} aria-labelledby={tabId('surah')} className="space-y-4">
      <SearchInput value={query} onChange={setQuery} label="Cari surah" placeholder="Nama (Latin/Arab) atau nomor surah" />
      <div role="radiogroup" aria-label="Filter tempat turun" className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map(({ value, label }) => {
          const active = filter === value
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setFilter(value)}
              className={cn('min-h-[44px] shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors', active ? 'border-primary bg-primary text-white' : 'border-line bg-surface text-muted-strong hover:bg-primary-soft')}
            >
              {label}
            </button>
          )
        })}
      </div>

      {surahs.loading ? (
        <LoadingState label="Memuat daftar surah…" />
      ) : surahs.error ? (
        <Card>
          <EmptyState icon={SearchX} title="Gagal memuat daftar surah" description={surahs.error} action={<Button onClick={surahs.reload}>Coba lagi</Button>} />
        </Card>
      ) : results.length === 0 ? (
        <Card>
          <EmptyState
            icon={SearchX}
            title="Surah tidak ditemukan"
            description="Coba kata kunci lain, misalnya sebagian nama surah atau nomornya."
            action={<Button variant="secondary" onClick={() => { setQuery(''); setFilter('all') }}>Reset pencarian</Button>}
          />
        </Card>
      ) : (
        <>
          <p className="type-caption" aria-live="polite">
            {results.length} dari {surahs.data?.length} surah
          </p>
          <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {results.map((s) => (
              <li key={s.id}>
                <SurahListItem
                  to={`/quran/${s.id}`}
                  surah={{ number: s.id, name: s.name_latin, verses: s.total_ayah, revelation: s.revelation_type, arabicName: s.name_arabic }}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

function JuzTab() {
  const juz = useAsync(() => quranService.getJuz(), [])
  const surahs = useAsync(() => quranService.getSurahs(), [])

  return (
    <div role="tabpanel" id={panelId('juz')} aria-labelledby={tabId('juz')}>
      {juz.loading || surahs.loading ? (
        <LoadingState label="Memuat daftar juz…" />
      ) : juz.error || surahs.error ? (
        <Card>
          <EmptyState icon={SearchX} title="Gagal memuat juz" description={(juz.error ?? surahs.error) as string} action={<Button onClick={() => { juz.reload(); surahs.reload() }}>Coba lagi</Button>} />
        </Card>
      ) : (juz.data ?? []).length === 0 ? (
        <Card>
          <EmptyState icon={LayoutList} title="Data juz belum tersedia" description="Metadata juz belum dimuat dari dataset tervalidasi." />
        </Card>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(juz.data ?? []).map((j) => {
            const s = surahs.data?.find((x) => x.id === j.start_surah_id)
            return (
              <li key={j.juz_number}>
                <Link to={`/quran/${j.start_surah_id}?ayah=${j.start_ayah_number}`} className="flex min-h-[64px] items-center gap-3 rounded-2xl border border-line bg-surface p-3 transition-colors hover:border-primary/40">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-sm font-bold text-brand-strong">{j.juz_number}</span>
                  <span className="min-w-0">
                    <span className="type-card-title block">Juz {j.juz_number}</span>
                    <span className="type-caption block truncate">
                      Mulai: {s?.name_latin ?? `Surah ${j.start_surah_id}`} ayat {j.start_ayah_number}
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function VerseSearchTab({ hasTranslation }: { hasTranslation: boolean }) {
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const surahs = useAsync(() => quranService.getSurahs(), [])
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(query.trim()), 400)
    return () => window.clearTimeout(t)
  }, [query])
  const hits = useAsync(() => quranService.searchTranslations(debounced), [debounced], hasTranslation && debounced.length >= 3)

  return (
    <div role="tabpanel" id={panelId('ayat')} aria-labelledby={tabId('ayat')} className="space-y-4">
      {!hasTranslation ? (
        <Card>
          <EmptyState icon={TextSearch} title="Terjemahan belum tersedia" description="Pencarian ayat memakai teks terjemahan. Terjemahan belum diimpor." />
        </Card>
      ) : (
        <>
          <SearchInput value={query} onChange={setQuery} label="Cari ayat pada terjemahan" placeholder="Kata kunci terjemahan (min. 3 huruf)" />
          <p className="type-caption">Pencarian dilakukan pada terjemahan Indonesia, bukan teks Arab. Maksimal 20 hasil.</p>
          {debounced.length < 3 ? null : hits.loading ? (
            <LoadingState label="Mencari…" />
          ) : hits.error ? (
            <Card>
              <EmptyState icon={SearchX} title="Pencarian gagal" description={hits.error} action={<Button onClick={hits.reload}>Coba lagi</Button>} />
            </Card>
          ) : (hits.data ?? []).length === 0 ? (
            <Card>
              <EmptyState icon={SearchX} title="Tidak ada hasil" description="Coba kata kunci lain." />
            </Card>
          ) : (
            <ul className="space-y-3">
              {(hits.data ?? []).map((h) => (
                <li key={`${h.surahId}:${h.ayahNumber}`}>
                  <Link to={`/quran/${h.surahId}?ayah=${h.ayahNumber}`} className="block rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-primary/40">
                    <span className="type-card-title block">
                      {surahs.data?.find((s) => s.id === h.surahId)?.name_latin ?? `Surah ${h.surahId}`} · ayat {h.ayahNumber}
                    </span>
                    <span lang="id" className="type-body mt-1 block">{h.translation}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
