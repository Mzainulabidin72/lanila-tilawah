import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, MailCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import { Alert } from '@/components/ui/Alert'
import { authService } from '@/services/authService'
import { toAppError } from '@/lib/utils/errors'
import { isValidEmail } from '@/lib/utils/validation'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)
    if (!email.trim()) return setError('Email wajib diisi.')
    if (!isValidEmail(email)) return setError('Format email tidak valid.')
    setError(null)

    setLoading(true)
    try {
      await authService.requestPasswordReset(email)
      setSent(true)
    } catch (err) {
      setFormError(toAppError(err).message)
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <MailCheck className="h-7 w-7" aria-hidden />
        </span>
        <h2 className="mt-6 text-2xl font-extrabold tracking-tight">Permintaan terkirim</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-strong">
          Jika <strong className="text-ink">{email.trim()}</strong> terdaftar, kami sudah mengirim tautan untuk mengatur
          ulang kata sandi. Cek juga folder spam.
        </p>
        <Link to="/login" className="mt-8 inline-flex min-h-[44px] items-center font-semibold text-primary hover:underline">
          Kembali ke halaman masuk
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link to="/login" className="mb-6 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-muted-strong hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Kembali
      </Link>
      <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Atur ulang kata sandi</h2>
      <p className="mt-2 text-sm text-muted-strong">Masukkan email akunmu. Kami kirim tautan untuk membuat kata sandi baru.</p>

      <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
        {formError && <Alert kind="error">{formError}</Alert>}
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
          error={error}
        />
        <Button type="submit" fullWidth loading={loading}>
          {loading ? 'Mengirim…' : 'Kirim tautan'}
        </Button>
      </form>
    </div>
  )
}
