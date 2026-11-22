import { DatabaseZap } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'

/** Ditampilkan bila dataset belum diimpor/tervalidasi. Tidak pernah menampilkan Al-Qur'an yang tidak lengkap. */
export function QuranUnavailable({ reason }: { reason?: string }) {
  return (
    <Card>
      <EmptyState
        icon={DatabaseZap}
        title="Data Al-Qur’an belum tersedia"
        description="Teks Al-Qur’an hanya ditampilkan dari dataset yang sudah diimpor dan lolos validasi. Coba lagi nanti."
      />
      <details className="border-t border-line px-5 py-4 text-sm">
        <summary className="min-h-[44px] cursor-pointer py-2.5 font-semibold text-brand">Detail untuk pengembang</summary>
        <div className="type-body space-y-2 pb-2">
          {reason && <p>{reason}</p>}
          <ol className="list-decimal space-y-1 pl-5">
            <li>Jalankan migrasi <code>20260102000000_quran_reader.sql</code>.</li>
            <li>Unduh berkas sumber Tanzil (lihat <code>data/quran-source/README.md</code>).</li>
            <li><code>npm run quran:validate</code>, lalu <code>npm run quran:import</code>.</li>
          </ol>
          <p>Panduan lengkap: <code>docs/QURAN_DATA.md</code>.</p>
        </div>
      </details>
    </Card>
  )
}
