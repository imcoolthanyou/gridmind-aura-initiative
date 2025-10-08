"use client"

import { motion } from "framer-motion"
import TrainingSimulator from "@/components/TrainingSimulator"
import NeuralBackground from "@/components/NeuralBackground"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import CustomCursor from "@/components/CustomCursor"

export default function TrainingPage() {
  return (
    <div className="relative min-h-screen">
      <CustomCursor />
      <Header />
      <div className="pt-16 overflow-hidden">
        {/* Animated Digital Schematics Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-void via-void/95 to-electric-cyan/5">
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" className="absolute inset-0">
              <defs>
                <pattern id="schematic-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                </pattern>
                <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <circle cx="50" cy="50" r="2" fill="currentColor" opacity="0.3"/>
                  <path d="M 20 50 L 80 50 M 50 20 L 50 80" stroke="currentColor" strokeWidth="0.5" opacity="0.2"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#schematic-grid)" className="text-electric-cyan/30"/>
              <rect width="100%" height="100%" fill="url(#circuit-pattern)" className="text-quantized-silver/20"/>
            </svg>
            
            {/* Animated circuit nodes */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-2 h-2 bg-electric-cyan rounded-full"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute top-3/4 right-1/3 w-1.5 h-1.5 bg-amber rounded-full"
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.3, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
            <motion.div
              className="absolute top-1/2 right-1/4 w-1 h-1 bg-crimson rounded-full"
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [1, 2, 1]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
          </div>
        </div>
        
        <div className="relative z-10 h-screen">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute top-4 left-6 z-20"
          >
            <h1 className="text-3xl font-bold text-quantized-silver mb-2 font-sans">
              OPERATOR <span className="text-electric-cyan text-glow-cyan">TRAINING & CERTIFICATION</span>
            </h1>
            <p className="text-sm text-quantized-silver/70">
              Interactive Simulator • Mission-Based Learning • Competitive Leaderboards
            </p>
          </motion.div>

          {/* Main Training Interface */}
          <TrainingSimulator />
        </div>
      </div>
      <Footer />
    </div>
  )
}