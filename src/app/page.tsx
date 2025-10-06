import Header from "@/components/Header"
import Footer from "@/components/Footer"
import CustomCursor from "@/components/CustomCursor"
import EnhancedParticleField from "@/components/EnhancedParticleField"
import GeometricBackground from "@/components/GeometricBackground"
import FloatingElements from "@/components/FloatingElements"
import RippleEffect from "@/components/RippleEffect"
import EnergyWaves from "@/components/EnergyWaves"
import HolographicOverlay from "@/components/HolographicOverlay"
import HeroSection from "@/components/HeroSection"
import FeatureReveal from "@/components/FeatureReveal"

export default function Home() {
  return (
    <main className="relative min-h-screen bg-void overflow-hidden">
      <CustomCursor />
      <GeometricBackground />
      <EnergyWaves />
      <EnhancedParticleField />
      <FloatingElements />
      <RippleEffect />
      <HolographicOverlay />
      <Header />
      
      <div className="relative z-10">
        <HeroSection />
        <FeatureReveal />
      </div>
      
      <Footer />
    </main>
  )
}