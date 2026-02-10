/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts}"],
  theme: {
    extend: {
      colors: {
        'az-gold': '#FFD700',
        'az-gold-glow': '#B8860B',
        'az-blue': '#00BFFF',
        'az-blue-glow': '#00008B',
        'az-dark': '#0a0a0a',
        'az-dark-soft': '#1a1a1a',
        'glass-bg': 'rgba(255, 255, 255, 0.03)',
        'glass-border': 'rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'], // High-tech mono font
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-p1': 'glow-gold 2s ease-in-out infinite alternate',
        'glow-p2': 'glow-blue 2s ease-in-out infinite alternate',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow-gold': {
          'from': { boxShadow: '0 0 10px #FFD700, 0 0 20px #FFD700' },
          'to': { boxShadow: '0 0 20px #FFD700, 0 0 30px #FFD700' },
        },
        'glow-blue': {
          'from': { boxShadow: '0 0 10px #00BFFF, 0 0 20px #00BFFF' },
          'to': { boxShadow: '0 0 20px #00BFFF, 0 0 30px #00BFFF' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
