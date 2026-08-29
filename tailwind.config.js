/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1B5E20',
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#43A047',
          600: '#2E7D32',
          700: '#1B5E20',
          800: '#15491A',
          900: '#0E3312',
        },
        ochre: {
          DEFAULT: '#C68B3E',
          50: '#FBF3E8',
          100: '#F5E3C8',
          200: '#ECD09F',
          300: '#DDB066',
          400: '#C68B3E',
          500: '#B0782E',
          600: '#8E5F22',
          700: '#6D4819',
        },
        positive: '#2E7D32',
        warning: '#F9A825',
        urgent: '#C62828',
        cream: '#FAF7F0',
        ink: '#212121',
        muted: '#6D6259',
      },
      fontFamily: {
        sans: ['Noto Sans', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        body: ['16px', { lineHeight: '1.5' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.25s ease-out',
        'highlight': 'highlight 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        highlight: {
          '0%': { backgroundColor: 'rgba(249, 168, 37, 0.3)' },
          '100%': { backgroundColor: 'transparent' },
        },
      },
    },
  },
  plugins: [],
};
