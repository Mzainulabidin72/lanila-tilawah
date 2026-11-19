import { useState, type FormEvent } from 'react'
import { User } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import { Alert } from '@/components/ui/Alert'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { profileService } from '@/services/profileService'
import { toAppError } from '@/lib/utils/errors'

export function EditProfileDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Edit profil">
      {/* Form di-mount hanya saat dialog terbuka agar state selalu segar. */}
      <EditProfileForm onClose={onClose} />
    </Modal>
  )
}

function EditProfileForm({ onClose }: { onClose: () => void }) {
  const { user, displayName, refreshProfile } = useAuth()
  const toast = useToast()
  const [name, setName] = useState(displayName)
  const [error, setError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)
    const trimmed = name.trim()
    if (trimmed.length < 2) return setError('Nama lengkap minimal 2 karakter.')
    if (trimmed.length > 120) return setError('Nama terlalu panjang (maks. 120 karakter).')
    setError(null)
    if (!user) return

    setLoading(true)
    try {
      await profileService.updateFullName(user.id, trimmed)
      await refreshProfile()
      toast.success('Profil diperbarui.')
      onClose()
    } catch (err) {
      setFormError(toAppError(err).message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 pb-2">
      {formError && <Alert kind="error">{formError}</Alert>}
      <TextField
        label="Nama lengkap"
        name="name"
        autoComplete="name"
        autoCapitalize="words"
        icon={<User className="h-5 w-5" />}
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={error}
        data-autofocus
      />
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onClose}>
          Batal
        </Button>
        <Button type="submit" loading={loading}>
          Simpan
        </Button>
      </div>
    </form>
  )
}
