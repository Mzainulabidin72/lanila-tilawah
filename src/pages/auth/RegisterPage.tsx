import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, MailCheck, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import { Alert } from '@/components/ui/Alert'
import { PasswordStrength } from '@/components/shared/PasswordStrength'
import { authService } from '@/services/authService'
import { useToast } from '@/hooks/useToast'
import { toAppError } from '@/lib/utils/errors'
import { isValidEmail, validatePassword } from '@/lib/utils/validation'

type Errors = Partial<Record<'fullName' | 'email' | 'password' | 'confirm', string>>

export function RegisterPage() {
  const navigate = useNavigate()
  const toast = useToast()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sentTo, setSentTo] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)

    const next: Errors = {}
    if (fullName.trim().length < 2) next.fullName = 'Nama lengkap minimal 2 karakter.'
    else if (fullName.trim().length > 120) next.fullName = 'Nama terlalu panjang (maks. 120 karakter).'
    if (!email.trim()) next.email = 'Email wajib diisi.'
    else if (!isValidEmail(email)) next.email = 'Format email tidak valid.'
    const pwErr = validatePassword(password)
    if (pwErr) next.password = pwErr
    if (!confirm) next.confirm = 'Konfirmasi kata sandi wajib diisi.'
    else if (confirm !== password) next.confirm = 'Konfirmasi kata sandi tidak cocok.'
    setErrors(next)
    if (Object.keys(next).length) return

    setLoading(true)
    try {
      const result = await authService.signUp({ fullName, email, password })
      if (result === 'already_registered') {
        setFormError('Email ini sudah terdaftar. Silakan masuk atau atur ulang kata sandi.')
      } else if (result === 'confirm_email') {
        setSentTo(email.trim())
      } else {
        toast.success('Akun berhasil dibuat. Selamat datang di Lanila Tilawah!')
        navigate('/', { replace: true })
        return
      }
    } catch (err) {
      setFormError(toAppError(err).message)
    }
    setLoading(false)
  }

  if (sentTo) {
    return (
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-brand">
          <MailCheck className="h-7 w-7" aria-hidden />
        </span>
        <h2 className="mt-6 text-2xl font-extrabold tracking-tight">Cek email kamu</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-strong">
          Kami mengirim tautan konfirmasi ke <strong className="text-ink">{sentTo}</strong>. Buka tautan itu untuk
          mengaktifkan akun, lalu masuk.
        </p>
        <Link to="/login" className="mt-8 inline-flex min-h-[44px] items-center font-semibold text-brand hover:underline">
          Kembali ke halaman masuk
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Buat akun</h2>
      <p className="mt-2 text-sm text-muted-strong">Mulai perjalanan tilawah pribadimu.</p>

      <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
        {formError && <Alert kind="error">{formError}</Alert>}

        <TextField
          label="Nama lengkap"
          name="name"
          autoComplete="name"
          autoCapitalize="words"
          placeholder="Nama kamu"
          icon={<User className="h-5 w-5" />}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={errors.fullName}
        />

        <TextField
          label="Email"
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder="nama@email.com"
          icon={<Mail className="h-5 w-5" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />

        <div className="space-y-3">
          <TextField
            label="Kata sandi"
            type="password"
            name="new-password"
            autoComplete="new-password"
            placeholder="Minimal 8 karakter, huruf dan angka"
            icon={<Lock className="h-5 w-5" />}
            revealable
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          <PasswordStrength password={password} />
        </div>

        <TextField
          label="Konfirmasi kata sandi"
          type="password"
          name="confirm-password"
          autoComplete="new-password"
          placeholder="Ulangi kata sandi"
          icon={<Lock className="h-5 w-5" />}
          revealable
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
        />

        <Button type="submit" fullWidth loading={loading}>
          {loading ? 'Membuat akun…' : 'Buat akun'}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-strong">
        Sudah punya akun?{' '}
        <Link to="/login" className="font-semibold text-brand hover:underline">
          Masuk
        </Link>
      </p>
    </div>
  )
}
