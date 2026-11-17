import { useEffect } from 'react'
import { LogOut, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '@/components/shared/Logo'
import { NavLinks } from './NavLinks'
import { useAuth } from '@/hooks/useAuth'

export function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { signOut, displayName, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const handleLogout = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <button type="button" aria-label="Tutup menu" onClick={onClose} className="absolute inset-0 bg-ink/40" />
      <div className="safe-bottom absolute inset-y-0 left-0 flex w-[84%] max-w-xs flex-col bg-surface p-4 shadow-card">
        <div className="mb-6 flex items-center justify-between">
          <Logo />
          <button type="button" onClick={onClose} aria-label="Tutup menu" className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-canvas">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <NavLinks onNavigate={onClose} />
        </div>
        <div className="border-t border-line pt-4">
          <p className="truncate text-sm font-semibold">{displayName}</p>
          <p className="mb-3 truncate text-sm text-muted-strong">{user?.email}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-danger hover:bg-danger-soft"
          >
            <LogOut className="h-5 w-5" aria-hidden />
            Keluar
          </button>
        </div>
      </div>
    </div>
  )
}
