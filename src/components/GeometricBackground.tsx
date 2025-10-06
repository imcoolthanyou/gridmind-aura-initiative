"use client"

import { useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export default function GeometricBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const mouseXSpring = useSpring(mouseX, { damping: 50, stiffness: 100 })
  const mouseYSpring = useSpring(mouseY, { damping: 50, stiffness: 100 })

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

    let mouseXPos = 0
    let mouseYPos = 0
    const unsubscribeX = mouseXSpring.on("change", (latest) => {
      mouseXPos = latest
    })
    const unsubscribeY = mouseYSpring.on("change", (latest) => {
      mouseYPos = latest
    })

    // 3D Grid System
    class GridNode {
      x: number
      y: number
      z: number
      originalZ: number
      connections: GridNode[]

      constructor(x: number, y: number, z: number) {
        this.x = x
        this.y = y
        this.z = z
        this.originalZ = z
        this.connections = []
      }

      update(time: number, mouseX: number, mouseY: number) {
        const dx = this.x - mouseX
        const dy = this.y - mouseY
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 300
        
        if (distance < maxDistance) {
          const influence = 1 - distance / maxDistance
          this.z = this.originalZ + Math.sin(time * 0.002 + distance * 0.01) * 100 * influence
        } else {
          this.z += (this.originalZ - this.z) * 0.1
        }
      }

      project(canvas: HTMLCanvasElement) {
        const perspective = 800
        const scale = perspective / (perspective + this.z)
        return {
          x: this.x * scale + canvas.width / 2,
          y: this.y * scale + canvas.height / 2,
          scale,
        }
      }
    }

    // Create grid
    const gridSize = 15
    const spacing = 80
    const nodes: GridNode[] = []

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const x = (i - gridSize / 2) * spacing
        const y = (j - gridSize / 2) * spacing
        const z = Math.sin(i * 0.5) * Math.cos(j * 0.5) * 50
        const node = new GridNode(x, y, z)
        nodes.push(node)

        // Connect to adjacent nodes
        if (i > 0) {
          const leftNode = nodes[nodes.length - gridSize - 1]
          node.connections.push(leftNode)
        }
        if (j > 0) {
          const topNode = nodes[nodes.length - 2]
          node.connections.push(topNode)
        }
      }
    }

    // Floating orbs
    class Orb {
      x: number
      y: number
      z: number
      radius: number
      speed: number
      angle: number
      orbitRadius: number

      constructor() {
        this.angle = Math.random() * Math.PI * 2
        this.orbitRadius = 200 + Math.random() * 300
        this.x = Math.cos(this.angle) * this.orbitRadius
        this.y = Math.sin(this.angle) * this.orbitRadius
        this.z = Math.random() * 200 - 100
        this.radius = 20 + Math.random() * 30
        this.speed = 0.0005 + Math.random() * 0.001
      }

      update(time: number) {
        this.angle += this.speed
        this.x = Math.cos(this.angle) * this.orbitRadius
        this.y = Math.sin(this.angle) * this.orbitRadius
        this.z = Math.sin(time * 0.001 + this.angle) * 100
      }

      draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        const perspective = 800
        const scale = perspective / (perspective + this.z)
        const x2d = this.x * scale + canvas.width / 2
        const y2d = this.y * scale + canvas.height / 2
        const radius2d = this.radius * scale

        const gradient = ctx.createRadialGradient(
          x2d,
          y2d,
          0,
          x2d,
          y2d,
          radius2d * 2
        )
        gradient.addColorStop(0, "rgba(0, 255, 255, 0.4)")
        gradient.addColorStop(0.3, "rgba(255, 0, 255, 0.2)")
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x2d, y2d, radius2d * 2, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = `rgba(0, 255, 255, ${0.6 * scale})`
        ctx.beginPath()
        ctx.arc(x2d, y2d, radius2d, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const orbs: Orb[] = []
    for (let i = 0; i < 5; i++) {
      orbs.push(new Orb())
    }

    // Animation loop
    let time = 0
    const animate = () => {
      time++
      ctx.fillStyle = "rgba(2, 8, 23, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update nodes
      nodes.forEach((node) => {
        node.update(time, mouseXPos, mouseYPos)
      })

      // Draw grid connections
      nodes.forEach((node) => {
        const pos = node.project(canvas)
        node.connections.forEach((connectedNode) => {
          const connectedPos = connectedNode.project(canvas)
          
          const gradient = ctx.createLinearGradient(
            pos.x,
            pos.y,
            connectedPos.x,
            connectedPos.y
          )
          const alpha = Math.min(pos.scale, connectedPos.scale) * 0.3
          gradient.addColorStop(0, `rgba(0, 255, 255, ${alpha})`)
          gradient.addColorStop(0.5, `rgba(255, 0, 255, ${alpha * 0.5})`)
          gradient.addColorStop(1, `rgba(0, 255, 255, ${alpha})`)

          ctx.strokeStyle = gradient
          ctx.lineWidth = 1 * pos.scale
          ctx.beginPath()
          ctx.moveTo(pos.x, pos.y)
          ctx.lineTo(connectedPos.x, connectedPos.y)
          ctx.stroke()
        })
      })

      // Draw nodes
      nodes.forEach((node) => {
        const pos = node.project(canvas)
        const size = 3 * pos.scale

        const gradient = ctx.createRadialGradient(
          pos.x,
          pos.y,
          0,
          pos.x,
          pos.y,
          size * 3
        )
        gradient.addColorStop(0, `rgba(0, 255, 255, ${0.8 * pos.scale})`)
        gradient.addColorStop(0.5, `rgba(0, 255, 255, ${0.3 * pos.scale})`)
        gradient.addColorStop(1, "rgba(0, 255, 255, 0)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, size * 3, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = `rgba(0, 255, 255, ${pos.scale})`
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Update and draw orbs
      orbs.forEach((orb) => {
        orb.update(time)
        orb.draw(ctx, canvas)
      })

      animationFrame = requestAnimationFrame(animate)
    }

    let animationFrame = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", setCanvasSize)
      cancelAnimationFrame(animationFrame)
      unsubscribeX()
      unsubscribeY()
    }
  }, [mouseXSpring, mouseYSpring])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2)
      mouseY.set(e.clientY - window.innerHeight / 2)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 -z-20 w-full h-full opacity-40"
    />
  )
}