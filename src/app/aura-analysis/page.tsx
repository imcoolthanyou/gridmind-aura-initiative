import AURAAnalysis from "@/components/AURAAnalysis"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import CustomCursor from "@/components/CustomCursor"

export default function AURAAnalysisPage() {
  return (
    <main className="relative min-h-screen bg-void">
      <CustomCursor />
      <Header />
      <AURAAnalysis />
      <Footer />
    </main>
  )
}