"use client"

import { useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.5])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    // Particle system
    class Particle {
      x: number
      y: number
      z: number
      baseX: number
      baseY: number
      baseZ: number
      vx: number
      vy: number
      vz: number
      size: number
      targetX: number
      targetY: number
      targetZ: number
      isForming: boolean

      constructor() {
        this.x = Math.random() * canvas.width - canvas.width / 2
        this.y = Math.random() * canvas.height - canvas.height / 2
        this.z = Math.random() * 1000
        this.baseX = this.x
        this.baseY = this.y
        this.baseZ = this.z
        this.vx = (Math.random() - 0.5) * 0.5
        this.vy = (Math.random() - 0.5) * 0.5
        this.vz = (Math.random() - 0.5) * 0.5
        this.size = Math.random() * 2 + 1
        this.targetX = 0
        this.targetY = 0
        this.targetZ = 0
        this.isForming = false
      }

      update(scrollProgress: number) {
        if (scrollProgress > 0.1 && scrollProgress < 0.4) {
          // Form transformer shape
          this.isForming = true
          const formProgress = (scrollProgress - 0.1) / 0.3
          
          // Define transformer structure points
          const angle = (this.baseX + this.baseY) * 0.01
          this.targetX = Math.cos(angle) * 200 * Math.sin(formProgress * Math.PI)
          this.targetY = Math.sin(angle) * 200 * Math.sin(formProgress * Math.PI) - 100
          this.targetZ = (Math.random() - 0.5) * 100
          
          // Lerp to target
          this.x += (this.targetX - this.x) * 0.05
          this.y += (this.targetY - this.y) * 0.05
          this.z += (this.targetZ - this.z) * 0.05
        } else if (scrollProgress <= 0.1) {
          // Float freely
          this.isForming = false
          this.x += this.vx
          this.y += this.vy
          this.z += this.vz

          // Wrap around edges
          const halfWidth = canvas.width / 2
          const halfHeight = canvas.height / 2
          if (this.x > halfWidth) this.x = -halfWidth
          if (this.x < -halfWidth) this.x = halfWidth
          if (this.y > halfHeight) this.y = -halfHeight
          if (this.y < -halfHeight) this.y = halfHeight
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        const perspective = 600
        const scale = perspective / (perspective + this.z)
        const x2d = this.x * scale + canvas.width / 2
        const y2d = this.y * scale + canvas.height / 2
        const size = this.size * scale

        // Glow effect
        const gradient = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, size * 3)
        if (this.isForming) {
          gradient.addColorStop(0, "rgba(0, 255, 255, 0.8)")
          gradient.addColorStop(0.5, "rgba(0, 255, 255, 0.4)")
          gradient.addColorStop(1, "rgba(0, 255, 255, 0)")
        } else {
          gradient.addColorStop(0, "rgba(0, 255, 255, 0.6)")
          gradient.addColorStop(0.5, "rgba(0, 255, 255, 0.2)")
          gradient.addColorStop(1, "rgba(0, 255, 255, 0)")
        }

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x2d, y2d, size * 3, 0, Math.PI * 2)
        ctx.fill()

        // Core particle
        ctx.fillStyle = this.isForming
          ? "rgba(0, 255, 255, 1)"
          : "rgba(0, 255, 255, 0.8)"
        ctx.beginPath()
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Create particles
    const particles: Particle[] = []
    const particleCount = 500
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    let scrollProgress = 0
    const animate = () => {
      ctx.fillStyle = "rgba(2, 8, 23, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw connecting lines for formed particles
      if (scrollProgress > 0.15 && scrollProgress < 0.4) {
        ctx.strokeStyle = "rgba(0, 255, 255, 0.1)"
        ctx.lineWidth = 0.5
        particles.forEach((p1, i) => {
          particles.slice(i + 1, i + 5).forEach((p2) => {
            const dx = p1.x - p2.x
            const dy = p1.y - p2.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            if (distance < 150 && p1.isForming && p2.isForming) {
              const perspective = 600
              const scale1 = perspective / (perspective + p1.z)
              const scale2 = perspective / (perspective + p2.z)
              const x1 = p1.x * scale1 + canvas.width / 2
              const y1 = p1.y * scale1 + canvas.height / 2
              const x2 = p2.x * scale2 + canvas.width / 2
              const y2 = p2.y * scale2 + canvas.height / 2

              ctx.beginPath()
              ctx.moveTo(x1, y1)
              ctx.lineTo(x2, y2)
              ctx.stroke()
            }
          })
        })
      }

      particles.forEach((particle) => {
        particle.update(scrollProgress)
        particle.draw(ctx)
      })

      animationFrame = requestAnimationFrame(animate)
    }

    let animationFrame = requestAnimationFrame(animate)

    // Update scroll progress
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      scrollProgress = latest
    })

    return () => {
      window.removeEventListener("resize", setCanvasSize)
      cancelAnimationFrame(animationFrame)
      unsubscribe()
    }
  }, [scrollYProgress])

  return (
    <div ref={containerRef} className="fixed inset-0 -z-10">
      <motion.canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ opacity, scale }}
      />
    </div>
  )
}