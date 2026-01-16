/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spotify: {
          green: '#1DB954',
          'green-dark': '#1aa34a',
          'green-light': '#1ed760',
          black: '#0D0D0D',
          'black-light': '#181818',
          'gray-dark': '#282828',
          'gray': '#404040',
          'gray-light': '#B3B3B3',
          white: '#FFFFFF',
        },
        wrapped: {
          purple: '#8A3FFC',
          pink: '#FF6FE8',
          yellow: '#FEEF5B',
          green: '#17E58A',
          blue: '#3B82F6',
          orange: '#F97316',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['ClashDisplay', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-spotify': 'linear-gradient(135deg, #1DB954 0%, #1aa34a 100%)',
        'gradient-wrapped': 'linear-gradient(135deg, #8A3FFC 0%, #FF6FE8 50%, #FEEF5B 100%)',
        'gradient-dark': 'linear-gradient(to bottom, #0D0D0D 0%, #181818 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(29, 185, 84, 0.5)',
        'glow-purple': '0 0 20px rgba(138, 63, 252, 0.5)',
        'glow-pink': '0 0 20px rgba(255, 111, 232, 0.5)',
      },
    },
  },
  plugins: [],
}
