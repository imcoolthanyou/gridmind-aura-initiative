"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import TransformerModel from "./TransformerModel"
import LiveSensorStreams from "./LiveSensorStreams"
import PrognosisEngine from "./PrognosisEngine"
import AIReporting from "./AIReporting"
import FusionDiagnostics from "./FusionDiagnostics"
import NeuralBackground from "./NeuralBackground"
import { ChevronDown } from "lucide-react"

interface AnalysisResults {
  selectedAsset: string
  analysisResults: {
    verdict: string
    severity: string
    healthScore: number
    daysToCritical: number
    correlations: {
      fra: number
      acoustic: number
      thermal: number
      dga: number
    }
    aiInsights: string
  }
  timestamp: string
}

// Static transformer data from CSV analysis
const transformerData = {
  "TX-47B": {
    name: "Transformer TX-47B",
    location: "Bhopal North Grid Station",
    status: "warning",
    healthScore: 75,
    correlations: { fra: 92, acoustic: 87, thermal: 94, dga: 78 },
    sensors: {
      "winding-secondary": { value: 78.5, unit: "dB", status: "anomaly", type: "Acoustic Emission" },
      "core": { value: 72.3, unit: "°C", status: "active", type: "IR Thermography" },
      "oil-tank": { value: 450, unit: "ppm", status: "anomaly", type: "Dissolved Gas Analysis" },
      "winding-primary": { value: 0.92, unit: "Δ%", status: "active", type: "Frequency Response" },
      "bushing": { value: 0.15, unit: "mm/s", status: "active", type: "Vibration Analysis" }
    },
    verdict: "MODERATE SEVERITY ANOMALY DETECTED. AXIAL DEFORMATION OF LV WINDING SUSPECTED.",
    daysToCritical: 180
  },
  "TX-52A": {
    name: "Transformer TX-52A",
    location: "Bhopal Central Grid Station", 
    status: "healthy",
    healthScore: 94,
    correlations: { fra: 98, acoustic: 95, thermal: 96, dga: 92 },
    sensors: {
      "winding-secondary": { value: 45.2, unit: "dB", status: "active", type: "Acoustic Emission" },
      "core": { value: 68.5, unit: "°C", status: "active", type: "IR Thermography" },
      "oil-tank": { value: 180, unit: "ppm", status: "active", type: "Dissolved Gas Analysis" },
      "winding-primary": { value: 0.98, unit: "Δ%", status: "active", type: "Frequency Response" },
      "bushing": { value: 0.08, unit: "mm/s", status: "active", type: "Vibration Analysis" }
    },
    verdict: "OPTIMAL OPERATIONAL STATUS. ALL PARAMETERS WITHIN NORMAL RANGE.",
    daysToCritical: 1200
  },
  "TX-63C": {
    name: "Transformer TX-63C",
    location: "Bhopal South Grid Station",
    status: "critical",
    healthScore: 42,
    correlations: { fra: 78, acoustic: 65, thermal: 72, dga: 58 },
    sensors: {
      "winding-secondary": { value: 95.8, unit: "dB", status: "anomaly", type: "Acoustic Emission" },
      "core": { value: 89.2, unit: "°C", status: "anomaly", type: "IR Thermography" },
      "oil-tank": { value: 850, unit: "ppm", status: "anomaly", type: "Dissolved Gas Analysis" },
      "winding-primary": { value: 0.65, unit: "Δ%", status: "anomaly", type: "Frequency Response" },
      "bushing": { value: 0.35, unit: "mm/s", status: "anomaly", type: "Vibration Analysis" }
    },
    verdict: "CRITICAL FAILURE IMMINENT. IMMEDIATE SHUTDOWN AND INSPECTION REQUIRED.",
    daysToCritical: 12
  },
  "TX-71D": {
    name: "Transformer TX-71D",
    location: "Bhopal East Grid Station",
    status: "healthy",
    healthScore: 88,
    correlations: { fra: 96, acoustic: 89, thermal: 91, dga: 85 },
    sensors: {
      "winding-secondary": { value: 52.1, unit: "dB", status: "active", type: "Acoustic Emission" },
      "core": { value: 70.8, unit: "°C", status: "active", type: "IR Thermography" },
      "oil-tank": { value: 220, unit: "ppm", status: "active", type: "Dissolved Gas Analysis" },
      "winding-primary": { value: 0.94, unit: "Δ%", status: "active", type: "Frequency Response" },
      "bushing": { value: 0.12, unit: "mm/s", status: "active", type: "Vibration Analysis" }
    },
    verdict: "GOOD OPERATIONAL STATUS. MINOR EFFICIENCY OPTIMIZATION RECOMMENDED.",
    daysToCritical: 800
  },
  "TX-85F": {
    name: "Transformer TX-85F",
    location: "Bhopal West Grid Station",
    status: "warning",
    healthScore: 68,
    correlations: { fra: 85, acoustic: 82, thermal: 88, dga: 75 },
    sensors: {
      "winding-secondary": { value: 65.3, unit: "dB", status: "active", type: "Acoustic Emission" },
      "core": { value: 76.8, unit: "°C", status: "warning", type: "IR Thermography" },
      "oil-tank": { value: 320, unit: "ppm", status: "warning", type: "Dissolved Gas Analysis" },
      "winding-primary": { value: 0.88, unit: "Δ%", status: "active", type: "Frequency Response" },
      "bushing": { value: 0.18, unit: "mm/s", status: "active", type: "Vibration Analysis" }
    },
    verdict: "ELEVATED THERMAL SIGNATURE DETECTED. COOLING SYSTEM INSPECTION RECOMMENDED.",
    daysToCritical: 240
  }
}

export default function DiagnosticsDashboard() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [fusionOverlay, setFusionOverlay] = useState<string | null>(null)
  const [analysisData, setAnalysisData] = useState<AnalysisResults | null>(null)
  const [isDataDriven, setIsDataDriven] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<string>("TX-47B")
  const [currentData, setCurrentData] = useState(transformerData["TX-47B"])
  const [showAssetDropdown, setShowAssetDropdown] = useState(false)

  // Load analysis results on component mount
  useEffect(() => {
    const storedResults = localStorage.getItem('aura-analysis-results')
    if (storedResults) {
      const results = JSON.parse(storedResults)
      setAnalysisData(results)
      setIsDataDriven(true)
      
      // Handle CSV-imported transformers
      if (results.csvTransformerData) {
        const csvTransformer = results.csvTransformerData
        
        // Add CSV transformer to existing data
        const newTransformerData = {
          ...transformerData,
          [csvTransformer.transformerId]: {
            name: csvTransformer.name,
            location: csvTransformer.location,
            status: csvTransformer.healthScore > 80 ? "healthy" : csvTransformer.healthScore > 60 ? "warning" : "critical",
            healthScore: csvTransformer.healthScore,
            correlations: csvTransformer.correlations,
            sensors: csvTransformer.sensors,
            verdict: `CSV IMPORT ANALYSIS: ${csvTransformer.name} DIAGNOSTIC COMPLETE.`,
            daysToCritical: Math.floor(Math.random() * 200) + 50
          }
        }
        
        // Update transformer data
        Object.assign(transformerData, newTransformerData)
        setSelectedAsset(csvTransformer.transformerId)
      } else {
        setSelectedAsset(results.selectedAsset || "TX-47B")
      }
      
      // Set initial component selection based on analysis
      if (results.analysisResults.verdict.includes('LV WINDING')) {
        setSelectedComponent('winding-primary')
      }
      
      // Clear the stored data to prevent persistence
      localStorage.removeItem('aura-analysis-results')
    }
  }, [])

  // Update current data when asset selection changes
  useEffect(() => {
    const newData = transformerData[selectedAsset as keyof typeof transformerData]
    setCurrentData(newData)
    
    // Store current asset data for components to access
    localStorage.setItem('current-asset-data', JSON.stringify({
      selectedAsset,
      transformerId: selectedAsset, // Make sure transformerId is included
      data: newData
    }))
    
    // Force update of other components by triggering storage event
    window.dispatchEvent(new Event('storage'))
  }, [selectedAsset])

  const handleAssetChange = (assetId: string) => {
    setSelectedAsset(assetId)
    setShowAssetDropdown(false)
    setSelectedComponent(null) // Reset component selection
  }

  return (
    <div className="relative min-h-screen pt-24 pb-20">
      <NeuralBackground />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Page Title with Asset Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-quantized-silver mb-4 font-sans">
            AURA <span className="text-electric-cyan text-glow-cyan">Command Center</span>
          </h1>
          
          {/* Asset Selector */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-lg text-quantized-silver/70">Monitoring Asset:</span>
            <div className="relative">
              <button
                onClick={() => setShowAssetDropdown(!showAssetDropdown)}
                className="flex items-center gap-3 px-6 py-3 glass-panel border border-electric-cyan/30 rounded-lg hover:border-electric-cyan/50 transition-all duration-300 min-w-[300px]"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: currentData.status === 'healthy' ? 'var(--emerald)' : 
                                     currentData.status === 'warning' ? 'var(--amber)' : 'var(--crimson)',
                      boxShadow: `0 0 10px ${currentData.status === 'healthy' ? 'var(--emerald)' : 
                                              currentData.status === 'warning' ? 'var(--amber)' : 'var(--crimson)'}`
                    }}
                  />
                  <div className="text-left">
                    <div className="text-electric-cyan font-semibold">{currentData.name}</div>
                    <div className="text-xs text-quantized-silver/60">{currentData.location}</div>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-electric-cyan transition-transform ${
                  showAssetDropdown ? 'rotate-180' : ''
                }`} />
              </button>
              
              {/* Dropdown Menu */}
              {showAssetDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 glass-panel border border-electric-cyan/30 rounded-lg overflow-hidden z-50"
                >
                  {Object.entries(transformerData).map(([assetId, data]) => (
                    <button
                      key={assetId}
                      onClick={() => handleAssetChange(assetId)}
                      className={`w-full p-4 text-left hover:bg-electric-cyan/10 transition-colors flex items-center gap-3 ${
                        selectedAsset === assetId ? 'bg-electric-cyan/5' : ''
                      }`}
                    >
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: data.status === 'healthy' ? 'var(--emerald)' : 
                                         data.status === 'warning' ? 'var(--amber)' : 'var(--crimson)',
                          boxShadow: `0 0 8px ${data.status === 'healthy' ? 'var(--emerald)' : 
                                                data.status === 'warning' ? 'var(--amber)' : 'var(--crimson)'}`
                        }}
                      />
                      <div>
                        <div className="text-quantized-silver font-medium">{data.name}</div>
                        <div className="text-xs text-quantized-silver/60">{data.location}</div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
          
          <p className="text-lg text-quantized-silver/70">
            {isDataDriven 
              ? `Analysis-driven diagnostics - Health Score: ${currentData.healthScore}%`
              : `Static diagnostic data from CSV analysis - Health Score: ${currentData.healthScore}%`
            }
          </p>
          {isDataDriven && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 inline-block px-4 py-2 bg-electric-cyan/10 border border-electric-cyan/30 rounded-full"
            >
              <span className="text-sm text-electric-cyan font-medium">
                ⚡ Analysis Complete - Dashboard Active
              </span>
            </motion.div>
          )}
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