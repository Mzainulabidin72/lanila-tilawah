import { BookMarked, CalendarClock, Plus, Repeat2, Target } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { StatCard } from '@/components/ui/StatCard'
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={BookMarked} label="Surah dihafal" value={null} hint="Belum ada data" />
        <StatCard icon={Repeat2} label="Murajaah hari ini" value={null} hint="Belum ada data" />
        <Card className="space-y-3 p-4 sm:col-span-2 sm:p-5 lg:col-span-1">
          <p className="type-card-title">Progres hafalan</p>
          <ProgressBar value={null} label="Progres hafalan" />
          <p className="type-caption">Belum ada hafalan.</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-4" aria-labelledby="hafalan-baru">
          <div id="hafalan-baru">
            <SectionHeader title="Hafalan baru" description="Target yang sedang kamu hafal." />
          </div>
          <Card>
            <EmptyState icon={Target} title="Belum ada target hafalan" description="Tentukan surah atau ayat yang ingin kamu hafal." action={<Button onClick={add}>Tambah hafalan</Button>} />
          </Card>
        </section>

        <section className="space-y-4" aria-labelledby="murajaah">
          <div id="murajaah">
            <SectionHeader title="Murajaah" description="Pengulangan hafalan yang sudah ada." />
          </div>
          <Card>
            <EmptyState icon={Repeat2} title="Belum ada murajaah" description="Hafalan yang perlu diulang akan muncul di sini." />
          </Card>
        </section>
      </div>

      <section className="space-y-4" aria-labelledby="jadwal">
        <div id="jadwal">
          <SectionHeader title="Jadwal murajaah" />
        </div>
        <Card>
          <EmptyState icon={CalendarClock} title="Belum ada jadwal" description="Jadwal pengulangan akan dibuat setelah fitur hafalan tersedia." />
        </Card>
      </section>
    </div>
  )
}
