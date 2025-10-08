"use client"

import { motion } from "framer-motion"
import { useState, useEffect, Suspense } from "react"
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Center, Html } from '@react-three/drei'
import { useRef } from 'react'
import { Group } from 'three'
import React from 'react'

interface TransformerModelProps {
  selectedComponent: string | null
  onComponentSelect: (component: string | null) => void
  fusionOverlay: string | null
}

interface Component {
  id: string
  name: string
  status: "healthy" | "warning" | "critical"
  position: { x: number; y: number; z: number }
  description?: string
}

// Generate components from CSV data
const getComponentsFromCSV = () => {
  try {
    const assetData = localStorage.getItem('current-asset-data')
    if (assetData) {
      const data = JSON.parse(assetData)
      const csvData = data.data?.sensors || {}
      const components: Component[] = []
      
      Object.keys(csvData).forEach((sensorId, index) => {
        const sensor = csvData[sensorId]
        components.push({
          id: sensorId,
          name: sensor.type || `Component ${index + 1}`,
          status: sensor.status === 'anomaly' ? 'critical' : 
                  sensor.status === 'warning' ? 'warning' : 'healthy',
          position: {
            x: (index % 3 - 1) * 2,
            y: Math.floor(index / 3) * 1.5,
            z: 0
          },
          description: `${sensor.type}: ${sensor.value} ${sensor.unit}`
        })
      })
      
      if (components.length > 0) return components
    }
  } catch (error) {
    console.log('No CSV data found')
  }
  
  // Default components if no CSV
  return [
    {
      id: 'primary_winding',
      name: 'Primary Winding',
      status: 'healthy' as const,
      position: { x: -1.5, y: 0, z: 0 },
      description: 'Primary winding electrical status'
    },
    {
      id: 'secondary_winding',
      name: 'Secondary Winding', 
      status: 'critical' as const,
      position: { x: 1.5, y: 0, z: 0 },
      description: 'Secondary winding overheating detected'
    },
    {
      id: 'oil_tank',
      name: 'Oil Tank',
      status: 'critical' as const,
      position: { x: 0, y: -1.5, z: 0 },
      description: 'Oil temperature critical'
    },
    {
      id: 'bushings',
      name: 'Bushings',
      status: 'warning' as const,
      position: { x: 0, y: 2, z: 0 },
      description: 'Bushing insulation monitoring'
    }
  ]
}

// Health Indicator Component
function HealthIndicator({ 
  component,
  isSelected, 
  onSelect,
  getStatusColor,
  getStatusIcon 
}: {
  component: Component
  isSelected: boolean
  onSelect: () => void
  getStatusColor: (status: string) => string
  getStatusIcon: (status: string) => React.ReactElement
}) {
  const statusColor = getStatusColor(component.status)
  
  return (
    <Html
      position={[component.position.x, component.position.y + 0.8, component.position.z]}
      distanceFactor={6}
      occlude
      style={{ pointerEvents: 'auto' }}
    >
      <div className="relative flex flex-col items-center">
        <div
          className={`
            w-6 h-6 rounded border-2 cursor-pointer relative backdrop-blur-sm
            ${component.status === 'healthy' ? 'bg-green-500/40 border-green-400' : ''}
            ${component.status === 'warning' ? 'bg-yellow-500/40 border-yellow-400' : ''}
            ${component.status === 'critical' ? 'bg-red-500/40 border-red-400' : ''}
          `}
          onClick={onSelect}
          style={{
            transform: isSelected ? 'scale(1.2)' : 'scale(1)',
            boxShadow: `0 0 ${isSelected ? '20px' : '10px'} ${statusColor}`
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div style={{ color: statusColor }} className="text-xs drop-shadow-lg font-bold">
              {getStatusIcon(component.status)}
            </div>
          </div>
        </div>

        <div className="mt-1 text-xs text-center backdrop-blur-sm">
          <div className="bg-gray-900/80 px-1.5 py-0.5 rounded border border-gray-600/50 text-white shadow-lg text-xs">
            <span className="font-medium">{component.name}</span>
          </div>
        </div>

        {isSelected && (
          <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-gray-900/95 backdrop-blur-md p-3 min-w-[220px] rounded-lg border border-gray-600/50 shadow-2xl z-50">
            <div className="flex items-center gap-2 mb-2">
              <div style={{ color: statusColor }}>
                {getStatusIcon(component.status)}
              </div>
              <span className="font-semibold text-sm text-white">
                {component.name}
              </span>
              <span 
                className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                style={{ 
                  backgroundColor: `${statusColor}30`,
                  color: statusColor,
                  border: `1px solid ${statusColor}60`
                }}
              >
                {component.status.toUpperCase()}
              </span>
            </div>
            
            <p className="text-xs text-gray-300 mb-2">
              {component.description}
            </p>
            
            <div className="mt-2 pt-1.5 border-t border-gray-600">
              <span className="text-xs text-gray-500">
                Data source: CSV analysis
              </span>
            </div>
          </div>
        )}
      </div>
    </Html>
  )
}

// 3D Model Component
function TransformerModel3D({ 
  selectedComponent,
  onComponentSelect,
  getStatusColor,
  getStatusIcon 
}: {
  selectedComponent: string | null
  onComponentSelect: (id: string) => void
  getStatusColor: (status: string) => string
  getStatusIcon: (status: string) => React.ReactElement
}) {
  const groupRef = useRef<Group>(null)
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
  })
  
  return (
    <Center>
      <group ref={groupRef}>
        {/* Transformer Model */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[4, 3, 2]} />
          <meshStandardMaterial 
            color="#3a3a3a" 
            metalness={0.7}
            roughness={0.2}
            emissive="#001122"
            emissiveIntensity={0.1}
          />
        </mesh>
        
        {/* Primary winding */}
        <mesh position={[-1.5, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.4, 0.4, 2.5, 16]} />
          <meshStandardMaterial 
            color="#4a9eff" 
            emissive="#4a9eff" 
            emissiveIntensity={0.2}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
        
        {/* Secondary winding */}
        <mesh position={[1.5, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.4, 0.4, 2.5, 16]} />
          <meshStandardMaterial 
            color="#ff4a4a" 
            emissive="#ff4a4a" 
            emissiveIntensity={0.2}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
        
        {/* Bushings */}
        <mesh position={[0, 2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.15, 0.15, 1, 8]} />
          <meshStandardMaterial 
            color="#cccccc" 
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        
        {/* Oil tank */}
        <mesh position={[0, -1.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.5, 0.4, 1.8]} />
          <meshStandardMaterial 
            color="#2a2a2a" 
            transparent 
            opacity={0.8}
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>
        
        {/* Health Indicators */}
        {getComponentsFromCSV().map((component) => (
          <HealthIndicator
            key={component.id}
            component={component}
            isSelected={selectedComponent === component.id}
            onSelect={() => onComponentSelect(component.id)}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
          />
        ))}
      </group>
    </Center>
  )
}

export default function TransformerModel({
  selectedComponent,
  onComponentSelect,
  fusionOverlay,
}: TransformerModelProps) {
  const [csvData, setCsvData] = useState<any>({})
  const [currentAsset, setCurrentAsset] = useState<string>('TX-47B')
  
  // Load CSV data from localStorage
  useEffect(() => {
    const loadCSVData = () => {
      try {
        const assetData = localStorage.getItem('current-asset-data')
        if (assetData) {
          const data = JSON.parse(assetData)
          setCsvData(data.data?.sensors || {})
          setCurrentAsset(data.transformerId || 'TX-47B')
        }
      } catch (error) {
        console.log('No CSV data found, using defaults')
      }
    }
    
    loadCSVData()
    const interval = setInterval(loadCSVData, 1000)
    
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "#00FFFF"
      case "warning":
        return "#FFA500"
      case "critical":
        return "#FF4444"
      default:
        return "#888888"
    }
  }

  const getStatusIcon = (status: string): React.ReactElement => {
    switch (status) {
      case "healthy":
        return <span className="text-xs font-bold text-green-400">OK</span>
      case "warning":
        return <span className="text-xs font-bold text-yellow-400">WARN</span>
      case "critical":
        return <span className="text-xs font-bold text-red-400">CRIT</span>
      default:
        return <span className="text-xs font-bold text-gray-400">UNK</span>
    }
  }

  return (
    <div className="glass-panel h-[700px] p-6 relative overflow-hidden group">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-quantized-silver font-sans">
          Digital Twin Model
        </h2>
        <div className="flex gap-2 text-xs">
          <motion.span 
            className="px-3 py-1 rounded-full bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/50"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            CSV DATA ACTIVE
          </motion.span>
          <span className="px-3 py-1 rounded-full bg-amber/10 text-amber border border-amber/30">
            Unit: {currentAsset}
          </span>
        </div>
      </div>
      
      {/* CSV Status Banner */}
      <motion.div 
        className="mb-4 p-3 rounded-lg border-l-4 border-electric-cyan bg-electric-cyan/5"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-electric-cyan mb-1">
              ANALYSIS: CSV-based diagnostics active
            </h3>
            <p className="text-xs text-quantized-silver/70">
              Monitoring {Object.keys(csvData).length} sensors from uploaded CSV data
            </p>
          </div>
          <motion.div
            className="w-3 h-3 rounded-full bg-electric-cyan"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* 3D Scene */}
      <div className="relative h-[500px] bg-gradient-to-br from-void via-electric-cyan/5 to-quantized-silver/10 rounded-lg border border-electric-cyan/30 overflow-hidden shadow-lg shadow-electric-cyan/20">
        <Canvas
          camera={{ position: [6, 4, 6], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
        >
          <color attach="background" args={['#0f0f23']} />
          
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} color="#ffffff" />
            <directionalLight position={[8, 8, 5]} intensity={1.5} color="#00FFFF" castShadow />
            <directionalLight position={[-5, 3, 3]} intensity={0.8} color="#4169E1" />
            <pointLight position={[3, 4, 2]} intensity={0.7} color="#00FFFF" distance={15} decay={2} />

            <TransformerModel3D 
              selectedComponent={selectedComponent}
              onComponentSelect={onComponentSelect}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
            />

            <Environment preset="night" background={false} environmentIntensity={0.3} />
            <OrbitControls 
              autoRotate={false}
              enableZoom={true}
              enablePan={true}
              minDistance={4}
              maxDistance={15}
              dampingFactor={0.05}
              enableDamping
            />
          </Suspense>
        </Canvas>

        {/* UI Overlays */}
        <div className="absolute top-4 right-4 bg-void/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-electric-cyan/40">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 bg-electric-cyan rounded-full animate-pulse"></div>
            <span className="text-electric-cyan font-medium">CSV TWIN ACTIVE</span>
          </div>
        </div>
        
        <div className="absolute bottom-4 left-4 bg-void/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-electric-cyan/30">
          <div className="text-xs text-quantized-silver/80 space-y-1">
            <div>MOUSE: Drag to rotate • SCROLL: Zoom in/out</div>
            <div>CLICK: Select indicator for details</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-green-400 bg-green-500/20" />
          <span className="text-quantized-silver/70">HEALTHY</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-yellow-400 bg-yellow-500/20" />
          <span className="text-quantized-silver/70">WARNING</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-red-400 bg-red-500/20" />
          <span className="text-quantized-silver/70">CRITICAL</span>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-6 text-xs text-quantized-silver/40">
        AURA DIGITAL TWIN SYSTEM • CSV-BASED DIAGNOSTICS • ASSET: {currentAsset}
      </div>
    </div>
  )
}