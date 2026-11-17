import { createClient } from '@supabase/supabase-js'
import { env, isConfigured } from '@/config/env'

/**
 * Klien Supabase tunggal. Jika env belum lengkap, App menampilkan layar
 * konfigurasi sebelum ada komponen yang memakai klien ini; nilai placeholder
 * hanya mencegah createClient melempar error saat modul dimuat.
 */
export const supabase = createClient(
  isConfigured ? env.supabaseUrl : 'http://localhost:54321',
  isConfigured ? env.supabaseAnonKey : 'not-configured',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'lanila-tilawah-auth', // terpisah dari aplikasi Lanila lain
    },
  },
)
