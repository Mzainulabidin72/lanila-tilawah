/** Error dengan pesan yang aman ditampilkan ke pengguna. */
export class AppError extends Error {
  readonly code: string
  constructor(message: string, code = 'unknown') {
    super(message)
    this.name = 'AppError'
    this.code = code
  }
}

interface SupabaseLikeError {
  message?: string
  code?: string
  status?: number
  name?: string
}

const NETWORK_HINTS = ['failed to fetch', 'networkerror', 'network request failed', 'load failed']

export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error

  const e = (error ?? {}) as SupabaseLikeError
  const msg = (e.message ?? '').toLowerCase()
  const code = e.code ?? ''

  if (e.name === 'AuthRetryableFetchError' || NETWORK_HINTS.some((h) => msg.includes(h))) {
    return new AppError('Tidak dapat terhubung ke server. Periksa koneksi internet kamu lalu coba lagi.', 'network')
  }

  switch (code) {
    case 'invalid_credentials':
      return new AppError('Email atau kata sandi salah.', code)
    case 'email_not_confirmed':
      return new AppError('Email belum dikonfirmasi. Cek kotak masuk kamu untuk tautan konfirmasi.', code)
    case 'user_already_exists':
    case 'email_exists':
      return new AppError('Email ini sudah terdaftar. Silakan masuk atau atur ulang kata sandi.', code)
    case 'weak_password':
      return new AppError('Kata sandi terlalu lemah. Gunakan minimal 8 karakter dengan huruf dan angka.', code)
    case 'validation_failed':
    case 'email_address_invalid':
      return new AppError('Format email tidak valid.', code)
    case 'over_request_rate_limit':
    case 'over_email_send_rate_limit':
      return new AppError('Terlalu banyak percobaan. Tunggu beberapa saat lalu coba lagi.', code)
    case 'reauthentication_needed':
      return new AppError('Demi keamanan, keluar lalu masuk kembali sebelum mengganti kata sandi.', code)
    case 'same_password':
      return new AppError('Kata sandi baru harus berbeda dari yang lama.', code)
    case 'otp_expired':
    case 'session_not_found':
    case 'bad_jwt':
      return new AppError('Tautan sudah kedaluwarsa atau tidak valid. Minta tautan baru.', code)
    default:
      break
  }

  if (msg.includes('invalid login credentials')) return new AppError('Email atau kata sandi salah.', 'invalid_credentials')
  if (msg.includes('already registered')) return new AppError('Email ini sudah terdaftar. Silakan masuk atau atur ulang kata sandi.', 'user_already_exists')
  if (msg.includes('rate limit')) return new AppError('Terlalu banyak percobaan. Tunggu beberapa saat lalu coba lagi.', 'over_request_rate_limit')
  if (e.status === 401 || e.status === 403) return new AppError('Sesi tidak valid atau akses ditolak. Silakan masuk kembali.', 'unauthorized')

  return new AppError('Terjadi kesalahan. Silakan coba lagi.', 'unknown')
}
