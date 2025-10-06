"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

interface Ripple {
  id: number
  x: number
  y: number
}

export default function RippleEffect() {
  const [ripples, setRipples] = useState<Ripple[]>([])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newRipple: Ripple = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      }
      setRipples((prev) => [...prev, newRipple])

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
      }, 1500)
    }

    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 200,
              height: 200,
              marginLeft: -100,
              marginTop: -100,
            }}
          >
            <div className="w-full h-full rounded-full border-4 border-electric-cyan shadow-[0_0_30px_rgba(0,255,255,0.6)]" />
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={`particle-${ripple.id}`}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute"
            style={{
              left: ripple.x,
              top: ripple.y,
            }}
          >
            {[...Array(12)].map((_, i) => {
              const angle = (i / 12) * Math.PI * 2
              const distance = 100
              return (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                  animate={{
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    scale: 0,
                    opacity: 0,
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute w-2 h-2 rounded-full bg-electric-cyan shadow-[0_0_10px_rgba(0,255,255,0.8)]"
                />
              )
            })}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}