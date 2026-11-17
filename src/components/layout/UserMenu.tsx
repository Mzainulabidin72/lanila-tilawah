import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, LogOut, UserCog } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'

export function UserMenu() {
  const { displayName, user, signOut } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const initial = displayName.trim().charAt(0).toUpperCase() || '?'

  const handleLogout = async () => {
    setOpen(false)
    try {
      await signOut()
    } catch {
      toast.error('Gagal keluar dari server, tetapi sesi di perangkat ini sudah dihapus.')
    }
    navigate('/login', { replace: true })
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex min-h-[44px] items-center gap-2 rounded-xl py-1 pl-1 pr-2 hover:bg-canvas"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{initial}</span>
        <span className="hidden max-w-[10rem] truncate text-sm font-medium sm:block">{displayName}</span>
        <ChevronDown className="hidden h-4 w-4 text-muted-strong sm:block" aria-hidden />
      </button>

      {open && (
        <div role="menu" className="absolute right-0 z-40 mt-2 w-64 rounded-2xl border border-line bg-surface p-2 shadow-card">
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold">{displayName}</p>
            <p className="truncate text-sm text-muted-strong">{user?.email}</p>
          </div>
          <div className="my-1 border-t border-line" />
          <Link
            to="/profil"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-sm font-medium hover:bg-canvas"
          >
            <UserCog className="h-4 w-4" aria-hidden />
            Profil & Pengaturan
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-danger hover:bg-danger-soft"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Keluar
          </button>
        </div>
      )}
    </div>
  )
}
