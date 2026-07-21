/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0d1117',
        casing: '#14181f',
        panel: '#1b212b',
        panelBorder: '#2a3240',
        screen: '#081a10',
        phosphor: '#3dffa0',
        phosphorDim: '#1f8a5c',
        red: '#e3350d',
        redDim: '#7a1c08',
        gold: '#ffcb05',
        muted: '#7c8698',
        danger: '#ff5c5c',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        mono: ['"JetBrains Mono"', 'monospace'],
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
        slideUp: {
          '0%': { transform: 'translate(-50%, 12px)', opacity: 0 },
          '100%': { transform: 'translate(-50%, 0)', opacity: 1 },
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
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
      },
      animation: {
        flash: 'flash 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        popIn: 'popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        slideUp: 'slideUp 0.3s ease-out',
        slideDown: 'slideDown 0.25s ease-out',
        pulseSoft: 'pulseSoft 1.8s ease-in-out infinite',
        coinPop: 'coinPop 0.35s ease-out',
        shimmer: 'shimmer 2.2s linear infinite',
        wiggle: 'wiggle 0.4s ease-in-out',
      },
      transitionTimingFunction: {
        bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}