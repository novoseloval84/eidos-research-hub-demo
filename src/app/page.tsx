import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import ResearchAssistant from '@/components/ResearchAssistant'
import Capabilities from '@/components/Capabilities'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      <Hero />
      <ResearchAssistant />
      <Capabilities />
      <Footer />
    </main>
  )
}
