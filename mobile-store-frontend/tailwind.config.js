/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#030712', // Deep Obsidian Background
          900: '#090d16', // Primary Surface
          850: '#0f172a', // Card & Modal Background
          800: '#1e293b', // Subdued Borders
          700: '#334155', // Hover State & Active Borders
        },
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
        },
        accent: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1', // Main Cyber Indigo Accent
          600: '#4f46e5',
          700: '#4338ca',
          glow: 'rgba(99, 102, 241, 0.35)',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(99, 102, 241, 0.25)',
        'glow-md': '0 0 30px -5px rgba(99, 102, 241, 0.35)',
        'glow-lg': '0 0 50px -10px rgba(99, 102, 241, 0.45)',
        'card': '0 8px 30px -8px rgba(0, 0, 0, 0.7)',
        'card-hover': '0 20px 40px -15px rgba(99, 102, 241, 0.2)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'marquee': 'marquee 32s linear infinite',
      },
    },
  },
  plugins: [],
}
