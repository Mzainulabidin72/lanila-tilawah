import { useState } from 'react'
import { Clock, Headphones, Play, SkipBack, SkipForward, User } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { PlaceholderNote } from '@/components/shared/PlaceholderNote'
import { SurahListItem } from '@/components/shared/SurahListItem'
import { SURAHS } from '@/data/surahs'
import { useComingSoon } from '@/hooks/useComingSoon'

const PAGE_SIZE = 10

export function AudioPage() {
  const soon = useComingSoon()
  const [visible, setVisible] = useState(PAGE_SIZE)
  const audioSoon = (what: string) => soon(what, 'Pemutaran audio dan daftar qari tersedia setelah sumber audio ditentukan di fase berikutnya.')

  return (
    <div className="space-y-8">
      <PageHeader title="Audio" description="Dengarkan bacaan Al-Qur'an. Pemutaran audio belum aktif pada tahap ini." />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="space-y-4 p-5 sm:p-6 lg:col-span-2">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-brand">
              <Headphones className="h-5 w-5" aria-hidden />
            </span>
            <Badge tone="gold">Placeholder</Badge>
          </div>
          <div>
            <h2 className="type-section-title">Audio pilihan</h2>
            <p className="type-body mt-1">Bacaan pilihan akan ditampilkan di sini.</p>
          </div>
          <Button onClick={() => audioSoon('Audio pilihan')}>
            <Play className="h-4 w-4" aria-hidden />
            Putar
          </Button>
        </Card>

        <Card className="p-5 sm:p-6">
          <SectionHeader title="Qari" />
          <p className="type-caption mt-2">Pilih qari favorit untuk pemutaran.</p>
          <Button variant="secondary" fullWidth className="mt-4" onClick={() => audioSoon('Pilih qari')}>
            <User className="h-4 w-4" aria-hidden />
            Pilih qari
          </Button>
        </Card>
      </div>

      <section className="space-y-4" aria-labelledby="terakhir">
        <div id="terakhir">
          <SectionHeader title="Terakhir diputar" />
        </div>
        <Card>
          <EmptyState icon={Clock} title="Belum ada riwayat" description="Audio yang baru kamu putar akan muncul di sini." />
        </Card>
      </section>

      <section className="space-y-4" aria-labelledby="daftar-audio">
        <div id="daftar-audio">
          <SectionHeader title="Daftar surah" description={`${Math.min(visible, SURAHS.length)} dari ${SURAHS.length} surah`} />
        </div>
        <PlaceholderNote>Daftar surah sementara dan belum divalidasi. Tombol putar belum memutar audio.</PlaceholderNote>
        <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {SURAHS.slice(0, visible).map((s) => (
            <li key={s.number}>
              <SurahListItem surah={s} trailing={<IconButton icon={Play} label={`Putar surah ${s.name}`} variant="soft" onClick={() => audioSoon(`Audio surah ${s.name}`)} />} />
            </li>
          ))}
        </ul>
        {visible < SURAHS.length && (
          <div className="flex justify-center">
            <Button variant="secondary" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
              Tampilkan lebih banyak
            </Button>
          </div>
        )}
      </section>

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
