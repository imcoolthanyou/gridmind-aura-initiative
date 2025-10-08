"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowRight, AlertTriangle, Activity, Zap, MapPin } from "lucide-react"
import StaticMapFallback from "./StaticMapFallback"

interface GridNode {
  id: string
  name: string
  type: "transformer" | "substation" | "generator"
  position: { lat: number; lng: number }
  status: "healthy" | "warning" | "critical" | "failed"
  healthScore: number
  connections: string[]
  voltage: number
  load: number
  temperature: number
}

// Sample grid data for Khandwa region with real coordinates
const gridNodes: GridNode[] = [
  {
    id: "KHD-SUB-001",
    name: "Khandwa Main Substation",
    type: "substation",
    position: { lat: 21.8270, lng: 76.3504 },
    status: "healthy",
    healthScore: 92,
    connections: ["KHD-T-001", "KHD-T-002", "KHD-SUB-002"],
    voltage: 132000,
    load: 85,
    temperature: 42
  },
  {
    id: "KHD-T-001",
    name: "Industrial Zone Transformer",
    type: "transformer",
    position: { lat: 21.8350, lng: 76.3420 },
    status: "warning",
    healthScore: 68,
    connections: ["KHD-SUB-001", "KHD-T-003"],
    voltage: 33000,
    load: 92,
    temperature: 87
  },
  {
    id: "KHD-T-002",
    name: "Residential North Transformer",
    type: "transformer",
    position: { lat: 21.8400, lng: 76.3580 },
    status: "critical",
    healthScore: 34,
    connections: ["KHD-SUB-001", "KHD-T-004"],
    voltage: 11000,
    load: 98,
    temperature: 124
  },
  {
    id: "KHD-SUB-002",
    name: "East District Substation",
    type: "substation",
    position: { lat: 21.8200, lng: 76.3650 },
    status: "healthy",
    healthScore: 88,
    connections: ["KHD-SUB-001", "KHD-T-005"],
    voltage: 66000,
    load: 73,
    temperature: 45
  },
  {
    id: "KHD-T-003",
    name: "Commercial Hub Transformer",
    type: "transformer",
    position: { lat: 21.8150, lng: 76.3380 },
    status: "healthy",
    healthScore: 94,
    connections: ["KHD-T-001", "KHD-T-006"],
    voltage: 11000,
    load: 67,
    temperature: 38
  },
  {
    id: "KHD-T-004",
    name: "Narmada Bank Transformer",
    type: "transformer",
    position: { lat: 21.8450, lng: 76.3700 },
    status: "warning",
    healthScore: 71,
    connections: ["KHD-T-002"],
    voltage: 11000,
    load: 89,
    temperature: 78
  },
  {
    id: "KHD-T-005",
    name: "Agricultural Feeder",
    type: "transformer",
    position: { lat: 21.8100, lng: 76.3720 },
    status: "healthy",
    healthScore: 91,
    connections: ["KHD-SUB-002"],
    voltage: 11000,
    load: 54,
    temperature: 41
  },
  {
    id: "KHD-T-006",
    name: "Railway Station Transformer",
    type: "transformer",
    position: { lat: 21.8050, lng: 76.3300 },
    status: "healthy",
    healthScore: 89,
    connections: ["KHD-T-003"],
    voltage: 11000,
    load: 76,
    temperature: 43
  }
]

export default function GridCommandReliable() {
  const [selectedNode, setSelectedNode] = useState<GridNode | null>(null)
  const [failedNodes, setFailedNodes] = useState<Set<string>>(new Set())
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const getNodeColor = (status: string) => {
    switch (status) {
      case "healthy": return "#10b981"
      case "warning": return "#FFBF00"
      case "critical": return "#DC2626"
      case "failed": return "#6b7280"
      default: return "#10b981"
    }
  }

  const simulateCascadingFailure = async (sourceNode: GridNode) => {
    if (sourceNode.status !== "critical" || isAnalyzing) return
    
    setIsAnalyzing(true)
    
    // Find affected nodes
    const affectedNodeIds = new Set<string>()
    sourceNode.connections.forEach(connectedId => {
      affectedNodeIds.add(connectedId)
    })
    
    setFailedNodes(affectedNodeIds)
    
    setTimeout(() => {
      setIsAnalyzing(false)
    }, 3000)
  }

  const resetFailureSimulation = () => {
    setFailedNodes(new Set())
    setIsAnalyzing(false)
  }

  return (
    <div className="relative w-full h-full">
      {/* Header Notice */}
      <div className="absolute top-4 left-4 z-20">
        <div className="glass-panel p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-electric-cyan rounded-full animate-pulse" />
            <h3 className="text-sm font-semibold text-quantized-silver">RELIABLE MODE</h3>
          </div>
          <p className="text-xs text-quantized-silver/60">
            Fully functional without external dependencies
          </p>
        </div>
      </div>

      <StaticMapFallback 
        nodes={gridNodes} 
        onNodeSelect={setSelectedNode}
      />

      {/* Detailed Sidebar */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute top-0 right-0 w-96 h-full glass-panel border-l border-white/20 p-6 overflow-y-auto z-10"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-quantized-silver font-sans mb-1">
                  {selectedNode.name}
                </h2>
                <p className="text-sm text-quantized-silver/60">{selectedNode.id}</p>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-quantized-silver/60 hover:text-quantized-silver transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Overview */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getNodeColor(selectedNode.status) }}
                />
                <span className="text-sm font-semibold text-quantized-silver uppercase">
                  {selectedNode.status}
                </span>
                <span className="text-sm text-quantized-silver/60">
                  {selectedNode.healthScore}% Health
                </span>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="glass-panel p-3">
                  <div className="text-quantized-silver/60 mb-1">Voltage</div>
                  <div className="text-electric-cyan font-bold">
                    {(selectedNode.voltage / 1000).toFixed(0)}kV
                  </div>
                </div>
                <div className="glass-panel p-3">
                  <div className="text-quantized-silver/60 mb-1">Load</div>
                  <div className={`font-bold ${
                    selectedNode.load > 90 ? "text-crimson" : 
                    selectedNode.load > 75 ? "text-amber" : "text-electric-cyan"
                  }`}>
                    {selectedNode.load}%
                  </div>
                </div>
                <div className="glass-panel p-3">
                  <div className="text-quantized-silver/60 mb-1">Temperature</div>
                  <div className={`font-bold ${
                    selectedNode.temperature > 100 ? "text-crimson" : 
                    selectedNode.temperature > 75 ? "text-amber" : "text-electric-cyan"
                  }`}>
                    {selectedNode.temperature}°C
                  </div>
                </div>
                <div className="glass-panel p-3">
                  <div className="text-quantized-silver/60 mb-1">Type</div>
                  <div className="text-quantized-silver font-bold capitalize">
                    {selectedNode.type}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Deep Dive Button */}
              <motion.button
                onClick={() => {
                  window.location.href = `/diagnostics?node=${selectedNode.id}`
                }}
                className="w-full p-3 bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/40 rounded-lg font-medium transition-all duration-300 hover:bg-electric-cyan/30 hover:border-electric-cyan/60 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Activity className="w-4 h-4" />
                DEEP DIVE ANALYSIS
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              {/* Cascade Analysis Button - Only for Critical Nodes */}
              {selectedNode.status === "critical" && (
                <motion.button
                  onClick={() => simulateCascadingFailure(selectedNode)}
                  disabled={isAnalyzing}
                  className="w-full p-3 bg-crimson/20 text-crimson border border-crimson/40 rounded-lg font-medium transition-all duration-300 hover:bg-crimson/30 hover:border-crimson/60 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={!isAnalyzing ? { scale: 1.02 } : {}}
                  whileTap={!isAnalyzing ? { scale: 0.98 } : {}}
                >
                  <AlertTriangle className="w-4 h-4" />
                  {isAnalyzing ? "ANALYZING IMPACT..." : "ANALYZE IMPACT"}
                  <Zap className="w-4 h-4" />
                </motion.button>
              )}

              {/* Reset Simulation Button */}
              {failedNodes.size > 0 && (
                <motion.button
                  onClick={resetFailureSimulation}
                  className="w-full p-3 bg-amber/20 text-amber border border-amber/40 rounded-lg font-medium transition-all duration-300 hover:bg-amber/30 hover:border-amber/60 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  RESET SIMULATION
                </motion.button>
              )}
            </div>

            {/* Connection Status */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-quantized-silver mb-3">
                GRID CONNECTIONS
              </h3>
              <div className="space-y-2">
                {selectedNode.connections.map((connId) => {
                  const connNode = gridNodes.find(n => n.id === connId)
                  if (!connNode) return null
                  
                  return (
                    <div
                      key={connId}
                      className="flex items-center justify-between p-2 bg-quantized-silver/5 rounded"
                    >
                      <span className="text-xs text-quantized-silver/70">
                        {connNode.name}
                      </span>
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getNodeColor(connNode.status) }}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Bar */}
      <div className="absolute bottom-4 left-6 right-6 glass-panel p-4 z-10">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald" />
              <span className="text-quantized-silver/70">Healthy: {gridNodes.filter(n => n.status === "healthy").length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber" />
              <span className="text-quantized-silver/70">Warning: {gridNodes.filter(n => n.status === "warning").length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-crimson" />
              <span className="text-quantized-silver/70">Critical: {gridNodes.filter(n => n.status === "critical").length}</span>
            </div>
            {failedNodes.size > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-500" />
                <span className="text-quantized-silver/70">Failed: {failedNodes.size}</span>
              </div>
            )}
          </div>
          <div className="text-quantized-silver/50 text-xs">
            KHANDWA REGIONAL GRID • RELIABLE MODE • {gridNodes.length} NODES
          </div>
        </div>
      </div>
    </div>
  )
}