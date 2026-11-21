import { useState, type FormEvent } from 'react'
import { Lock } from 'lucide-react'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import { Alert } from '@/components/ui/Alert'
import { PasswordStrength } from '@/components/shared/PasswordStrength'
import { useToast } from '@/hooks/useToast'
import { authService } from '@/services/authService'
import { toAppError } from '@/lib/utils/errors'
import { validatePassword } from '@/lib/utils/validation'

export function ChangePasswordDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <BottomSheet open={open} onClose={onClose} title="Ganti kata sandi">
      <ChangePasswordForm onClose={onClose} />
    </BottomSheet>
  )
}

function ChangePasswordForm({ onClose }: { onClose: () => void }) {
  const toast = useToast()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)
    const next: typeof errors = {}
    const pwErr = validatePassword(password)
    if (pwErr) next.password = pwErr
    if (!confirm) next.confirm = 'Konfirmasi kata sandi wajib diisi.'
    else if (confirm !== password) next.confirm = 'Konfirmasi kata sandi tidak cocok.'
    setErrors(next)
    if (Object.keys(next).length) return

    setLoading(true)
    try {
      await authService.updatePassword(password)
      toast.success('Kata sandi berhasil diganti.')
      onClose()
    } catch (err) {
      setFormError(toAppError(err).message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 pb-2">
      {formError && <Alert kind="error">{formError}</Alert>}
      <div className="space-y-3">
        <TextField
          label="Kata sandi baru"
          type="password"
          name="new-password"
          autoComplete="new-password"
          icon={<Lock className="h-5 w-5" />}
          revealable
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          data-autofocus
        />
        <PasswordStrength password={password} />
      </div>
      <TextField
        label="Konfirmasi kata sandi baru"
        type="password"
        name="confirm-password"
        autoComplete="new-password"
        icon={<Lock className="h-5 w-5" />}
        revealable
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={errors.confirm}
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
