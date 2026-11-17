import { Logo } from '@/components/shared/Logo'
import { NavLinks } from './NavLinks'

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-20 flex-col border-r border-line bg-surface px-3 py-5 md:flex lg:w-64 lg:px-4">
      <div className="mb-8 flex justify-center px-1 lg:justify-start lg:px-2">
        <Logo className="lg:hidden" showWordmark={false} />
        <Logo className="hidden lg:flex" />
      </div>
      <div className="flex-1 overflow-y-auto">
        <NavLinks compact />
      </div>
    </aside>
  )
}
