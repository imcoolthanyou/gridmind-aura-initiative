"use client"

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Smartphone, Wifi, Battery, Signal } from 'lucide-react'

// Device orientation handler
export function useDeviceOrientation() {
  const [orientation, setOrientation] = useState({
    alpha: 0, // Z axis
    beta: 0,  // X axis
    gamma: 0  // Y axis
  })
  
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      setOrientation({
        alpha: event.alpha || 0,
        beta: event.beta || 0,
        gamma: event.gamma || 0
      })
    }

    if ('DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation)
      
      return () => {
        window.removeEventListener('deviceorientation', handleOrientation)
      }
    }
  }, [])

  return orientation
}

// Touch gesture handler for AR interactions
export function useARGestures(onPinch: (scale: number) => void, onRotate: (rotation: number) => void) {
  const [isGesturing, setIsGesturing] = useState(false)
  const [initialDistance, setInitialDistance] = useState(0)
  const [initialAngle, setInitialAngle] = useState(0)

  const getDistance = (touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const getAngle = (touch1: Touch, touch2: Touch) => {
    return Math.atan2(touch2.clientY - touch1.clientY, touch2.clientX - touch1.clientX)
  }

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      setIsGesturing(true)
      setInitialDistance(getDistance(e.touches[0], e.touches[1]))
      setInitialAngle(getAngle(e.touches[0], e.touches[1]))
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (isGesturing && e.touches.length === 2) {
      e.preventDefault()
      
      const currentDistance = getDistance(e.touches[0], e.touches[1])
      const currentAngle = getAngle(e.touches[0], e.touches[1])
      
      const scale = currentDistance / initialDistance
      const rotation = currentAngle - initialAngle
      
      onPinch(scale)
      onRotate(rotation)
    }
  }

  const handleTouchEnd = () => {
    setIsGesturing(false)
  }

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: false })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isGesturing, initialDistance, initialAngle])

  return isGesturing
}

// AR Performance Monitor
export function ARPerformanceMonitor() {
  const [fps, setFps] = useState(60)
  const [memoryUsage, setMemoryUsage] = useState(0)
  const frameCount = useRef(0)
  const lastTime = useRef(Date.now())

  useEffect(() => {
    const updatePerformance = () => {
      frameCount.current++
      const currentTime = Date.now()
      
      if (currentTime - lastTime.current >= 1000) {
        setFps(frameCount.current)
        frameCount.current = 0
        lastTime.current = currentTime
        
        // Memory usage (if available)
        if ('memory' in performance) {
          const memory = (performance as any).memory
          setMemoryUsage(Math.round(memory.usedJSHeapSize / 1048576)) // MB
        }
      }
      
      requestAnimationFrame(updatePerformance)
    }
    
    updatePerformance()
  }, [])

  return (
    <div className="absolute top-4 left-4 z-10">
      <div className="bg-void/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-electric-cyan/30 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Signal className="w-3 h-3 text-green-400" />
            <span className="text-quantized-silver">{fps} FPS</span>
          </div>
          {memoryUsage > 0 && (
            <div className="flex items-center gap-1">
              <Battery className="w-3 h-3 text-blue-400" />
              <span className="text-quantized-silver">{memoryUsage}MB</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// AR Calibration Component
export function ARCalibration({ onCalibrationComplete }: { onCalibrationComplete: () => void }) {
  const [step, setStep] = useState(1)
  const [isCalibrating, setIsCalibrating] = useState(false)

  const startCalibration = () => {
    setIsCalibrating(true)
    setStep(1)
    
    // Simulate calibration steps
    setTimeout(() => setStep(2), 1500)
    setTimeout(() => setStep(3), 3000)
    setTimeout(() => {
      setStep(4)
      setIsCalibrating(false)
      setTimeout(onCalibrationComplete, 1000)
    }, 4500)
  }

  const calibrationSteps = [
    { title: "Point at a flat surface", description: "Hold your device steady and point at the ground or a table" },
    { title: "Move slowly left and right", description: "Help the system understand your environment" },
    { title: "Detecting surfaces...", description: "AR tracking is initializing" },
    { title: "Calibration complete!", description: "Ready for AR experience" }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 bg-void/90 backdrop-blur-sm flex items-center justify-center z-20"
    >
      <div className="text-center max-w-md px-6">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Smartphone className="w-16 h-16 text-electric-cyan mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-electric-cyan mb-2">
            {calibrationSteps[step - 1].title}
          </h2>
          <p className="text-quantized-silver/80">
            {calibrationSteps[step - 1].description}
          </p>
        </motion.div>

        {step < 4 && (
          <div className="flex justify-center mb-6">
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i <= step ? 'bg-electric-cyan' : 'bg-quantized-silver/30'
                  } ${i === step ? 'animate-pulse' : ''}`}
                />
              ))}
            </div>
          </div>
        )}

        {!isCalibrating && step === 1 && (
          <button
            onClick={startCalibration}
            className="bg-electric-cyan text-void px-8 py-3 rounded-lg font-bold hover:bg-electric-cyan/80 transition-colors"
          >
            Start AR Calibration
          </button>
        )}

        {isCalibrating && (
          <div className="animate-spin w-8 h-8 border-2 border-electric-cyan border-t-transparent rounded-full mx-auto" />
        )}
      </div>
    </motion.div>
  )
}

// AR Tutorial Overlay
export function ARTutorial({ onClose }: { onClose: () => void }) {
  const [currentTip, setCurrentTip] = useState(0)
  
  const tips = [
    {
      title: "Move Around",
      description: "Walk around to view the model from different angles",
      icon: "🚶‍♂️"
    },
    {
      title: "Pinch to Scale",
      description: "Use pinch gestures to make the model bigger or smaller",
      icon: "🤏"
    },
    {
      title: "Tap to Interact",
      description: "Tap on different parts of the model for detailed information",
      icon: "👆"
    },
    {
      title: "Good Lighting",
      description: "Use AR in well-lit environments for better tracking",
      icon: "💡"
    }
  ]

  const nextTip = () => {
    if (currentTip < tips.length - 1) {
      setCurrentTip(currentTip + 1)
    } else {
      onClose()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="absolute bottom-20 left-4 right-4 z-20"
    >
      <div className="bg-void/90 backdrop-blur-sm p-6 rounded-xl border border-electric-cyan/30 max-w-sm mx-auto">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">{tips[currentTip].icon}</div>
          <h3 className="font-bold text-electric-cyan text-lg">{tips[currentTip].title}</h3>
          <p className="text-sm text-quantized-silver/80 mt-2">{tips[currentTip].description}</p>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {tips.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentTip ? 'bg-electric-cyan' : 'bg-quantized-silver/30'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={nextTip}
            className="bg-electric-cyan text-void px-4 py-2 rounded-lg text-sm font-medium hover:bg-electric-cyan/80 transition-colors"
          >
            {currentTip < tips.length - 1 ? 'Next' : 'Got it!'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
