import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0d1b2a',
        steel: '#7b8ea1',
        shimmer: '#d4d7dd',
        accent: '#1d9bf0'
      },
      boxShadow: {
        glow: '0 20px 40px rgba(15, 23, 42, 0.18)'
      }
    }
  },
  plugins: []
}

export default config
