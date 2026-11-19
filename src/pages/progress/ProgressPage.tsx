import { BookOpenCheck, CalendarDays, Flame, Target } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { PlaceholderNote } from '@/components/shared/PlaceholderNote'

const DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

const STATS = [
  { label: 'Total aktivitas membaca', icon: BookOpenCheck },
  { label: 'Konsistensi harian', icon: CalendarDays },
  { label: 'Streak membaca', icon: Flame },
]

export function ProgressPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Progres" description="Lihat perkembangan kebiasaan membacamu. Data muncul setelah fitur membaca tersedia." />
      <PlaceholderNote>Belum ada statistik yang ditampilkan. Angka hanya akan muncul dari aktivitas nyata kamu.</PlaceholderNote>

      <ul className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4">
        {STATS.map(({ label, icon: Icon }) => (
          <li key={label}>
            <Card className="h-full p-4 sm:p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-brand">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <p className="mt-4 text-2xl font-extrabold text-muted" aria-label="Belum ada data">
                —
              </p>
              <p className="type-caption mt-1">{label}</p>
            </Card>
          </li>
        ))}
        <li>
          <Card className="flex h-full items-center gap-4 p-4 sm:p-5">
            <ProgressRing value={null} label="Pencapaian target bacaan" size={64} stroke={7}>
              <Target className="h-5 w-5 text-muted" aria-hidden />
            </ProgressRing>
            <div>
              <p className="text-sm font-semibold text-muted">Belum ada data</p>
              <p className="type-caption mt-1">Pencapaian target</p>
            </div>
          </Card>
        </li>
      </ul>

      <Card className="space-y-4 p-5 sm:p-6">
        <SectionHeader title="Progres khatam" description="Dari awal hingga akhir Al-Qur'an." />
        <ProgressBar value={null} label="Progres khatam" />
        <p className="type-caption">Belum dimulai.</p>
      </Card>

      <Card className="space-y-4 p-5 sm:p-6">
        <SectionHeader title="Aktivitas mingguan" />
        <div role="img" aria-label="Grafik aktivitas mingguan: belum ada data" className="flex h-40 items-end gap-2 sm:gap-4">
          {DAYS.map((d) => (
            <div key={d} className="flex flex-1 flex-col items-center gap-2">
              <div className="w-full rounded-t-md border-b-2 border-dashed border-line" style={{ height: 6 }} />
              <span className="type-caption">{d}</span>
            </div>
          ))}
        </div>
        <p className="type-caption">Belum ada aktivitas minggu ini.</p>
      </Card>
    </div>
  )
}
