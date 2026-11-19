import { useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Bell, Camera, ChevronRight, KeyRound, Languages, LogOut, Pencil, Type as TypeIcon } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useAuth } from '@/hooks/useAuth'
import { useLogout } from '@/hooks/useLogout'
import { useComingSoon } from '@/hooks/useComingSoon'
import { EditProfileDialog } from './EditProfileDialog'
import { ChangePasswordDialog } from './ChangePasswordDialog'

function Row({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="type-label">{label}</p>
        {hint && <p className="type-caption mt-0.5">{hint}</p>}
      </div>
      <div className="sm:w-64 sm:shrink-0">{children}</div>
    </div>
  )
}

function SoonRow({ icon: Icon, label, hint, onClick }: { icon: typeof Bell; label: string; hint: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex min-h-[64px] w-full items-center gap-3 py-3 text-left">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-brand">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="type-label block">{label}</span>
        <span className="type-caption block">{hint}</span>
      </span>
      <Badge tone="gold">Segera</Badge>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted" aria-hidden />
    </button>
  )
}

export function SettingsPage() {
  const { user, displayName } = useAuth()
  const logout = useLogout()
  const soon = useComingSoon()
  const { hash } = useLocation()
  const [editOpen, setEditOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)

  useEffect(() => {
    if (hash === '#preferensi') document.getElementById('preferensi')?.scrollIntoView({ block: 'start' })
  }, [hash])

  const joined = user?.created_at
    ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date(user.created_at))
    : '-'

  return (
    <div className="space-y-6">
      <PageHeader title="Profil & Pengaturan" description="Kelola akun dan preferensi tampilanmu." />

      <Card className="p-5 sm:p-6">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <Avatar name={displayName} className="h-20 w-20 text-3xl" />
          <div className="min-w-0 flex-1">
            <p className="text-xl font-bold break-words">{displayName}</p>
            <p className="type-caption break-all">{user?.email}</p>
            <button
              type="button"
              onClick={() => soon('Foto profil', 'Unggah foto profil tersedia di fase berikutnya.')}
              className="mt-2 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-brand hover:underline"
            >
              <Camera className="h-4 w-4" aria-hidden />
              Ubah foto
            </button>
          </div>
          <Button variant="secondary" onClick={() => setEditOpen(true)}>
            <Pencil className="h-4 w-4" aria-hidden />
            Edit profil
          </Button>
        </div>
      </Card>

      <Card id="preferensi" className="scroll-mt-24 p-5 sm:p-6">
        <SectionHeader title="Preferensi" />
        <div className="mt-2 divide-y divide-line">
          <Row label="Bahasa" hint="Bahasa lain akan ditambahkan nanti.">
            <div className="flex min-h-[44px] items-center gap-2 text-sm font-medium">
              <Languages className="h-4 w-4 text-muted-strong" aria-hidden />
              Bahasa Indonesia
            </div>
          </Row>
          <Row label="Tema tampilan" hint="Tersimpan di perangkat ini.">
            <ThemeToggle variant="segmented" />
          </Row>
          <SoonRow icon={Bell} label="Notifikasi" hint="Pengingat membaca dan murajaah." onClick={() => soon('Preferensi notifikasi')} />
          <SoonRow icon={TypeIcon} label="Preferensi membaca" hint="Ukuran teks dan tampilan ayat." onClick={() => soon('Preferensi membaca', 'Pengaturan tampilan bacaan tersedia bersama pembaca Al-Qur’an di Part 03.')} />
        </div>
      </Card>

      <Card className="p-5 sm:p-6">
        <SectionHeader title="Akun" />
        <dl className="mt-2 divide-y divide-line">
          <div className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between">
            <dt className="type-caption">Email</dt>
            <dd className="break-all text-sm font-medium">{user?.email ?? '-'}</dd>
          </div>
          <div className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between">
            <dt className="type-caption">Bergabung sejak</dt>
            <dd className="text-sm font-medium">{joined}</dd>
          </div>
        </dl>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button variant="secondary" onClick={() => setPasswordOpen(true)}>
            <KeyRound className="h-4 w-4" aria-hidden />
            Ganti kata sandi
          </Button>
          <Button variant="danger" onClick={() => void logout()}>
            <LogOut className="h-4 w-4" aria-hidden />
            Keluar
          </Button>
        </div>
      </Card>

      <EditProfileDialog open={editOpen} onClose={() => setEditOpen(false)} />
      <ChangePasswordDialog open={passwordOpen} onClose={() => setPasswordOpen(false)} />
    </div>
  )
}
