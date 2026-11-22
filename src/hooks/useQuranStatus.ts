import { quranService } from '@/services/quranService'
import type { QuranStatus } from '@/types/quran'
import { useAsync } from './useAsync'

export function useQuranStatus() {
  const s = useAsync<QuranStatus>(() => quranService.getStatus(), [])
  return { status: s.data, loading: s.loading, error: s.error, reload: s.reload }
}
