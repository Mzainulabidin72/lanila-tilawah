/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  /** Hanya untuk pengembangan: tampilkan pembaca dengan konten placeholder (BUKAN Al-Qur'an) saat data belum diimpor. */
  readonly VITE_QURAN_PLACEHOLDER?: string
}
