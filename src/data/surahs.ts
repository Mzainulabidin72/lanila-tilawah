/**
 * DAFTAR SURAH SEMENTARA (metadata saja: nama, jumlah ayat, tempat turun).
 * Belum divalidasi terhadap dataset resmi. Digantikan oleh dataset tervalidasi di Part 03.
 * Tidak berisi teks Arab. Klasifikasi Makkiyah/Madaniyah memiliki perbedaan pendapat ulama;
 * di sini mengikuti penggolongan yang umum dipakai di Indonesia.
 */
export type Revelation = 'Makkiyah' | 'Madaniyah'

export interface Surah {
  number: number
  name: string
  verses: number
  revelation: Revelation
}

type Row = readonly [name: string, verses: number, type: 'K' | 'D']

const ROWS: readonly Row[] = [
  ['Al-Fatihah', 7, 'K'], ['Al-Baqarah', 286, 'D'], ['Ali ʿImran', 200, 'D'], ['An-Nisa’', 176, 'D'],
  ['Al-Ma’idah', 120, 'D'], ['Al-An’am', 165, 'K'], ['Al-A’raf', 206, 'K'], ['Al-Anfal', 75, 'D'],
  ['At-Taubah', 129, 'D'], ['Yunus', 109, 'K'], ['Hud', 123, 'K'], ['Yusuf', 111, 'K'],
  ['Ar-Ra’d', 43, 'D'], ['Ibrahim', 52, 'K'], ['Al-Hijr', 99, 'K'], ['An-Nahl', 128, 'K'],
  ['Al-Isra’', 111, 'K'], ['Al-Kahf', 110, 'K'], ['Maryam', 98, 'K'], ['Ta Ha', 135, 'K'],
  ['Al-Anbiya’', 112, 'K'], ['Al-Hajj', 78, 'D'], ['Al-Mu’minun', 118, 'K'], ['An-Nur', 64, 'D'],
  ['Al-Furqan', 77, 'K'], ['Asy-Syu’ara’', 227, 'K'], ['An-Naml', 93, 'K'], ['Al-Qasas', 88, 'K'],
  ['Al-‘Ankabut', 69, 'K'], ['Ar-Rum', 60, 'K'], ['Luqman', 34, 'K'], ['As-Sajdah', 30, 'K'],
  ['Al-Ahzab', 73, 'D'], ['Saba’', 54, 'K'], ['Fatir', 45, 'K'], ['Ya Sin', 83, 'K'],
  ['As-Saffat', 182, 'K'], ['Sad', 88, 'K'], ['Az-Zumar', 75, 'K'], ['Gafir', 85, 'K'],
  ['Fussilat', 54, 'K'], ['Asy-Syura', 53, 'K'], ['Az-Zukhruf', 89, 'K'], ['Ad-Dukhan', 59, 'K'],
  ['Al-Jasiyah', 37, 'K'], ['Al-Ahqaf', 35, 'K'], ['Muhammad', 38, 'D'], ['Al-Fath', 29, 'D'],
  ['Al-Hujurat', 18, 'D'], ['Qaf', 45, 'K'], ['Az-Zariyat', 60, 'K'], ['At-Tur', 49, 'K'],
  ['An-Najm', 62, 'K'], ['Al-Qamar', 55, 'K'], ['Ar-Rahman', 78, 'D'], ['Al-Waqi’ah', 96, 'K'],
  ['Al-Hadid', 29, 'D'], ['Al-Mujadalah', 22, 'D'], ['Al-Hasyr', 24, 'D'], ['Al-Mumtahanah', 13, 'D'],
  ['As-Saff', 14, 'D'], ['Al-Jumu’ah', 11, 'D'], ['Al-Munafiqun', 11, 'D'], ['At-Tagabun', 18, 'D'],
  ['At-Talaq', 12, 'D'], ['At-Tahrim', 12, 'D'], ['Al-Mulk', 30, 'K'], ['Al-Qalam', 52, 'K'],
  ['Al-Haqqah', 52, 'K'], ['Al-Ma’arij', 44, 'K'], ['Nuh', 28, 'K'], ['Al-Jinn', 28, 'K'],
  ['Al-Muzzammil', 20, 'K'], ['Al-Muddassir', 56, 'K'], ['Al-Qiyamah', 40, 'K'], ['Al-Insan', 31, 'D'],
  ['Al-Mursalat', 50, 'K'], ['An-Naba’', 40, 'K'], ['An-Nazi’at', 46, 'K'], ['‘Abasa', 42, 'K'],
  ['At-Takwir', 29, 'K'], ['Al-Infitar', 19, 'K'], ['Al-Mutaffifin', 36, 'K'], ['Al-Insyiqaq', 25, 'K'],
  ['Al-Buruj', 22, 'K'], ['At-Tariq', 17, 'K'], ['Al-A’la', 19, 'K'], ['Al-Gasyiyah', 26, 'K'],
  ['Al-Fajr', 30, 'K'], ['Al-Balad', 20, 'K'], ['Asy-Syams', 15, 'K'], ['Al-Lail', 21, 'K'],
  ['Ad-Duha', 11, 'K'], ['Asy-Syarh', 8, 'K'], ['At-Tin', 8, 'K'], ['Al-‘Alaq', 19, 'K'],
  ['Al-Qadr', 5, 'K'], ['Al-Bayyinah', 8, 'D'], ['Az-Zalzalah', 8, 'D'], ['Al-‘Adiyat', 11, 'K'],
  ['Al-Qari’ah', 11, 'K'], ['At-Takasur', 8, 'K'], ['Al-‘Asr', 3, 'K'], ['Al-Humazah', 9, 'K'],
  ['Al-Fil', 5, 'K'], ['Quraisy', 4, 'K'], ['Al-Ma’un', 7, 'K'], ['Al-Kausar', 3, 'K'],
  ['Al-Kafirun', 6, 'K'], ['An-Nasr', 3, 'D'], ['Al-Lahab', 5, 'K'], ['Al-Ikhlas', 4, 'K'],
  ['Al-Falaq', 5, 'K'], ['An-Nas', 6, 'K'],
]

export const SURAHS: readonly Surah[] = ROWS.map(([name, verses, type], i) => ({
  number: i + 1,
  name,
  verses,
  revelation: type === 'K' ? 'Makkiyah' : 'Madaniyah',
}))
