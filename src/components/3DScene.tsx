"use client"

import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, Center } from '@react-three/drei'
import { Suspense, useRef, useState, useEffect } from 'react'
import { Group } from 'three'

// Model options
const MODEL_OPTIONS = [
  { name: 'Transformer Part 2', path: '/transformer-part-2.glb' },
  { name: 'Transformer Joined', path: '/transformerjoined.glb' }
]

interface ModelProps {
  modelPath: string
}

// Safe model loader component
function ModelLoader({ modelPath }: ModelProps) {
  const groupRef = useRef<Group>(null)
  
  // Always call useGLTF at the top level
  let modelData: any = null
  let hasError = false
  
  try {
    modelData = useGLTF(modelPath)
  } catch (err) {
    console.error('Error loading model:', err)
    hasError = true
  }
  
  // Animation hook - always called
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })
  
  // Log successful loading
  useEffect(() => {
    if (modelData?.scene) {
      console.log('Model loaded successfully:', modelPath)
      console.log('Nodes:', Object.keys(modelData.nodes || {}))
      console.log('Materials:', Object.keys(modelData.materials || {}))
    }
  }, [modelData, modelPath])
  
  // Return fallback if error or no model
  if (hasError || !modelData?.scene) {
    return <FallbackModel />
  }
  
  return (
    <Center>
      <group ref={groupRef} dispose={null}>
        <primitive 
          object={modelData.scene.clone()} 
          scale={0.8}
        />
      </group>
    </Center>
  )
}

// Fallback model component
function FallbackModel() {
  const groupRef = useRef<Group>(null)
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2
    }
  })
  
  return (
    <Center>
      <group ref={groupRef}>
        <mesh>
          <boxGeometry args={[2, 1, 1]} />
          <meshStandardMaterial 
            color="#00FFFF" 
            wireframe
            emissive="#00FFFF"
            emissiveIntensity={0.2}
          />
        </mesh>
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshStandardMaterial color="#FF00FF" />
        </mesh>
        <mesh position={[0, -1.5, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
          <meshStandardMaterial color="#FFA500" />
        </mesh>
      </group>
    </Center>
  )
}

// Main Model component
function Model({ modelPath }: ModelProps) {
  return <ModelLoader modelPath={modelPath} />
}

// Enhanced loading fallback with animation
function LoadingFallback() {
  const meshRef = useRef<Group>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })
  
  return (
    <group ref={meshRef}>
      <mesh>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial 
          color="#00FFFF" 
          wireframe 
          emissive="#00FFFF"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  )
}

// Main Scene component with model selector
export default function Scene() {
  const [selectedModel, setSelectedModel] = useState(MODEL_OPTIONS[0].path)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black relative border border-electric-cyan/20">
      {/* Model Selector Dropdown */}
      <div className="absolute top-4 left-4 z-10 pointer-events-auto">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-void/80 backdrop-blur-sm border border-electric-cyan/30 text-electric-cyan px-3 py-2 rounded-lg text-sm font-medium hover:bg-void/90 hover:border-electric-cyan/50 transition-all duration-200 flex items-center gap-2"
          >
            <span>🔧</span>
            {MODEL_OPTIONS.find(model => model.path === selectedModel)?.name || 'Select Model'}
            <span className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-void/90 backdrop-blur-sm border border-electric-cyan/30 rounded-lg shadow-lg overflow-hidden">
              {MODEL_OPTIONS.map((model) => (
                <button
                  key={model.path}
                  onClick={() => {
                    setSelectedModel(model.path)
                    setIsDropdownOpen(false)
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    selectedModel === model.path
                      ? 'bg-electric-cyan/20 text-electric-cyan'
                      : 'text-quantized-silver hover:bg-electric-cyan/10 hover:text-electric-cyan'
                  }`}
                >
                  {model.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Canvas
        camera={{ 
          position: [0, 0, 8], 
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <color attach="background" args={['#000000']} />
        
        <Suspense fallback={<LoadingFallback />}>
          {/* Enhanced Lighting Setup */}
          <ambientLight intensity={0.4} color="#ffffff" />
          
          {/* Key light */}
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={1.2} 
            color="#00FFFF"
            castShadow
          />
          
          {/* Fill light */}
          <directionalLight 
            position={[-5, -2, 3]} 
            intensity={0.8} 
            color="#FF00FF"
          />
          
          {/* Accent light */}
          <pointLight 
            position={[0, 3, 2]} 
            intensity={0.6} 
            color="#FFA500"
            distance={20}
          />
          
          {/* Rim light */}
          <pointLight 
            position={[0, -3, -5]} 
            intensity={0.4} 
            color="#00FFFF"
            distance={15}
          />

          {/* The Model with selected path */}
          <Model modelPath={selectedModel} />

          {/* Environment lighting */}
          <Environment 
            preset="night"
            background={false}
            intensity={0.2}
          />

          {/* Enhanced Controls */}
          <OrbitControls 
            autoRotate={false}
            autoRotateSpeed={0.5}
            enableZoom={true}
            enablePan={true}
            minDistance={3}
            maxDistance={15}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI - Math.PI / 6}
            dampingFactor={0.05}
            enableDamping
          />
        </Suspense>
      </Canvas>
      
      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Status indicator */}
        <div className="absolute top-4 right-4 bg-void/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-electric-cyan/30">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-electric-cyan">3D Model Active</span>
          </div>
        </div>
        
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-electric-cyan/20 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-electric-cyan/20 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-electric-cyan/20 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-electric-cyan/20 rounded-br-lg" />
        
        {/* Control instructions */}
        <div className="absolute bottom-4 left-4 bg-void/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-electric-cyan/20">
          <div className="text-xs text-quantized-silver/70 space-y-1">
            <div>🖱️ Click & Drag to Rotate</div>
            <div>🔍 Scroll to Zoom</div>
            <div>⌨️ Right-click & Drag to Pan</div>
          </div>
        </div>
      </div>
    </div>
  )
}
