"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowRight, AlertTriangle, Activity, Zap, MapPin, RotateCcw, Map } from "lucide-react"
import dynamic from "next/dynamic"
import StaticMapFallback from "./StaticMapFallback"

// Three-tier map loading strategy
type MapMode = 'interactive' | 'static' | 'reload'

// Dynamically import ALL Leaflet components at once to avoid partial loading issues
const LeafletMap = dynamic(
  () => import('./LeafletMapComponent'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-void">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-electric-cyan border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-sm text-quantized-silver/60">Loading interactive map...</p>
        </div>
      </div>
    )
  }
)

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

interface PowerLine {
  id: string
  from: string
  to: string
  status: "normal" | "overload" | "failed"
  capacity: number
  currentLoad: number
}

// Sample grid data for Khandwa region with real coordinates
const gridNodes: GridNode[] = [
  {
    id: "KHD-SUB-001",
    name: "Khandwa Main Substation",
    type: "substation",
    position: { lat: 21.8270, lng: 76.3504 }, // Khandwa center
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
    position: { lat: 21.8350, lng: 76.3420 }, // Industrial area
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
    position: { lat: 21.8400, lng: 76.3580 }, // North residential
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
    position: { lat: 21.8200, lng: 76.3650 }, // East district
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
    position: { lat: 21.8150, lng: 76.3380 }, // Commercial area
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
    position: { lat: 21.8450, lng: 76.3700 }, // Near Narmada
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
    position: { lat: 21.8100, lng: 76.3720 }, // Agricultural area
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
    position: { lat: 21.8050, lng: 76.3300 }, // Railway station area
    status: "healthy",
    healthScore: 89,
    connections: ["KHD-T-003"],
    voltage: 11000,
    load: 76,
    temperature: 43
  }
]

const powerLines: PowerLine[] = [
  { id: "L1", from: "KHD-SUB-001", to: "KHD-T-001", status: "normal", capacity: 100, currentLoad: 85 },
  { id: "L2", from: "KHD-SUB-001", to: "KHD-T-002", status: "overload", capacity: 100, currentLoad: 98 },
  { id: "L3", from: "KHD-SUB-001", to: "KHD-SUB-002", status: "normal", capacity: 200, currentLoad: 145 },
  { id: "L4", from: "KHD-T-001", to: "KHD-T-003", status: "normal", capacity: 50, currentLoad: 34 },
  { id: "L5", from: "KHD-T-002", to: "KHD-T-004", status: "overload", capacity: 50, currentLoad: 49 },
  { id: "L6", from: "KHD-SUB-002", to: "KHD-T-005", status: "normal", capacity: 75, currentLoad: 41 },
  { id: "L7", from: "KHD-T-003", to: "KHD-T-006", status: "normal", capacity: 40, currentLoad: 28 }
]

export default function GridCommandDashboard() {
  const [selectedNode, setSelectedNode] = useState<GridNode | null>(null)
  const [hoveredNode, setHoveredNode] = useState<GridNode | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [failedNodes, setFailedNodes] = useState<Set<string>>(new Set())
  const [failedLines, setFailedLines] = useState<Set<string>>(new Set())
  const [isMapReady, setIsMapReady] = useState(false)
  const [mapKey, setMapKey] = useState(0) // Add unique key for map container
  const [mapTheme, setMapTheme] = useState<'dark' | 'satellite' | 'terrain'>('dark')
  const mapRef = useRef<any>(null)
  const [mapMode, setMapMode] = useState<MapMode>('interactive')
  const [mapError, setMapError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [mapLoadAttempts, setMapLoadAttempts] = useState(0)
  const maxRetries = 3
  const containerRef = useRef<HTMLDivElement>(null)

  // Map theme configurations
  const mapThemes = {
    dark: {
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      background: 'var(--void)'
    },
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      background: '#1a1a2e'
    },
    terrain: {
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
      background: '#2c5234'
    }
  }

  const getNodeColor = (status: string) => {
    switch (status) {
      case "healthy": return "#10b981"
      case "warning": return "#FFBF00"
      case "critical": return "#DC2626"
      case "failed": return "#6b7280"
      default: return "#10b981"
    }
  }

  const getLineColor = (line: PowerLine) => {
    if (failedLines.has(line.id)) return "#DC2626"
    if (line.status === "overload") return "#FFBF00"
    return "#00FFFF"
  }

  // Props to pass to map components
  const mapProps = {
    gridNodes,
    powerLines,
    mapTheme,
    mapThemes,
    failedNodes,
    failedLines,
    getNodeColor,
    getLineColor,
    onNodeSelect: setSelectedNode,
    onNodeHover: setHoveredNode
  }

  const simulateCascadingFailure = useCallback(async (sourceNode: GridNode) => {
    if (sourceNode.status !== "critical" || isAnalyzing) return
    
    try {
      setIsAnalyzing(true)
      
      // Find affected nodes within geographic radius
      const affectedNodeIds = new Set<string>()
      const affectedLineIds = new Set<string>()
      
      // Check direct connections first
      sourceNode.connections.forEach(connectedId => {
        affectedNodeIds.add(connectedId)
        
        // Find lines connecting to failed nodes
        powerLines.forEach(line => {
          if ((line.from === sourceNode.id && line.to === connectedId) ||
              (line.to === sourceNode.id && line.from === connectedId)) {
            affectedLineIds.add(line.id)
          }
        })
      })
      
      setFailedNodes(affectedNodeIds)
      setFailedLines(affectedLineIds)
      
      // Auto-reset after 5 seconds
      setTimeout(() => {
        setIsAnalyzing(false)
      }, 5000)
    } catch (error) {
      console.error('Error in cascade simulation:', error)
      setIsAnalyzing(false)
    }
  }, [isAnalyzing])

  const resetFailureSimulation = useCallback(() => {
    try {
      setFailedNodes(new Set())
      setFailedLines(new Set())
      setIsAnalyzing(false)
    } catch (error) {
      console.error('Error resetting simulation:', error)
    }
  }, [])

  // Khandwa center coordinates
  const khandwaCenter: [number, number] = [21.8270, 76.3504]
  
  const currentTheme = mapThemes[mapTheme]

  // Three-tier fallback strategy
  const handleMapError = useCallback((error: any) => {
    console.error('Map error:', error)
    setMapLoadAttempts(prev => prev + 1)
    
    if (mapLoadAttempts < maxRetries) {
      // Tier 1: Retry with exponential backoff
      const delay = Math.pow(2, mapLoadAttempts) * 1000
      setTimeout(() => {
        setMapKey(prev => prev + 1)
        setMapError(null)
      }, delay)
    } else {
      // Tier 2: Switch to static fallback
      setMapMode('static')
      setMapError('Interactive map failed, using static fallback')
    }
  }, [mapLoadAttempts, maxRetries])
  
  const forceReload = useCallback(() => {
    // Tier 3: Full page reload
    window.location.reload()
  }, [])
  
  const retryInteractiveMap = useCallback(() => {
    setMapMode('interactive')
    setMapLoadAttempts(0)
    setMapError(null)
    setMapKey(prev => prev + 1)
  }, [])

  // Initialize map on mount
  useEffect(() => {
    setIsMapReady(true)
  }, [])

  // Map content based on current mode
  const renderMapContent = () => {
    switch (mapMode) {
      case 'interactive':
        return (
          <LeafletMap
            key={mapKey}
            gridNodes={gridNodes}
            powerLines={powerLines}
            mapTheme={mapTheme}
            mapThemes={mapThemes}
            failedNodes={failedNodes}
            failedLines={failedLines}
            getNodeColor={getNodeColor}
            getLineColor={getLineColor}
            onNodeSelect={setSelectedNode}
            onNodeHover={setHoveredNode}
            onError={handleMapError}
          />
        )
      case 'static':
        return (
          <StaticMapFallback
            gridNodes={gridNodes}
            powerLines={powerLines}
            failedNodes={failedNodes}
            failedLines={failedLines}
            onNodeSelect={setSelectedNode}
            onNodeHover={setHoveredNode}
            getNodeColor={getNodeColor}
            getLineColor={getLineColor}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="relative w-full h-full">
      {/* Map Theme Controls */}
      <div className="absolute top-4 left-4 z-20">
        <div className="glass-panel p-3">
          <h3 className="text-sm font-semibold text-quantized-silver mb-2">MAP THEME</h3>
          <div className="flex gap-2">
            {Object.entries(mapThemes).map(([theme, config]) => (
              <button
                key={theme}
                onClick={() => setMapTheme(theme as 'dark' | 'satellite' | 'terrain')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-300 ${
                  mapTheme === theme
                    ? "bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/40"
                    : "bg-quantized-silver/5 text-quantized-silver/60 hover:bg-quantized-silver/10"
                }`}
              >
                {theme.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real Map with Three-Tier Fallback Strategy */}
      <div className="absolute inset-0 z-0" ref={containerRef}>
        {renderMapContent()}
        
        {/* Map Mode Indicator & Controls */}
        {mapMode === 'static' && (
          <div className="absolute top-20 left-4 glass-panel p-3 z-20">
            <div className="flex items-center gap-2 mb-2">
              <Map className="w-4 h-4 text-amber" />
              <span className="text-sm text-amber font-medium">STATIC MODE</span>
            </div>
            <p className="text-xs text-quantized-silver/60 mb-3">Interactive map unavailable</p>
            <div className="space-y-2">
              <button 
                onClick={retryInteractiveMap}
                className="w-full px-3 py-1.5 bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/40 rounded text-xs hover:bg-electric-cyan/30 transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Retry Interactive
              </button>
              <button 
                onClick={forceReload}
                className="w-full px-3 py-1.5 bg-crimson/20 text-crimson border border-crimson/40 rounded text-xs hover:bg-crimson/30 transition-colors"
              >
                Full Reload
              </button>
            </div>
          </div>
        )}
        
        {/* Error Status */}
        {mapError && mapMode === 'interactive' && (
          <div className="absolute top-20 left-4 glass-panel p-3 z-20 border-amber/40">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber" />
              <span className="text-sm text-amber font-medium">MAP LOADING</span>
            </div>
            <p className="text-xs text-quantized-silver/60 mb-2">
              Attempt {mapLoadAttempts}/{maxRetries}
            </p>
            <div className="w-full bg-quantized-silver/20 rounded-full h-1">
              <div 
                className="bg-amber h-1 rounded-full transition-all duration-1000"
                style={{ width: `${(mapLoadAttempts / maxRetries) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

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
              {(failedNodes.size > 0 || failedLines.size > 0) && (
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
            KHANDWA REGIONAL GRID • {gridNodes.length} NODES • {powerLines.length} CONNECTIONS
          </div>
        </div>
      </div>
    </div>
  )
}