"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Activity, AlertTriangle, TrendingUp } from "lucide-react"

interface Sensor {
  id: string
  name: string
  type: string
  status: "active" | "anomaly" | "offline"
  value: number
  unit: string
  trend: number[]
  lastUpdate: string
}

interface LiveSensorStreamsProps {
  onSensorClick: (sensorId: string) => void
  staticData?: {
    [key: string]: {
      value: number
      unit: string
      status: string
      type: string
    }
  }
  assetName?: string
}

const initialSensors: Sensor[] = [
  {
    id: "winding-secondary",
    name: "Source-001: Acoustic",
    type: "Acoustic Emission",
    status: "anomaly",
    value: 78.5,
    unit: "dB",
    trend: [45, 50, 52, 55, 60, 65, 70, 75, 78.5],
    lastUpdate: "2s ago",
  },
  {
    id: "core",
    name: "Source-002: Thermal",
    type: "IR Thermography",
    status: "active",
    value: 72.3,
    unit: "°C",
    trend: [68, 69, 70, 71, 71.5, 72, 72.2, 72.3, 72.3],
    lastUpdate: "1s ago",
  },
  {
    id: "oil-tank",
    name: "Source-003: DGA",
    type: "Dissolved Gas Analysis",
    status: "anomaly",
    value: 450,
    unit: "ppm",
    trend: [200, 220, 250, 280, 320, 360, 400, 425, 450],
    lastUpdate: "5s ago",
  },
  {
    id: "winding-primary",
    name: "Source-004: FRA",
    type: "Frequency Response",
    status: "active",
    value: 0.92,
    unit: "Δ%",
    trend: [0.88, 0.89, 0.9, 0.91, 0.91, 0.92, 0.92, 0.92, 0.92],
    lastUpdate: "3s ago",
  },
  {
    id: "bushing",
    name: "Source-005: Vibration",
    type: "Vibration Analysis",
    status: "active",
    value: 0.15,
    unit: "mm/s",
    trend: [0.1, 0.11, 0.12, 0.13, 0.14, 0.14, 0.15, 0.15, 0.15],
    lastUpdate: "2s ago",
  },
]

export default function LiveSensorStreams({ onSensorClick, staticData, assetName }: LiveSensorStreamsProps) {
  // Check for current asset data from localStorage
  const getCurrentAssetData = () => {
    try {
      const stored = localStorage.getItem('current-asset-data')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }
  
  // Generate static trend data based on current value
  const generateStaticTrend = (baseValue: number) => {
    return Array.from({ length: 9 }, (_, i) => {
      // Create a realistic historical trend ending at the current value
      const variation = baseValue * 0.05 // 5% max variation
      const trend = baseValue - variation + (variation * 2 * i / 8)
      return parseFloat(trend.toFixed(2))
    })
  }
  
  // Initialize sensors with static data
  const [sensors, setSensors] = useState<Sensor[]>(() => {
    const assetData = getCurrentAssetData()
    const dataSource = staticData || (assetData?.data?.sensors)
    
    if (dataSource) {
      return Object.entries(dataSource).map(([id, sensorData], index) => {
        const data = sensorData as { value: number; unit: string; status: string; type: string }
        return {
          id,
          name: `Source-${String(index + 1).padStart(3, '0')}: ${data.type.split(' ')[0]}`,
          type: data.type,
          status: data.status as "active" | "anomaly" | "offline",
          value: data.value,
          unit: data.unit,
          trend: generateStaticTrend(data.value),
          lastUpdate: "CSV data"
        }
      })
    }
    return initialSensors
  })
  
  // Only listen for asset changes, no random updates
  useEffect(() => {
    const handleStorageChange = () => {
      const assetData = getCurrentAssetData()
      if (assetData?.data?.sensors) {
        const newSensors = Object.entries(assetData.data.sensors).map(([id, sensorData], index) => {
          const data = sensorData as { value: number; unit: string; status: string; type: string }
          return {
            id,
            name: `Source-${String(index + 1).padStart(3, '0')}: ${data.type.split(' ')[0]}`,
            type: data.type,
            status: data.status as "active" | "anomaly" | "offline",
            value: data.value,
            unit: data.unit,
            trend: generateStaticTrend(data.value),
            lastUpdate: "CSV data"
          }
        })
        setSensors(newSensors)
      }
    }
    
    // Check for changes periodically but don't update values randomly
    const interval = setInterval(handleStorageChange, 1000)
    return () => clearInterval(interval)
  }, [])

  // REMOVED: No more random updates - data stays static!

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "var(--electric-cyan)"
      case "anomaly":
        return "var(--amber)"
      case "offline":
        return "var(--crimson)"
      default:
        return "var(--quantized-silver)"
    }
  }

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-quantized-silver font-sans mb-1">
            Static Sensor Data
          </h2>
          <p className="text-sm text-quantized-silver/60">
            CSV-based sensor readings - No live updates
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-electric-cyan/10 border border-electric-cyan/30">
          <Activity className="w-4 h-4 text-electric-cyan animate-pulse" />
          <span className="text-sm text-electric-cyan font-medium">
            {sensors.filter((s) => s.status === "active").length} Active
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {sensors.map((sensor, index) => (
          <motion.div
            key={sensor.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel-bright p-4 hover:border-electric-cyan/30 transition-all duration-300 cursor-pointer group"
            onClick={() => onSensorClick(sensor.id)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{
                    backgroundColor: getStatusColor(sensor.status),
                    boxShadow: `0 0 10px ${getStatusColor(sensor.status)}`,
                  }}
                />
                <div>
                  <h3 className="text-sm font-semibold text-quantized-silver group-hover:text-electric-cyan transition-colors">
                    {sensor.name}
                  </h3>
                  <p className="text-xs text-quantized-silver/50">{sensor.type}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {sensor.status === "anomaly" && (
                  <AlertTriangle className="w-4 h-4 text-amber" />
                )}
                <div className="text-right">
                  <div className="text-lg font-bold text-electric-cyan font-mono">
                    {sensor.value}
                    <span className="text-sm text-quantized-silver/70 ml-1">
                      {sensor.unit}
                    </span>
                  </div>
                  <div className="text-xs text-quantized-silver/50">
                    CSV data
                  </div>
                </div>
              </div>
            </div>

            {/* Mini sparkline */}
            <div className="relative h-12 flex items-end gap-0.5">
              {sensor.trend.map((value, i) => {
                const max = Math.max(...sensor.trend)
                const min = Math.min(...sensor.trend)
                const normalized = ((value - min) / (max - min)) * 100

                return (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-t"
                    style={{
                      height: `${normalized}%`,
                      backgroundColor:
                        sensor.status === "anomaly"
                          ? "var(--amber)"
                          : "var(--electric-cyan)",
                      opacity: 0.3 + (i / sensor.trend.length) * 0.7,
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: `${normalized}%` }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  />
                )
              })}
            </div>

            {/* Status badge */}
            <div className="mt-2 flex items-center justify-between">
              <span
                className="text-xs px-2 py-0.5 rounded uppercase font-semibold"
                style={{
                  color: getStatusColor(sensor.status),
                  backgroundColor: `${getStatusColor(sensor.status)}20`,
                }}
              >
                {sensor.status}
              </span>
              <TrendingUp
                className="w-3 h-3 text-quantized-silver/40 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}