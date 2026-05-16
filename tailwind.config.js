/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink:       '#090D16',
        card:      '#131B2E',
        card2:     '#1A2440',
        card3:     '#1E2D55',
        line:      '#222D4A',
        line2:     '#2C3A5E',
        lineFaint: '#1C2540',
        fg:        '#FFFFFF',
        muted:     '#94A3B8',
        dim:       '#64748B',
        cyan: { DEFAULT:'#06B6D4', hover:'#22D3EE', press:'#0891B2' },
        indigo: { DEFAULT:'#6366F1', light:'#818CF8' },
        amber: { DEFAULT:'#F59E0B', light:'#FBBF24' },
        success: '#4CAF50',
        warning: '#FFB300',
        danger:  '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow:         '0 0 0 1px rgba(6,182,212,0.55), 0 0 28px rgba(6,182,212,0.22)',
        'glow-indigo':'0 0 0 1px rgba(99,102,241,0.50), 0 0 28px rgba(99,102,241,0.22)',
        'glow-amber': '0 0 0 1px rgba(245,158,11,0.45), 0 0 24px rgba(245,158,11,0.18)',
      },
      keyframes: {
        zkScan:    { '0%':{ transform:'translateX(-100%)' }, '100%':{ transform:'translateX(100%)' } },
        sealPulse: { '0%,100%':{ boxShadow:'0 0 0 0 rgba(99,102,241,0)' }, '50%':{ boxShadow:'0 0 0 6px rgba(99,102,241,0.14)' } },
      },
      animation: {
        'zk-scan':    'zkScan 1.6s linear infinite',
        'seal-pulse': 'sealPulse 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
