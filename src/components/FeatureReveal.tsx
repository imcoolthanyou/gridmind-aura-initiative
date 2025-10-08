"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Brain, Zap, Eye, Network } from "lucide-react"
import Interactive3DCard from "@/components/Interactive3DCard"

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}

const features: Feature[] = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: "AI-Driven Prognosis",
    description:
      "Advanced machine learning models predict transformer failures weeks in advance, enabling proactive maintenance and preventing catastrophic grid failures.",
    color: "electric-cyan",
  },
  {
    icon: <Network className="w-8 h-8" />,
    title: "Multi-Modal Data Fusion",
    description:
      "Seamlessly integrates FRA, acoustic, thermal, and DGA sensor data into a unified intelligence layer for comprehensive asset health analysis.",
    color: "magenta",
  },
  {
    icon: <Eye className="w-8 h-8" />,
    title: "Digital Twin Visualization",
    description:
      "Interactive 3D models mirror real-world transformer conditions in real-time, providing intuitive visualization of complex diagnostic data.",
    color: "solar-orange",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "AR Maintenance Overlay",
    description:
      "Augmented reality guidance overlays diagnostic data directly onto physical equipment, empowering field engineers with instant insights.",
    color: "amber",
  },
]

export default function FeatureReveal() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  return (
    <div ref={containerRef} className="relative py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold text-quantized-silver mb-6 font-sans">
            Revolutionary Capabilities
          </h2>
          <p className="text-xl text-quantized-silver/70 max-w-3xl mx-auto">
            GridMind transforms raw sensor data into actionable intelligence,
            safeguarding the world's energy infrastructure.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              feature={feature}
              index={index}
              scrollProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function FeatureCard({
  feature,
  index,
  scrollProgress,
}: {
  feature: Feature
  index: number
  scrollProgress: any
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: cardProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "center center"],
  })

  const opacity = useTransform(cardProgress, [0, 0.5], [0, 1])
  const y = useTransform(cardProgress, [0, 0.5], [100, 0])
  const pathLength = useTransform(cardProgress, [0.3, 0.8], [0, 1])

  return (
    <motion.div
      ref={cardRef}
      style={{ opacity, y }}
      className="relative group"
    >
      <Interactive3DCard>
        <div className="glass-panel p-8 hover:glass-panel-bright transition-all duration-500 relative overflow-hidden">
          {/* Neural pathway SVG */}
          <svg
            className="absolute -left-20 top-1/2 -translate-y-1/2 w-20 h-2 overflow-visible hidden lg:block"
            viewBox="0 0 80 2"
          >
            <motion.path
              d="M 0 1 L 80 1"
              stroke={`var(--${feature.color})`}
              strokeWidth="2"
              fill="none"
              style={{ pathLength }}
              className="drop-shadow-[0_0_8px_var(--electric-cyan)]"
            />
            <motion.circle
              cy="1"
              r="3"
              fill={`var(--${feature.color})`}
              animate={{ cx: [0, 80, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="drop-shadow-[0_0_12px_var(--electric-cyan)]"
            />
          </svg>

          <motion.div
            className={`inline-flex p-4 rounded-xl bg-${feature.color}/10 mb-6 relative`}
            whileHover={{ scale: 1.15, rotateZ: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className={`text-${feature.color}`} style={{ color: `var(--${feature.color})` }}>
              {feature.icon}
            </div>
            
            {/* Animated ring */}
            <motion.div
              className="absolute inset-0 rounded-xl border-2"
              style={{ borderColor: `var(--${feature.color})` }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          <h3
            className="text-2xl font-bold mb-4 font-sans group-hover:text-glow-cyan transition-all duration-300"
            style={{ color: `var(--${feature.color})` }}
          >
            {feature.title}
          </h3>

          <p className="text-quantized-silver/80 leading-relaxed">
            {feature.description}
          </p>

          {/* Animated corner accents */}
          <motion.div
            className="absolute bottom-0 right-0 w-20 h-20 opacity-20 group-hover:opacity-40 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at bottom right, var(--${feature.color}) 0%, transparent 70%)`,
            }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Floating particles effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{ backgroundColor: `var(--${feature.color})` }}
                animate={{
                  x: [0, Math.random() * 100 - 50],
                  y: [0, -100],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeOut",
                }}
                initial={{
                  left: `${Math.random() * 100}%`,
                  bottom: 0,
                }}
              />
            ))}
          </div>
        </div>
      </Interactive3DCard>
    </motion.div>
  )
}