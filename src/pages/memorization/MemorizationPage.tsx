import { BookMarked, CalendarClock, Plus, Target } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useComingSoon } from '@/hooks/useComingSoon'

export function MemorizationPage() {
  const soon = useComingSoon()
  const add = () => soon('Tambah hafalan', 'Pencatatan hafalan dan murajaah dikerjakan di fase berikutnya.')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hafalan"
        description="Pantau hafalan dan jadwal murajaah. Pencatatan hafalan belum aktif pada tahap ini."
        action={
          <Button onClick={add}>
            <Plus className="h-4 w-4" aria-hidden />
            Tambah hafalan
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-4 p-5 sm:p-6">
          <SectionHeader title="Ringkasan hafalan" />
          <ProgressBar value={null} label="Ringkasan hafalan" />
          <p className="type-caption">Belum ada data hafalan.</p>
        </Card>

        <Card className="space-y-4 p-5 sm:p-6">
          <SectionHeader title="Target saat ini" />
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-brand">
              <Target className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="type-card-title">Belum ada target</p>
              <p className="type-caption mt-1">Tentukan surah atau ayat yang ingin kamu hafal.</p>
            </div>
          </div>
          <Button variant="secondary" onClick={() => soon('Atur target hafalan')}>
            Atur target
          </Button>
        </Card>
      </div>

      <section className="space-y-4" aria-labelledby="terakhir-dihafal">
        <div id="terakhir-dihafal">
          <SectionHeader title="Terakhir dihafal" />
        </div>
        <Card>
          <EmptyState icon={BookMarked} title="Belum ada hafalan" description="Surah yang sudah kamu hafal akan tampil di sini." action={<Button onClick={add}>Tambah hafalan</Button>} />
        </Card>
      </section>

      <section className="space-y-4" aria-labelledby="murajaah">
        <div id="murajaah">
          <SectionHeader title="Jadwal murajaah" />
        </div>
        <Card>
          <EmptyState icon={CalendarClock} title="Belum ada jadwal" description="Jadwal pengulangan hafalan akan dibuat otomatis setelah ada hafalan." />
        </Card>
      </section>
    </div>
  )
}
