/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#ced9fd',
          300: '#a3b6fb',
          400: '#7289f7',
          500: '#4763f3',
          600: '#2563eb', // Primary brand color
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        premium: '0 8px 30px rgba(0, 0, 0, 0.04)',
        'premium-hover': '0 20px 40px rgba(0, 0, 0, 0.06)',
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
    },
  },
  plugins: [],
}

