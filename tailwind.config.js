/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core backgrounds
        primary: '#07080f',
        secondary: '#0d0f1a',
        card: '#111420',
        elevated: '#171b2e',
        // Accents
        crimson: {
          DEFAULT: '#e63946',
          dark: '#c5303c',
          light: '#ff4d5a',
          hover: '#ff4d5a',
        },
        gold: {
          DEFAULT: '#f4c542',
          dark: '#d4a828',
          light: '#ffd666',
        },
        purple: {
          DEFAULT: '#7c6dfa',
          light: '#9b8fff',
          dark: '#6355d4',
        },
        // Text
        'txt': {
          primary: '#eef0f8',
          secondary: '#6b7494',
          muted: '#3d4360',
        },
        // Borders
        'line': {
          DEFAULT: 'rgba(255,255,255,0.06)',
          hover: 'rgba(255,255,255,0.12)',
        },
        // Legacy alias
        ink: {
          950: '#07080f',
          900: '#0d0f1a',
          800: '#111420',
          700: '#171b2e',
          600: '#243052',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        logo: ['Cinzel', 'serif'],
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out',
        fadeInUp: 'fadeInUp 0.5s ease-out both',
        slideUp: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        shimmer: 'shimmer 1.5s infinite',
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
        heroFade: 'heroFade 0.8s ease-in-out',
        float: 'float 3s ease-in-out infinite',
        spinSlow: 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(100%)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(230, 57, 70, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(230, 57, 70, 0.6)' },
        },
        heroFade: {
          from: { opacity: '0', transform: 'translateX(-10px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
