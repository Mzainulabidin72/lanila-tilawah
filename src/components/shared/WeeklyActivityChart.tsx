const DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

/** values: 7 angka (Sen–Min) dari aktivitas nyata, atau null bila belum ada data (placeholder garis putus). */
export function WeeklyActivityChart({ values, height = 120 }: { values: readonly number[] | null; height?: number }) {
  const max = values ? Math.max(1, ...values) : 1
  return (
    <div
      role="img"
      aria-label={values ? 'Grafik aktivitas membaca mingguan' : 'Grafik aktivitas mingguan: belum ada data'}
      className="flex items-end gap-2 sm:gap-4"
      style={{ height }}
    >
      {DAYS.map((d, i) => (
        <div key={d} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
          <div
            className={values ? 'w-full rounded-t-md bg-primary' : 'w-full rounded-t-md border-b-2 border-dashed border-line'}
            style={{ height: values ? `${Math.max(4, (values[i] / max) * 100)}%` : 6 }}
          />
          <span className="type-caption">{d}</span>
        </div>
      ))}
    </div>
  )
}
