import DiagnosticsDashboard from "@/components/DiagnosticsDashboard"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import CustomCursor from "@/components/CustomCursor"

export default function DiagnosticsPage() {
  return (
    <main className="relative min-h-screen bg-void">
      <CustomCursor />
      <Header />
      <DiagnosticsDashboard />
      <Footer />
    </main>
  )
}