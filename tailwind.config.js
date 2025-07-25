/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#72008c',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        categories: {
          kids: '#8ce205',
          juniores: '#72008c',
          adolescentes: '#f20384',
          jovens: '#1da2c3',
          'datas-festivas': '#01b58e',
          'outros-temas': '#ffd400',
          'atividades-imprimir': '#f76400',
          'desenhos-colorir': '#ee1e2e'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'wave': 'wave 2s infinite', // 👋 animação do emoji
        'pulse-metal': 'pulseMetal 1.5s ease-in-out infinite',
      },
      keyframes: {
  fadeIn: {
    '0%': { opacity: '0', transform: 'translateY(10px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  slideUp: {
    '0%': { transform: 'translateY(100%)' },
    '100%': { transform: 'translateY(0)' },
  },
  wave: {
    '0%': { transform: 'rotate(0deg)' },
    '15%': { transform: 'rotate(14deg)' },
    '30%': { transform: 'rotate(-8deg)' },
    '40%': { transform: 'rotate(14deg)' },
    '50%': { transform: 'rotate(-4deg)' },
    '60%': { transform: 'rotate(10deg)' },
    '70%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(0deg)' },
  },
  // 🔥 Efeito metálico que brilha suavemente
  metalShift: {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
        
pulseMetal: {
    '0%, 100%': { backgroundColor: '#9333ea' }, // vermelho metálico
    '50%': { backgroundColor: '#b913a3ff' }, // dourado ✅
  },
        
animation: {
  'fade-in': 'fadeIn 0.3s ease-in-out',
  'slide-up': 'slideUp 0.3s ease-out',
  'pulse-slow': 'pulse 3s infinite',
  'wave': 'wave 2s infinite',
  // ✨ Adiciona a nova animação metálica
  'metal': 'metalShift 5s ease-in-out infinite',
},

      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      typography: (theme) => ({
        dark: {
          css: {
            color: theme('colors.gray.300'),
            a: {
              color: theme('colors.primary.400'),
              '&:hover': {
                color: theme('colors.primary.600'),
              },
            },
            strong: {
              color: theme('colors.gray.100'),
            },
            blockquote: {
              borderLeftColor: theme('colors.gray.600'),
              color: theme('colors.gray.400'),
            },
            h1: { color: theme('colors.gray.100') },
            h2: { color: theme('colors.gray.100') },
            code: { color: theme('colors.purple.400') },
            'pre code': { color: theme('colors.gray.100') },
            hr: { borderColor: theme('colors.gray.700') },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  variants: {
    typography: ['dark'],
  },
};
