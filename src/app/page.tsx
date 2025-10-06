import Header from "@/components/Header"
import Footer from "@/components/Footer"
import HeroSection from "@/components/HeroSection"
import FeatureReveal from "@/components/FeatureReveal"
import ClientSideAnimations from "@/components/ClientSideAnimations"

export default function Home() {
  return (
    <main className="relative min-h-screen bg-void overflow-hidden">
      <ClientSideAnimations />
      <Header />
      
      <div className="relative z-10">
        <HeroSection />
        <FeatureReveal />
      </div>
      
      <Footer />
    </main>
  )
}