import type { DatasetInfo } from '@/types/quran'

/** Atribusi sumber (CC BY 3.0 mewajibkan penyebutan sumber dan tautan ke tanzil.net). */
export function QuranAttribution({ info, placeholder }: { info: DatasetInfo; placeholder?: boolean }) {
  if (placeholder) return null
  return (
    <footer className="type-caption space-y-1.5 border-t border-line pt-4">
      <p>
        Teks Al-Qur’an: {info.text_attribution ?? 'Tanzil Quran Text © Tanzil Project'},{' '}
        <a href="https://tanzil.net" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand underline">
          tanzil.net
        </a>
        . {info.text_license ?? 'Lisensi CC BY 3.0; teks tidak diubah.'}
      </p>
      {info.translation_language && (
        <p>
          Terjemahan: {info.translation_attribution ?? info.translation_translator}
          {info.translation_version ? `, versi ${info.translation_version}` : ''}. {info.translation_license}
        </p>
      )}
    </footer>
  )
}
