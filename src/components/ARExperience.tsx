"use client"

import { motion } from "framer-motion"
import { useState, useEffect, useRef, Suspense } from "react"
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, Center, Html } from '@react-three/drei'
import { Group } from 'three'
import React from 'react'

interface ARStatus {
  hasPermission: boolean
  isSupported: boolean
  isActive: boolean
  error: string | null
}

interface Component {
  id: string
  name: string
  status: "healthy" | "warning" | "critical"
  position: { x: number; y: number; z: number }
  temperature?: number
  vibration?: number
  description?: string
}

const components: Component[] = [
  {
    id: "winding-primary",
    name: "Primary Winding",
    status: "healthy",
    position: { x: -0.3, y: 0, z: 0 },
    temperature: 65,
    vibration: 0.2,
    description: "Main power input winding - Operating normally"
  },
  {
    id: "winding-secondary",
    name: "Secondary Winding",
    status: "critical",
    position: { x: 0.3, y: 0, z: 0 },
    temperature: 127,
    vibration: 1.8,
    description: "Output winding - CRITICAL OVERHEATING DETECTED"
  },
  {
    id: "core",
    name: "Magnetic Core",
    status: "warning",
    position: { x: 0, y: 0, z: 0 },
    temperature: 88,
    vibration: 0.6,
    description: "Transformer core - Elevated temperature levels"
  },
  {
    id: "oil-tank",
    name: "Oil Tank",
    status: "critical",
    position: { x: 0, y: -0.4, z: 0 },
    temperature: 134,
    vibration: 2.1,
    description: "Cooling oil reservoir - CRITICAL TEMPERATURE"
  },
  {
    id: "bushing",
    name: "HV Bushing",
    status: "warning",
    position: { x: 0, y: 0.4, z: 0 },
    temperature: 92,
    vibration: 0.8,
    description: "High voltage connection - Warning levels detected"
  },
]

// AR Transformer Model Component
function ARTransformerModel({ 
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
  
  // Try to load the transformer model, fallback to simple geometry
  let modelData: any = null
  let hasError = false
  
  try {
    modelData = useGLTF('/transformer-part-2.glb')
  } catch (err) {
    console.log('Using fallback model for AR')
    hasError = true
  }
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Gentle floating animation for AR
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02
      groupRef.current.rotation.y += delta * 0.05
    }
  })
  
  return (
    <Center>
      <group ref={groupRef} scale={0.5} position={[0, 0, -1]}>
        {/* 3D Model */}
        {!hasError && modelData?.scene ? (
          <primitive 
            object={modelData.scene.clone()} 
            scale={0.8}
          />
        ) : (
          // Fallback AR transformer representation
          <>
            {/* Main tank */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.8, 0.6, 0.4]} />
              <meshStandardMaterial 
                color="#3a3a3a" 
                metalness={0.7}
                roughness={0.2}
              />
            </mesh>
            {/* Primary winding */}
            <mesh position={[-0.3, 0, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
              <meshStandardMaterial 
                color="#4a9eff" 
                emissive="#4a9eff" 
                emissiveIntensity={0.2}
              />
            </mesh>
            {/* Secondary winding */}
            <mesh position={[0.3, 0, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
              <meshStandardMaterial 
                color="#ff4a4a" 
                emissive="#ff4a4a" 
                emissiveIntensity={0.2}
              />
            </mesh>
            {/* Bushings */}
            <mesh position={[0, 0.4, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.2, 8]} />
              <meshStandardMaterial 
                color="#cccccc" 
                metalness={0.9}
              />
            </mesh>
            {/* Oil tank indicator */}
            <mesh position={[0, -0.4, 0]}>
              <boxGeometry args={[0.7, 0.08, 0.36]} />
              <meshStandardMaterial 
                color="#2a2a2a" 
                transparent 
                opacity={0.8}
              />
            </mesh>
          </>
        )}
        
        {/* AR Health Indicators */}
        {components.map((component) => (
          <Html
            key={component.id}
            position={[component.position.x, component.position.y + 0.2, component.position.z]}
            distanceFactor={3}
            occlude
            style={{ pointerEvents: 'auto' }}
          >
            <motion.div
              className="relative flex flex-col items-center"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + components.indexOf(component) * 0.1 }}
            >
              {/* AR Health Status Box */}
              <motion.div
                className={`
                  w-4 h-4 rounded border cursor-pointer relative backdrop-blur-sm
                  ${component.status === 'healthy' ? 'bg-green-500/50 border-green-400' : ''}
                  ${component.status === 'warning' ? 'bg-yellow-500/50 border-yellow-400' : ''}
                  ${component.status === 'critical' ? 'bg-red-500/50 border-red-400' : ''}
                `}
                whileHover={{ scale: 1.2 }}
                onClick={() => onComponentSelect(component.id)}
                animate={{
                  scale: selectedComponent === component.id ? [1, 1.1, 1] : component.status === "critical" ? [1, 1.05, 1] : 1,
                }}
                transition={{
                  duration: component.status === "critical" ? 0.8 : 2,
                  repeat: Infinity,
                }}
              >
                {/* Status Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-xs font-bold" style={{ color: getStatusColor(component.status) }}>
                    {getStatusIcon(component.status)}
                  </div>
                </div>
              </motion.div>

              {/* AR Component Label */}
              <motion.div
                className="mt-1 text-xs text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ delay: 1 }}
              >
                <div className="bg-gray-900/90 px-1 py-0.5 rounded border border-gray-600/70 text-white shadow-lg text-xs">
                  <span className="font-medium">{component.name}</span>
                </div>
              </motion.div>

              {/* AR Tooltip */}
              {selectedComponent === component.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-gray-900/95 backdrop-blur-md p-2 min-w-[180px] rounded border border-gray-600/70 shadow-xl z-50"
                >
                  <div className="flex items-center gap-1 mb-1">
                    <div style={{ color: getStatusColor(component.status) }}>
                      {getStatusIcon(component.status)}
                    </div>
                    <span className="font-semibold text-xs text-white">
                      {component.name}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-300 mb-1">
                    {component.description}
                  </p>
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Temp:</span>
                      <span className={component.temperature! > 120 ? "text-red-400 font-bold" : component.temperature! > 85 ? "text-yellow-400" : "text-cyan-400"}>
                        {component.temperature}°C
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Vibration:</span>
                      <span className={component.vibration! > 1.5 ? "text-red-400 font-bold" : component.vibration! > 0.5 ? "text-yellow-400" : "text-cyan-400"}>
                        {component.vibration} mm/s
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </Html>
        ))}
      </group>
    </Center>
  )
}

export default function ARExperience() {
  const [arStatus, setARStatus] = useState<ARStatus>({
    hasPermission: false,
    isSupported: false,
    isActive: false,
    error: null
  })
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Check AR support
  useEffect(() => {
    const checkARSupport = async () => {
      // Check for camera access (works on both mobile and desktop)
      const hasCamera = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices
      
      if (hasCamera) {
        try {
          // Test if we can enumerate devices
          const devices = await navigator.mediaDevices.enumerateDevices()
          const hasVideoDevice = devices.some(device => device.kind === 'videoinput')
          setARStatus(prev => ({ ...prev, isSupported: hasVideoDevice }))
        } catch (error) {
          setARStatus(prev => ({ ...prev, isSupported: hasCamera }))
        }
      } else {
        setARStatus(prev => ({ ...prev, isSupported: false }))
      }
    }
    
    checkARSupport()
  }, [])

  // Request camera permission and start AR
  const startAR = async () => {
    try {
      // For desktop/laptop users - try to get any available camera
      // For mobile users - prefer back camera if available
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      
      const constraints = {
        video: isMobile ? {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } : {
          // For desktop/laptop - use any available camera
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        }
      }
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
      
      setARStatus(prev => ({
        ...prev,
        hasPermission: true,
        isActive: true,
        error: null
      }))
    } catch (error) {
      setARStatus(prev => ({
        ...prev,
        hasPermission: false,
        isActive: false,
        error: error instanceof Error ? error.message : 'Camera access denied'
      }))
    }
  }

  // Stop AR
  const stopAR = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    setARStatus(prev => ({
      ...prev,
      isActive: false
    }))
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

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

  if (!arStatus.isSupported) {
    return (
      <div className="container mx-auto px-6 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="glass-panel p-8">
            <h1 className="text-4xl font-bold text-quantized-silver mb-4 font-sans">
              CAMERA NOT SUPPORTED
            </h1>
            <p className="text-lg text-quantized-silver/70 mb-6">
              Your device doesn't have camera access or your browser doesn't support camera features.
              Please ensure your device has a webcam and try using a modern browser.
            </p>
            <div className="text-sm text-quantized-silver/50 space-y-1">
              <div>DESKTOP: Ensure webcam is connected and enabled</div>
              <div>MOBILE: Use Chrome, Safari, or Firefox</div>
              <div>PERMISSIONS: Allow camera access when prompted</div>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 pt-24 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-quantized-silver mb-4 font-sans">
            AURA <span className="text-electric-cyan text-glow-cyan">AR EXPERIENCE</span>
          </h1>
          <p className="text-lg text-quantized-silver/70">
            Experience the transformer diagnostics in Augmented Reality
          </p>
        </div>

        {!arStatus.isActive ? (
          /* Permission Request Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-8 text-center"
          >
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-electric-cyan/10 border border-electric-cyan/30 flex items-center justify-center">
                <span className="text-3xl text-electric-cyan">AR</span>
              </div>
              <h2 className="text-2xl font-bold text-quantized-silver mb-4">
                WEBCAM ACCESS REQUIRED
              </h2>
              <p className="text-quantized-silver/70 mb-6 max-w-md mx-auto">
                To experience the AR transformer diagnostics, we need access to your webcam or camera. 
                The 3D model will be overlaid on your camera feed.
              </p>
            </div>

            {arStatus.error && (
              <div className="mb-6 p-4 rounded-lg bg-crimson/10 border border-crimson/30">
                <p className="text-crimson text-sm">
                  ERROR: {arStatus.error}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startAR}
                className="px-8 py-4 bg-electric-cyan text-void font-bold text-lg rounded-xl shadow-lg shadow-electric-cyan/50 hover:shadow-electric-cyan/70 transition-all duration-300"
              >
                ENABLE AR EXPERIENCE
              </motion.button>
              
              <div className="text-xs text-quantized-silver/50 space-y-1">
                <div>DESKTOP: Point webcam at your desk or workspace</div>
                <div>MOBILE: Point camera at a flat surface</div>
                <div>LIGHTING: Ensure good lighting conditions</div>
                <div>MOVEMENT: Move slowly for best experience</div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* AR Experience Screen */
          <div className="relative">
            {/* Camera Feed Container */}
            <div className="relative w-full h-[600px] rounded-xl overflow-hidden bg-black border border-electric-cyan/30 shadow-lg shadow-electric-cyan/20">
              {/* Webcam/Camera Feed */}
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
                autoPlay
              />
              
              {/* 3D AR Overlay */}
              <div className="absolute inset-0">
                <Canvas
                  camera={{ 
                    position: [0, 0, 2], 
                    fov: 75
                  }}
                  gl={{ alpha: true, antialias: true }}
                >
                  <Suspense fallback={null}>
                    {/* AR Lighting */}
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[2, 2, 1]} intensity={1} />
                    <pointLight position={[-2, 1, 1]} intensity={0.5} />
                    
                    {/* AR Transformer Model */}
                    <ARTransformerModel
                      selectedComponent={selectedComponent}
                      onComponentSelect={setSelectedComponent}
                      getStatusColor={getStatusColor}
                      getStatusIcon={getStatusIcon}
                    />
                  </Suspense>
                </Canvas>
              </div>

              {/* AR UI Overlays */}
              <div className="absolute top-4 left-4 bg-void/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-electric-cyan/40">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 bg-electric-cyan rounded-full animate-pulse"></div>
                  <span className="text-electric-cyan font-medium">AR ACTIVE</span>
                </div>
              </div>

              <div className="absolute top-4 right-4 bg-void/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-electric-cyan/40">
                <div className="text-xs text-quantized-silver/80 space-y-1">
                  <div>AURA TRANSFORMER DIAGNOSTICS</div>
                  <div className="text-electric-cyan font-medium">WEBCAM AR MODE</div>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 bg-void/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-electric-cyan/30">
                <div className="text-xs text-quantized-silver/80 space-y-1">
                  <div>DESKTOP: Click components with mouse</div>
                  <div>MOBILE: Tap components to select</div>
                  <div>CAMERA: Move to reposition view</div>
                </div>
              </div>
            </div>

            {/* Desktop/Mobile AR Controls */}
            <div className="mt-6 flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={stopAR}
                className="px-6 py-3 bg-crimson text-white font-bold rounded-xl shadow-lg shadow-crimson/30 hover:shadow-crimson/50 transition-all duration-300"
              >
                EXIT WEBCAM AR
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedComponent(null)}
                className="px-6 py-3 bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/50 font-bold rounded-xl hover:bg-electric-cyan/30 transition-all duration-300"
              >
                CLEAR SELECTION
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}