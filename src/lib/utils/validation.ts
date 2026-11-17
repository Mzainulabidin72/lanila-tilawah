const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim())
}

export const MIN_PASSWORD_LENGTH = 8

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4
  label: string
  isAcceptable: boolean
}

export function evaluatePassword(pw: string): PasswordStrength {
  if (!pw) return { score: 0, label: '', isAcceptable: false }

  let score = 0
  if (pw.length >= MIN_PASSWORD_LENGTH) score++
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) score++

  const s = Math.min(score, 4) as 0 | 1 | 2 | 3 | 4
  const labels = ['Sangat lemah', 'Lemah', 'Cukup', 'Kuat', 'Sangat kuat']
  const isAcceptable = pw.length >= MIN_PASSWORD_LENGTH && /[A-Za-z]/.test(pw) && /\d/.test(pw)
  return { score: s, label: labels[s], isAcceptable }
}

export function validatePassword(pw: string): string | null {
  if (!pw) return 'Kata sandi wajib diisi.'
  if (pw.length < MIN_PASSWORD_LENGTH) return `Kata sandi minimal ${MIN_PASSWORD_LENGTH} karakter.`
  if (!/[A-Za-z]/.test(pw) || !/\d/.test(pw)) return 'Gunakan kombinasi huruf dan angka.'
  return null
}
