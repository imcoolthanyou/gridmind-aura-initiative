"use client"

import { motion } from "framer-motion"
import GridCommandDashboard from "@/components/GridCommandDashboard"
import NeuralBackground from "@/components/NeuralBackground"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import CustomCursor from "@/components/CustomCursor"

export default function GridCommandPage() {
  return (
    <div className="relative min-h-screen">
      <CustomCursor />
      <Header />
      <div className="pt-16 overflow-hidden">
        <NeuralBackground />
        
        <div className="relative z-10 h-screen">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute top-4 left-6 z-20"
          >
            <h1 className="text-3xl font-bold text-quantized-silver mb-2 font-sans">
              STRATEGIC <span className="text-electric-cyan text-glow-cyan">GRID COMMAND</span>
            </h1>
            <p className="text-sm text-quantized-silver/70">
              Regional Power Grid • Khandwa & Bhopal • Real-time Topology Analysis
            </p>
          </motion.div>

          {/* Main Grid Command Interface */}
          <GridCommandDashboard />
        </div>
      </div>
      <Footer />
    </div>
  )
}