"use client"

import { useEffect, useRef, memo } from "react"
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion"

const EnhancedParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
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

    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    let currentMouseX = 0
    let currentMouseY = 0

    const handleMouseMove = (e: MouseEvent) => {
      currentMouseX = e.clientX
      currentMouseY = e.clientY
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener("mousemove", handleMouseMove)

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
      color: string
      orbitAngle: number
      orbitSpeed: number

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth - canvasWidth / 2
        this.y = Math.random() * canvasHeight - canvasHeight / 2
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
        this.orbitAngle = Math.random() * Math.PI * 2
        this.orbitSpeed = 0.001 + Math.random() * 0.002
        
        const colors = ["0,255,255", "255,0,255", "255,165,0"]
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update(scrollProgress: number, mouseX: number, mouseY: number, canvasWidth: number, canvasHeight: number) {
        // Mouse interaction
        const dx = this.x - (mouseX - canvasWidth / 2)
        const dy = this.y - (mouseY - canvasHeight / 2)
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 200

        if (distance < maxDistance) {
          const force = (1 - distance / maxDistance) * 0.5
          this.vx += (dx / distance) * force
          this.vy += (dy / distance) * force
        }

        if (scrollProgress > 0.1 && scrollProgress < 0.4) {
          this.isForming = true
          const formProgress = (scrollProgress - 0.1) / 0.3
          
          // Create transformer structure with orbital elements
          this.orbitAngle += this.orbitSpeed
          const angle = (this.baseX + this.baseY) * 0.01
          const orbitRadius = 200 * Math.sin(formProgress * Math.PI)
          
          this.targetX = Math.cos(angle + this.orbitAngle) * orbitRadius
          this.targetY = Math.sin(angle + this.orbitAngle) * orbitRadius - 100
          this.targetZ = Math.cos(this.orbitAngle * 2) * 50
          
          this.x += (this.targetX - this.x) * 0.05
          this.y += (this.targetY - this.y) * 0.05
          this.z += (this.targetZ - this.z) * 0.05
        } else if (scrollProgress <= 0.1) {
          this.isForming = false
          this.x += this.vx
          this.y += this.vy
          this.z += this.vz

          // Apply damping
          this.vx *= 0.99
          this.vy *= 0.99

          const halfWidth = canvasWidth / 2
          const halfHeight = canvasHeight / 2
          if (this.x > halfWidth) this.x = -halfWidth
          if (this.x < -halfWidth) this.x = halfWidth
          if (this.y > halfHeight) this.y = -halfHeight
          if (this.y < -halfHeight) this.y = halfHeight
        }
      }

      draw(ctx: CanvasRenderingContext2D, time: number, canvasWidth: number, canvasHeight: number) {
        const perspective = 600
        const scale = perspective / (perspective + this.z)
        const x2d = this.x * scale + canvasWidth / 2
        const y2d = this.y * scale + canvasHeight / 2
        const size = this.size * scale

        if (size < 0) return; // Don't draw if behind camera

        // Pulsing effect
        const pulse = Math.sin(time * 0.003 + this.baseX * 0.01) * 0.3 + 0.7

        // Simplified single-layer glow
        const glowSize = size * 5
        const gradient = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, glowSize)
        const alpha = this.isForming ? 0.5 : 0.3
        gradient.addColorStop(0, `rgba(${this.color}, ${alpha * pulse})`)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x2d, y2d, glowSize, 0, Math.PI * 2)
        ctx.fill()

        // Core particle
        ctx.fillStyle = `rgba(${this.color}, ${this.isForming ? 1 : 0.8 * pulse})`
        ctx.beginPath()
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const particles: Particle[] = []
    const particleCount = 200
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas.width, canvas.height))
    }

    let scrollProgress = 0
    let time = 0
    const animate = () => {
      time++
      ctx.fillStyle = "rgba(2, 8, 23, 0.08)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Energy lines between forming particles
      /* if (scrollProgress > 0.15 && scrollProgress < 0.4) {
        ctx.strokeStyle = "rgba(0, 255, 255, 0.15)"
        ctx.lineWidth = 0.5
        particles.forEach((p1, i) => {
          if (i % 3 !== 0) return
          particles.slice(i + 1, i + 4).forEach((p2) => {
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

              const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
              gradient.addColorStop(0, `rgba(${p1.color}, 0.3)`)
              gradient.addColorStop(0.5, "rgba(255, 0, 255, 0.3)")
              gradient.addColorStop(1, `rgba(${p2.color}, 0.3)`)
              ctx.strokeStyle = gradient

              ctx.beginPath()
              ctx.moveTo(x1, y1)
              ctx.lineTo(x2, y2)
              ctx.stroke()
            }
          })
        })
      } */

      particles.forEach((particle) => {
        particle.update(scrollProgress, currentMouseX, currentMouseY, canvas.width, canvas.height)
        particle.draw(ctx, time, canvas.width, canvas.height)
      })

      animationFrame = requestAnimationFrame(animate)
    }

    let animationFrame = requestAnimationFrame(animate)

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      scrollProgress = latest
    })

    return () => {
      window.removeEventListener("resize", setCanvasSize)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrame)
      unsubscribe()
    }
  }, [scrollYProgress, mouseX, mouseY])

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

export default memo(EnhancedParticleField)