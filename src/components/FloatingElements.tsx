"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useEffect, useState } from "react"
import { Cpu, Zap, Shield, Activity } from "lucide-react"

const elements = [
  { icon: Cpu, color: "electric-cyan", label: "Neural Core", x: 15, y: 20 },
  { icon: Zap, color: "magenta", label: "Quantum Processing", x: 75, y: 25 },
  { icon: Shield, color: "solar-orange", label: "Grid Shield", x: 20, y: 70 },
  { icon: Activity, color: "amber", label: "Live Metrics", x: 80, y: 75 },
]

export default function FloatingElements() {
  const [isMounted, setIsMounted] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    setIsMounted(true)
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  if (!isMounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
      {elements.map((element, index) => (
        <FloatingElement
          key={index}
          element={element}
          mouseX={mouseX}
          mouseY={mouseY}
          index={index}
        />
      ))}
    </div>
  )
}

function FloatingElement({
  element,
  mouseX,
  mouseY,
  index,
}: {
  element: typeof elements[0]
  mouseX: any
  mouseY: any
  index: number
}) {
  const Icon = element.icon
  
  const x = useTransform(mouseX, [0, window.innerWidth], [-30, 30])
  const y = useTransform(mouseY, [0, window.innerHeight], [-30, 30])
  
  const xSpring = useSpring(x, { damping: 50, stiffness: 100 })
  const ySpring = useSpring(y, { damping: 50, stiffness: 100 })

  return (
    <motion.div
      style={{
        left: `${element.x}%`,
        top: `${element.y}%`,
        x: xSpring,
        y: ySpring,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        rotateY: [0, 360],
        rotateX: [-10, 10, -10],
      }}
      transition={{
        opacity: { delay: index * 0.2, duration: 0.8 },
        scale: { delay: index * 0.2, duration: 0.8 },
        rotateY: { duration: 20, repeat: Infinity, ease: "linear", delay: index * 2 },
        rotateX: { duration: 5, repeat: Infinity, ease: "easeInOut" },
      }}
      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group cursor-pointer"
    >
      <motion.div
        whileHover={{ scale: 1.2, rotateZ: 10 }}
        whileTap={{ scale: 0.9 }}
        className="glass-panel p-6 border-2 relative"
        style={{
          borderColor: `var(--${element.color})`,
          boxShadow: `0 0 40px rgba(var(--${element.color}-rgb), 0.3)`,
        }}
      >
        <div className="relative">
          <Icon 
            className="w-8 h-8 group-hover:scale-110 transition-transform" 
            style={{ color: `var(--${element.color})` }}
          />
          <motion.div
            className="absolute inset-0 blur-xl opacity-50"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ backgroundColor: `var(--${element.color})` }}
          />
        </div>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="text-xs mt-2 text-quantized-silver whitespace-nowrap"
        >
          {element.label}
        </motion.p>

        {/* Pulsing border effect */}
        <motion.div
          className="absolute inset-0 rounded-lg border-2"
          style={{ borderColor: `var(--${element.color})` }}
          animate={{
            opacity: [0, 0.5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.3,
          }}
        />
      </motion.div>
    </motion.div>
  )
}