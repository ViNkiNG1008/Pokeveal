/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#05070d',
        casing: '#0a0f1c',
        panel: '#111c2e',
        panelBorder: '#243450',
        screen: '#04070f',
        phosphor: '#7fd4ff',
        phosphorDim: '#5c7fa3',
        red: '#e3350d',
        redDim: '#a8260a',
        gold: '#ffcb05',
        muted: '#7788a0',
        danger: '#ff5b5b',
        text: '#eef2f9',
      },
      fontFamily: {
        pixel: ['"Baloo 2"', 'sans-serif'],
        mono: ['"Nunito"', 'sans-serif'],
      },
      keyframes: {
        flash: {
          '0%': { transform: 'scale(0.8)', opacity: 0 },
          '60%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        popIn: {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        slideDown: {
          '0%': { transform: 'translateY(-6px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        coinPop: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.18)' },
          '100%': { transform: 'scale(1)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        floatUp: {
          '0%': { transform: 'translateY(0)', opacity: 1 },
          '100%': { transform: 'translateY(-18px)', opacity: 0 },
        },
      },
      animation: {
        flash: 'flash 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        popIn: 'popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        slideDown: 'slideDown 0.25s ease-out',
        pulseSoft: 'pulseSoft 1.8s ease-in-out infinite',
        coinPop: 'coinPop 0.35s ease-out',
        wiggle: 'wiggle 0.4s ease-in-out',
        spinSlow: 'spinSlow 6s linear infinite',
        floatUp: 'floatUp 0.7s ease-out forwards',
      },
    },
  },
  plugins: [],
}