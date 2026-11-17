import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import { Alert } from '@/components/ui/Alert'
import { EmptyState } from '@/components/ui/EmptyState'
import { PasswordStrength } from '@/components/shared/PasswordStrength'
import { FullScreenLoader } from '@/components/shared/FullScreenLoader'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { authService } from '@/services/authService'
import { toAppError } from '@/lib/utils/errors'
import { validatePassword } from '@/lib/utils/validation'

/** Supabase mengirim error recovery lewat hash URL (#error=...&error_code=otp_expired). */
function hasRecoveryLinkError(): boolean {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  return params.has('error') || params.has('error_code')
}

export function ResetPasswordPage() {
  const { session, loading: authLoading, signOut } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const [linkError] = useState(hasRecoveryLinkError)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (authLoading) return <FullScreenLoader label="Memeriksa tautan…" />

  if (linkError || !session) {
    return (
      <EmptyState
        icon={LinkIcon}
        title="Tautan tidak valid atau kedaluwarsa"
        description="Tautan atur ulang kata sandi hanya berlaku sekali dan dalam waktu terbatas. Minta tautan baru untuk melanjutkan."
        action={
          <Link
            to="/forgot-password"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Minta tautan baru
          </Link>
        }
      />
    )
  }

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
      await signOut()
      toast.success('Kata sandi diperbarui. Silakan masuk dengan kata sandi baru.')
      navigate('/login', { replace: true })
    } catch (err) {
      setFormError(toAppError(err).message)
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Buat kata sandi baru</h2>
      <p className="mt-2 text-sm text-muted-strong">Pilih kata sandi yang belum pernah kamu pakai di tempat lain.</p>

      <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
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
        <Button type="submit" fullWidth loading={loading}>
          {loading ? 'Menyimpan…' : 'Simpan kata sandi'}
        </Button>
      </form>
    </div>
  )
}
