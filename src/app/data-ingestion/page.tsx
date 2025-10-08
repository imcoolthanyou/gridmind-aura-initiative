import DataIngestionPortal from "@/components/DataIngestionPortal"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import CustomCursor from "@/components/CustomCursor"

export default function DataIngestionPage() {
  return (
    <main className="relative min-h-screen bg-void">
      <CustomCursor />
      <Header />
      <DataIngestionPortal />
      <Footer />
    </main>
  )
}