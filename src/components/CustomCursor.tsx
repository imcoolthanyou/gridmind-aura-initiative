"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export default function CustomCursor() {
  const [isMounted, setIsMounted] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springConfig = { damping: 25, stiffness: 200 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    setIsMounted(true)

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    window.addEventListener("mousemove", moveCursor)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [cursorX, cursorY])

  if (!isMounted) return null

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 pointer-events-none z-[9999] mix-blend-screen"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={isClicking ? { scale: 0.8 } : { scale: 1 }}
      >
        <div className="w-full h-full bg-electric-cyan rounded-full glow-cyan" />
      </motion.div>

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9998] mix-blend-screen"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={isClicking ? { scale: 1.5 } : { scale: 1 }}
        transition={{ type: "spring", damping: 30, stiffness: 150 }}
      >
        <motion.div 
          className="w-full h-full border-2 border-electric-cyan/40 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      {/* Crosshair lines */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9997] mix-blend-screen"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        {/* Horizontal line */}
        <motion.div
          className="absolute h-px w-16 bg-gradient-to-r from-transparent via-electric-cyan to-transparent"
          animate={isClicking ? { scaleX: 1.5, opacity: 1 } : { scaleX: 1, opacity: 0.6 }}
        />
        {/* Vertical line */}
        <motion.div
          className="absolute w-px h-16 bg-gradient-to-b from-transparent via-electric-cyan to-transparent"
          animate={isClicking ? { scaleY: 1.5, opacity: 1 } : { scaleY: 1, opacity: 0.6 }}
        />
      </motion.div>

      {/* Enhanced trail particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed top-0 left-0 pointer-events-none z-[9996] mix-blend-screen"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            translateX: "-50%",
            translateY: "-50%",
          }}
          transition={{
            type: "spring",
            damping: 20 - i * 1.5,
            stiffness: 150 - i * 15,
          }}
        >
          <motion.div
            className="rounded-full"
            style={{
              width: (3 - i * 0.3) + "px",
              height: (3 - i * 0.3) + "px",
              backgroundColor: i % 2 === 0 ? "#00FFFF" : "#FF00FF",
              opacity: 0.6 - i * 0.07,
              boxShadow: `0 0 ${10 - i}px rgba(${i % 2 === 0 ? "0, 255, 255" : "255, 0, 255"}, ${0.8 - i * 0.1})`,
            }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        </motion.div>
      ))}

      {/* Orbital particles */}
      {[...Array(4)].map((_, i) => {
        const angle = (i / 4) * Math.PI * 2
        const radius = 20
        return (
          <motion.div
            key={`orbit-${i}`}
            className="fixed top-0 left-0 w-1.5 h-1.5 pointer-events-none z-[9995] mix-blend-screen"
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
              translateX: "-50%",
              translateY: "-50%",
            }}
          >
            <motion.div
              className="w-full h-full bg-electric-cyan rounded-full"
              animate={{
                x: Math.cos(angle) * radius + Math.cos(Date.now() * 0.001 + i) * 10,
                y: Math.sin(angle) * radius + Math.sin(Date.now() * 0.001 + i) * 10,
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                x: { duration: 2, repeat: Infinity, ease: "linear" },
                y: { duration: 2, repeat: Infinity, ease: "linear" },
                opacity: { duration: 1.5, repeat: Infinity, delay: i * 0.2 },
              }}
              style={{
                boxShadow: "0 0 8px rgba(0, 255, 255, 0.8)",
              }}
            />
          </motion.div>
        )
      })}
    </>
  )
}