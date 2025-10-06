"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Calendar, TrendingDown } from "lucide-react"

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

export default function PrognosisEngine() {
  const [selectedRange, setSelectedRange] = useState("6M")
  const [data, setData] = useState(generateData(6))

  const handleRangeChange = (range: string) => {
    setSelectedRange(range)
    const months = parseInt(range)
    setData(generateData(months))
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

      {/* Time range selector */}
      <div className="flex gap-2 mb-6">
        {timeRanges.map((range) => (
          <button
            key={range}
            onClick={() => handleRangeChange(range)}
            className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              selectedRange === range
                ? "bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/40"
                : "bg-quantized-silver/5 text-quantized-silver/60 hover:bg-quantized-silver/10"
            }`}
          >
            {range}
          </button>
        ))}
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
                      ? "var(--magenta)"
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
          <div className="w-3 h-3 rounded bg-magenta/60 border border-white/30" />
          <span>Predicted</span>
        </div>
      </div>
    </div>
  )
}