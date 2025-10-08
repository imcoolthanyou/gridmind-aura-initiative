"use client"

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Center, Html } from '@react-three/drei'
import { Group } from 'three'
import { motion } from "framer-motion"

interface TrainingComponent {
  id: string
  name: string
  status: "healthy" | "warning" | "critical" | "anomaly"
  position: { x: number; y: number; z: number }
  temperature?: number
  description?: string
  isObjective?: boolean
  isAnomaly?: boolean
}

// Training-specific components based on scenario
const getScenarioComponents = (scenario: string): TrainingComponent[] => {
  switch (scenario) {
    case 'basic_inspection':
      return [
        {
          id: "oil_tank",
          name: "Oil Tank",
          status: "healthy",
          position: { x: 0, y: -1.8, z: 0 },
          temperature: 45,
          description: "Main oil cooling reservoir",
          isObjective: true
        },
        {
          id: "radiators",
          name: "Cooling Radiators",
          status: "healthy",
          position: { x: -2, y: 0, z: 0 },
          temperature: 42,
          description: "Heat dissipation system",
          isObjective: true
        },
        {
          id: "tap_changer",
          name: "Tap Changer",
          status: "healthy",
          position: { x: 0, y: 2.5, z: 0 },
          temperature: 38,
          description: "Voltage regulation mechanism",
          isObjective: true
        },
        {
          id: "bushings",
          name: "HV Bushings",
          status: "healthy",
          position: { x: 0, y: 2, z: 0 },
          temperature: 35,
          description: "High voltage insulators",
          isObjective: true
        }
      ]
    
    case 'thermal_detection':
      return [
        {
          id: "thermal_sensor",
          name: "Thermal Sensor",
          status: "healthy",
          position: { x: 1, y: 1, z: 1 },
          temperature: 40,
          description: "Temperature monitoring system",
          isObjective: true
        },
        {
          id: "cooling_system",
          name: "Cooling System",
          status: "warning",
          position: { x: -2, y: 0, z: 0 },
          temperature: 85,
          description: "Active cooling mechanism",
          isObjective: true
        },
        {
          id: "overheating_winding",
          name: "Secondary Winding",
          status: "critical",
          position: { x: 1.5, y: 0, z: 0 },
          temperature: 127,
          description: "Overheating detected!",
          isAnomaly: true
        },
        {
          id: "oil_temp",
          name: "Oil Temperature",
          status: "warning",
          position: { x: 0, y: -1.8, z: 0 },
          temperature: 95,
          description: "Oil temperature monitoring",
          isObjective: true
        }
      ]
    
    case 'critical_fault':
      return [
        {
          id: "fault_detector",
          name: "Fault Detector",
          status: "critical",
          position: { x: 0, y: 1.5, z: 1 },
          description: "Critical fault detected",
          isObjective: true
        },
        {
          id: "protection_relay",
          name: "Protection Relay",
          status: "warning",
          position: { x: -1, y: 2, z: 0 },
          description: "Relay protection system",
          isObjective: true
        },
        {
          id: "electrical_fault",
          name: "Electrical Fault",
          status: "critical",
          position: { x: 1.5, y: 0, z: 0 },
          description: "Electrical fault location",
          isAnomaly: true
        },
        {
          id: "circuit_breaker",
          name: "Circuit Breaker",
          status: "healthy",
          position: { x: 0, y: 2.5, z: 0 },
          description: "Main circuit protection",
          isObjective: true
        }
      ]
    
    default:
      return []
  }
}

interface TrainingIndicatorProps {
  component: TrainingComponent
  isSelected: boolean
  onSelect: () => void
  isCompleted: boolean
  showHint: boolean
}

function TrainingIndicator({ 
  component, 
  isSelected, 
  onSelect, 
  isCompleted,
  showHint 
}: TrainingIndicatorProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "#10b981"
      case "warning": return "#FFBF00"
      case "critical": return "#DC2626"
      case "anomaly": return "#8B5CF6"
      default: return "#6b7280"
    }
  }

  const statusColor = getStatusColor(component.status)
  
  return (
    <Html
      position={[component.position.x, component.position.y + 0.8, component.position.z]}
      distanceFactor={6}
      occlude
      style={{ pointerEvents: 'auto' }}
    >
      <motion.div
        className="relative flex flex-col items-center"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Interactive Health Status Indicator */}
        <motion.div
          className={`
            w-8 h-8 rounded-full border-3 cursor-pointer relative backdrop-blur-sm
            ${component.isObjective ? 'ring-2 ring-electric-cyan/60' : ''}
            ${component.isAnomaly ? 'ring-2 ring-purple-500/60' : ''}
            ${isCompleted ? 'bg-emerald/40 border-emerald' : ''}
          `}
          style={{
            backgroundColor: isCompleted ? '#10b981' : `${statusColor}40`,
            borderColor: isCompleted ? '#10b981' : statusColor
          }}
          whileHover={{ scale: 1.2 }}
          onClick={onSelect}
          animate={{
            scale: isSelected ? [1, 1.3, 1] : 
                   component.status === "critical" || component.isAnomaly ? [1, 1.1, 1] : 1,
            boxShadow: [
              `0 0 10px ${statusColor}`,
              `0 0 20px ${statusColor}`,
              `0 0 10px ${statusColor}`
            ]
          }}
          transition={{
            duration: component.status === "critical" || component.isAnomaly ? 0.8 : 1.5,
            repeat: Infinity,
          }}
        >
          {/* Status Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            {isCompleted ? (
              <span className="text-white font-bold text-sm">✓</span>
            ) : component.isObjective ? (
              <span className="text-electric-cyan font-bold text-xs">•</span>
            ) : component.isAnomaly ? (
              <span className="text-purple-400 font-bold text-xs">!</span>
            ) : (
              <span style={{ color: statusColor }} className="text-xs font-bold">
                {component.status === "critical" ? "!" : 
                 component.status === "warning" ? "⚠" : "●"}
              </span>
            )}
          </div>

          {/* Pulse Effects for Critical/Anomaly */}
          {(component.status === "critical" || component.isAnomaly) && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: statusColor }}
                animate={{
                  scale: [1, 2.5, 2.5],
                  opacity: [1, 0, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: statusColor }}
                animate={{
                  scale: [1, 2, 2],
                  opacity: [0.8, 0, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 0.5,
                }}
              />
            </>
          )}

          {/* Completion Effect */}
          {isCompleted && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-emerald"
              animate={{
                scale: [1, 1.5, 1.5],
                opacity: [1, 0, 0],
              }}
              transition={{
                duration: 1,
                repeat: 3,
              }}
            />
          )}
        </motion.div>

        {/* Component Label */}
        <motion.div
          className="mt-2 text-xs text-center backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ delay: 0.5 }}
        >
          <div className={`px-2 py-1 rounded border shadow-lg text-xs ${
            isCompleted ? 'bg-emerald/20 border-emerald text-emerald' :
            component.isObjective ? 'bg-electric-cyan/20 border-electric-cyan text-electric-cyan' :
            component.isAnomaly ? 'bg-purple-500/20 border-purple-500 text-purple-400' :
            'bg-gray-900/80 border-gray-600/50 text-white'
          }`}>
            <span className="font-medium">{component.name}</span>
            {component.temperature && (
              <div className="text-xs opacity-80">{component.temperature}°C</div>
            )}
          </div>
        </motion.div>

        {/* Enhanced Tooltip */}
        {(isSelected || showHint) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-gray-900/95 backdrop-blur-md p-3 min-w-[200px] rounded-lg border border-gray-600/50 shadow-2xl z-50"
          >
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: statusColor }}
              />
              <span className="font-semibold text-white text-sm">{component.name}</span>
            </div>
            
            <p className="text-gray-300 text-xs mb-2">{component.description}</p>
            
            {component.temperature && (
              <div className="text-xs text-gray-400">
                Temperature: <span style={{ color: statusColor }}>{component.temperature}°C</span>
              </div>
            )}
            
            {component.isObjective && !isCompleted && (
              <div className="mt-2 text-xs text-electric-cyan font-medium">
                🎯 Mission Objective
              </div>
            )}
            
            {component.isAnomaly && (
              <div className="mt-2 text-xs text-purple-400 font-medium">
                🔍 Anomaly Detection Target
              </div>
            )}
            
            {isCompleted && (
              <div className="mt-2 text-xs text-emerald font-medium">
                ✅ Objective Complete!
              </div>
            )}
          </motion.div>
        )}

        {/* Hint Indicator */}
        {showHint && component.isObjective && !isCompleted && (
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          >
            <div className="w-4 h-4 bg-amber/80 rounded-full border border-amber flex items-center justify-center">
              <span className="text-xs">💡</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </Html>
  )
}

interface TrainingTransformerModel3DProps {
  selectedComponent: string | null
  onComponentSelect: (componentId: string) => void
  scenario: string
  gameState: {
    completedObjectives: Set<string>
    detectedAnomalies: string[]
  }
  showHints?: boolean
}

export default function TrainingTransformerModel3D({ 
  selectedComponent,
  onComponentSelect,
  scenario,
  gameState,
  showHints = false
}: TrainingTransformerModel3DProps) {
  const groupRef = useRef<Group>(null)
  const components = getScenarioComponents(scenario)
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05 // Slower rotation for training
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.03
    }
  })
  
  return (
    <Center>
      <group ref={groupRef}>
        {/* Base Transformer Model */}
        <>
          {/* Main Body */}
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
              emissiveIntensity={scenario === 'thermal_detection' ? 0.4 : 0.2}
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
          
          {/* Cooling Radiators */}
          <mesh position={[-2, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.3, 2, 1.5]} />
            <meshStandardMaterial 
              color="#666666" 
              metalness={0.8}
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
          
          {/* Tap Changer */}
          <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.6, 0.4, 0.6]} />
            <meshStandardMaterial 
              color="#8a8a8a" 
              metalness={0.7}
              roughness={0.2}
            />
          </mesh>
          
          {/* Oil tank indicator */}
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
        </>
        
        {/* Training-specific Interactive Indicators */}
        {components.map((component) => {
          const isCompleted = component.isObjective && 
            gameState.completedObjectives.has(`obj_${components.findIndex(c => c.id === component.id)}`)
          const isDetected = component.isAnomaly && 
            gameState.detectedAnomalies.includes(component.id)
          
          return (
            <TrainingIndicator
              key={component.id}
              component={component}
              isSelected={selectedComponent === component.id}
              onSelect={() => onComponentSelect(component.id)}
              isCompleted={!!(isCompleted || isDetected)}
              showHint={showHints}
            />
          )
        })}
      </group>
    </Center>
  )
}