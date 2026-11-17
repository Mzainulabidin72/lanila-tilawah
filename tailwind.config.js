/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#087F68', dark: '#066653', soft: '#E6F4F0' },
        secondary: { DEFAULT: '#159879', soft: '#E8F6F2' },
        accent: { DEFAULT: '#D6B66A', soft: '#F7F0DE' },
        canvas: '#FAFBF9',
        surface: '#FFFFFF',
        ink: '#202923',
        muted: '#78847D',
        'muted-strong': '#5B665F',
        line: '#E6EBE7',
        danger: { DEFAULT: '#B42318', soft: '#FDECEA' },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(32,41,35,0.04), 0 4px 16px rgba(32,41,35,0.04)',
      },
    },
  },
  plugins: [],
}
