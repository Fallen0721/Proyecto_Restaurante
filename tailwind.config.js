/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#D4A574',
          light: '#E8C9A0',
          dark: '#B8894A',
        },
        charcoal: {
          DEFAULT: '#1A1A1A',
          deep: '#0A0A0A',
          light: '#2A2A2A',
        },
        cream: '#F5F0EB',
        terracotta: '#C17A53',
        warmgray: '#A8998B',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212, 165, 116, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(212, 165, 116, 0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'bounce-arrow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(8px)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'confetti-fall': {
          '0%': { transform: 'translateY(-10px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'bounce-arrow': 'bounce-arrow 1.5s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'confetti-fall': 'confetti-fall 2s ease-in forwards',
      },
      backgroundSize: {
        '200%': '200%',
      },
    },
  },
  plugins: [],
};
