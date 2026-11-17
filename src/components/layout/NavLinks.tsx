import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '@/config/nav'
import { cn } from '@/lib/utils/cn'

/** Daftar navigasi. compact = hanya ikon (tablet); label muncul di lg ke atas. */
export function NavLinks({ compact = false, onNavigate }: { compact?: boolean; onNavigate?: () => void }) {
  return (
    <nav aria-label="Navigasi utama" className="space-y-1">
      {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          end={path === '/'}
          onClick={onNavigate}
          title={label}
          className={({ isActive }) =>
            cn(
              'flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors',
              compact ? 'justify-center lg:justify-start' : '',
              isActive ? 'bg-primary-soft text-primary-dark' : 'text-muted-strong hover:bg-canvas hover:text-ink',
            )
          }
        >
          <Icon className="h-5 w-5 shrink-0" aria-hidden />
          <span className={cn(compact && 'sr-only lg:not-sr-only')}>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
