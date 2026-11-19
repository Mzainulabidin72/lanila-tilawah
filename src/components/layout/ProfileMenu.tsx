import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Brain, LogOut, Settings } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Dropdown } from '@/components/ui/Dropdown'
import { Modal } from '@/components/ui/Modal'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useAuth } from '@/hooks/useAuth'
import { useLogout } from '@/hooks/useLogout'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const ITEM = 'type-nav flex min-h-[48px] w-full items-center gap-3 rounded-xl px-3 hover:bg-primary-soft'

function MenuBody({ onDone, mobile }: { onDone: () => void; mobile: boolean }) {
  const { displayName, user } = useAuth()
  const logout = useLogout()

  return (
    <div>
      <div className="flex items-center gap-3 px-3 py-2">
        <Avatar name={displayName} className="h-11 w-11" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{displayName}</p>
          <p className="type-caption truncate">{user?.email}</p>
        </div>
      </div>
      <div className="my-2 border-t border-line" />
      {/* Hafalan tidak ada di bottom navigation mobile, jadi disediakan di sini. */}
      {mobile && (
        <Link to="/hafalan" onClick={onDone} className={ITEM}>
          <Brain className="h-5 w-5 text-muted-strong" aria-hidden />
          Hafalan
        </Link>
      )}
      <Link to="/profil" onClick={onDone} className={ITEM}>
        <Settings className="h-5 w-5 text-muted-strong" aria-hidden />
        Profil & Pengaturan
      </Link>
      {mobile && (
        <div className="px-1 py-2">
          <ThemeToggle variant="segmented" />
        </div>
      )}
      <div className="my-2 border-t border-line" />
      <button
        type="button"
        onClick={() => {
          onDone()
          void logout()
        }}
        className={`${ITEM} text-danger hover:bg-danger-soft`}
      >
        <LogOut className="h-5 w-5" aria-hidden />
        Keluar
      </button>
    </div>
  )
}

export function ProfileMenu() {
  const { displayName } = useAuth()
  const isTabletUp = useMediaQuery('(min-width: 768px)')
  const [sheetOpen, setSheetOpen] = useState(false)

  if (isTabletUp) {
    return (
      <Dropdown
        label="Menu profil"
        triggerClassName="py-1 pl-1 pr-2"
        trigger={
          <>
            <Avatar name={displayName} />
            <span className="hidden max-w-[10rem] truncate text-sm font-medium lg:block">{displayName}</span>
          </>
        }
      >
        {(close) => <MenuBody onDone={close} mobile={false} />}
      </Dropdown>
    )
  }

  return (
    <>
      <button
        type="button"
        aria-label="Buka menu profil"
        onClick={() => setSheetOpen(true)}
        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl hover:bg-primary-soft"
      >
        <Avatar name={displayName} />
      </button>
      <Modal open={sheetOpen} onClose={() => setSheetOpen(false)} title="Akun">
        <MenuBody onDone={() => setSheetOpen(false)} mobile />
      </Modal>
    </>
  )
}
