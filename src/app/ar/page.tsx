import ARExperience from "@/components/ARExperience"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import CustomCursor from "@/components/CustomCursor"

export default function ARPage() {
  return (
    <main className="relative min-h-screen bg-void">
      <CustomCursor />
      <Header />
      <ARExperience />
      <Footer />
    </main>
  )
}