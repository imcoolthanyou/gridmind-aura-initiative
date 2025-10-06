"use client"

import { motion } from "framer-motion"
import { Radio, Thermometer, Waves, Droplets } from "lucide-react"

interface FusionDiagnosticsProps {
  onOverlayChange: (overlay: string | null) => void
  activeOverlay: string | null
}

const dataStreams = [
  {
    id: "fra",
    name: "FRA Analysis",
    icon: Radio,
    correlation: 92,
    color: "var(--electric-cyan)",
    description: "Frequency Response",
  },
  {
    id: "acoustic",
    name: "Acoustic Pattern",
    icon: Waves,
    correlation: 87,
    color: "var(--magenta)",
    description: "Partial Discharge",
  },
  {
    id: "thermal",
    name: "Thermal Map",
    icon: Thermometer,
    correlation: 94,
    color: "var(--solar-orange)",
    description: "Hot Spot Detection",
  },
  {
    id: "dga",
    name: "DGA Profile",
    icon: Droplets,
    correlation: 78,
    color: "var(--amber)",
    description: "Oil Chemistry",
  },
]

export default function FusionDiagnostics({
  onOverlayChange,
  activeOverlay,
}: FusionDiagnosticsProps) {
  return (
    <div className="glass-panel p-6 h-[400px] flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-quantized-silver font-sans mb-1">
          Fusion Diagnostics
        </h2>
        <p className="text-sm text-quantized-silver/60">Multi-modal correlation</p>
      </div>

      {/* Correlation radar chart visualization */}
      <div className="flex-1 flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          {/* Radar background */}
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 border border-electric-cyan/10 rounded-full"
              style={{
                transform: `scale(${1 - i * 0.25})`,
              }}
            />
          ))}

          {/* Data points */}
          {dataStreams.map((stream, index) => {
            const angle = (index * 360) / dataStreams.length - 90
            const radians = (angle * Math.PI) / 180
            const radius = (stream.correlation / 100) * 96 // 48px radius max
            const x = Math.cos(radians) * radius
            const y = Math.sin(radians) * radius

            return (
              <div key={stream.id}>
                {/* Axis line */}
                <div
                  className="absolute top-1/2 left-1/2 h-[1px] origin-left"
                  style={{
                    width: "96px",
                    backgroundColor: `${stream.color}40`,
                    transform: `rotate(${angle}deg)`,
                  }}
                />

                {/* Data point */}
                <motion.div
                  className="absolute top-1/2 left-1/2"
                  style={{
                    transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                  }}
                  whileHover={{ scale: 1.3 }}
                >
                  <div
                    className="w-3 h-3 rounded-full cursor-pointer"
                    style={{
                      backgroundColor: stream.color,
                      boxShadow: `0 0 12px ${stream.color}`,
                    }}
                  />
                </motion.div>
              </div>
            )
          })}

          {/* Center indicator */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 rounded-full bg-electric-cyan/30 border-2 border-electric-cyan animate-pulse" />
          </div>
        </div>
      </div>

      {/* Data stream cards */}
      <div className="space-y-2">
        {dataStreams.map((stream, index) => {
          const Icon = stream.icon
          const isActive = activeOverlay === stream.id

          return (
            <motion.button
              key={stream.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onOverlayChange(isActive ? null : stream.id)}
              className={`w-full glass-panel-bright p-3 rounded-lg transition-all duration-300 ${
                isActive ? "border-2" : "border"
              }`}
              style={{
                borderColor: isActive ? stream.color : "rgba(0, 255, 255, 0.1)",
                backgroundColor: isActive
                  ? `${stream.color}10`
                  : "rgba(30, 41, 59, 0.5)",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${stream.color}20` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: stream.color }} />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-quantized-silver">
                      {stream.name}
                    </div>
                    <div className="text-xs text-quantized-silver/50">
                      {stream.description}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className="text-lg font-bold font-mono"
                    style={{ color: stream.color }}
                  >
                    {stream.correlation}%
                  </div>
                  <div className="text-[10px] text-quantized-silver/40">
                    Correlation
                  </div>
                </div>
              </div>

              {/* Correlation bar */}
              <div className="mt-2 h-1 bg-quantized-silver/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: stream.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${stream.correlation}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Active overlay indicator */}
      {activeOverlay && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-2 rounded-lg bg-electric-cyan/5 border border-electric-cyan/20 text-center"
        >
          <p className="text-xs text-electric-cyan">
            {dataStreams.find((s) => s.id === activeOverlay)?.name} overlay active
          </p>
        </motion.div>
      )}
    </div>
  )
}