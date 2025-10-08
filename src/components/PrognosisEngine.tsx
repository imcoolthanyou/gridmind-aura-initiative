"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Calendar, TrendingDown, GitBranch } from "lucide-react"

const timeRanges = ["3M", "6M", "12M", "24M"]

interface DataPoint {
  date: string
  health: number
  predicted: boolean
}

const generateData = (months: number): DataPoint[] => {
  const data: DataPoint[] = []
  const now = new Date()

  // Past data (slightly declining)
  for (let i = -6; i <= 0; i++) {
    const date = new Date(now)
    date.setMonth(date.getMonth() + i)
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      health: 95 - Math.random() * 5 - i * 2,
      predicted: false,
    })
  }

  // Future predictions (declining)
  for (let i = 1; i <= months; i++) {
    const date = new Date(now)
    date.setMonth(date.getMonth() + i)
    const decline = i * 3 + Math.random() * 5
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      health: Math.max(30, 90 - decline),
      predicted: true,
    })
  }

  return data
}

const generateOptimizedData = (months: number): DataPoint[] => {
  const data: DataPoint[] = []
  const now = new Date()

  // Past data (same as original)
  for (let i = -6; i <= 0; i++) {
    const date = new Date(now)
    date.setMonth(date.getMonth() + i)
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      health: 95 - Math.random() * 5 - i * 2,
      predicted: false,
    })
  }

  // Future predictions (optimized - healthier trajectory)
  for (let i = 1; i <= months; i++) {
    const date = new Date(now)
    date.setMonth(date.getMonth() + i)
    // Much slower decline with maintenance
    const decline = i * 0.8 + Math.random() * 2
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      health: Math.max(75, 92 - decline), // Maintains higher health levels
      predicted: true,
    })
  }

  return data
}

export default function PrognosisEngine() {
  const [selectedRange, setSelectedRange] = useState("6M")
  const [data, setData] = useState(generateData(6))
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [targetSystem, setTargetSystem] = useState("")
  const [proactiveMandateType, setProactiveMandateType] = useState("")
  const [isSimulationRunning, setIsSimulationRunning] = useState(false)
  const [hasSimulationRun, setHasSimulationRun] = useState(false)

  const handleRangeChange = (range: string) => {
    setSelectedRange(range)
    const months = parseInt(range)
    if (hasSimulationRun) {
      setData(generateOptimizedData(months))
    } else {
      setData(generateData(months))
    }
  }

  const handleRunSimulation = () => {
    if (!targetSystem || !proactiveMandateType) return
    
    setIsSimulationRunning(true)
    
    // Simulate processing time
    setTimeout(() => {
      const months = parseInt(selectedRange)
      setData(generateOptimizedData(months))
      setHasSimulationRun(true)
      setIsSimulationRunning(false)
      setIsModalOpen(false)
    }, 2000)
  }

  const criticalDate = data.find((d) => d.predicted && d.health < 50)
  const daysToFailure = criticalDate
    ? Math.floor(
        (new Date(criticalDate.date).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null

  return (
    <div className="glass-panel p-6 h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-quantized-silver font-sans mb-1">
            Prognosis Engine
          </h2>
          <p className="text-sm text-quantized-silver/60">Predictive health timeline</p>
        </div>
        <Calendar className="w-5 h-5 text-electric-cyan" />
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6">
        {/* Time range selector */}
        <div className="flex gap-2">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => handleRangeChange(range)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedRange === range
                  ? "bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/40"
                  : "bg-quantized-silver/5 text-quantized-silver/60 hover:bg-quantized-silver/10"
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Run Simulation Button */}
        <motion.button
          onClick={() => setIsModalOpen(true)}
          className="relative px-4 py-2 bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/40 rounded-lg font-medium text-sm transition-all duration-300 hover:bg-electric-cyan/30 hover:border-electric-cyan/60 overflow-hidden group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-electric-cyan/20 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <div className="relative flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            RUN SIMULATION
          </div>
        </motion.button>
      </div>

      {/* Chart */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 flex items-end gap-1 pb-8">
          {data.map((point, index) => {
            const height = point.health
            const isPredicted = point.predicted
            const isCritical = height < 50
            const isWarning = height < 70 && height >= 50

            return (
              <div key={index} className="flex-1 flex flex-col items-center group">
                <motion.div
                  className="w-full rounded-t relative"
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  style={{
                    backgroundColor: isCritical
                      ? "var(--crimson)"
                      : isWarning
                      ? "var(--amber)"
                      : isPredicted
                      ? hasSimulationRun ? "var(--emerald)" : "var(--magenta)"
                      : "var(--electric-cyan)",
                    opacity: isPredicted ? 0.6 : 1,
                    border: isPredicted ? "1px dashed rgba(255, 255, 255, 0.3)" : "none",
                  }}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="glass-panel p-2 whitespace-nowrap text-xs">
                      <div className="font-semibold text-quantized-silver mb-1">
                        {point.date}
                      </div>
                      <div className="text-electric-cyan">
                        Health: {point.health.toFixed(1)}%
                      </div>
                      {isPredicted && (
                        <div className="text-magenta text-[10px] mt-0.5">Predicted</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>

        {/* Y-axis labels */}
        <div className="absolute left-0 bottom-8 top-0 flex flex-col justify-between text-[10px] text-quantized-silver/40 -ml-8">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>

        {/* Critical threshold line */}
        <div className="absolute left-0 right-0 bottom-[calc(8px+50%)] border-t-2 border-dashed border-amber/40" />
        <div className="absolute right-0 bottom-[calc(8px+50%)] translate-y-1/2 text-[10px] text-amber">
          Critical: 50%
        </div>
      </div>

      {/* Prediction summary */}
      {daysToFailure && daysToFailure > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 rounded-lg bg-amber/10 border border-amber/30 flex items-start gap-3"
        >
          <TrendingDown className="w-5 h-5 text-amber flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-amber mb-1">
              Failure Prediction Alert
            </div>
            <div className="text-xs text-quantized-silver/70">
              Critical health threshold expected in{" "}
              <span className="font-bold text-amber">{daysToFailure} days</span>.
              Immediate maintenance recommended.
            </div>
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="mt-4 flex gap-4 text-[10px] text-quantized-silver/60">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-electric-cyan" />
          <span>Historical</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-3 h-3 rounded border border-white/30 ${
            hasSimulationRun ? 'bg-emerald/60' : 'bg-magenta/60'
          }`} />
          <span>{hasSimulationRun ? 'Optimized' : 'Predicted'}</span>
        </div>
      </div>

      {/* AURA Scenario Engine Modal */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glassmorphism Panel */}
            <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 shadow-2xl">
              {/* Holographic Title */}
              <motion.h2
                className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-electric-cyan via-magenta to-electric-cyan bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{
                  backgroundSize: '200% 200%',
                }}
              >
                AURA SCENARIO ENGINE
              </motion.h2>

              {/* Interactive Controls */}
              <div className="space-y-6">
                {/* Target System Dropdown */}
                <div>
                  <label className="block text-sm font-semibold text-quantized-silver/80 mb-2">
                    TARGET SYSTEM
                  </label>
                  <select
                    value={targetSystem}
                    onChange={(e) => setTargetSystem(e.target.value)}
                    className="w-full p-3 rounded-lg bg-black/30 border border-electric-cyan/30 text-quantized-silver focus:border-electric-cyan focus:ring-2 focus:ring-electric-cyan/20 transition-all duration-300"
                  >
                    <option value="">Select Target System</option>
                    <option value="lv-winding">LV Winding</option>
                    <option value="core-assembly">Core Assembly</option>
                    <option value="phase-a-bushing">Phase A Bushing</option>
                    <option value="oil-tank">Oil Tank</option>
                    <option value="cooling-system">Cooling System</option>
                  </select>
                </div>

                {/* Proactive Mandate Dropdown */}
                <div>
                  <label className="block text-sm font-semibold text-quantized-silver/80 mb-2">
                    PROACTIVE MANDATE
                  </label>
                  <select
                    value={proactiveMandateType}
                    onChange={(e) => setProactiveMandateType(e.target.value)}
                    className="w-full p-3 rounded-lg bg-black/30 border border-electric-cyan/30 text-quantized-silver focus:border-electric-cyan focus:ring-2 focus:ring-electric-cyan/20 transition-all duration-300"
                  >
                    <option value="">Select Proactive Mandate</option>
                    <option value="full-replacement">Execute Full Replacement</option>
                    <option value="refurbishment">Initiate Refurbishment</option>
                    <option value="cooling-protocol">Increase Cooling Protocol</option>
                    <option value="oil-change">Execute Oil Change</option>
                    <option value="preventive-maintenance">Preventive Maintenance</option>
                  </select>
                </div>

                {/* Execute Simulation Button */}
                <motion.button
                  onClick={handleRunSimulation}
                  disabled={!targetSystem || !proactiveMandateType || isSimulationRunning}
                  className={`w-full p-4 rounded-lg font-bold text-lg transition-all duration-300 relative overflow-hidden ${
                    !targetSystem || !proactiveMandateType
                      ? 'bg-gray-600/20 text-gray-400 cursor-not-allowed'
                      : 'bg-electric-cyan text-black hover:bg-electric-cyan/90 cursor-pointer'
                  }`}
                  whileHover={targetSystem && proactiveMandateType ? { scale: 1.02 } : {}}
                  whileTap={targetSystem && proactiveMandateType ? { scale: 0.98 } : {}}
                >
                  {isSimulationRunning && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  )}
                  <div className="relative flex items-center justify-center gap-3">
                    <motion.div
                      animate={isSimulationRunning ? {
                        rotate: [0, 360],
                      } : {}}
                      transition={{
                        duration: 1,
                        repeat: isSimulationRunning ? Infinity : 0,
                        ease: "linear",
                      }}
                    >
                      <GitBranch className="w-5 h-5" />
                    </motion.div>
                    {isSimulationRunning ? 'EXECUTING SIMULATION...' : 'EXECUTE SIMULATION'}
                  </div>
                </motion.button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-quantized-silver/60 hover:text-quantized-silver transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}