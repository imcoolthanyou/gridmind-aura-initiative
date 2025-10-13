"use client"
"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet"
import { GridNode, PowerLine } from "@/lib/transformerData"

// Leaflet imports
let L: any = null

interface LeafletMapProps {
  gridNodes: GridNode[]
  powerLines: PowerLine[]
  mapTheme: 'dark' | 'satellite' | 'terrain'
  mapThemes: any
  failedNodes: Set<string>
  failedLines: Set<string>
  getNodeColor: (status: string) => string
  getLineColor: (line: PowerLine) => string
  onNodeSelect: (node: GridNode) => void
  onNodeHover: (node: GridNode | null) => void
  onError?: (error: any) => void
}

export default function LeafletMapComponent({
  gridNodes,
  powerLines,
  mapTheme,
  mapThemes,
  failedNodes,
  failedLines,
  getNodeColor,
  getLineColor,
  onNodeSelect,
  onNodeHover,
  onError
}: LeafletMapProps) {
  const mapRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLeafletReady, setIsLeafletReady] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Center coordinates between Khandwa and Bhopal regions
  const mapCenter: [number, number] = [22.5, 76.9] // Midpoint between the two regions
  const currentTheme = mapThemes[mapTheme]

  // Load Leaflet dynamically and safely
  useEffect(() => {
    let mounted = true
    let cssLink: HTMLLinkElement | null = null

    const loadLeaflet = async () => {
      try {
        // Import Leaflet
        const leaflet = await import('leaflet')
        L = leaflet.default

        // Verify Leaflet is properly loaded
        if (!L || !L.map || !L.icon) {
          throw new Error('Leaflet core functions not available')
        }

        // Load CSS if not already present
        const existingCss = document.querySelector('link[href*="leaflet.css"]')
        if (!existingCss) {
          cssLink = document.createElement('link')
          cssLink.rel = 'stylesheet'
          cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
          cssLink.crossOrigin = 'anonymous'
          
          cssLink.onload = () => {
            if (mounted) {
              setTimeout(() => {
                if (mounted) setIsLeafletReady(true)
              }, 100)
            }
          }

          cssLink.onerror = () => {
            if (mounted) {
              setLoadError('Failed to load map styles')
              onError?.('CSS load failed')
            }
          }

          document.head.appendChild(cssLink)
        } else {
          if (mounted) {
            setTimeout(() => {
              if (mounted) setIsLeafletReady(true)
            }, 100)
          }
        }

      } catch (error) {
        console.error('Failed to load Leaflet:', error)
        if (mounted) {
          setLoadError('Failed to initialize map library')
          onError?.(error)
        }
      }
    }

    loadLeaflet()

    return () => {
      mounted = false
      setIsLeafletReady(false)

      // Cleanup CSS if we added it
      if (cssLink && document.head.contains(cssLink)) {
        try {
          document.head.removeChild(cssLink)
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    }
  }, [onError])

  // Memoized icon creation
  const createTransformerIcon = useMemo(() => {
    return (status: string, type: string) => {
      if (!isLeafletReady || !L || typeof window === 'undefined') {
        return undefined
      }
      
      const color = getNodeColor(status)
      const size = type === "substation" ? 32 : 24
      
      try {
        const svgString = `
          <svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="glow-${status}-${type}">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            ${type === "substation" ? `
              <rect x="4" y="4" width="16" height="16" rx="2" fill="${color}" stroke="white" stroke-width="2" filter="url(#glow-${status}-${type})"/>
              <rect x="8" y="8" width="8" height="8" fill="white" opacity="0.8"/>
            ` : `
              <circle cx="12" cy="12" r="8" fill="${color}" stroke="white" stroke-width="2" filter="url(#glow-${status}-${type})"/>
              <path d="M8 12h8M12 8v8" stroke="white" stroke-width="2" opacity="0.8"/>
            `}
          </svg>
        `
        
        return L.icon({
          iconUrl: `data:image/svg+xml;base64,${btoa(svgString)}`,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
          popupAnchor: [0, -size / 2]
        })
      } catch (error) {
        console.error('Error creating icon:', error)
        // Return simple fallback
        try {
          return L.icon({
            iconUrl: `data:image/svg+xml;base64,${btoa(`<svg width="${size}" height="${size}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="${color}" stroke="white" stroke-width="2"/></svg>`)}`,
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2]
          })
        } catch (fallbackError) {
          return undefined
        }
      }
    }
  }, [isLeafletReady, getNodeColor])

  // Error handling
  const handleMapError = (error: any) => {
    console.error('Map container error:', error)
    setLoadError('Map rendering failed')
    onError?.(error)
  }

  if (loadError) {
    return (
      <div className="w-full h-full bg-void flex items-center justify-center">
        <div className="text-center">
          <p className="text-crimson mb-4">{loadError}</p>
          <button 
            onClick={() => {
              setLoadError(null)
              setIsLeafletReady(false)
              // Trigger reload
              window.location.reload()
            }}
            className="px-4 py-2 bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/40 rounded text-sm hover:bg-electric-cyan/30 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  if (!isLeafletReady) {
    return (
      <div className="w-full h-full bg-void flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-electric-cyan border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-sm text-quantized-silver/60">Loading interactive map...</p>
        </div>
      </div>
    )
  }

  try {
    return (
      <div ref={containerRef} className="w-full h-full">
        <MapContainer
          center={mapCenter}
          zoom={10}
          className="w-full h-full"
          style={{ 
            background: currentTheme.background, 
            height: '100vh',
            zIndex: 0
          }}
          ref={mapRef}
          whenReady={() => console.log('Map ready')}
          zoomControl={true}
          scrollWheelZoom={true}
          doubleClickZoom={true}
          keyboard={true}
          attributionControl={true}
          maxBounds={[
            [21.5, 76.0],  // Southwest (expanded for both regions)
            [23.5, 78.0]   // Northeast (expanded for both regions) 
          ]}
          maxBoundsViscosity={0.8}
        >
          {/* Dynamic themed tile layer */}
          <TileLayer
            key={mapTheme}
            url={currentTheme.url}
            attribution={currentTheme.attribution}
            maxZoom={18}
            tileSize={256}
            errorTileUrl="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSIjNjY2NjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTZweCI+Tm8gVGlsZTwvdGV4dD48L3N2Zz4K"
          />
          
          {/* Power transmission lines */}
          {powerLines.map((line) => {
            const fromNode = gridNodes.find(n => n.id === line.from)
            const toNode = gridNodes.find(n => n.id === line.to)
            if (!fromNode || !toNode) return null

            const positions: [number, number][] = [
              [fromNode.position.lat, fromNode.position.lng],
              [toNode.position.lat, toNode.position.lng]
            ]

            return (
              <Polyline
                key={line.id}
                positions={positions}
                pathOptions={{
                  color: getLineColor(line),
                  weight: 4,
                  opacity: failedLines.has(line.id) ? 0.5 : 0.8,
                  dashArray: failedLines.has(line.id) ? '10, 10' : undefined
                }}
              />
            )
          })}
          
          {/* Grid Nodes with Custom Icons */}
          {gridNodes.map((node) => {
            const isFailed = failedNodes.has(node.id)
            const nodeStatus = isFailed ? "failed" : node.status
            const icon = createTransformerIcon(nodeStatus, node.type)
            
            if (!icon) {
              // Fallback to simple marker if icon creation fails
              return (
                <Marker
                  key={`${node.id}-fallback`}
                  position={[node.position.lat, node.position.lng]}
                  eventHandlers={{
                    click: () => onNodeSelect(node),
                    mouseover: () => onNodeHover(node),
                    mouseout: () => onNodeHover(null)
                  }}
                >
                  <Popup closeOnClick={false} autoClose={false}>
                    <div className="text-center p-2">
                      <h3 className="font-bold text-sm mb-1 text-gray-800">{node.name}</h3>
                      <p className="text-xs text-gray-600">{node.id}</p>
                      <p className="text-xs font-semibold mt-1 text-gray-700">
                        Health: <span style={{color: getNodeColor(nodeStatus)}}>{node.healthScore}%</span>
                      </p>
                      <p className="text-xs text-gray-600 mt-1 capitalize">{node.type}</p>
                    </div>
                  </Popup>
                </Marker>
              )
            }
            
            return (
              <Marker
                key={`${node.id}-${nodeStatus}`}
                position={[node.position.lat, node.position.lng]}
                icon={icon}
                eventHandlers={{
                  click: () => onNodeSelect(node),
                  mouseover: () => onNodeHover(node),
                  mouseout: () => onNodeHover(null)
                }}
              >
                <Popup closeOnClick={false} autoClose={false}>
                  <div className="text-center p-2">
                    <h3 className="font-bold text-sm mb-1 text-gray-800">{node.name}</h3>
                    <p className="text-xs text-gray-600">{node.id}</p>
                    <p className="text-xs font-semibold mt-1 text-gray-700">
                      Health: <span style={{color: getNodeColor(nodeStatus)}}>{node.healthScore}%</span>
                    </p>
                    <p className="text-xs text-gray-600 mt-1 capitalize">{node.type}</p>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>
    )
  } catch (error) {
    console.error('Map render error:', error)
    handleMapError(error)
    return (
      <div className="w-full h-full bg-void flex items-center justify-center">
        <div className="text-center">
          <p className="text-crimson mb-4">Map rendering failed</p>
          <button 
            onClick={() => onError?.(error)}
            className="px-4 py-2 bg-amber/20 text-amber border border-amber/40 rounded text-sm hover:bg-amber/30 transition-colors"
          >
            Switch to Static Mode
          </button>
        </div>
      </div>
    )
  }
}