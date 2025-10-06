import TechnologyVision from "@/components/TechnologyVision"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import CustomCursor from "@/components/CustomCursor"

export default function TechnologyPage() {
  return (
    <main className="relative min-h-screen bg-void">
      <CustomCursor />
      <Header />
      <TechnologyVision />
      <Footer />
    </main>
  )
}