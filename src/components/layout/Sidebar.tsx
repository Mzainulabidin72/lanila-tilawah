import { Link } from 'react-router-dom'
import { LogOut, Settings } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { Avatar } from '@/components/ui/Avatar'
import { NavLinks } from '@/components/navigation/NavLinks'
import { useAuth } from '@/hooks/useAuth'
import { useLogout } from '@/hooks/useLogout'

const ROW = 'type-nav flex min-h-[44px] w-full items-center justify-center gap-3 rounded-xl px-3 transition-colors xl:justify-start'

export function Sidebar() {
  const { displayName, user } = useAuth()
  const logout = useLogout()

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-20 flex-col border-r border-line bg-surface md:flex xl:w-64">
      <div className="flex h-16 items-center justify-center px-3 xl:justify-start xl:px-5">
        <Logo showWordmark={false} className="xl:hidden" />
        <Logo className="hidden xl:flex" />
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 xl:px-4">
        <NavLinks />
      </div>

      <div className="space-y-1 border-t border-line p-3 xl:p-4">
        <Link to="/profil" title="Profil" className={`${ROW} text-ink hover:bg-primary-soft/60`}>
          <Avatar name={displayName} />
          <span className="hidden min-w-0 flex-1 xl:block">
            <span className="block truncate text-sm font-semibold">{displayName}</span>
            <span className="type-caption block truncate">{user?.email}</span>
          </span>
        </Link>
        <Link to="/profil#preferensi" title="Pengaturan" className={`${ROW} text-muted-strong hover:bg-primary-soft/60 hover:text-ink`}>
          <Settings className="h-5 w-5 shrink-0" aria-hidden />
          <span className="sr-only xl:not-sr-only">Pengaturan</span>
        </Link>
        <button type="button" onClick={logout} title="Keluar" className={`${ROW} text-danger hover:bg-danger-soft`}>
          <LogOut className="h-5 w-5 shrink-0" aria-hidden />
          <span className="sr-only xl:not-sr-only">Keluar</span>
        </button>
      </div>
    </aside>
  )
}
