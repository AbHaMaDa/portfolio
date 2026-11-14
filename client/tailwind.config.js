/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#09090B',
          card: '#121216',
          surface: '#141418',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        brand: {
          cyan: '#06B6D4',
          blue: '#3B82F6',
          purple: '#8B5CF6',
          orange: '#F97316',
          coral: '#F43F5E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
