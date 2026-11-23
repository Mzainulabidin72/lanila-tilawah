-- Part 03b: menyimpan catatan kaki terjemahan (agar tidak ada konten yang dihapus) dan versi/sumber terjemahan.
alter table public.quran_translations add column if not exists footnotes text;

alter table public.quran_dataset_info add column if not exists translation_version text;
alter table public.quran_dataset_info add column if not exists translation_source_url text;
alter table public.quran_dataset_info add column if not exists translation_downloaded_at date;
alter table public.quran_dataset_info add column if not exists text_downloaded_at date;
