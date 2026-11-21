import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { BottomNavigation } from '@/components/navigation/BottomNavigation'
import { PageSkeleton } from '@/components/ui/LoadingState'

export function AppLayout() {
  const { pathname, hash } = useLocation()

  // Kembali ke atas saat pindah halaman, kecuali ada anchor (#preferensi) yang ditangani halaman.
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])

  return (
    <div className="min-h-screen bg-canvas">
      <a
        href="#konten"
        className="sr-only z-[90] rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Lewati ke konten
      </a>
      <Sidebar />
      <div className="flex min-h-screen flex-col md:pl-20 xl:pl-64">
        <TopBar />
        {/* pb besar di mobile agar konten tidak tertutup bottom navigation */}
        <main
          id="konten"
          className="mx-auto w-full max-w-6xl 2xl:max-w-7xl flex-1 px-4 py-6 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:px-6 md:py-8 md:pb-10 lg:px-10"
        >
          <Suspense fallback={<PageSkeleton />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <BottomNavigation />
    </div>
  )
}
