import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: '#0891B2',
        'brand-hover': '#0E7490',
        'brand-active': '#155E75',
        'bg-app': '#F8FAFC',
        surface: '#ffffff',
        border: '#E2E8F0',
        'text-primary': '#0F172A',
        'text-secondary': '#475569',
        'text-muted': '#94A3B8',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        sora: ['Sora', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        card: '0 1px 4px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
}

export default config
