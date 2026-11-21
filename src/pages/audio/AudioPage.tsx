import { useMemo, useState } from 'react'
import { Clock, Heart, Headphones, Mic, Play, SearchX, SkipBack, SkipForward } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SearchInput } from '@/components/ui/SearchInput'
import { Tabs, panelId, tabId } from '@/components/ui/Tabs'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { PlaceholderNote } from '@/components/shared/PlaceholderNote'
import { SurahListItem } from '@/components/shared/SurahListItem'
import { SURAHS } from '@/data/surahs'
import { useComingSoon } from '@/hooks/useComingSoon'

type View = 'reciters' | 'surah'
const VIEWS = [
  { id: 'reciters', label: 'Qari' },
  { id: 'surah', label: 'Surah' },
] as const

// Nama qari sengaja placeholder: sumber audio dan daftar qari resmi belum ditentukan.
const RECITERS = ['Qari contoh A', 'Qari contoh B', 'Qari contoh C', 'Qari contoh D']
const PAGE_SIZE = 10
const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

export function AudioPage() {
  const soon = useComingSoon()
  const [view, setView] = useState<View>('reciters')
  const [query, setQuery] = useState('')
  const [visible, setVisible] = useState(PAGE_SIZE)
  const audioSoon = (what: string) => soon(what, 'Pemutaran audio dan daftar qari resmi tersedia setelah sumber audio ditentukan di fase berikutnya.')

  const q = normalize(query)
  const reciters = useMemo(() => RECITERS.filter((r) => !q || normalize(r).includes(q)), [q])
  const surahs = useMemo(() => SURAHS.filter((s) => !q || normalize(s.name).includes(q) || String(s.number) === q), [q])

  return (
    <div className="space-y-8">
      <PageHeader title="Audio" description="Dengarkan bacaan Al-Qur'an. Pemutaran audio belum aktif pada tahap ini." />

      <SearchInput value={query} onChange={setQuery} label="Cari qari atau surah" placeholder="Cari qari atau surah" />

      <Card className="space-y-4 border-primary/30 bg-primary-soft p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <SectionHeader title="Qari pilihan" />
          <Badge tone="gold">Placeholder</Badge>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-surface text-brand">
            <Headphones className="h-7 w-7" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-lg font-bold text-ink">Qari contoh</p>
            <p className="type-caption">Qari pilihan akan ditampilkan di sini.</p>
          </div>
        </div>
        <Button onClick={() => audioSoon('Qari pilihan')}>
          <Play className="h-4 w-4" aria-hidden />
          Putar
        </Button>
      </Card>

      <section className="space-y-4" aria-label="Daftar audio">
        <Tabs tabs={VIEWS} value={view} onChange={setView} label="Tampilan audio" className="max-w-xs" />

        {view === 'reciters' ? (
          <div role="tabpanel" id={panelId('reciters')} aria-labelledby={tabId('reciters')} className="space-y-4">
            <PlaceholderNote>Nama qari di bawah hanyalah contoh tampilan, bukan daftar resmi.</PlaceholderNote>
            {reciters.length === 0 ? (
              <Card>
                <EmptyState icon={SearchX} title="Qari tidak ditemukan" description="Coba kata kunci lain." />
              </Card>
            ) : (
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {reciters.map((name) => (
                  <li key={name}>
                    <Card className="flex items-center gap-3 p-3.5">
                      <Avatar name={name} className="h-11 w-11" />
                      <div className="min-w-0 flex-1">
                        <p className="type-card-title truncate">{name}</p>
                        <p className="type-caption">Placeholder</p>
                      </div>
                      <IconButton icon={Heart} label={`Favoritkan ${name}`} onClick={() => audioSoon('Qari favorit')} />
                      <Button variant="secondary" onClick={() => audioSoon(`Pilih ${name}`)}>
                        Pilih
                      </Button>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div role="tabpanel" id={panelId('surah')} aria-labelledby={tabId('surah')} className="space-y-4">
            <PlaceholderNote>Daftar surah sementara dan belum divalidasi. Tombol putar belum memutar audio.</PlaceholderNote>
            <p className="type-caption" aria-live="polite">
              {Math.min(visible, surahs.length)} dari {surahs.length} surah
            </p>
            {surahs.length === 0 ? (
              <Card>
                <EmptyState icon={SearchX} title="Surah tidak ditemukan" description="Coba kata kunci lain." />
              </Card>
            ) : (
              <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {surahs.slice(0, visible).map((s) => (
                  <li key={s.number}>
                    <SurahListItem surah={s} trailing={<IconButton icon={Play} label={`Putar surah ${s.name}`} variant="soft" onClick={() => audioSoon(`Audio surah ${s.name}`)} />} />
                  </li>
                ))}
              </ul>
            )}
            {visible < surahs.length && (
              <div className="flex justify-center">
                <Button variant="secondary" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                  Tampilkan lebih banyak
                </Button>
              </div>
            )}
          </div>
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="space-y-4" aria-labelledby="terakhir">
          <div id="terakhir">
            <SectionHeader title="Terakhir diputar" />
          </div>
          <Card>
            <EmptyState icon={Clock} title="Belum ada riwayat" description="Audio yang baru kamu putar akan muncul di sini." />
          </Card>
        </section>
        <section className="space-y-4" aria-labelledby="favorit">
          <div id="favorit">
            <SectionHeader title="Qari favorit" />
          </div>
          <Card>
            <EmptyState icon={Mic} title="Belum ada favorit" description="Qari yang kamu favoritkan akan tersimpan di sini." />
          </Card>
        </section>
      </div>

      <Card className="space-y-4 p-5" aria-label="Pemutar audio (belum aktif)">
        <div className="flex items-center justify-between gap-3">
          <p className="type-card-title">Pemutar audio</p>
          <Badge>Belum aktif</Badge>
        </div>
        <ProgressBar value={null} label="Posisi pemutaran" />
        <div className="flex items-center justify-center gap-2">
          <IconButton icon={SkipBack} label="Sebelumnya" disabled />
          <IconButton icon={Play} label="Putar" variant="soft" disabled />
          <IconButton icon={SkipForward} label="Berikutnya" disabled />
        </div>
      </Card>
    </div>
  )
}
