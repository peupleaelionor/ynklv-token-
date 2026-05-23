/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ─── YNKLV design tokens ───────────────────────────────────────────────
        //
        // Use these in Tailwind classes: bg-ynklv-black, text-ynklv-cream, etc.
        // Source of truth is globals.css :root vars; these values must stay in sync.
        'ynklv-black':   '#0A0A0A',   // Primary background
        'ynklv-cream':   '#F5F0E8',   // Primary text / light surfaces
        'ynklv-copper':  '#C17D3C',   // Brand accent — interactive elements, highlights
        'ynklv-copper-dim': '#8B5A2B', // Subdued copper for hover / inactive states
        'ynklv-surface': '#141414',   // Card / panel background
        'ynklv-border':  '#2A2A2A',   // Dividers and outlines
        'ynklv-muted':   'rgba(245, 240, 232, 0.45)', // Secondary / helper text
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderColor: {
        DEFAULT: '#2A2A2A', // ynklv-border as default border color
      },
      ringColor: {
        copper: '#C17D3C',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
