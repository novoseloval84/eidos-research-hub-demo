import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dna-purple': '#8B5CF6',
        'med-blue': '#3B82F6',
        'lab-green': '#10B981',
        'cell-yellow': '#F59E0B',
        'research-teal': '#06B6D4',
        'ai-pink': '#EC4899',
        'gray-light': '#E2E8F0',
        'gray-dark': '#64748B',
      },
      backgroundImage: {
        'gradient-purple-pink': 'linear-gradient(90deg, #8B5CF6, #EC4899)',
        'gradient-green-teal': 'linear-gradient(90deg, #10B981, #06B6D4)',
        'gradient-purple-pink-blue': 'linear-gradient(90deg, #8B5CF6, #EC4899, #3B82F6)',
      },
      boxShadow: {
        'custom': '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        'custom-lg': '0 20px 40px -10px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'gradient': 'gradient 3s ease infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundSize: {
        '200-auto': '200% auto',
      },
    },
  },
  plugins: [],
}
export default config