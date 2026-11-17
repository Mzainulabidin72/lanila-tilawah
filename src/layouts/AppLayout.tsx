import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { MobileNav } from '@/components/layout/MobileNav'
import { MobileDrawer } from '@/components/layout/MobileDrawer'

export function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setDrawerOpen(false), [pathname])

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar />
      <div className="flex min-h-screen flex-col md:pl-20 lg:pl-64">
        <Header onOpenMenu={() => setDrawerOpen(true)} />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 pb-24 sm:px-6 md:pb-10 lg:px-10">
          <Outlet />
        </main>
      </div>
      <MobileNav onOpenMenu={() => setDrawerOpen(true)} />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}
