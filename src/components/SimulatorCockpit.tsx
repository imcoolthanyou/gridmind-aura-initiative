"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Timer, 
  CheckCircle2, 
  Circle, 
  Target,
  Zap,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Eye,
  X,
  Home
} from "lucide-react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Center, Html, useGLTF } from "@react-three/drei"
import { useRef } from 'react'
import { Group } from 'three'

// 3D Transformer Scene Component - Using your actual transformer model
function Transformer3DScene({ 
  selectedComponent,
  onComponentSelect
}: {
  selectedComponent: string | null
  onComponentSelect: (componentId: string) => void
}) {
  const groupRef = useRef<Group>(null)
  
  // Load your actual transformer model
  let transformerModel = null
  try {
    const { scene } = useGLTF('/transformer-part-2.glb')
    transformerModel = scene
  } catch (error) {
    console.log('Loading fallback transformer model')
    try {
      const { scene } = useGLTF('/transformerjoined.glb')
      transformerModel = scene
    } catch (fallbackError) {
      console.log('Using basic transformer geometry')
    }
  }
  
  // Components data for the training scenario - positioned relative to your transformer
  const trainingComponents = [
    { id: 'oil_tank', name: 'Oil Tank', position: [0, -2, 0] as [number, number, number] },
    { id: 'radiators', name: 'Radiators', position: [-1.5, 0, 1] as [number, number, number] },
    { id: 'tap_changer', name: 'Tap Changer', position: [0, 2.5, 0] as [number, number, number] },
    { id: 'bushings', name: 'Bushings', position: [1.5, 2, 0] as [number, number, number] },
    { id: 'thermal_sensor', name: 'Thermal Sensor', position: [1, 0, -1] as [number, number, number] },
    { id: 'cooling_system', name: 'Cooling System', position: [-1, 0, -1] as [number, number, number] }
  ]
  
  return (
    <Center>
      <group ref={groupRef}>
        {/* Your Actual Transformer Model */}
        {transformerModel ? (
          <primitive 
            object={transformerModel.clone()} 
            scale={1.2}
            castShadow
            receiveShadow
          />
        ) : (
          // Fallback basic transformer if model fails to load
          <group>
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[3, 2.5, 1.5]} />
              <meshStandardMaterial 
                color="#2a2a2a" 
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
          </group>
        )}
        
        {/* Interactive Component Markers */}
        {trainingComponents.map((component) => (
          <group key={component.id} position={component.position}>
            {/* Clickable invisible sphere for interaction */}
            <mesh 
              onClick={() => onComponentSelect(component.id)}
              visible={false}
            >
              <sphereGeometry args={[0.4]} />
            </mesh>
            
            {/* Visual indicator */}
            <Html
              position={[0, 0.6, 0]}
              distanceFactor={8}
              occlude
              style={{ pointerEvents: 'auto' }}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 cursor-pointer transition-all duration-300 backdrop-blur-sm ${
                  selectedComponent === component.id 
                    ? 'bg-electric-cyan/80 border-electric-cyan scale-125 shadow-lg shadow-electric-cyan/70' 
                    : 'bg-quantized-silver/60 border-quantized-silver/80 hover:bg-electric-cyan/60 hover:border-electric-cyan'
                }`}
                onClick={() => onComponentSelect(component.id)}
                title={component.name}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-2 h-2 rounded-full ${
                    selectedComponent === component.id 
                      ? 'bg-electric-cyan animate-pulse' 
                      : 'bg-quantized-silver/80'
                  }`} />
                </div>
              </div>
            </Html>
          </group>
        ))}
      </group>
    </Center>
  )
}

interface TrainingMission {
  id: string
  title: string
  difficulty: number
  description: string
  duration: number
  xpReward: number
  objectives: string[]
  scenario: string
  isCompleted: boolean
  isLocked: boolean
}

interface SimulatorCockpitProps {
  mission: TrainingMission
  onMissionComplete: (score: number, xpGained: number) => void
  onReturnToHub: () => void
  onNotificationAdd: (type: string, title: string, message: string, xp?: number) => void
}

interface GameState {
  isActive: boolean
  timeRemaining: number
  currentScore: number
  completedObjectives: Set<string>
  detectedAnomalies: string[]
  selectedComponent: string | null
}

// Scenario-specific data
const scenarioData: Record<string, {
  components: string[]
  anomalies: string[]
  hints: string[]
}> = {
  basic_inspection: {
    components: ['oil_tank', 'radiators', 'tap_changer', 'bushings'],
    anomalies: [],
    hints: [
      "Look for the large cylindrical oil tank at the base",
      "Cooling radiators are usually on the sides",
      "Tap changer is typically at the top",
      "Bushings are the cylindrical insulators"
    ]
  },
  thermal_detection: {
    components: ['thermal_sensor', 'cooling_system', 'oil_temp', 'winding_temp'],
    anomalies: ['overheating_winding', 'cooling_failure'],
    hints: [
      "Use thermal imaging to scan for hotspots",
      "Check cooling system functionality",
      "Monitor oil temperature trends",
      "Examine winding temperature patterns"
    ]
  },
  critical_fault: {
    components: ['fault_detector', 'protection_relay', 'circuit_breaker', 'ground_connection'],
    anomalies: ['electrical_fault', 'insulation_breakdown', 'arc_formation'],
    hints: [
      "Identify the type of electrical fault",
      "Check protection relay status",
      "Verify circuit breaker operation",
      "Examine grounding connections"
    ]
  }
}

export default function SimulatorCockpit({ 
  mission, 
  onMissionComplete, 
  onReturnToHub,
  onNotificationAdd 
}: SimulatorCockpitProps) {
  const [gameState, setGameState] = useState<GameState>({
    isActive: false,
    timeRemaining: mission.duration * 60, // Convert to seconds
    currentScore: 0,
    completedObjectives: new Set(),
    detectedAnomalies: [],
    selectedComponent: null
  })

  const [hudVisible, setHudVisible] = useState(true)
  const [showHints, setShowHints] = useState(false)
  const [missionPhase, setMissionPhase] = useState<'briefing' | 'active' | 'completed'>('briefing')
  
  const scenario = scenarioData[mission.scenario as keyof typeof scenarioData] || scenarioData.basic_inspection

  // Timer countdown - FIXED: Simplified to prevent infinite reloading
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (gameState.isActive && gameState.timeRemaining > 0 && missionPhase === 'active') {
      interval = setInterval(() => {
        setGameState(prev => {
          const newTime = prev.timeRemaining - 1
          return {
            ...prev,
            timeRemaining: newTime
          }
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [gameState.isActive, gameState.timeRemaining, missionPhase])

  // Separate effect to handle mission completion
  useEffect(() => {
    if (gameState.timeRemaining === 0 && gameState.isActive) {
      setGameState(prev => ({ ...prev, isActive: false }))
      setMissionPhase('completed')
      
      // Calculate final score
      const objectiveScore = (gameState.completedObjectives.size / mission.objectives.length) * 700
      const timeBonus = 0 // No time bonus when time runs out
      const anomalyBonus = gameState.detectedAnomalies.length * 100
      const finalScore = Math.round(objectiveScore + timeBonus + anomalyBonus)
      
      const baseXP = mission.xpReward
      const performanceMultiplier = finalScore / 1000
      const xpGained = Math.round(baseXP * performanceMultiplier)
      
      onMissionComplete(finalScore, xpGained)
    }
  }, [gameState.timeRemaining, gameState.isActive, gameState.completedObjectives.size, gameState.detectedAnomalies.length, mission.objectives.length, mission.xpReward, onMissionComplete])

  // Start mission
  const startMission = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isActive: true
    }))
    setMissionPhase('active')
  }, [])

  // Pause/Resume mission
  const toggleMission = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isActive: !prev.isActive
    }))
  }, [])

  // Reset mission
  const resetMission = useCallback(() => {
    setGameState({
      isActive: false,
      timeRemaining: mission.duration * 60,
      currentScore: 0,
      completedObjectives: new Set(),
      detectedAnomalies: [],
      selectedComponent: null
    })
    setMissionPhase('briefing')
  }, [mission.duration])

  // Handle component interaction with gamified rewards - FIXED: Simplified to prevent infinite reloading
  const handleComponentClick = useCallback((componentId: string) => {
    if (!gameState.isActive || missionPhase !== 'active') return
    
    setGameState(prev => {
      const newState = { ...prev, selectedComponent: componentId }
      
      // Check if this component completes an objective
      const objectiveIndex = scenario.components.indexOf(componentId)
      if (objectiveIndex !== -1 && objectiveIndex < mission.objectives.length) {
        const objectiveId = `obj_${objectiveIndex}`
        if (!prev.completedObjectives.has(objectiveId)) {
          const xpReward = 100
          newState.completedObjectives = new Set([...prev.completedObjectives, objectiveId])
          newState.currentScore = prev.currentScore + xpReward
          
          // Gamified notification
          onNotificationAdd('objective_complete', 'OBJECTIVE COMPLETE!', mission.objectives[objectiveIndex], xpReward)
        }
      }
      
      // Check for anomaly detection with bonus XP
      if (scenario.anomalies.includes(componentId) && !prev.detectedAnomalies.includes(componentId)) {
        const bonusXP = 200
        newState.detectedAnomalies = [...prev.detectedAnomalies, componentId]
        newState.currentScore = newState.currentScore + bonusXP
        
        // Anomaly detection notification
        onNotificationAdd('anomaly_detected', 'ANOMALY DETECTED!', `Critical fault found: ${componentId}`, bonusXP)
      }
      
      return newState
    })
  }, [gameState.isActive, missionPhase, scenario.components, mission.objectives.length, mission.objectives, onNotificationAdd, scenario.anomalies])

  // Separate effect to handle mission completion when all objectives are done
  useEffect(() => {
    if (gameState.completedObjectives.size >= mission.objectives.length && 
        gameState.completedObjectives.size > 0 && 
        missionPhase === 'active') {
      setTimeout(() => {
        setGameState(prev => ({ ...prev, isActive: false }))
        setMissionPhase('completed')
        
        // Calculate final score
        const objectiveScore = (gameState.completedObjectives.size / mission.objectives.length) * 700
        const timeBonus = Math.max(0, (gameState.timeRemaining / (mission.duration * 60)) * 200)
        const anomalyBonus = gameState.detectedAnomalies.length * 100
        const finalScore = Math.round(objectiveScore + timeBonus + anomalyBonus)
        
        const baseXP = mission.xpReward
        const performanceMultiplier = finalScore / 1000
        const xpGained = Math.round(baseXP * performanceMultiplier)
        
        onMissionComplete(finalScore, xpGained)
      }, 1000)
    }
  }, [gameState.completedObjectives.size, mission.objectives.length, missionPhase, gameState.timeRemaining, mission.duration, gameState.detectedAnomalies.length, mission.xpReward, onMissionComplete])

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // HUD Overlay Component - Stabilized without continuous animations
  const HUDOverlay = () => (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Top HUD Bar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-auto">
        {/* Return to Hub Button */}
        <button
          onClick={onReturnToHub}
          className="flex items-center gap-2 px-4 py-2 bg-crimson/20 text-crimson border border-crimson/40 rounded-lg font-medium transition-all duration-300 hover:bg-crimson/30 hover:scale-105"
        >
          <X className="w-4 h-4" />
          <Home className="w-4 h-4" />
          Return to Hub
        </button>

        {/* Mission Info */}
        <div className="glass-panel p-3 max-w-md mx-4">
          <h3 className="text-sm font-semibold text-electric-cyan mb-1">{mission.title}</h3>
          <p className="text-xs text-quantized-silver/70">{mission.description}</p>
        </div>

        {/* Timer and Score */}
        <div className="flex gap-3">
          {/* Timer with gamified styling */}
          <div className="glass-panel p-3 min-w-[140px]">
            <div className="flex items-center gap-2 mb-1">
              <Timer className="w-4 h-4 text-electric-cyan" />
              <span className="text-sm font-semibold text-quantized-silver">Time</span>
            </div>
            <div className={`text-lg font-mono font-bold transition-colors duration-300 ${
              gameState.timeRemaining < 60 ? 'text-crimson animate-pulse' : 
              gameState.timeRemaining < 300 ? 'text-amber' : 'text-electric-cyan'
            }`}>
              {formatTime(gameState.timeRemaining)}
            </div>
            {/* Time bonus indicator */}
            {gameState.timeRemaining > (mission.duration * 60 * 0.8) && (
              <div className="text-xs text-emerald">Time Bonus Active!</div>
            )}
          </div>

          {/* Score with XP */}
          <div className="glass-panel p-3 min-w-[140px]">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-electric-cyan" />
              <span className="text-sm font-semibold text-quantized-silver">XP</span>
            </div>
            <div className="text-lg font-mono font-bold text-electric-cyan">
              {gameState.currentScore}
            </div>
            <div className="text-xs text-quantized-silver/60">
              Target: {mission.xpReward} XP
            </div>
          </div>
        </div>
      </div>

      {/* Objectives Checklist */}
      <div className="absolute top-4 right-4 w-80 pointer-events-auto">
        <div className="glass-panel p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-electric-cyan" />
            <span className="text-sm font-semibold text-quantized-silver">Mission Objectives</span>
            <span className="text-xs text-quantized-silver/60">
              ({gameState.completedObjectives.size}/{mission.objectives.length})
            </span>
          </div>
          
          <div className="space-y-2">
            {mission.objectives.map((objective, index) => {
              const objectiveId = `obj_${index}`
              const isCompleted = gameState.completedObjectives.has(objectiveId)
              
              return (
                <div
                  key={objectiveId}
                  className={`flex items-center gap-2 p-2 rounded transition-all duration-300 ${
                    isCompleted ? 'bg-emerald/10 border border-emerald/30' : 'bg-quantized-silver/5'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-quantized-silver/60 flex-shrink-0" />
                  )}
                  <span className={`text-xs ${
                    isCompleted ? 'text-emerald line-through' : 'text-quantized-silver/80'
                  }`}>
                    {objective}
                  </span>
                  {isCompleted && (
                    <span className="text-xs text-emerald font-bold ml-auto">
                      +100 XP
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-quantized-silver/60 mb-1">
              <span>Progress</span>
              <span>{Math.round((gameState.completedObjectives.size / mission.objectives.length) * 100)}%</span>
            </div>
            <div className="w-full bg-quantized-silver/20 rounded-full h-2">
              <div
                className="bg-electric-cyan h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${(gameState.completedObjectives.size / mission.objectives.length) * 100}%` 
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="absolute bottom-4 left-4 pointer-events-auto">
        <div className="glass-panel p-3">
          <div className="flex items-center gap-3">
            {missionPhase === 'briefing' ? (
              <button
                onClick={startMission}
                className="flex items-center gap-2 px-4 py-2 bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/40 rounded-lg font-medium transition-all duration-300 hover:bg-electric-cyan/30 hover:scale-105"
              >
                <Play className="w-4 h-4" />
                Start Mission
              </button>
            ) : (
              <>
                <button
                  onClick={toggleMission}
                  className="flex items-center gap-2 px-3 py-2 bg-amber/20 text-amber border border-amber/40 rounded-lg font-medium transition-all duration-300 hover:bg-amber/30 hover:scale-105"
                >
                  {gameState.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {gameState.isActive ? 'Pause' : 'Resume'}
                </button>
                
                <button
                  onClick={resetMission}
                  className="flex items-center gap-2 px-3 py-2 bg-crimson/20 text-crimson border border-crimson/40 rounded-lg font-medium transition-all duration-300 hover:bg-crimson/30 hover:scale-105"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </>
            )}
            
            <button
              onClick={() => setShowHints(!showHints)}
              className="flex items-center gap-2 px-3 py-2 bg-quantized-silver/20 text-quantized-silver border border-quantized-silver/40 rounded-lg font-medium transition-all duration-300 hover:bg-quantized-silver/30 hover:scale-105"
            >
              <Eye className="w-4 h-4" />
              Hints
            </button>
          </div>
        </div>
      </div>

      {/* Hints Panel */}
      {showHints && (
        <div className="absolute bottom-20 left-4 w-80 pointer-events-auto">
          <div className="glass-panel p-4">
            <h4 className="text-sm font-semibold text-quantized-silver mb-3">Mission Hints</h4>
            <div className="space-y-2">
              {scenario.hints.map((hint, index) => (
                <div key={index} className="text-xs text-quantized-silver/70 p-2 bg-quantized-silver/10 rounded">
                  {hint}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="h-full relative bg-gradient-to-br from-void via-void/95 to-electric-cyan/5">
      {/* 3D Scene */}
      <div className="h-full relative">
        <Canvas
          camera={{ 
            position: [8, 6, 8], 
            fov: 50
          }}
          gl={{ antialias: true, alpha: true }}
        >
          <color attach="background" args={['#1a1a2e']} />
          
          <Suspense fallback={null}>
            {/* Professional Lighting Setup */}
            <ambientLight intensity={0.3} color="#ffffff" />
            
            {/* Key light - Main illumination */}
            <directionalLight 
              position={[8, 8, 5]} 
              intensity={2.0} 
              color="#00FFFF"
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            
            {/* Fill light - Reduces harsh shadows */}
            <directionalLight 
              position={[-5, 3, 3]} 
              intensity={1.0} 
              color="#4169E1"
            />
            
            {/* Rim light - Creates depth and separation */}
            <directionalLight 
              position={[0, -5, -8]} 
              intensity={0.8} 
              color="#00CED1"
            />
            
            {/* Interactive point lights for drama */}
            <pointLight 
              position={[3, 4, 2]} 
              intensity={1.2} 
              color="#00FFFF"
              distance={15}
              decay={2}
            />
            
            <pointLight 
              position={[-3, 2, 4]} 
              intensity={0.8} 
              color="#FF00FF"
              distance={12}
              decay={2}
            />
            
            {/* Bottom accent light for industrial feel */}
            <pointLight 
              position={[0, -3, 2]} 
              intensity={0.6} 
              color="#FFA500"
              distance={10}
              decay={2}
            />
            
            {/* Focused spot light on transformer */}
            <spotLight
              position={[5, 10, 5]}
              angle={0.4}
              penumbra={0.3}
              intensity={1.5}
              color="#00FFFF"
              castShadow
              target-position={[0, 0, 0]}
            />

            {/* 3D Transformer Model - Only the 3D parts */}
            <Transformer3DScene 
              selectedComponent={gameState.selectedComponent}
              onComponentSelect={handleComponentClick}
            />

            {/* Enhanced Environment with fog and atmosphere */}
            <fog attach="fog" args={['#0f0f23', 8, 25]} />
            
            {/* Environment lighting for realism */}
            <Environment preset="night" background={false} environmentIntensity={0.4} />

            {/* Controls with better settings */}
            <OrbitControls 
              autoRotate={false}
              enableZoom={true}
              enablePan={true}
              minDistance={4}
              maxDistance={15}
              dampingFactor={0.05}
              enableDamping
              maxPolarAngle={Math.PI * 0.8}
              minPolarAngle={Math.PI * 0.2}
            />
          </Suspense>
        </Canvas>

        {/* Professional Scene Corner Accents */}
        <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-electric-cyan/60 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-electric-cyan/60 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-electric-cyan/60 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-electric-cyan/60 rounded-br-lg" />

        {/* 3D Scene Status Indicator */}
        <div className="absolute top-4 right-4 bg-void/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-electric-cyan/40 shadow-lg shadow-electric-cyan/20">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 bg-emerald rounded-full animate-pulse shadow-sm shadow-emerald"></div>
            <span className="text-emerald font-medium">3D TWIN ACTIVE</span>
          </div>
        </div>
        
        {/* Enhanced Control Instructions */}
        <div className="absolute bottom-4 left-4 bg-void/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-electric-cyan/30 shadow-lg">
          <div className="text-xs text-quantized-silver/80 space-y-1">
            <div><span className="text-electric-cyan font-medium">MOUSE:</span> Drag to rotate • Scroll to zoom</div>
            <div><span className="text-electric-cyan font-medium">CLICK:</span> Interactive components to complete objectives</div>
          </div>
        </div>

        {/* HUD Overlay */}
        <HUDOverlay />

        {/* Mission Completion Modal */}
        {missionPhase === 'completed' && (
          <div className="absolute inset-0 bg-void/80 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="glass-panel p-8 max-w-md w-full mx-4 text-center">
              <div className="w-16 h-16 bg-electric-cyan/20 border-2 border-electric-cyan rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-electric-cyan" />
              </div>
              
              <h3 className="text-xl font-bold text-quantized-silver mb-2">Mission Complete!</h3>
              <p className="text-quantized-silver/70 mb-6">{mission.title}</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-quantized-silver/60">Final Score:</span>
                  <span className="text-electric-cyan font-bold">{gameState.currentScore}/1000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-quantized-silver/60">Objectives:</span>
                  <span className="text-emerald font-bold">
                    {gameState.completedObjectives.size}/{mission.objectives.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-quantized-silver/60">XP Earned:</span>
                  <span className="text-amber font-bold">+{mission.xpReward} XP</span>
                </div>
              </div>
              
              <button
                onClick={resetMission}
                className="w-full px-4 py-3 bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/40 rounded-lg font-medium transition-all duration-300 hover:bg-electric-cyan/30 hover:scale-105"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}