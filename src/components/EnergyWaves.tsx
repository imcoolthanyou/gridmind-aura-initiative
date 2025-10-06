"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function EnergyWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

    class Wave {
      phase: number
      amplitude: number
      frequency: number
      speed: number
      color: string
      opacity: number
      yOffset: number

      constructor(index: number) {
        this.phase = Math.random() * Math.PI * 2
        this.amplitude = 80 + Math.random() * 40
        this.frequency = 0.002 + Math.random() * 0.001
        this.speed = 0.02 + Math.random() * 0.02
        this.yOffset = (canvas.height / 6) * (index + 1)
        this.opacity = 0.15 + Math.random() * 0.15
        
        const colors = [
          "0, 255, 255",      // Cyan
          "255, 0, 255",      // Magenta
          "255, 165, 0",      // Orange
          "255, 191, 0",      // Amber
        ]
        this.color = colors[index % colors.length]
      }

      draw(ctx: CanvasRenderingContext2D, time: number) {
        ctx.beginPath()
        ctx.moveTo(0, this.yOffset)

        for (let x = 0; x < canvas.width; x += 2) {
          const y = 
            this.yOffset +
            Math.sin(x * this.frequency + time * this.speed + this.phase) *
              this.amplitude +
            Math.sin(x * this.frequency * 2 + time * this.speed * 1.5) *
              (this.amplitude * 0.5)

          ctx.lineTo(x, y)
        }

        // Create gradient
        const gradient = ctx.createLinearGradient(0, this.yOffset - this.amplitude * 2, 0, this.yOffset + this.amplitude * 2)
        gradient.addColorStop(0, `rgba(${this.color}, 0)`)
        gradient.addColorStop(0.5, `rgba(${this.color}, ${this.opacity})`)
        gradient.addColorStop(1, `rgba(${this.color}, 0)`)

        ctx.strokeStyle = gradient
        ctx.lineWidth = 3
        ctx.stroke()

        // Add glow
        ctx.shadowBlur = 20
        ctx.shadowColor = `rgba(${this.color}, ${this.opacity * 0.8})`
        ctx.stroke()
        ctx.shadowBlur = 0
      }
    }

    // DNA Helix particles
    class HelixParticle {
      angle: number
      radius: number
      speed: number
      y: number
      size: number
      color: string
      pairIndex: number

      constructor(startAngle: number, pairIndex: number) {
        this.angle = startAngle
        this.radius = 150
        this.speed = 0.01
        this.y = canvas.height / 2
        this.size = 4
        this.pairIndex = pairIndex
        this.color = pairIndex % 2 === 0 ? "0, 255, 255" : "255, 0, 255"
      }

      update() {
        this.angle += this.speed
      }

      draw(ctx: CanvasRenderingContext2D) {
        const x = canvas.width / 2 + Math.cos(this.angle) * this.radius
        const z = Math.sin(this.angle) * this.radius
        const scale = (z + this.radius) / (this.radius * 2)
        const size = this.size * scale

        // Glow
        const gradient = ctx.createRadialGradient(x, this.y, 0, x, this.y, size * 4)
        gradient.addColorStop(0, `rgba(${this.color}, ${0.6 * scale})`)
        gradient.addColorStop(0.5, `rgba(${this.color}, ${0.3 * scale})`)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, this.y, size * 4, 0, Math.PI * 2)
        ctx.fill()

        // Core
        ctx.fillStyle = `rgba(${this.color}, ${scale})`
        ctx.beginPath()
        ctx.arc(x, this.y, size, 0, Math.PI * 2)
        ctx.fill()
      }

      getPairPosition(canvas: HTMLCanvasElement): { x: number; y: number } {
        const x = canvas.width / 2 + Math.cos(this.angle + Math.PI) * this.radius
        return { x, y: this.y }
      }
    }

    const waves: Wave[] = []
    for (let i = 0; i < 8; i++) {
      waves.push(new Wave(i))
    }

    const helixParticles: HelixParticle[] = []
    for (let i = 0; i < 20; i++) {
      helixParticles.push(new HelixParticle((i / 20) * Math.PI * 2, i))
    }

    let time = 0
    const animate = () => {
      time++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw waves
      waves.forEach((wave) => wave.draw(ctx, time))

      // Draw helix connections
      helixParticles.forEach((particle, i) => {
        if (i % 2 === 0 && i < helixParticles.length - 1) {
          const p1 = particle
          const p2 = helixParticles[i + 1]
          
          const x1 = canvas.width / 2 + Math.cos(p1.angle) * p1.radius
          const x2 = canvas.width / 2 + Math.cos(p2.angle) * p2.radius
          const y = canvas.height / 2

          const gradient = ctx.createLinearGradient(x1, y, x2, y)
          gradient.addColorStop(0, `rgba(${p1.color}, 0.2)`)
          gradient.addColorStop(1, `rgba(${p2.color}, 0.2)`)
          
          ctx.strokeStyle = gradient
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(x1, y)
          ctx.lineTo(x2, y)
          ctx.stroke()
        }
      })

      // Update and draw helix particles
      helixParticles.forEach((particle) => {
        particle.update()
        particle.draw(ctx)
      })

      animationFrame = requestAnimationFrame(animate)
    }

    let animationFrame = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", setCanvasSize)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 -z-15 w-full h-full opacity-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.3 }}
      transition={{ duration: 2 }}
    />
  )
}