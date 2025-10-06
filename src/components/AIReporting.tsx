"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { FileText, Sparkles, Download, Mail } from "lucide-react"

const reportTypes = [
  { value: "field-engineer", label: "Field Engineer Report" },
  { value: "asset-manager", label: "Asset Manager Summary" },
  { value: "executive", label: "Executive Brief" },
  { value: "maintenance", label: "Maintenance Schedule" },
]

export default function AIReporting() {
  const [selectedType, setSelectedType] = useState(reportTypes[0].value)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedReport, setGeneratedReport] = useState<string | null>(null)

  const handleGenerate = () => {
    setIsGenerating(true)
    setGeneratedReport(null)

    // Simulate AI generation
    setTimeout(() => {
      const reports = {
        "field-engineer": `FIELD DIAGNOSTIC REPORT - TX-47B

EXECUTIVE SUMMARY:
Critical anomaly detected in Secondary Winding (Unit-002). Immediate inspection required.

SENSOR ANALYSIS:
• Acoustic Emission: 78.5 dB (↑45% from baseline)
• Thermal Signature: 89°C (Warning threshold)
• DGA Levels: 450 ppm H₂ (Critical)
• Vibration: 0.7 mm/s (Elevated)

RECOMMENDED ACTIONS:
1. Schedule emergency shutdown within 48 hours
2. Perform visual inspection of windings
3. Conduct oil sampling for comprehensive DGA
4. Verify cooling system functionality

RISK ASSESSMENT: HIGH
Estimated failure window: 14-21 days without intervention.`,

        "asset-manager": `ASSET HEALTH SUMMARY - TX-47B

OVERALL HEALTH SCORE: 68/100 (↓12 pts)

KEY METRICS:
• Operational Hours: 127,450
• Last Maintenance: 184 days ago
• Predicted Life Extension: 2.3 years (with intervention)

FINANCIAL IMPACT:
• Replacement Cost: $1.2M
• Downtime Cost: $450K/day
• Preventive Maintenance: $85K

ROI ANALYSIS:
Immediate intervention projected to save $1.6M over 24 months.

PRIORITY: URGENT - Schedule maintenance window`,

        executive: `EXECUTIVE BRIEF - Grid Sector 7

ASSET: Transformer TX-47B
STATUS: ⚠️ REQUIRES ATTENTION

BUSINESS IMPACT:
Critical transformer serving 45,000 customers showing degradation patterns. Proactive maintenance will prevent $2M+ in losses.

RECOMMENDATION:
Approve $85K emergency maintenance budget to prevent catastrophic failure.

TIMELINE: 48-72 hours for intervention
CONFIDENCE: 99.2% prediction accuracy`,

        maintenance: `MAINTENANCE SCHEDULE - TX-47B

IMMEDIATE (0-48 hrs):
□ Thermal imaging scan
□ Acoustic emission test
□ Oil sampling (DGA)
□ Load reduction to 70%

SHORT-TERM (Week 1):
□ Schedule outage window
□ Mobilize field crew
□ Order replacement parts
□ Prepare backup transformer

MAINTENANCE TASKS:
□ Winding inspection & cleaning
□ Oil filtration/replacement
□ Bushing inspection
□ Cooling system service
□ Protection relay testing

ESTIMATED DURATION: 36-48 hours
COST ESTIMATE: $85,000`,
      }

      setGeneratedReport(reports[selectedType as keyof typeof reports])
      setIsGenerating(false)
    }, 2500)
  }

  return (
    <div className="glass-panel p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-quantized-silver font-sans mb-1">
            AI Report Generator
          </h2>
          <p className="text-sm text-quantized-silver/60">Instant diagnostic reports</p>
        </div>
        <Sparkles className="w-5 h-5 text-magenta" />
      </div>

      {/* Report type selector */}
      <div className="mb-4">
        <label className="text-xs text-quantized-silver/70 mb-2 block uppercase tracking-wide">
          Report Type
        </label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full px-4 py-2 rounded-lg glass-panel-bright border border-electric-cyan/20 text-quantized-silver text-sm focus:outline-none focus:border-electric-cyan/50 transition-colors"
        >
          {reportTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Generate button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-magenta/20 to-electric-cyan/20 border border-magenta/40 text-quantized-silver font-semibold hover:border-magenta/60 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        {isGenerating ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 text-magenta" />
            </motion.div>
            <span>Generating Report...</span>
          </>
        ) : (
          <>
            <FileText className="w-5 h-5" />
            <span>Generate Report</span>
          </>
        )}
      </motion.button>

      {/* Generated report */}
      <AnimatePresence mode="wait">
        {isGenerating && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 glass-panel-bright p-4 rounded-lg overflow-hidden"
          >
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-3 bg-electric-cyan/10 rounded"
                  style={{ width: `${60 + Math.random() * 40}%` }}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {generatedReport && !isGenerating && (
          <motion.div
            key="report"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col"
          >
            <div className="flex-1 glass-panel-bright p-4 rounded-lg overflow-y-auto mb-4">
              <pre className="text-xs text-quantized-silver/90 font-mono whitespace-pre-wrap leading-relaxed">
                {generatedReport}
              </pre>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-4 py-2 rounded-lg glass-panel-bright border border-electric-cyan/30 text-electric-cyan text-sm font-medium hover:bg-electric-cyan/5 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-4 py-2 rounded-lg glass-panel-bright border border-electric-cyan/30 text-electric-cyan text-sm font-medium hover:bg-electric-cyan/5 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!generatedReport && !isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex items-center justify-center text-center p-6"
        >
          <div>
            <FileText className="w-12 h-12 text-quantized-silver/20 mx-auto mb-3" />
            <p className="text-sm text-quantized-silver/40">
              Select a report type and click Generate
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}