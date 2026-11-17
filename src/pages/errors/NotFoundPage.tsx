import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { Logo } from '@/components/shared/Logo'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas px-4">
      <Logo />
      <EmptyState
        icon={Compass}
        title="Halaman tidak ditemukan"
        description="Alamat yang kamu buka tidak ada atau sudah dipindahkan."
        action={
          <Link
            to="/"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Ke beranda
          </Link>
        }
      />
    </div>
  )
}
