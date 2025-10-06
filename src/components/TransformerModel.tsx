"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { AlertCircle, CheckCircle, Zap } from "lucide-react"

interface TransformerModelProps {
  selectedComponent: string | null
  onComponentSelect: (component: string | null) => void
  fusionOverlay: string | null
}

interface Component {
  id: string
  name: string
  status: "healthy" | "warning" | "critical"
  position: { x: number; y: number }
  temperature?: number
  vibration?: number
}

const components: Component[] = [
  {
    id: "winding-primary",
    name: "Primary Winding",
    status: "healthy",
    position: { x: 45, y: 30 },
    temperature: 65,
    vibration: 0.2,
  },
  {
    id: "winding-secondary",
    name: "Secondary Winding",
    status: "warning",
    position: { x: 55, y: 30 },
    temperature: 89,
    vibration: 0.7,
  },
  {
    id: "core",
    name: "Magnetic Core",
    status: "healthy",
    position: { x: 50, y: 45 },
    temperature: 72,
    vibration: 0.3,
  },
  {
    id: "oil-tank",
    name: "Oil Tank",
    status: "critical",
    position: { x: 50, y: 65 },
    temperature: 95,
    vibration: 0.9,
  },
  {
    id: "bushing",
    name: "HV Bushing",
    status: "healthy",
    position: { x: 50, y: 15 },
    temperature: 58,
    vibration: 0.1,
  },
]

export default function TransformerModel({
  selectedComponent,
  onComponentSelect,
  fusionOverlay,
}: TransformerModelProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "var(--electric-cyan)"
      case "warning":
        return "var(--amber)"
      case "critical":
        return "var(--crimson)"
      default:
        return "var(--quantized-silver)"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-4 h-4" />
      case "warning":
        return <AlertCircle className="w-4 h-4" />
      case "critical":
        return <Zap className="w-4 h-4" />
    }
  }

  return (
    <div className="glass-panel h-[600px] p-6 relative overflow-hidden group">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-quantized-silver font-sans">
          Digital Twin Model
        </h2>
        <div className="flex gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-electric-cyan/10 text-electric-cyan border border-electric-cyan/30">
            Unit: TX-47B
          </span>
          <span className="px-3 py-1 rounded-full bg-quantized-silver/10 text-quantized-silver/70">
            Last Update: 2s ago
          </span>
        </div>
      </div>

      {/* 3D Transformer Visualization */}
      <div
        className="relative h-[400px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={(e) => {
          if (isDragging) {
            setRotation({
              x: rotation.x + e.movementY * 0.5,
              y: rotation.y + e.movementX * 0.5,
            })
          }
        }}
      >
        <motion.div
          className="relative w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        >
          {/* Main transformer body */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Core structure */}
            <div className="relative w-48 h-64">
              {/* Tank */}
              <div className="absolute inset-0 glass-panel-bright border-2 border-electric-cyan/30 rounded-lg">
                <div className="absolute inset-0 bg-gradient-to-b from-electric-cyan/5 to-transparent" />
              </div>

              {/* Components with hotspots */}
              {components.map((component) => {
                const isSelected = selectedComponent === component.id
                const statusColor = getStatusColor(component.status)

                return (
                  <motion.div
                    key={component.id}
                    className="absolute group/component"
                    style={{
                      left: `${component.position.x}%`,
                      top: `${component.position.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    whileHover={{ scale: 1.2 }}
                    onClick={() => onComponentSelect(component.id)}
                  >
                    {/* Hotspot */}
                    <motion.div
                      className="w-6 h-6 rounded-full cursor-pointer relative"
                      style={{
                        backgroundColor: statusColor,
                        boxShadow: `0 0 20px ${statusColor}`,
                      }}
                      animate={{
                        scale: isSelected ? [1, 1.3, 1] : 1,
                        opacity: component.status === "critical" ? [0.5, 1, 0.5] : 1,
                      }}
                      transition={{
                        duration: 2,
                        repeat: component.status === "critical" ? Infinity : 0,
                      }}
                    >
                      {/* Pulsing ring for critical */}
                      {component.status === "critical" && (
                        <motion.div
                          className="absolute inset-0 rounded-full border-2"
                          style={{ borderColor: statusColor }}
                          animate={{
                            scale: [1, 2, 2],
                            opacity: [1, 0, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        />
                      )}
                    </motion.div>

                    {/* Tooltip */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="absolute left-full ml-4 top-1/2 -translate-y-1/2 glass-panel p-3 min-w-[200px] z-20 pointer-events-none"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div style={{ color: statusColor }}>
                          {getStatusIcon(component.status)}
                        </div>
                        <span className="font-semibold text-sm text-quantized-silver">
                          {component.name}
                        </span>
                      </div>
                      <div className="space-y-1 text-xs text-quantized-silver/70">
                        <div className="flex justify-between">
                          <span>Temperature:</span>
                          <span className={component.temperature! > 85 ? "text-amber" : ""}>
                            {component.temperature}°C
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vibration:</span>
                          <span className={component.vibration! > 0.5 ? "text-amber" : ""}>
                            {component.vibration} mm/s
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <span style={{ color: statusColor }}>
                            {component.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Neural pathway to selected */}
                    {isSelected && (
                      <motion.svg
                        className="absolute left-full top-1/2 w-32 h-1 overflow-visible"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.path
                          d="M 0 0 L 128 0"
                          stroke={statusColor}
                          strokeWidth="2"
                          fill="none"
                          style={{ filter: `drop-shadow(0 0 4px ${statusColor})` }}
                        />
                      </motion.svg>
                    )}
                  </motion.div>
                )
              })}

              {/* Fusion overlay */}
              {fusionOverlay && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  className="absolute inset-0 pointer-events-none"
                >
                  {fusionOverlay === "thermal" && (
                    <div className="absolute inset-0 bg-gradient-to-b from-solar-orange/40 via-amber/30 to-transparent rounded-lg" />
                  )}
                  {fusionOverlay === "acoustic" && (
                    <div className="absolute inset-0">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-magenta/40 rounded-full"
                          style={{
                            width: `${(i + 1) * 40}px`,
                            height: `${(i + 1) * 40}px`,
                          }}
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-electric-cyan glow-cyan" />
          <span className="text-quantized-silver/70">Healthy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber glow-amber" />
          <span className="text-quantized-silver/70">Warning</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-crimson" />
          <span className="text-quantized-silver/70">Critical</span>
        </div>
      </div>

      {/* Interaction hint */}
      <div className="absolute bottom-4 left-6 text-xs text-quantized-silver/40">
        Click & drag to rotate • Click components for details
      </div>
    </div>
  )
}