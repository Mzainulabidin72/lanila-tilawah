import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { Tabs, panelId, tabId } from '@/components/ui/Tabs'
import { SearchInput } from '@/components/ui/SearchInput'
import { LoadingState } from '@/components/ui/LoadingState'
import { Alert } from '@/components/ui/Alert'
import { useAsync } from '@/hooks/useAsync'
import { quranService } from '@/services/quranService'
import { normalizeArabicForSearch, normalizeLatinForSearch } from '@/lib/utils/arabic'
import { cn } from '@/lib/utils/cn'
import type { QuranSurah } from '@/types/quran'

type View = 'surah' | 'juz'
const TABS = [
  { id: 'surah', label: 'Surah' },
  { id: 'juz', label: 'Juz' },
] as const

export function matchSurah(s: QuranSurah, query: string): boolean {
  const latin = normalizeLatinForSearch(query)
  const arabic = normalizeArabicForSearch(query.trim())
  if (!latin && !arabic) return true
  if (/^\d+$/.test(query.trim())) return String(s.id) === query.trim()
  return (
    (latin !== '' && normalizeLatinForSearch(s.name_latin).includes(latin)) ||
    (arabic !== '' && normalizeArabicForSearch(s.name_arabic).includes(arabic))
  )
}

/** Navigasi cepat surah/juz dari dalam pembaca. */
export function SurahJuzSheet({ open, onClose, currentSurahId }: { open: boolean; onClose: () => void; currentSurahId: number }) {
  const navigate = useNavigate()
  const [view, setView] = useState<View>('surah')
  const [query, setQuery] = useState('')
  const surahs = useAsync(() => quranService.getSurahs(), [], open)
  const juz = useAsync(() => quranService.getJuz(), [], open && view === 'juz')

  const filtered = useMemo(() => (surahs.data ?? []).filter((s) => matchSurah(s, query)), [surahs.data, query])
  const go = (to: string) => {
    onClose()
    navigate(to)
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Navigasi">
      <div className="space-y-3 pb-2">
        <Tabs tabs={TABS} value={view} onChange={setView} label="Navigasi surah atau juz" />
        {view === 'surah' ? (
          <div role="tabpanel" id={panelId('surah')} aria-labelledby={tabId('surah')} className="space-y-3">
            <SearchInput value={query} onChange={setQuery} label="Cari surah" placeholder="Nama atau nomor surah" />
            {surahs.loading ? (
              <LoadingState />
            ) : surahs.error ? (
              <Alert kind="error">{surahs.error}</Alert>
            ) : filtered.length === 0 ? (
              <p className="type-body py-6 text-center">Surah tidak ditemukan.</p>
            ) : (
              <ul className="max-h-[50dvh] space-y-1 overflow-y-auto">
                {filtered.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => go(`/quran/${s.id}`)}
                      aria-current={s.id === currentSurahId ? 'true' : undefined}
                      className={cn('flex min-h-[48px] w-full items-center gap-3 rounded-xl px-3 text-left hover:bg-primary-soft', s.id === currentSurahId && 'bg-primary-soft')}
                    >
                      <span className="w-8 text-sm font-bold text-brand-strong">{s.id}</span>
                      <span className="flex-1 text-sm font-medium">{s.name_latin}</span>
                      {s.name_arabic && (
                        <span lang="ar" dir="rtl" className="font-quran text-lg leading-loose">
                          {s.name_arabic}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div role="tabpanel" id={panelId('juz')} aria-labelledby={tabId('juz')}>
            {juz.loading || surahs.loading ? (
              <LoadingState />
            ) : juz.error || surahs.error ? (
              <Alert kind="error">{juz.error ?? surahs.error}</Alert>
            ) : (juz.data ?? []).length === 0 ? (
              <p className="type-body py-6 text-center">Data juz belum tersedia.</p>
            ) : (
              <ul className="max-h-[50dvh] space-y-1 overflow-y-auto">
                {(juz.data ?? []).map((j) => {
                  const s = surahs.data?.find((x) => x.id === j.start_surah_id)
                  return (
                    <li key={j.juz_number}>
                      <button type="button" onClick={() => go(`/quran/${j.start_surah_id}?ayah=${j.start_ayah_number}`)} className="flex min-h-[48px] w-full items-center gap-3 rounded-xl px-3 text-left hover:bg-primary-soft">
                        <span className="w-14 text-sm font-bold text-brand-strong">Juz {j.juz_number}</span>
                        <span className="flex-1 text-sm">
                          {s?.name_latin ?? `Surah ${j.start_surah_id}`} · ayat {j.start_ayah_number}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </BottomSheet>
  )
}
