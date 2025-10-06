"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export default function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-6 pt-32 pb-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-electric-cyan/30 mb-8"
          >
            <Sparkles className="w-4 h-4 text-electric-cyan" />
            <span className="text-sm text-electric-cyan font-medium">
              AURA Initiative • Next-Gen Grid Intelligence
            </span>
          </motion.div>

          {/* Main headline with chromatic aberration effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <h1 className="text-7xl md:text-8xl font-bold text-quantized-silver mb-4 font-sans leading-tight">
              <span className="inline-block">Predict the</span>{" "}
              <motion.span 
                className="text-electric-cyan text-glow-cyan inline-block"
                animate={{
                  textShadow: [
                    "0 0 10px rgba(0,255,255,0.5), 0 0 20px rgba(0,255,255,0.3)",
                    "0 0 20px rgba(0,255,255,0.8), 0 0 40px rgba(0,255,255,0.5)",
                    "0 0 10px rgba(0,255,255,0.5), 0 0 20px rgba(0,255,255,0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                Failure.
              </motion.span>
            </h1>
            <h1 className="text-7xl md:text-8xl font-bold text-quantized-silver font-sans leading-tight">
              <span className="inline-block">Prevent the</span>{" "}
              <motion.span 
                className="text-magenta inline-block"
                animate={{
                  textShadow: [
                    "0 0 10px rgba(255,0,255,0.5), 0 0 20px rgba(255,0,255,0.3)",
                    "0 0 20px rgba(255,0,255,0.8), 0 0 40px rgba(255,0,255,0.5)",
                    "0 0 10px rgba(255,0,255,0.5), 0 0 20px rgba(255,0,255,0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                Blackout.
              </motion.span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-xl md:text-2xl text-quantized-silver/80 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Transform critical power transformers into living, intelligent
            Digital Twins. GridMind leverages multi-modal AI to move beyond
            diagnostics to a{" "}
            <span className="text-electric-cyan font-semibold">
              proactive command center
            </span>{" "}
            for the future of energy infrastructure.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/diagnostics">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-electric-cyan text-void font-bold text-lg rounded-xl overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    background: [
                      "linear-gradient(45deg, #00FFFF 0%, #FF00FF 50%, #00FFFF 100%)",
                      "linear-gradient(45deg, #FF00FF 0%, #00FFFF 50%, #FF00FF 100%)",
                      "linear-gradient(45deg, #00FFFF 0%, #FF00FF 50%, #00FFFF 100%)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                <span className="relative z-10 flex items-center gap-2">
                  Enter the Command Center
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </span>

                {/* Particle burst on hover */}
                <motion.div 
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  {[...Array(12)].map((_, i) => {
                    const angle = (i / 12) * Math.PI * 2
                    return (
                      <motion.div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full"
                        animate={{
                          x: Math.cos(angle) * 50,
                          y: Math.sin(angle) * 50,
                          opacity: [1, 0],
                          scale: [1, 0],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                      />
                    )
                  })}
                </motion.div>
              </motion.button>
            </Link>

            <Link href="/technology">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-8 py-4 glass-panel border-electric-cyan/30 text-quantized-silver font-bold text-lg rounded-xl overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-electric-cyan/10"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                
                <span className="relative z-10">Explore Technology</span>

                {/* Border animation */}
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{ 
                    border: "2px solid transparent",
                    backgroundImage: "linear-gradient(var(--void), var(--void)), linear-gradient(45deg, #00FFFF, #FF00FF, #FFA500)",
                    backgroundOrigin: "border-box",
                    backgroundClip: "padding-box, border-box",
                  }}
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            {[
              { value: "99.8%", label: "Prediction Accuracy" },
              { value: "70%", label: "Downtime Reduction" },
              { value: "5x", label: "Asset Life Extension" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="glass-panel p-6 border-electric-cyan/20 hover:border-electric-cyan/40 transition-all duration-300 relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-electric-cyan/20 via-magenta/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                <motion.div 
                  className="text-4xl font-bold text-electric-cyan text-glow-cyan mb-2 relative z-10"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3,
                  }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-quantized-silver/70 uppercase tracking-wide relative z-10">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-electric-cyan/60"
        >
          <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-electric-cyan/40 rounded-full p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-electric-cyan rounded-full mx-auto"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}