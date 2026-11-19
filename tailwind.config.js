/** @type {import('tailwindcss').Config} */
const v = (name) => `rgb(var(--c-${name}) / <alpha-value>)`

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Semua warna berasal dari CSS variable (lihat src/styles/index.css),
      // sehingga komponen otomatis mengikuti tema light/dark.
      colors: {
        primary: { DEFAULT: v('primary'), dark: v('primary-dark'), soft: v('primary-soft') },
        brand: { DEFAULT: v('brand'), strong: v('brand-strong') }, // teks/ikon beraksen di atas surface
        secondary: { DEFAULT: v('secondary'), soft: v('secondary-soft') },
        accent: { DEFAULT: v('accent'), soft: v('accent-soft') },
        canvas: v('canvas'),
        surface: v('surface'),
        ink: v('ink'),
        muted: v('muted'),
        'muted-strong': v('muted-strong'),
        line: v('line'),
        danger: { DEFAULT: v('danger'), soft: v('danger-soft') },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Font Arab Al-Qur'an dipasang di Part 03. Jangan pakai font sans untuk teks Arab.
        quran: ['"Quran Placeholder"', 'Amiri', '"Noto Naskh Arabic"', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(32,41,35,0.04), 0 4px 16px rgba(32,41,35,0.05)',
      },
    },
  },
  plugins: [],
}
