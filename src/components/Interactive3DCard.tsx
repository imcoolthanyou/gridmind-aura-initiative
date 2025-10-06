"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ReactNode, useRef } from "react"

interface Interactive3DCardProps {
  children: ReactNode
  className?: string
}

export default function Interactive3DCard({
  children,
  className = "",
}: Interactive3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { damping: 30, stiffness: 200 })
  const mouseYSpring = useSpring(y, { damping: 30, stiffness: 200 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [15, -15])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-15, 15])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    x.set((e.clientX - centerX) / rect.width)
    y.set((e.clientY - centerY) / rect.height)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.05 }}
      className={`relative ${className}`}
    >
      <motion.div
        style={{
          transform: "translateZ(50px)",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </motion.div>

      {/* Spotlight effect */}
      <motion.div
        className="absolute inset-0 opacity-0 pointer-events-none rounded-lg"
        style={{
          background: useTransform(
            [mouseXSpring, mouseYSpring],
            ([latestX, latestY]) => {
              const xPercent = ((latestX as number) + 0.5) * 100
              const yPercent = ((latestY as number) + 0.5) * 100
              return `radial-gradient(circle at ${xPercent}% ${yPercent}%, rgba(0,255,255,0.3) 0%, transparent 50%)`
            }
          ),
        }}
        whileHover={{ opacity: 1 }}
      />
    </motion.div>
  )
}