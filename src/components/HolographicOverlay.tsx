"use client"

import { motion } from "framer-motion"

export default function HolographicOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden mix-blend-screen">
      {/* Scanning lines */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            rgba(0, 255, 255, 0.03) 0px,
            transparent 2px,
            transparent 4px,
            rgba(0, 255, 255, 0.03) 6px
          )`,
        }}
      />
      
      {/* Horizontal scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric-cyan to-transparent opacity-50"
        animate={{
          top: ["0%", "100%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          boxShadow: "0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(0, 255, 255, 0.4)",
        }}
      />

      {/* Vertical scan line */}
      <motion.div
        className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-magenta to-transparent opacity-30"
        animate={{
          left: ["0%", "100%"],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          boxShadow: "0 0 20px rgba(255, 0, 255, 0.6), 0 0 40px rgba(255, 0, 255, 0.3)",
        }}
      />

      {/* Corner scanners */}
      {[
        { top: 0, left: 0, rotate: 0 },
        { top: 0, right: 0, rotate: 90 },
        { bottom: 0, right: 0, rotate: 180 },
        { bottom: 0, left: 0, rotate: 270 },
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-32 h-32"
          style={{ ...pos }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            style={{ transform: `rotate(${pos.rotate}deg)` }}
          >
            <motion.path
              d="M 0 0 L 100 0 L 100 100"
              stroke="url(#cornerGradient)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
            <defs>
              <linearGradient id="cornerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(0, 255, 255, 0.8)" />
                <stop offset="50%" stopColor="rgba(255, 0, 255, 0.6)" />
                <stop offset="100%" stopColor="rgba(255, 165, 0, 0.4)" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      ))}

      {/* Vignette effect */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at center, transparent 0%, rgba(2, 8, 23, 0.3) 100%)",
        }}
      />

      {/* Chromatic aberration overlay */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(255, 0, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255, 165, 0, 0.05) 0%, transparent 50%)
          `,
        }}
      />
    </div>
  )
}