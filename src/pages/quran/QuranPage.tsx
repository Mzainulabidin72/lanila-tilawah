import { useMemo, useState } from 'react'
import { LayoutList, SearchX } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { SearchInput } from '@/components/ui/SearchInput'
import { EmptyState } from '@/components/ui/EmptyState'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Tabs, panelId, tabId } from '@/components/ui/Tabs'
import { PlaceholderNote } from '@/components/shared/PlaceholderNote'
import { SurahListItem } from '@/components/shared/SurahListItem'
import { SURAHS, type Revelation } from '@/data/surahs'
import { useComingSoon } from '@/hooks/useComingSoon'
import { cn } from '@/lib/utils/cn'

type View = 'surah' | 'juz'
type Filter = 'all' | Revelation

const VIEWS = [
  { id: 'surah', label: 'Surah' },
  { id: 'juz', label: 'Juz' },
] as const

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: 'all', label: 'Semua' },
  { value: 'Makkiyah', label: 'Makkiyah' },
  { value: 'Madaniyah', label: 'Madaniyah' },
]

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

export function QuranPage() {
  const soon = useComingSoon()
  const [view, setView] = useState<View>('surah')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const results = useMemo(() => {
    const q = normalize(query)
    return SURAHS.filter((s) => {
      if (filter !== 'all' && s.revelation !== filter) return false
      if (!q) return true
      return normalize(s.name).includes(q) || String(s.number) === q
    })
  }, [query, filter])

  return (
    <div className="space-y-6">
      <PageHeader title="Al-Qur'an" description="Telusuri 114 surah. Pembaca lengkap dengan teks Arab dan terjemahan hadir di Part 03." />

      <Tabs tabs={VIEWS} value={view} onChange={setView} label="Tampilan daftar" className="max-w-xs" />

      {view === 'juz' ? (
        <div role="tabpanel" id={panelId('juz')} aria-labelledby={tabId('juz')}>
          <Card>
            <EmptyState icon={LayoutList} title="Daftar juz segera hadir" description="Penelusuran per juz memerlukan dataset tervalidasi yang dimuat di Part 03." />
          </Card>
        </div>
      ) : (
        <div role="tabpanel" id={panelId('surah')} aria-labelledby={tabId('surah')} className="space-y-6">
          <PlaceholderNote>Daftar surah ini sementara (nama, jumlah ayat, tempat turun) dan belum divalidasi. Teks Arab belum ditampilkan.</PlaceholderNote>

          <div className="space-y-3">
            <SearchInput value={query} onChange={setQuery} label="Cari surah" placeholder="Cari nama atau nomor surah" />
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
                    className={cn(
                      'min-h-[44px] shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors',
                      active ? 'border-primary bg-primary text-white' : 'border-line bg-surface text-muted-strong hover:bg-primary-soft',
                    )}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
            <p className="type-caption" aria-live="polite">
              {results.length} dari {SURAHS.length} surah
            </p>
          </div>

          {results.length === 0 ? (
            <Card>
              <EmptyState
                icon={SearchX}
                title="Surah tidak ditemukan"
                description="Coba kata kunci lain, misalnya sebagian nama surah atau nomornya."
                action={
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setQuery('')
                      setFilter('all')
                    }}
                  >
                    Reset pencarian
                  </Button>
                }
              />
            </Card>
          ) : (
            <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {results.map((s) => (
                <li key={s.number}>
                  <SurahListItem surah={s} onSelect={() => soon(`Surah ${s.name}`, 'Pembaca Al-Qur’an dengan teks Arab tervalidasi akan tersedia di Part 03.')} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
