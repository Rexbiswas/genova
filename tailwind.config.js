/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0786C5',
          hover: '#066fa3',
          light: '#e0f2fe',
        },
        navy: {
          DEFAULT: '#092846',
          dark: '#051b30',
        },
        cyan: {
          DEFAULT: '#09B7D5',
          light: '#cffafe',
        },
        background: '#F5F8FC',
        surface: '#FFFFFF',
        ink: {
          DEFAULT: '#101D32',
          secondary: '#334155',
          muted: '#70819A',
          light: '#94a3b8',
        },
        border: {
          DEFAULT: '#DFE7F1',
          light: '#F1F5F9',
        },
        success: {
          DEFAULT: '#19B981',
          soft: '#ecfdf5',
        },
        warning: {
          DEFAULT: '#F59E0B',
          soft: '#fffbeb',
        },
        error: {
          DEFAULT: '#EF4444',
          soft: '#fef2f2',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        card: '18px',
        control: '10px',
        sm: '8px',
        lg: '14px',
      },
      boxShadow: {
        card: '0 4px 18px rgba(9, 40, 70, 0.045)',
        hover: '0 12px 28px rgba(9, 40, 70, 0.10)',
        dropdown: '0 16px 36px -4px rgba(9, 40, 70, 0.16)',
        modal: '0 24px 48px -12px rgba(9, 40, 70, 0.25)',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { transform: 'scale(1)', filter: 'drop-shadow(0 0 0px #09B7D5)' },
          '50%': { transform: 'scale(1.15)', filter: 'drop-shadow(0 0 8px rgba(9, 183, 213, 0.8))' },
        },
        pingDot: {
          '0%': { transform: 'scale(0.95)', opacity: '0.8' },
          '50%': { transform: 'scale(1.6)', opacity: '0' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.4s infinite ease-in-out',
        'ping-dot': 'pingDot 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [],
}
