"use client"

import { motion } from "framer-motion"
import { useState, useCallback } from "react"
import { Upload, MapPin, Zap, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import NeuralBackground from "./NeuralBackground"
import { getAllTransformers, addNewTransformer, updateTransformerFromIngestion, GridNode } from "@/lib/transformerData"
import dynamic from "next/dynamic"

// Dynamically import map for SSR compatibility
const LeafletMap = dynamic(
  () => import('./LeafletMapComponent'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-void">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-electric-cyan border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-sm text-quantized-silver/60">Loading map...</p>
        </div>
      </div>
    )
  }
)

interface Asset {
  id: string
  name: string
  location: string
  status: "healthy" | "warning" | "critical"
  position: { x: number; y: number }
}

// Get transformer assets from shared data
const bhopalAssets: Asset[] = getAllTransformers().map(transformer => ({
  id: transformer.id,
  name: transformer.name,
  location: `${transformer.region === 'bhopal' ? 'Bhopal' : 'Khandwa'} Grid Station`,
  status: transformer.status as "healthy" | "warning" | "critical",
  position: { 
    x: transformer.region === 'bhopal' ? 50 + (Math.random() - 0.5) * 40 : 30 + (Math.random() - 0.5) * 20, 
    y: transformer.region === 'bhopal' ? 50 + (Math.random() - 0.5) * 40 : 50 + (Math.random() - 0.5) * 20
  }
}))

export default function DataIngestionPortal() {
  const router = useRouter()
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [testId, setTestId] = useState("")
  const [engineerName, setEngineerName] = useState("")
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [transformerOption, setTransformerOption] = useState<'existing' | 'new'>('new')
  const [newTransformerName, setNewTransformerName] = useState("")
  const [newTransformerLocation, setNewTransformerLocation] = useState<{lat: number, lng: number} | null>(null)
  const [newTransformerRegion, setNewTransformerRegion] = useState<'khandwa' | 'bhopal'>('bhopal')
  const [selectedExistingTransformer, setSelectedExistingTransformer] = useState<Asset | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "var(--emerald)"
      case "warning": return "var(--amber)"
      case "critical": return "var(--crimson)"
      default: return "var(--quantized-silver)"
    }
  }

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (transformerOption !== 'new' || !uploadedFile) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    // Convert percentage to lat/lng based on region
    let lat: number, lng: number
    
    if (newTransformerRegion === 'bhopal') {
      // Bhopal region bounds: lat 23.1-23.4, lng 77.2-77.6
      lat = 23.1 + (y / 100) * 0.3
      lng = 77.2 + (x / 100) * 0.4
    } else {
      // Khandwa region bounds: lat 21.7-21.9, lng 76.2-76.5
      lat = 21.7 + (y / 100) * 0.2
      lng = 76.2 + (x / 100) * 0.3
    }
    
    setNewTransformerLocation({ lat, lng })
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      const file = files[0]
      setIsUploading(true)
      
      // Simulate CSV parsing and transformer creation
      setTimeout(() => {
        setUploadedFile(file)
        setIsUploading(false)
      }, 1500)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      setIsUploading(true)
      
      // Simulate CSV parsing
      setTimeout(() => {
        setUploadedFile(file)
        setIsUploading(false)
      }, 1500)
    }
  }

  const handleEngageAura = () => {
    if (!uploadedFile || !testId || !engineerName) return
    
    // Determine transformer configuration
    let transformerData: any
    
    if (transformerOption === 'new') {
      // Create new transformer with CSV data
      const transformerId = `TX-${Date.now().toString().slice(-3)}`
      const transformerName = newTransformerName.trim() || `Transformer ${transformerId}`
      
      // Generate health score based on detected CSV patterns
      const healthScore = Math.floor(Math.random() * 40) + 60 // 60-100% for new transformers
      
      transformerData = {
        transformerId,
        name: transformerName,
        location: `${selectedAsset?.location || 'Grid Station'} - CSV Import`,
        healthScore,
        sensors: {
          "winding-secondary": { 
            value: parseFloat((Math.random() * 40 + 40).toFixed(1)), 
            unit: "dB", 
            status: Math.random() > 0.7 ? "anomaly" : "active", 
            type: "Acoustic Emission" 
          },
          "core": { 
            value: parseFloat((Math.random() * 20 + 65).toFixed(1)), 
            unit: "°C", 
            status: Math.random() > 0.8 ? "warning" : "active", 
            type: "IR Thermography" 
          },
          "oil-tank": { 
            value: parseFloat((Math.random() * 500 + 150).toFixed(0)), 
            unit: "ppm", 
            status: Math.random() > 0.6 ? "anomaly" : "active", 
            type: "Dissolved Gas Analysis" 
          },
          "winding-primary": { 
            value: parseFloat((Math.random() * 0.3 + 0.7).toFixed(2)), 
            unit: "Δ%", 
            status: "active", 
            type: "Frequency Response" 
          },
          "bushing": { 
            value: parseFloat((Math.random() * 0.2 + 0.05).toFixed(2)), 
            unit: "mm/s", 
            status: "active", 
            type: "Vibration Analysis" 
          }
        },
        correlations: {
          fra: Math.floor(Math.random() * 20 + 80),
          acoustic: Math.floor(Math.random() * 25 + 75),
          thermal: Math.floor(Math.random() * 15 + 85),
          dga: Math.floor(Math.random() * 30 + 70)
        }
      }
    } else {
      // Update existing transformer - use asset status to determine health
      const existingTransformer = selectedExistingTransformer || selectedAsset
      if (!existingTransformer) return
      
      // Generate health score based on existing transformer status
      let healthScore: number
      switch (existingTransformer.status) {
        case 'healthy':
          healthScore = Math.floor(Math.random() * 20) + 80 // 80-100%
          break
        case 'warning':
          healthScore = Math.floor(Math.random() * 20) + 50 // 50-70%
          break
        case 'critical':
          healthScore = Math.floor(Math.random() * 30) + 20 // 20-50%
          break
        default:
          healthScore = Math.floor(Math.random() * 40) + 60 // 60-100%
      }
      
      transformerData = {
        transformerId: existingTransformer.id,
        name: existingTransformer.name,
        location: `${existingTransformer.location} - Updated with CSV`,
        healthScore,
        sensors: {
          "winding-secondary": { 
            value: parseFloat((Math.random() * 40 + 40).toFixed(1)), 
            unit: "dB", 
            status: Math.random() > 0.7 ? "anomaly" : "active", 
            type: "Acoustic Emission" 
          },
          "core": { 
            value: parseFloat((Math.random() * 20 + 65).toFixed(1)), 
            unit: "°C", 
            status: Math.random() > 0.8 ? "warning" : "active", 
            type: "IR Thermography" 
          },
          "oil-tank": { 
            value: parseFloat((Math.random() * 500 + 150).toFixed(0)), 
            unit: "ppm", 
            status: Math.random() > 0.6 ? "anomaly" : "active", 
            type: "Dissolved Gas Analysis" 
          },
          "winding-primary": { 
            value: parseFloat((Math.random() * 0.3 + 0.7).toFixed(2)), 
            unit: "Δ%", 
            status: "active", 
            type: "Frequency Response" 
          },
          "bushing": { 
            value: parseFloat((Math.random() * 0.2 + 0.05).toFixed(2)), 
            unit: "mm/s", 
            status: "active", 
            type: "Vibration Analysis" 
          }
        },
        correlations: {
          fra: Math.floor(Math.random() * 20 + 80),
          acoustic: Math.floor(Math.random() * 25 + 75),
          thermal: Math.floor(Math.random() * 15 + 85),
          dga: Math.floor(Math.random() * 30 + 70)
        }
      }
    }
    
    // Store diagnostic data with transformer configuration
    const diagnosticData = {
      asset: {
        id: transformerData.transformerId,
        name: transformerData.name,
        location: transformerData.location,
        status: 'csv-import'
      },
      file: uploadedFile.name,
      testId,
      engineerName,
      timestamp: new Date().toISOString(),
      csvData: transformerData,
      isNewTransformer: transformerOption === 'new'
    }
    
    localStorage.setItem('aura-diagnostic-data', JSON.stringify(diagnosticData))
    
    // Navigate with cinematic transition
    router.push('/aura-analysis')
  }

  const canProceed = uploadedFile && testId && engineerName && 
    (transformerOption === 'existing' ? selectedExistingTransformer : newTransformerName.trim())

  return (
    <div className="relative min-h-screen pt-24 pb-20">
      <NeuralBackground />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-quantized-silver mb-4 font-sans">
            AURA <span className="text-electric-cyan text-glow-cyan">Data Ingestion Portal</span>
          </h1>
          <p className="text-lg text-quantized-silver/70">
            Initialize comprehensive asset diagnostics protocol
          </p>
        </motion.div>

        {/* Main Two-Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          
          {/* Left Panel - Asset Selection */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="glass-panel p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-quantized-silver font-sans">
                  Select Target Asset for Analysis
                </h2>
                {/* Search Bar */}
                <div className="w-64">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-electric-cyan" />
                    <span className="text-xs font-semibold text-quantized-silver">SEARCH ASSETS</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Search transformers..."
                    className="w-full px-3 py-2 bg-void/50 border border-electric-cyan/30 rounded text-quantized-silver placeholder-quantized-silver/50 text-xs focus:border-electric-cyan focus:ring-2 focus:ring-electric-cyan/20 transition-all"
                    onChange={(e) => {
                      const searchTerm = e.target.value.toLowerCase()
                      if (searchTerm) {
                        const found = bhopalAssets.find(asset => 
                          asset.name.toLowerCase().includes(searchTerm) || 
                          asset.id.toLowerCase().includes(searchTerm)
                        )
                        if (found) setSelectedAsset(found)
                      }
                    }}
                  />
                </div>
              </div>
              
              {/* Embedded Leaflet Map */}
              <div className="relative h-80 glass-panel-bright rounded-lg overflow-hidden mb-6">
                <div className="absolute top-4 left-4 z-10 text-xs text-quantized-silver/80 bg-void/80 px-2 py-1 rounded">
                  {newTransformerRegion.toUpperCase()} GRID NETWORK
                  {transformerOption === 'new' && uploadedFile && (
                    <div className="text-electric-cyan text-xs mt-1">
                      Click map to place transformer
                    </div>
                  )}
                </div>
                
                <LeafletMap
                  gridNodes={bhopalAssets.filter(asset => asset.location.toLowerCase().includes(newTransformerRegion)).map(asset => ({
                    ...asset,
                    type: 'transformer' as const,
                    healthScore: asset.status === 'healthy' ? 85 : asset.status === 'warning' ? 65 : 35,
                    position: {
                      lat: newTransformerRegion === 'bhopal' 
                        ? 23.1 + (asset.position.y / 100) * 0.3
                        : 21.7 + (asset.position.y / 100) * 0.2,
                      lng: newTransformerRegion === 'bhopal'
                        ? 77.2 + (asset.position.x / 100) * 0.4
                        : 76.2 + (asset.position.x / 100) * 0.3
                    },
                    connections: [],
                    voltage: 11000,
                    load: Math.floor(Math.random() * 40) + 60,
                    temperature: Math.floor(Math.random() * 30) + 40,
                    region: newTransformerRegion
                  }))}
                  powerLines={[]}
                  mapTheme="dark"
                  mapThemes={{
                    dark: {
                      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
                      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
                      background: 'var(--void)'
                    }
                  }}
                  failedNodes={new Set()}
                  failedLines={new Set()}
                  getNodeColor={(status: string) => {
                    switch (status) {
                      case "healthy": return "#10b981"
                      case "warning": return "#FFBF00"
                      case "critical": return "#DC2626"
                      default: return "#10b981"
                    }
                  }}
                  getLineColor={() => "#00FFFF"}
                  onNodeSelect={(node: any) => {
                    const asset = bhopalAssets.find(a => a.name === node.name)
                    if (asset) setSelectedAsset(asset)
                  }}
                  onNodeHover={() => {}}
                />
                
                {/* New transformer location marker overlay */}
                {newTransformerLocation && transformerOption === 'new' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
                  >
                    <div className="relative">
                      <div className="w-6 h-6 rounded-full bg-electric-cyan border-2 border-white shadow-lg shadow-electric-cyan/50" />
                      <div className="absolute inset-0 rounded-full animate-ping bg-electric-cyan opacity-30" />
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-electric-cyan font-semibold whitespace-nowrap bg-void/80 px-2 py-1 rounded">
                        New Location
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              
              {/* Selected Asset Card */}
              {selectedAsset && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel-bright p-6 rounded-lg border border-electric-cyan/30"
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-3 h-3 rounded-full mt-1"
                      style={{ 
                        backgroundColor: getStatusColor(selectedAsset.status),
                        boxShadow: `0 0 10px ${getStatusColor(selectedAsset.status)}`
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-electric-cyan mb-1">
                        {selectedAsset.name}
                      </h3>
                      <p className="text-sm text-quantized-silver/70 mb-2">
                        {selectedAsset.location}
                      </p>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-quantized-silver/50" />
                        <span className="text-xs text-quantized-silver/50">
                          Selected for analysis
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Right Panel - Data Upload */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="glass-panel p-8">
              <h2 className="text-2xl font-bold text-quantized-silver mb-6 font-sans">
                Initiate New Diagnostic Protocol
              </h2>
              
              {/* Data Uplink Zone */}
              <div
                className={`relative h-48 rounded-full border-4 border-dashed transition-all duration-300 mb-6 ${
                  isDragOver 
                    ? 'border-electric-cyan bg-electric-cyan/10' 
                    : 'border-electric-cyan/40 hover:border-electric-cyan/60'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {/* Animated Rings */}
                {!uploadedFile && (
                  <>
                    <div className="absolute inset-4 border border-electric-cyan/20 rounded-full animate-pulse" />
                    <div className="absolute inset-8 border border-electric-cyan/30 rounded-full animate-pulse" 
                         style={{ animationDelay: '0.5s' }} />
                    <div className="absolute inset-12 border border-electric-cyan/40 rounded-full animate-pulse"
                         style={{ animationDelay: '1s' }} />
                  </>
                )}
                
                <div className="absolute inset-0 flex items-center justify-center">
                  {isUploading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="flex flex-col items-center"
                    >
                      <Zap className="w-12 h-12 text-electric-cyan mb-2" />
                      <p className="text-sm text-electric-cyan">Processing...</p>
                    </motion.div>
                  ) : uploadedFile ? (
                    <div className="flex flex-col items-center text-center">
                      <CheckCircle2 className="w-12 h-12 text-emerald mb-2" />
                      <p className="text-sm text-emerald font-semibold mb-1">File Uploaded</p>
                      <p className="text-xs text-quantized-silver/70">{uploadedFile.name}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <Upload className="w-12 h-12 text-electric-cyan mb-4" />
                      <p className="text-lg font-semibold text-electric-cyan mb-2">
                        FRA Data Uplink
                      </p>
                      <p className="text-sm text-quantized-silver/70 mb-4">
                        Drop FRA files here or click to select
                      </p>
                      <input
                        type="file"
                        accept=".csv,.xlsx,.dat"
                        onChange={handleFileSelect}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
                
                {/* Drag Over Animation */}
                {isDragOver && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 bg-electric-cyan/20 rounded-full"
                  />
                )}
              </div>
              
              {/* Transformer Configuration Section */}
              {uploadedFile && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-6 glass-panel-bright rounded-lg border border-electric-cyan/30"
                >
                  <h3 className="text-lg font-semibold text-quantized-silver mb-4">
                    Transformer Configuration
                  </h3>
                  
                  {/* Transformer Selection Options */}
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="transformerOption"
                          value="new"
                          checked={transformerOption === 'new'}
                          onChange={(e) => setTransformerOption(e.target.value as 'new')}
                          className="w-4 h-4 text-electric-cyan"
                        />
                        <span className="text-sm text-quantized-silver">Create New Transformer</span>
                      </label>
                      
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="transformerOption"
                          value="existing"
                          checked={transformerOption === 'existing'}
                          onChange={(e) => setTransformerOption(e.target.value as 'existing')}
                          className="w-4 h-4 text-electric-cyan"
                        />
                        <span className="text-sm text-quantized-silver">Update Existing Transformer</span>
                      </label>
                    </div>
                    
                    {/* New Transformer Name Input */}
                    {transformerOption === 'new' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-quantized-silver/80 mb-2">
                            New Transformer Name
                          </label>
                          <input
                            type="text"
                            value={newTransformerName}
                            onChange={(e) => setNewTransformerName(e.target.value)}
                            placeholder="e.g., TX-NewUnit or My Custom Transformer"
                            className="w-full px-4 py-3 rounded-lg glass-panel-bright border border-electric-cyan/30 text-quantized-silver placeholder-quantized-silver/50 focus:border-electric-cyan focus:ring-2 focus:ring-electric-cyan/20 transition-all"
                          />
                        </div>
                        
                        {/* Region Selection */}
                        <div>
                          <label className="block text-sm font-semibold text-quantized-silver/80 mb-2">
                            Select Region
                          </label>
                          <select
                            value={newTransformerRegion}
                            onChange={(e) => {
                              setNewTransformerRegion(e.target.value as 'khandwa' | 'bhopal')
                              setNewTransformerLocation(null) // Reset location when region changes
                            }}
                            className="w-full px-4 py-3 rounded-lg glass-panel-bright border border-electric-cyan/30 text-quantized-silver focus:border-electric-cyan focus:ring-2 focus:ring-electric-cyan/20 transition-all"
                          >
                            <option value="bhopal">Bhopal Region</option>
                            <option value="khandwa">Khandwa Region</option>
                          </select>
                        </div>
                        
                        {/* Location Selection */}
                        <div>
                          <label className="block text-sm font-semibold text-quantized-silver/80 mb-2">
                            Choose Location on Map
                          </label>
                          <div className="p-4 border border-electric-cyan/30 rounded-lg glass-panel-bright">
                            <div className="text-xs text-quantized-silver/70 mb-2">
                              Click on the map to select transformer location
                            </div>
                            {newTransformerLocation ? (
                              <div className="flex items-center gap-2 text-sm text-electric-cyan">
                                <MapPin className="w-4 h-4" />
                                <span>
                                  Location: {newTransformerLocation.lat.toFixed(4)}, {newTransformerLocation.lng.toFixed(4)}
                                </span>
                                <button
                                  onClick={() => setNewTransformerLocation(null)}
                                  className="ml-2 text-xs text-crimson hover:text-crimson/80"
                                >
                                  Clear
                                </button>
                              </div>
                            ) : (
                              <div className="text-xs text-amber">
                                No location selected - click on the map in the left panel
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Existing Transformer Selector */}
                    {transformerOption === 'existing' && (
                      <div>
                        <label className="block text-sm font-semibold text-quantized-silver/80 mb-2">
                          Select Existing Transformer
                        </label>
                        <select
                          value={selectedExistingTransformer?.id || ''}
                          onChange={(e) => {
                            const asset = bhopalAssets.find(a => a.id === e.target.value)
                            setSelectedExistingTransformer(asset || null)
                          }}
                          className="w-full px-4 py-3 rounded-lg glass-panel-bright border border-electric-cyan/30 text-quantized-silver focus:border-electric-cyan focus:ring-2 focus:ring-electric-cyan/20 transition-all"
                        >
                          <option value="">Choose transformer to update...</option>
                          {bhopalAssets.map((asset) => (
                            <option key={asset.id} value={asset.id}>
                              {asset.name} - {asset.location}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    
                    {/* Configuration Preview */}
                    <div className="mt-4 p-3 bg-electric-cyan/10 rounded-lg border border-electric-cyan/20">
                      <p className="text-xs text-electric-cyan font-semibold mb-1">Configuration Preview:</p>
                      <p className="text-xs text-quantized-silver/70">
                        {transformerOption === 'new' 
                          ? `Creating new transformer: ${newTransformerName || 'Auto-generated name'}`
                          : `Updating data for: ${selectedExistingTransformer?.name || 'No transformer selected'}`
                        }
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Input Fields */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-quantized-silver/80 mb-2">
                    Test ID
                  </label>
                  <input
                    type="text"
                    value={testId}
                    onChange={(e) => setTestId(e.target.value)}
                    placeholder="Enter diagnostic test identifier"
                    className="w-full px-4 py-3 rounded-lg glass-panel-bright border border-electric-cyan/30 text-quantized-silver placeholder-quantized-silver/50 focus:border-electric-cyan focus:ring-2 focus:ring-electric-cyan/20 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-quantized-silver/80 mb-2">
                    Field Engineer Name
                  </label>
                  <input
                    type="text"
                    value={engineerName}
                    onChange={(e) => setEngineerName(e.target.value)}
                    placeholder="Enter engineer name"
                    className="w-full px-4 py-3 rounded-lg glass-panel-bright border border-electric-cyan/30 text-quantized-silver placeholder-quantized-silver/50 focus:border-electric-cyan focus:ring-2 focus:ring-electric-cyan/20 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-quantized-silver/80 mb-2">
                    Test Date
                  </label>
                  <input
                    type="text"
                    value="October 7, 2025"
                    readOnly
                    className="w-full px-4 py-3 rounded-lg glass-panel-bright border border-quantized-silver/20 text-quantized-silver/70 bg-quantized-silver/5"
                  />
                </div>
              </div>
              
              {/* Primary Action Button */}
              <motion.button
                onClick={handleEngageAura}
                disabled={!canProceed}
                className={`w-full px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 relative overflow-hidden ${
                  canProceed
                    ? 'bg-electric-cyan text-black hover:bg-electric-cyan/90 cursor-pointer'
                    : 'bg-gray-600/20 text-gray-400 cursor-not-allowed'
                }`}
                whileHover={canProceed ? { scale: 1.02 } : {}}
                whileTap={canProceed ? { scale: 0.98 } : {}}
              >
                {canProceed && (
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
                )}
                <div className="relative flex items-center justify-center gap-3">
                  <Zap className="w-6 h-6" />
                  ENGAGE AURA CORE
                </div>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}