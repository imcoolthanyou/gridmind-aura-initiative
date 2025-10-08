"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Brain, Radar, TrendingDown, FileText, ArrowRight } from "lucide-react"
import NeuralBackground from "./NeuralBackground"

interface DiagnosticData {
  asset: {
    id: string
    name: string
    location: string
    status: string
  }
  file: string
  testId: string
  engineerName: string
  timestamp: string
  csvData?: {
    transformerId: string
    name: string
    location: string
    healthScore: number
    sensors: any
    correlations: any
  }
}

interface AnalysisResults {
  verdict: string
  severity: "low" | "moderate" | "high"
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

const analysisSteps = [
  {
    title: "INGESTING & PARSING DATA",
    description: "Processing FRA waveform signatures",
    icon: FileText,
    duration: 1200
  },
  {
    title: "CORRELATING SIGNATURES", 
    description: "Comparing against historical database",
    icon: Radar,
    duration: 1500
  },
  {
    title: "NEURAL NETWORK INFERENCE",
    description: "AI pattern recognition analysis",
    icon: Brain,
    duration: 1800
  },
  {
    title: "FINALIZING VERDICT",
    description: "Generating comprehensive report",
    icon: TrendingDown,
    duration: 1000
  }
]

// Demo results for TX-47B
const demoResults: AnalysisResults = {
  verdict: "MODERATE SEVERITY ANOMALY DETECTED. AXIAL DEFORMATION OF LV WINDING SUSPECTED.",
  severity: "moderate",
  healthScore: 75,
  daysToCritical: 180,
  correlations: {
    fra: 92,
    acoustic: 87,
    thermal: 94,
    dga: 78
  },
  aiInsights: `COMPREHENSIVE ANALYSIS SUMMARY:

FRA signature analysis reveals characteristic patterns consistent with mechanical deformation in the low-voltage winding structure. The frequency response shows deviation from baseline measurements, particularly in the 1-10 kHz range, indicating potential axial displacement.

KEY FINDINGS:
• Impedance variations suggest winding compression
• Resonance frequency shifts detected at 3.2 kHz and 7.8 kHz  
• Correlation with thermal imaging confirms localized heating
• DGA analysis supports mechanical stress indicators

RISK ASSESSMENT:
Current health trajectory projects gradual degradation over 180 days. Immediate intervention recommended to prevent catastrophic failure and extend asset life by 24+ months.

RECOMMENDED ACTIONS:
1. Schedule detailed visual inspection during next maintenance window
2. Implement enhanced monitoring protocol
3. Consider load reduction during peak demand periods
4. Plan preemptive winding assessment within 30 days`
}

export default function AURAAnalysis() {
  const router = useRouter()
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticData | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    // Load diagnostic data from previous page
    const storedData = localStorage.getItem('aura-diagnostic-data')
    if (storedData) {
      const data = JSON.parse(storedData)
      setDiagnosticData(data)
      
      // If CSV data exists, update demo results
      if (data.csvData) {
        demoResults.healthScore = data.csvData.healthScore
        demoResults.correlations = data.csvData.correlations
        demoResults.verdict = `CSV ANALYSIS COMPLETE. TRANSFORMER ${data.csvData.transformerId} ASSESSED.`
        demoResults.daysToCritical = Math.floor(Math.random() * 200) + 50
      }
    }

    // Start analysis animation
    let totalDuration = 0
    analysisSteps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(index)
      }, totalDuration)
      totalDuration += step.duration
    })

    // Complete analysis and show results
    setTimeout(() => {
      setIsAnalysisComplete(true)
      setTimeout(() => {
        setShowResults(true)
      }, 500)
    }, totalDuration)
  }, [])

  const handleProceedToDashboard = () => {
    // Store analysis results for diagnostics page
    const analysisState = {
      selectedAsset: diagnosticData?.csvData?.transformerId || diagnosticData?.asset.id || "TX-47B",
      analysisResults: demoResults,
      timestamp: new Date().toISOString(),
      csvTransformerData: diagnosticData?.csvData // Pass CSV data if available
    }
    
    localStorage.setItem('aura-analysis-results', JSON.stringify(analysisState))
    
    // Navigate to diagnostics with state
    router.push('/diagnostics')
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "var(--emerald)"
      case "moderate": return "var(--amber)"
      case "high": return "var(--crimson)"
      default: return "var(--quantized-silver)"
    }
  }

  return (
    <div className="relative min-h-screen pt-24 pb-20">
      <NeuralBackground />
      
      <div className="container mx-auto px-6 relative z-10">
        <AnimatePresence mode="wait">
          {!showResults ? (
            /* Phase 1: Analysis Animation */
            <motion.div
              key="analysis"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[70vh]"
            >
              {/* Main Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
              >
                <h1 className="text-6xl font-bold text-quantized-silver mb-4 font-sans">
                  AURA <span className="text-electric-cyan text-glow-cyan">Analysis Engine</span>
                </h1>
                <p className="text-xl text-quantized-silver/70">
                  Advanced neural inference in progress...
                </p>
              </motion.div>

              {/* Analysis Steps */}
              <div className="w-full max-w-2xl space-y-8">
                {analysisSteps.map((step, index) => {
                  const Icon = step.icon
                  const isActive = currentStep === index
                  const isCompleted = currentStep > index
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ 
                        opacity: isActive || isCompleted ? 1 : 0.3,
                        x: 0,
                        scale: isActive ? 1.02 : 1
                      }}
                      transition={{ delay: index * 0.1 }}
                      className={`glass-panel p-6 transition-all duration-500 ${
                        isActive ? 'border-electric-cyan/50 bg-electric-cyan/5' : 
                        isCompleted ? 'border-emerald/30 bg-emerald/5' : 'border-quantized-silver/20'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${
                          isActive ? 'bg-electric-cyan/20 border border-electric-cyan' :
                          isCompleted ? 'bg-emerald/20 border border-emerald' : 'bg-quantized-silver/10 border border-quantized-silver/30'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            isActive ? 'text-electric-cyan' :
                            isCompleted ? 'text-emerald' : 'text-quantized-silver/50'
                          }`} />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className={`text-lg font-semibold ${
                            isActive ? 'text-electric-cyan' :
                            isCompleted ? 'text-emerald' : 'text-quantized-silver/70'
                          }`}>
                            {step.title}
                          </h3>
                          <p className="text-sm text-quantized-silver/60">
                            {step.description}
                          </p>
                        </div>

                        {/* Progress indicator */}
                        {isActive && (
                          <motion.div
                            className="w-8 h-8 border-2 border-electric-cyan border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                        )}
                        
                        {isCompleted && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-8 h-8 bg-emerald rounded-full flex items-center justify-center"
                          >
                            <motion.div
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.5 }}
                            >
                              ✓
                            </motion.div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Completion Message */}
              {isAnalysisComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 text-center"
                >
                  <div className="glass-panel p-6 border-emerald/30 bg-emerald/5">
                    <h3 className="text-xl font-semibold text-emerald mb-2">
                      Analysis Complete
                    </h3>
                    <p className="text-quantized-silver/70">
                      Preparing comprehensive diagnostic report...
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            /* Phase 2: Results Display */
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Page Title */}
              <div className="text-center mb-12">
                <h1 className="text-5xl font-bold text-quantized-silver mb-4 font-sans">
                  AURA <span className="text-electric-cyan text-glow-cyan">Diagnostic Verdict</span>
                </h1>
                <p className="text-lg text-quantized-silver/70">
                  Comprehensive analysis results for {diagnosticData?.asset.name}
                </p>
              </div>

              {/* Verdict Banner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-panel p-6 border-l-4"
                style={{ 
                  borderLeftColor: getSeverityColor(demoResults.severity),
                  backgroundColor: `${getSeverityColor(demoResults.severity)}10`
                }}
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="w-4 h-4 rounded-full mt-1 animate-pulse"
                    style={{ 
                      backgroundColor: getSeverityColor(demoResults.severity),
                      boxShadow: `0 0 20px ${getSeverityColor(demoResults.severity)}`
                    }}
                  />
                  <div>
                    <h2 className="text-xl font-bold text-quantized-silver mb-2">
                      DIAGNOSTIC VERDICT
                    </h2>
                    <p className="text-lg" style={{ color: getSeverityColor(demoResults.severity) }}>
                      {demoResults.verdict}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Results Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Fusion Diagnostics Snapshot */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-panel p-6"
                >
                  <h3 className="text-lg font-semibold text-quantized-silver mb-4">
                    Fusion Diagnostics Snapshot
                  </h3>
                  
                  {/* Mini Radar Chart */}
                  <div className="relative w-40 h-40 mx-auto mb-4">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute inset-0 border border-electric-cyan/10 rounded-full"
                        style={{ transform: `scale(${1 - i * 0.25})` }}
                      />
                    ))}
                    
                    {/* Data Points */}
                    {Object.entries(demoResults.correlations).map(([key, value], index) => {
                      const angle = (index * 360) / 4 - 90
                      const radians = (angle * Math.PI) / 180
                      const radius = (value / 100) * 80
                      const x = Math.cos(radians) * radius
                      const y = Math.sin(radians) * radius
                      
                      return (
                        <div
                          key={key}
                          className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-electric-cyan"
                          style={{
                            transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                            boxShadow: '0 0 8px var(--electric-cyan)'
                          }}
                        />
                      )
                    })}
                  </div>
                  
                  {/* Correlation Values */}
                  <div className="space-y-2">
                    {Object.entries(demoResults.correlations).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-quantized-silver/70 capitalize">{key}:</span>
                        <span className="text-electric-cyan font-mono">{value}%</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Prognosis Engine Initial Verdict */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="glass-panel p-6"
                >
                  <h3 className="text-lg font-semibold text-quantized-silver mb-4">
                    Prognosis Engine Verdict
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-electric-cyan mb-1">
                        {demoResults.healthScore}%
                      </div>
                      <p className="text-sm text-quantized-silver/70">Current Health Score</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber mb-1">
                        {demoResults.daysToCritical} Days
                      </div>
                      <p className="text-sm text-quantized-silver/70">To Critical Threshold</p>
                    </div>
                    
                    <div className="glass-panel-bright p-3 rounded">
                      <p className="text-xs text-quantized-silver/80">
                        Predictive model indicates gradual degradation pattern. 
                        Proactive maintenance recommended within 30 days.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* AI-Generated Insights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="glass-panel p-6"
                >
                  <h3 className="text-lg font-semibold text-quantized-silver mb-4">
                    AI-Generated Insights
                  </h3>
                  
                  <div className="glass-panel-bright p-4 rounded h-48 overflow-y-auto">
                    <pre className="text-xs text-quantized-silver/80 whitespace-pre-wrap leading-relaxed">
                      {demoResults.aiInsights}
                    </pre>
                  </div>
                </motion.div>
              </div>

              {/* Primary Action Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="text-center pt-8"
              >
                <motion.button
                  onClick={handleProceedToDashboard}
                  className="px-12 py-4 bg-electric-cyan text-black font-bold text-xl rounded-lg hover:bg-electric-cyan/90 transition-all duration-300 relative overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <div className="relative flex items-center gap-3">
                    PROCEED TO LIVE COMMAND CENTER
                    <ArrowRight className="w-6 h-6" />
                  </div>
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}