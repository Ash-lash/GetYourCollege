/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          DEFAULT: '#6366f1',
          light: '#a5b4fc',
          dark: '#4338ca',
        },
        pink: {
          DEFAULT: '#ec4899',
        },
        teal: {
          DEFAULT: '#14b8a6',
        },
        ink: '#050510',
        surface: '#fdfdff',
        muted: '#6b7280',
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        grotesk: ['Space Grotesk', 'system-ui', 'sans-serif'],
        caveat: ['Caveat', 'cursive'],
      },
      boxShadow: {
        sm: '0 8px 32px rgba(0, 0, 0, 0.06)',
        lg: '0 20px 60px rgba(0, 0, 0, 0.1)',
        indigo: '0 4px 12px rgba(99, 102, 241, 0.35)',
        'indigo-md': '0 6px 18px rgba(99, 102, 241, 0.3)',
        'indigo-lg': '0 10px 26px rgba(99, 102, 241, 0.38)',
        'red-sm': '0 4px 12px rgba(248, 113, 113, 0.3)',
        'red-md': '0 6px 20px rgba(248, 113, 113, 0.5)',
      },
      backdropBlur: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
      maxWidth: {
        '8xl': '1280px',
        '7xl': '1040px',
        '5xl': '960px',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
