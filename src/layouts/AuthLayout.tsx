import { Outlet } from 'react-router-dom'
import { BookOpen, Headphones, GraduationCap, TrendingUp } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'

const PILLARS = [
  { icon: BookOpen, label: 'Read', text: "Baca Al-Qur'an dengan tenang." },
  { icon: Headphones, label: 'Listen', text: 'Dengarkan bacaan kapan saja.' },
  { icon: GraduationCap, label: 'Learn', text: 'Pahami makna yang kamu baca.' },
  { icon: TrendingUp, label: 'Grow', text: 'Bangun kebiasaan yang konsisten.' },
]

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-canvas lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside className="relative hidden overflow-hidden bg-primary p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Logo light />
        <div>
          <h1 className="max-w-md text-4xl font-extrabold leading-tight tracking-tight">Teman tilawah pribadimu.</h1>
          <ul className="mt-10 space-y-5">
            {PILLARS.map(({ icon: Icon, label, text }) => (
              <li key={label} className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold">{label}</p>
                  <p className="text-sm text-white/80">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-white/70">Bagian dari ekosistem Lanila</p>
        <span className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent/20" aria-hidden />
      </aside>

      <main className="flex min-h-screen flex-col px-4 py-8 sm:px-8 lg:min-h-0 lg:justify-center lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <Logo className="mb-8 lg:hidden" />
          <Outlet />
        </div>
      </main>
    </div>
  )
}
