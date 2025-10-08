"use client"

import { motion } from "framer-motion"
import { MapPin, Zap, AlertTriangle } from "lucide-react"

interface StaticMapProps {
  nodes: Array<{
    id: string
    name: string
    position: { lat: number; lng: number }
    status: "healthy" | "warning" | "critical" | "failed"
    healthScore: number
  }>
  onNodeSelect: (node: any) => void
}

export default function StaticMapFallback({ nodes, onNodeSelect }: StaticMapProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "#10b981"
      case "warning": return "#FFBF00"
      case "critical": return "#DC2626"
      case "failed": return "#6b7280"
      default: return "#10b981"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical": return AlertTriangle
      case "warning": return Zap
      default: return MapPin
    }
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-deep-space-cobalt/20 to-black overflow-hidden">
      {/* Static Map Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMxZTQwYWYiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
      
      {/* Geographic Features */}
      <svg className="absolute inset-0 w-full h-full">
        {/* Narmada River */}
        <motion.path
          d="M 10,70 Q 30,65 50,70 T 90,75"
          fill="none"
          stroke="var(--electric-cyan)"
          strokeWidth="3"
          opacity="0.4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
        
        {/* Major Roads */}
        <motion.path
          d="M 0,30 L 100,30"
          fill="none"
          stroke="var(--deep-space-cobalt)"
          strokeWidth="2"
          opacity="0.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
        />
        <motion.path
          d="M 50,0 L 50,100"
          fill="none"
          stroke="var(--deep-space-cobalt)"
          strokeWidth="2"
          opacity="0.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.7 }}
        />
      </svg>

      {/* Grid Nodes - Static positioning */}
      {nodes.map((node, index) => {
        const StatusIcon = getStatusIcon(node.status)
        // Convert lat/lng to approximate percentage positions for static display
        const x = ((node.position.lng - 76.30) / 0.08) * 100 // Rough conversion for Khandwa area
        const y = (1 - (node.position.lat - 21.80) / 0.08) * 100
        
        return (
          <motion.div
            key={node.id}
            className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${Math.max(10, Math.min(90, x))}%`,
              top: `${Math.max(10, Math.min(90, y))}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.2 }}
            onClick={() => onNodeSelect(node)}
          >
            {/* Node Glow Effect */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  `0 0 10px ${getStatusColor(node.status)}`,
                  `0 0 20px ${getStatusColor(node.status)}`,
                  `0 0 10px ${getStatusColor(node.status)}`
                ]
              }}
              transition={{
                duration: node.status === "critical" ? 0.8 : 2,
                repeat: Infinity,
              }}
            />

            {/* Node Core */}
            <div
              className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center relative"
              style={{ backgroundColor: getStatusColor(node.status) }}
            >
              <StatusIcon className="w-4 h-4 text-white" />
              
              {/* Critical Node Halo */}
              {node.status === "critical" && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-crimson/30"
                  animate={{
                    scale: [1, 2, 1],
                    opacity: [0.6, 0.2, 0.6]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                />
              )}
            </div>

            {/* Node Label */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-center">
              <div className="bg-gray-900/80 px-2 py-1 rounded border border-gray-600/50 text-white shadow-lg text-xs max-w-32">
                <div className="font-medium truncate">{node.name}</div>
                <div className="text-xs opacity-75">{node.healthScore}%</div>
              </div>
            </div>
          </motion.div>
        )
      })}

      {/* Fallback Mode Indicator */}
      <div className="absolute top-4 right-4 glass-panel p-3">
        <div className="flex items-center gap-2 text-amber">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-xs font-medium">FALLBACK MODE</span>
        </div>
        <p className="text-xs text-quantized-silver/60 mt-1">
          Interactive map unavailable
        </p>
      </div>

      {/* Region Label */}
      <div className="absolute bottom-4 left-4 glass-panel p-3">
        <h3 className="text-sm font-semibold text-quantized-silver">KHANDWA REGION</h3>
        <p className="text-xs text-quantized-silver/60">Madhya Pradesh, India</p>
      </div>
    </div>
  )
}