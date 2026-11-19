import { NavLink } from 'react-router-dom'
import { BOTTOM_NAV } from '@/config/nav'
import { cn } from '@/lib/utils/cn'

export function BottomNavigation() {
  return (
    <nav
      aria-label="Navigasi bawah"
      className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 backdrop-blur md:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {BOTTOM_NAV.map(({ path, label, icon: Icon }) => (
          <li key={path}>
            <NavLink
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                cn(
                  'relative flex min-h-[56px] flex-col items-center justify-center gap-0.5 px-1 text-[11px] font-semibold transition-colors',
                  isActive ? 'text-brand-strong' : 'text-muted-strong',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span aria-hidden className={cn('absolute inset-x-5 top-0 h-0.5 rounded-b-full bg-primary', !isActive && 'hidden')} />
                  <Icon className="h-5 w-5" aria-hidden />
                  <span className="max-w-full truncate">{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
