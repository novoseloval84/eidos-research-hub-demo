# 🤖 AI Research Assistant - Eidos Research Hub

## 🎯 Project Description
Multi-agent expert analysis system with the ability to operate in demonstration mode without connecting to external LLMs.

## ✨ Key Features

### 🔬 4 Expert Systems:
- 🤖 **Generative AI** - Creative synthesis and innovation generation
- 🕸️ **Knowledge Graph** - Semantic network and pattern analysis  
- 🧬 **Life Sciences** - Scientific analysis in biomedicine
- 🌐 **Multi-Domain** - Comprehensive interdisciplinary analysis

### ⚡ Core Features:
- 🎯 **Multi-agent architecture** - Chain of 3 AI agents
- 🎨 **Intuitive interface** - Gradients, animations, beautiful cards
- 📊 **Process visualization** - Clear workflow for each agent
- 🛡️ **Autonomous operation** - Demo mode without API keys
- 📱 **Responsive design** - Works on all devices

## 🏗️ Architecture

### Frontend:
- ⚛️ **Next.js 14** - Modern React framework
- 🎨 **Tailwind CSS** - Utility classes for styling
- ✨ **FontAwesome** - Beautiful icons
- 📱 **Responsive Design** - Adaptive layout

### Backend:
- 🚀 **Next.js API Routes** - Serverless functions
- 🤝 **Multi-agent system** - Chain of 3 AI agents
- 🔄 **Fallback mode** - Automatic switch to demo data

## 🎨 Interface

### Main Components:
1. 🎯 **Expertise Selection** - 4 colored system cards
2. 📋 **Example Queries** - Ready-made templates for testing
3. ✍️ **Query Form** - Large text field with hints
4. 🔄 **Process Visualization** - Agent work animation
5. 📊 **Analysis Results** - Structured response in markdown
6. 📈 **Statistics** - Key analysis metrics

### Visual Elements:
- 🌈 **Gradients** - DNA Purple, AI Pink, Lab Green, Med Blue
- 🎭 **Animations** - Smooth transitions, progress indicators
- 📱 **Cards** - Glass effect, shadows, rounded corners
- 🎯 **Icons** - FontAwesome for all UI elements

## 🔧 Technology Stack

### **Frontend:**
- **Next.js 14** - React framework with App Router and Server Components
- **React 18** - UI library with hooks and concurrent features
- **TypeScript** - Static typing for better code quality
- **Tailwind CSS** - Utility-first CSS framework
- **FontAwesome** - Icon library for UI elements

### **Backend:**
- **Next.js API Routes** - Serverless API endpoints
- **Node.js** - JavaScript runtime environment
- **REST API** - Architectural style for web services

### **Development Tools:**
- **ESLint** - Code linting and quality checking
- **Prettier** - Code formatting and consistency
- **Responsive Design** - Mobile-first responsive layouts

### **Deployment:**
- **Vercel** - Hosting platform with CI/CD
- **GitHub** - Version control and collaboration

## 📁 Project Structure

### **File Descriptions:**

#### **API Routes:**
- `src/app/api/chat/route.ts` - Handles chat functionality endpoints
- `src/app/api/research/assistant/route.ts` - Multi-agent research assistant API

#### **App Components:**
- `src/app/globals.css` - Global CSS styles and Tailwind directives
- `src/app/layout.tsx` - Root layout component with metadata
- `src/app/page.tsx` - Main home page component

#### **UI Components:**
- `src/components/ResearchAssistant.tsx` - Multi-agent AI research assistant interface
- `src/components/Navbar.tsx` - Navigation header component
- `src/components/Hero.tsx` - Hero/landing section component
- `src/components/Capabilities.tsx` - Features and capabilities showcase
- `src/components/Footer.tsx` - Footer component with links and information

#### **Configuration Files:**
- `package.json` - Project dependencies, scripts, and metadata
- `tailwind.config.ts` - Tailwind CSS theme and plugin configuration
- `tsconfig.json` - TypeScript compiler options
- `next.config.js` - Next.js framework configuration
- `.env.local` - Environment variables (not in repo)

#### **Static Assets:**
- `public/favicon.ico` - Website favicon
- `public/robots.txt` - Search engine optimization configuration

#### **Documentation:**
- `README.md` - Project documentation (this file)
- `LICENSE` - MIT License file

## 🚀 Live Demo

👉 **[Live Demo on Vercel](https://eidos-research-hub-demo.vercel.app/)**

## 🎮 How to Use

1. **Select expertise** 🎯 - Click on the desired system
2. **Enter query** ✍️ - Or use a ready-made example
3. **Click "Start Analysis"** 🚀 - Agent chain will start
4. **Observe the process** 👀 - Animation of 3 AI agents working
5. **Get results** 📊 - Structured analysis with metrics

## 🚀 Quick Start

### Local Development
```bash
# Clone repository
git clone https://github.com/novoseloval84/eidos-research-hub-demo.git
cd eidos-research-hub-demo

# Install dependencies
npm install

# Run development server
npm run dev

Open http://localhost:3000 in your browser.

# Build for production
npm run build

# Start production server
npm start

🔧 Development
Environment Variables
Create .env.local file:
GROQ_API_KEY=your_groq_key_here
GOOGLE_API_KEY=your_google_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
Add Real LLM Support
Get API keys from:

Groq Cloud

Google AI Studio

Update src/app/api/research/assistant/route.ts

Restart the server

🌟 Advantages
For Users:
🎨 Beautiful interface - Modern design with animations

⚡ Fast operation - Local demo data without delays

🧩 Easy to use - Intuitive workflow

📱 Mobile version - Full functionality on phones

For Developers:
🏗️ Clean architecture - Separation of frontend and backend

📝 TypeScript - Typing for reliability

🎨 Tailwind - Fast styling

🔧 Easy setup - Simple API connection

🔮 Development Roadmap
Near-term Updates:
🔌 Real LLM support - Groq, OpenAI, Anthropic

📁 File upload - PDF, DOCX, images

📊 Graph visualization - Interactive knowledge graphs

🤖 Additional agents - Specialized experts

🌐 Result export - PDF, Markdown, JSON

Long-term Goals:
🧠 Custom prompts - Editing system instructions

📈 Analytics - Usage and effectiveness statistics

🔗 Integrations - Zotero, PubMed, arXiv

👥 Collaborations - Joint work on projects

👥 Project Team
Alexey Novoselov - Full-stack developer

Eidos Research Hub - Scientific research platform

🤝 Contributing
Fork the repository

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
MIT License - open source code for scientific and educational purposes.
