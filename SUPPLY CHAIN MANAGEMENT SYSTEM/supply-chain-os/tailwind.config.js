/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background layers
        void: '#0A0E14',
        surface: {
          DEFAULT: '#151B26',
          alt: '#1C2433',
        },
        border: '#2A3441',
        
        // Text hierarchy
        text: {
          primary: '#E8EDF4',
          secondary: '#A0AABE',
          tertiary: '#6B7589',
        },
        
        // Semantic colors
        accent: {
          DEFAULT: '#FF8C42',
          dim: '#CC6F35',
        },
        success: {
          DEFAULT: '#3DD68C',
          dim: '#2A9D64',
        },
        warning: {
          DEFAULT: '#FFB84D',
          dim: '#CC933D',
        },
        danger: {
          DEFAULT: '#FF5757',
          dim: '#CC4646',
        },
        info: {
          DEFAULT: '#4D9FFF',
          dim: '#3D7FCC',
        },
        
        // Chart colors
        chart: {
          1: '#FF8C42',
          2: '#4D9FFF',
          3: '#3DD68C',
          4: '#A78BFA',
          5: '#FFB84D',
        },
      },
      
      fontFamily: {
        heading: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Roboto Mono', 'monospace'],
      },
      
      fontSize: {
        'data-lg': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'data-md': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'data-sm': ['1rem', { lineHeight: '1.3' }],
      },
      
      backgroundImage: {
        'grid-pattern': `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232A3441' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v6h6V4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        'noise': `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
      },
      
      boxShadow: {
        'glow-accent': '0 0 20px rgba(255, 140, 66, 0.3)',
        'glow-success': '0 0 20px rgba(61, 214, 140, 0.3)',
        'glow-danger': '0 0 20px rgba(255, 87, 87, 0.3)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
      },
      
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
