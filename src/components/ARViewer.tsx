"use client"

import { useRef, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, Center, Html } from '@react-three/drei'
import { Group, PerspectiveCamera } from 'three'
import { motion } from 'framer-motion'
import { RotateCcw, ZoomIn, ZoomOut, Move3D, X, Info } from 'lucide-react'
import { ARCalibration, ARTutorial, ARPerformanceMonitor, useARGestures, useDeviceOrientation } from './ARUtils'

// AR Camera Feed Component
function CameraFeed({ onCameraReady }: { onCameraReady: (stream: MediaStream) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        })
        
        setStream(mediaStream)
        onCameraReady(mediaStream)
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
          videoRef.current.play()
        }
        
        setIsLoading(false)
      } catch (err) {
        console.error('Camera access error:', err)
        setError('Failed to access camera. Please check permissions.')
        setIsLoading(false)
      }
    }

    startCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [onCameraReady])

  if (error) {
    return (
      <div className="absolute inset-0 bg-void flex items-center justify-center">
        <div className="text-center text-red-400">
          <p className="text-lg font-bold mb-2">Camera Error</p>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0">
      {isLoading && (
        <div className="absolute inset-0 bg-void flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-electric-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-quantized-silver">Starting camera...</p>
          </div>
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
        style={{ transform: 'scaleX(-1)' }} // Mirror for better UX
      />
    </div>
  )
}

// Enhanced AR Model Component
function ARTransformerModel({ position, scale, rotation }: { 
  position: [number, number, number]
  scale: number 
  rotation: [number, number, number]
}) {
  const groupRef = useRef<Group>(null)
  const [modelLoaded, setModelLoaded] = useState(false)
  
  // Try to load the transformer model, fallback to procedural model
  let modelData: any = null
  let hasError = false
  
  try {
    modelData = useGLTF('/transformer-part-2.glb')
    if (modelData.scene) {
      setModelLoaded(true)
    }
  } catch {
    hasError = true
  }

  // Subtle animation for the AR model
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
  })

  // Fallback procedural model if GLTF fails
  if (hasError || !modelData?.scene) {
    return (
      <group ref={groupRef} position={position} scale={scale} rotation={rotation}>
        {/* Main transformer body */}
        <mesh>
          <boxGeometry args={[2, 1.5, 1]} />
          <meshStandardMaterial 
            color="#1a1a2e" 
            metalness={0.8}
            roughness={0.2}
            emissive="#00FFFF"
            emissiveIntensity={0.1}
          />
        </mesh>
        
        {/* High voltage bushings */}
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.8, 8]} />
          <meshStandardMaterial 
            color="#FF6B6B" 
            metalness={0.9}
            roughness={0.1}
            emissive="#FF6B6B"
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* Cooling fins */}
        <mesh position={[-1.2, 0, 0]}>
          <boxGeometry args={[0.1, 1.2, 0.8]} />
          <meshStandardMaterial color="#4ECDC4" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[1.2, 0, 0]}>
          <boxGeometry args={[0.1, 1.2, 0.8]} />
          <meshStandardMaterial color="#4ECDC4" metalness={0.7} roughness={0.3} />
        </mesh>
        
        {/* Indicator lights */}
        <mesh position={[0.8, 0.5, 0.6]}>
          <sphereGeometry args={[0.05]} />
          <meshStandardMaterial 
            color="#00FF00" 
            emissive="#00FF00"
            emissiveIntensity={0.8}
          />
        </mesh>
        <mesh position={[0.8, 0.2, 0.6]}>
          <sphereGeometry args={[0.05]} />
          <meshStandardMaterial 
            color="#FFD700" 
            emissive="#FFD700"
            emissiveIntensity={0.8}
          />
        </mesh>
        
        {/* AR Info Label */}
        <Html
          position={[0, 2, 0]}
          center
          distanceFactor={6}
          occlude
        >
          <div className="bg-void/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-electric-cyan/50 text-center min-w-[200px]">
            <h3 className="text-electric-cyan font-bold text-sm mb-1">Power Transformer</h3>
            <div className="text-xs text-quantized-silver/80">
              <p>Status: <span className="text-green-400">Operational</span></p>
              <p>Load: <span className="text-yellow-400">75%</span></p>
              <p>Temp: <span className="text-blue-400">85°C</span></p>
            </div>
          </div>
        </Html>
      </group>
    )
  }

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={rotation}>
      <primitive object={modelData.scene.clone()} />
      <Html
        position={[0, 2, 0]}
        center
        distanceFactor={6}
        occlude
      >
        <div className="bg-void/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-electric-cyan/50 text-center min-w-[200px]">
          <h3 className="text-electric-cyan font-bold text-sm mb-1">GridMind Transformer</h3>
          <div className="text-xs text-quantized-silver/80">
            <p>Model: <span className="text-electric-cyan">Digital Twin</span></p>
            <p>Status: <span className="text-green-400">Active</span></p>
            <p>AI Analysis: <span className="text-yellow-400">Processing</span></p>
          </div>
        </div>
      </Html>
    </group>
  )
}

// AR Controls Component
function ARControls({ 
  onReset, 
  onScaleChange, 
  scale, 
  onClose 
}: { 
  onReset: () => void
  onScaleChange: (delta: number) => void
  scale: number
  onClose: () => void
}) {
  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
      <div className="flex items-center gap-2 bg-void/80 backdrop-blur-sm px-4 py-3 rounded-full border border-electric-cyan/30">
        <button
          onClick={() => onScaleChange(-0.1)}
          className="p-2 rounded-full bg-electric-cyan/20 hover:bg-electric-cyan/30 transition-colors"
          disabled={scale <= 0.2}
        >
          <ZoomOut className="w-4 h-4 text-electric-cyan" />
        </button>
        
        <button
          onClick={onReset}
          className="p-2 rounded-full bg-electric-cyan/20 hover:bg-electric-cyan/30 transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-electric-cyan" />
        </button>
        
        <button
          onClick={() => onScaleChange(0.1)}
          className="p-2 rounded-full bg-electric-cyan/20 hover:bg-electric-cyan/30 transition-colors"
          disabled={scale >= 2.0}
        >
          <ZoomIn className="w-4 h-4 text-electric-cyan" />
        </button>
        
        <div className="w-px h-6 bg-electric-cyan/30 mx-2" />
        
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors"
        >
          <X className="w-4 h-4 text-red-400" />
        </button>
      </div>
      
      <div className="text-center mt-2">
        <span className="text-xs text-quantized-silver/60 bg-void/60 px-2 py-1 rounded">
          Scale: {scale.toFixed(1)}x
        </span>
      </div>
    </div>
  )
}

// Main AR Viewer Component
export default function ARViewer() {
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [modelPosition, setModelPosition] = useState<[number, number, number]>([0, -1, -3])
  const [modelScale, setModelScale] = useState(1)
  const [modelRotation, setModelRotation] = useState<[number, number, number]>([0, 0, 0])
  const [showInstructions, setShowInstructions] = useState(true)
  const [showCalibration, setShowCalibration] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [calibrationComplete, setCalibrationComplete] = useState(false)

  const handleCameraReady = (stream: MediaStream) => {
    setCameraStream(stream)
    setShowCalibration(true)
    // Hide instructions after camera starts
    setTimeout(() => setShowInstructions(false), 3000)
  }
  
  const handleCalibrationComplete = () => {
    setShowCalibration(false)
    setCalibrationComplete(true)
    setShowTutorial(true)
  }
  
  const handleTutorialClose = () => {
    setShowTutorial(false)
  }

  const resetModel = () => {
    setModelPosition([0, -1, -3])
    setModelScale(1)
    setModelRotation([0, 0, 0])
  }

  const handleScaleChange = (delta: number) => {
    setModelScale(prev => Math.max(0.2, Math.min(2.0, prev + delta)))
  }

  // Gesture handling
  const handlePinch = (scale: number) => {
    setModelScale(prev => Math.max(0.2, Math.min(2.0, prev * scale)))
  }
  
  const handleRotateGesture = (rotation: number) => {
    setModelRotation(prev => [prev[0], prev[1] + rotation, prev[2]])
  }
  
  const isGesturing = useARGestures(handlePinch, handleRotateGesture)
  const orientation = useDeviceOrientation()
  
  const handleClose = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
    }
    // Navigate back or close AR view
    window.history.back()
  }

  return (
    <div className="relative w-full h-[80vh] rounded-xl overflow-hidden bg-black">
      {/* Camera Feed Background */}
      <CameraFeed onCameraReady={handleCameraReady} />
      
      {/* AR Overlay Canvas */}
      <div className="absolute inset-0 pointer-events-none">
        <Canvas
          camera={{
            position: [0, 0, 5],
            fov: 75,
            near: 0.1,
            far: 1000
          }}
          gl={{ 
            alpha: true, 
            antialias: true,
            powerPreference: "high-performance"
          }}
          style={{ background: 'transparent' }}
        >
          {/* Lighting for AR */}
          <ambientLight intensity={0.6} />
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={0.8}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight position={[-5, 5, 5]} intensity={0.4} color="#00FFFF" />
          
          <Suspense fallback={null}>
            <ARTransformerModel 
              position={modelPosition}
              scale={modelScale}
              rotation={modelRotation}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Instructions Overlay */}
      {showInstructions && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-4 left-4 right-4 z-10"
        >
          <div className="bg-void/90 backdrop-blur-sm p-4 rounded-lg border border-electric-cyan/30">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-5 h-5 text-electric-cyan" />
              <h3 className="font-bold text-electric-cyan">AR Instructions</h3>
            </div>
            <ul className="text-sm text-quantized-silver/80 space-y-1">
              <li>• Move your device to view the model from different angles</li>
              <li>• Use the controls below to scale and reset the model</li>
              <li>• The model will appear anchored in your physical space</li>
            </ul>
          </div>
        </motion.div>
      )}

      {/* AR Controls */}
      <div className="pointer-events-auto">
        <ARControls
          onReset={resetModel}
          onScaleChange={handleScaleChange}
          scale={modelScale}
          onClose={handleClose}
        />
      </div>

      {/* Performance Monitor */}
      {calibrationComplete && <ARPerformanceMonitor />}
      
      {/* Status Indicator */}
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-2 rounded-full text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>AR Active</span>
        </div>
      </div>
      
      {/* AR Calibration */}
      {showCalibration && (
        <ARCalibration onCalibrationComplete={handleCalibrationComplete} />
      )}
      
      {/* AR Tutorial */}
      {showTutorial && (
        <ARTutorial onClose={handleTutorialClose} />
      )}
      
      {/* Gesture Indicator */}
      {isGesturing && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-electric-cyan/20 text-electric-cyan px-4 py-2 rounded-full text-sm font-medium">
            Adjusting Model
          </div>
        </div>
      )}
    </div>
  )
}
