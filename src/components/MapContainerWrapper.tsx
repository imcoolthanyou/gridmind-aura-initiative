"use client"

import { useEffect, useRef, useState } from "react"

interface MapContainerWrapperProps {
  children: React.ReactNode
  onReady?: () => void
}

export default function MapContainerWrapper({ children, onReady }: MapContainerWrapperProps) {
  const [containerId] = useState(() => `map-container-${Date.now()}-${Math.random()}`)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    let mounted = true
    let timeoutId: NodeJS.Timeout
    
    const initContainer = () => {
      if (!mounted || !containerRef.current) return
      
      try {
        // Ensure container is clean and ready
        const container = containerRef.current
        
        // Only clear if we have control over the container
        if (container && document.body.contains(container)) {
          // Clear existing content safely
          while (container.firstChild) {
            try {
              container.removeChild(container.firstChild)
            } catch (e) {
              // If removeChild fails, break to avoid infinite loop
              break
            }
          }
          
          setIsReady(true)
          setIsMounted(true)
          onReady?.()
        }
      } catch (error) {
        console.warn('Container initialization error:', error)
        // Still proceed but without clearing
        if (mounted) {
          setIsReady(true)
          setIsMounted(true)
          onReady?.()
        }
      }
    }

    // Delay initialization to ensure DOM is stable
    timeoutId = setTimeout(initContainer, 100)

    return () => {
      mounted = false
      setIsMounted(false)
      
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      
      // Graceful cleanup with extensive safety checks
      if (containerRef.current) {
        try {
          const container = containerRef.current
          
          // Only attempt cleanup if container is still in DOM
          if (document.body.contains(container)) {
            // Use a more gentle approach to cleanup
            const cleanupContainer = () => {
              try {
                // Check each child before removal
                const children = Array.from(container.children)
                children.forEach(child => {
                  try {
                    if (container.contains(child)) {
                      container.removeChild(child)
                    }
                  } catch (e) {
                    // Skip problematic children
                  }
                })
              } catch (e) {
                // If all else fails, try innerHTML (less safe but works)
                try {
                  container.innerHTML = ''
                } catch (innerError) {
                  // Give up on cleanup
                }
              }
            }
            
            // Run cleanup in next tick to avoid timing issues
            setTimeout(cleanupContainer, 0)
          }
        } catch (error) {
          // Completely ignore cleanup errors
        }
      }
      
      setIsReady(false)
    }
  }, [onReady])

  // Don't render children until we're sure the container is ready
  if (!isMounted || !isReady) {
    return (
      <div 
        ref={containerRef} 
        id={containerId} 
        className="w-full h-full flex items-center justify-center"
        style={{ position: 'relative', background: 'var(--void)' }}
      >
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-electric-cyan border-t-transparent rounded-full mx-auto mb-2 animate-spin" />
          <p className="text-xs text-quantized-silver/60">Initializing map container...</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef} 
      id={containerId} 
      className="w-full h-full"
      style={{ position: 'relative' }}
    >
      {children}
    </div>
  )
}