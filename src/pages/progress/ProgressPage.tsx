import { BookOpenCheck, CalendarDays, Compass, Flame, Target } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { StatCard } from '@/components/ui/StatCard'
import { PlaceholderNote } from '@/components/shared/PlaceholderNote'
import { WeeklyActivityChart } from '@/components/shared/WeeklyActivityChart'
import { useComingSoon } from '@/hooks/useComingSoon'

export function ProgressPage() {
  const soon = useComingSoon()

  return (
    <div className="space-y-6">
      <PageHeader title="Progres" description="Lihat perkembangan kebiasaan membacamu. Data muncul setelah fitur membaca tersedia." />
      <PlaceholderNote>Belum ada statistik yang ditampilkan. Angka hanya akan muncul dari aktivitas nyata kamu.</PlaceholderNote>

      <ul className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4">
        <li>
          <StatCard icon={BookOpenCheck} label="Statistik membaca" value={null} />
        </li>
        <li>
          <StatCard icon={CalendarDays} label="Aktivitas harian" value={null} />
        </li>
        <li>
          <StatCard icon={Flame} label="Streak saat ini" value={null} />
        </li>
        <li>
          <Card className="flex h-full items-center gap-4 p-4 sm:p-5">
            <ProgressRing value={null} label="Pencapaian target bacaan" size={64} stroke={7}>
              <Target className="h-5 w-5 text-muted" aria-hidden />
            </ProgressRing>
            <div>
              <p className="text-sm font-semibold text-muted-strong">Belum ada data</p>
              <p className="type-caption mt-1">Pencapaian target</p>
            </div>
          </Card>
        </li>
      </ul>

      <Card className="space-y-4 p-5 sm:p-6">
        <SectionHeader title="Aktivitas mingguan" />
        <WeeklyActivityChart values={null} height={160} />
        <p className="type-caption">Belum ada aktivitas minggu ini.</p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-4 p-5 sm:p-6">
          <SectionHeader title="Progres khatam" description="Dari awal hingga akhir Al-Qur'an." />
          <ProgressBar value={null} label="Progres khatam" />
          <p className="type-caption">Belum dimulai.</p>
        </Card>

        <Card className="flex flex-col items-start gap-4 p-5 sm:p-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-brand">
            <Compass className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h2 className="type-card-title">Khatam Planner</h2>
            <p className="type-body mt-1">Rencanakan target khatam sesuai kemampuanmu.</p>
          </div>
          <Button variant="secondary" onClick={() => soon('Khatam Planner', 'Perencana khatam dikerjakan di fase berikutnya.')}>
            Buat rencana
          </Button>
        </Card>
      </div>
    </div>
  )
}
