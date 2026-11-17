const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

function jwtRole(token: string): string | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return (JSON.parse(json) as { role?: string }).role ?? null
  } catch {
    return null
  }
}

const issues: string[] = []

if (!url) {
  issues.push('VITE_SUPABASE_URL belum diisi.')
} else {
  try {
    new URL(url)
  } catch {
    issues.push('VITE_SUPABASE_URL bukan URL yang valid (contoh: https://xxxx.supabase.co).')
  }
}

if (!key) {
  issues.push('VITE_SUPABASE_ANON_KEY belum diisi.')
} else if (jwtRole(key) === 'service_role') {
  issues.push('Key yang dipakai adalah service_role. Itu rahasia dan tidak boleh ada di frontend. Gunakan anon key.')
}

export const configIssues: readonly string[] = issues
export const isConfigured = issues.length === 0

export const env = {
  supabaseUrl: url ?? '',
  supabaseAnonKey: key ?? '',
} as const
