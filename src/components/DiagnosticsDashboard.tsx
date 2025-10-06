"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import TransformerModel from "./TransformerModel"
import LiveSensorStreams from "./LiveSensorStreams"
import PrognosisEngine from "./PrognosisEngine"
import AIReporting from "./AIReporting"
import FusionDiagnostics from "./FusionDiagnostics"
import NeuralBackground from "./NeuralBackground"

export default function DiagnosticsDashboard() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [fusionOverlay, setFusionOverlay] = useState<string | null>(null)

  return (
    <div className="relative min-h-screen pt-24 pb-20">
      <NeuralBackground />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-quantized-silver mb-4 font-sans">
            AURA <span className="text-electric-cyan text-glow-cyan">Command Center</span>
          </h1>
          <p className="text-lg text-quantized-silver/70">
            Real-time Digital Twin diagnostics and predictive analytics
          </p>
        </motion.div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Fusion Diagnostics - Top Left */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <FusionDiagnostics 
              onOverlayChange={setFusionOverlay}
              activeOverlay={fusionOverlay}
            />
          </motion.div>

          {/* Central Transformer Model - Top Center/Right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-2 lg:row-span-2"
          >
            <TransformerModel 
              selectedComponent={selectedComponent}
              onComponentSelect={setSelectedComponent}
              fusionOverlay={fusionOverlay}
            />
          </motion.div>

          {/* Prognosis Engine - Middle Left */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="lg:col-span-1"
          >
            <PrognosisEngine />
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Sensor Streams - Bottom Left/Center */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="lg:col-span-2"
          >
            <LiveSensorStreams onSensorClick={setSelectedComponent} />
          </motion.div>

          {/* AI Reporting - Bottom Right */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="lg:col-span-1"
          >
            <AIReporting />
          </motion.div>
        </div>
      </div>
    </div>
  )
}