#!/bin/bash

echo "🚀 Создание Eidos Research Hub проекта..."

# Создаем структуру папок
mkdir -p src/{app,components,lib} public

# 1. package.json
cat > package.json << 'EOF'
{
  "name": "eidos-research-hub",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 8880",
    "build": "next build",
    "start": "next start -p 8880",
    "lint": "next lint"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "14.0.4",
    "lucide-react": "^0.309.0",
    "framer-motion": "^10.16.4",
    "tailwind-merge": "^2.2.0",
    "clsx": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.3.2",
    "eslint": "^8.55.0",
    "eslint-config-next": "14.0.4"
  }
}
EOF

# 2. tailwind.config.ts
cat > tailwind.config.ts << 'EOF'
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
      },
      animation: {
        'gradient': 'gradient 3s ease infinite',
        'pulse-slow': 'pulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'progress': 'progress 2s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        progress: {
          '0%, 100%': { width: '75%' },
          '50%': { width: '85%' },
        },
      },
    },
  },
  plugins: [],
}
export default config
EOF

# 3. next.config.js
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: 'http://localhost:8880' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ]
      }
    ]
  },
  devIndicators: {
    buildActivityPosition: 'bottom-right',
  }
}

module.exports = nextConfig
EOF

# 4. tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

# 5. .gitignore
cat > .gitignore << 'EOF'
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
EOF

# 6. postcss.config.js
cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# 7. .env.local
cat > .env.local << 'EOF'
GROQ_API_KEY=your_groq_api_key_here
GOOGLE_AI_API_KEY=your_google_ai_studio_key_here
OPENROUTER_API_KEY=your_openrouter_key_here
NEXT_PUBLIC_APP_URL=http://localhost:8880
EOF

# 8. public/favicon.ico (пустой файл)
touch public/favicon.ico

# 9. public/robots.txt
cat > public/robots.txt << 'EOF'
User-agent: *
Allow: /
EOF

echo "✅ Все файлы созданы!"
echo "📦 Запустите: npm install"
echo "🚀 Затем: npm run dev"
