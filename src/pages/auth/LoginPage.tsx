import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import { Alert } from '@/components/ui/Alert'
import { authService } from '@/services/authService'
import { toAppError } from '@/lib/utils/errors'
import { isValidEmail } from '@/lib/utils/validation'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)

    const next: typeof errors = {}
    if (!email.trim()) next.email = 'Email wajib diisi.'
    else if (!isValidEmail(email)) next.email = 'Format email tidak valid.'
    if (!password) next.password = 'Kata sandi wajib diisi.'
    setErrors(next)
    if (Object.keys(next).length) return

    setLoading(true)
    try {
      await authService.signIn(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setFormError(toAppError(err).message)
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Masuk</h2>
      <p className="mt-2 text-sm text-muted-strong">Lanjutkan tilawah dari tempat terakhir kamu berhenti.</p>

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
          error={errors.email}
        />

        <TextField
          label="Kata sandi"
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Masukkan kata sandi"
          icon={<Lock className="h-5 w-5" />}
          revealable
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
            Lupa kata sandi?
          </Link>
        </div>

        <Button type="submit" fullWidth loading={loading}>
          {loading ? 'Memproses…' : 'Masuk'}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-strong">
        Belum punya akun?{' '}
        <Link to="/register" className="font-semibold text-primary hover:underline">
          Daftar
        </Link>
      </p>
    </div>
  )
}
