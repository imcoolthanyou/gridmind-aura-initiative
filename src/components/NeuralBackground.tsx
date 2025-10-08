"use client"

import { useEffect, useRef } from "react"

export default function NeuralBackground() {
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

    // Neural network nodes
    class Node {
      x: number
      y: number
      vx: number
      vy: number
      connections: Node[]

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth
        this.y = Math.random() * canvasHeight
        this.vx = (Math.random() - 0.5) * 0.3
        this.vy = (Math.random() - 0.5) * 0.3
        this.connections = []
      }

      update(canvasWidth: number, canvasHeight: number) {
        this.x += this.vx
        this.y += this.vy

        if (this.x < 0 || this.x > canvasWidth) this.vx *= -1
        if (this.y < 0 || this.y > canvasHeight) this.vy *= -1
      }

      draw(ctx: CanvasRenderingContext2D) {
        // Draw node
        ctx.beginPath()
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(0, 255, 255, 0.4)"
        ctx.fill()

        // Draw connections
        this.connections.forEach((node) => {
          const dx = node.x - this.x
          const dy = node.y - this.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 200) {
            const opacity = (1 - distance / 200) * 0.15
            ctx.beginPath()
            ctx.moveTo(this.x, this.y)
            ctx.lineTo(node.x, node.y)
            ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })
      }
    }

    // Create nodes
    const nodes: Node[] = []
    const nodeCount = 50
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new Node(canvas.width, canvas.height))
    }

    // Connect nodes
    nodes.forEach((node, i) => {
      const connectionsCount = Math.floor(Math.random() * 3) + 2
      for (let j = 0; j < connectionsCount; j++) {
        const randomNode = nodes[Math.floor(Math.random() * nodes.length)]
        if (randomNode !== node && !node.connections.includes(randomNode)) {
          node.connections.push(randomNode)
        }
      }
    })

    // Grid overlay
    const drawGrid = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
      ctx.strokeStyle = "rgba(0, 255, 255, 0.03)"
      ctx.lineWidth = 1

      // Vertical lines
      for (let x = 0; x < canvasWidth; x += 50) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvasHeight)
        ctx.stroke()
      }

      // Horizontal lines
      for (let y = 0; y < canvasHeight; y += 50) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvasWidth, y)
        ctx.stroke()
      }
    }

    // Animation loop
    const animate = () => {
      ctx.fillStyle = "rgba(2, 8, 23, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      drawGrid(ctx, canvas.width, canvas.height)

      nodes.forEach((node) => {
        node.update(canvas.width, canvas.height)
        node.draw(ctx)
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
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 opacity-60"
    />
  )
}