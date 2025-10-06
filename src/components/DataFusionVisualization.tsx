"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Zap, Activity, Thermometer, FlaskConical } from "lucide-react"

interface DataStream {
  id: string
  name: string
  icon: any
  color: string
  value: number
  unit: string
  status: 'normal' | 'warning' | 'critical'
}

export default function DataFusionVisualization() {
  const [animatedValues, setAnimatedValues] = useState<DataStream[]>([
    {
      id: 'fra',
      name: 'FRA Analysis',
      icon: Zap,
      color: 'electric-cyan',
      value: 87.2,
      unit: '%',
      status: 'normal'
    },
    {
      id: 'acoustic',
      name: 'Acoustic Monitoring',
      icon: Activity,
      color: 'magenta',
      value: 42.8,
      unit: 'dB',
      status: 'normal'
    },
    {
      id: 'thermal',
      name: 'Thermal Imaging',
      icon: Thermometer,
      color: 'solar-orange',
      value: 68.5,
      unit: '°C',
      status: 'warning'
    },
    {
      id: 'dga',
      name: 'DGA Results',
      icon: FlaskConical,
      color: 'amber',
      value: 94.1,
      unit: 'ppm',
      status: 'normal'
    }
  ])

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedValues(prev => prev.map(stream => ({
        ...stream,
        value: Math.max(0, stream.value + (Math.random() - 0.5) * 10)
      })))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      {/* Central Fusion Node */}
      <div className="flex items-center justify-center mb-12">
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            boxShadow: [
              '0 0 20px rgba(0, 255, 255, 0.3)',
              '0 0 40px rgba(0, 255, 255, 0.5)',
              '0 0 20px rgba(0, 255, 255, 0.3)'
            ]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-32 h-32 rounded-full bg-gradient-to-br from-electric-cyan/20 to-magenta/20 border-2 border-electric-cyan/50 flex items-center justify-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-electric-cyan/10 via-transparent to-magenta/10 animate-pulse" />
          <div className="relative z-10 text-center">
            <div className="text-2xl font-bold text-electric-cyan mb-1">AI</div>
            <div className="text-xs text-quantized-silver/70">Fusion</div>
          </div>
          
          {/* Orbital rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 border border-electric-cyan/30 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 border border-magenta/30 rounded-full"
          />
        </motion.div>
      </div>

      {/* Data Streams */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {animatedValues.map((stream, index) => {
          const Icon = stream.icon
          return (
            <motion.div
              key={stream.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel p-4 relative overflow-hidden group hover:glass-panel-bright transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `var(--${stream.color})20` }}
                >
                  <Icon 
                    className="w-5 h-5"
                    style={{ color: `var(--${stream.color})` }}
                  />
                </div>
                <div 
                  className={`w-2 h-2 rounded-full ${
                    stream.status === 'normal' ? 'bg-green-400' :
                    stream.status === 'warning' ? 'bg-yellow-400' :
                    'bg-red-400'
                  }`}
                />
              </div>
              
              <h3 className="text-sm font-medium text-quantized-silver mb-2">
                {stream.name}
              </h3>
              
              <div className="flex items-baseline gap-1">
                <span 
                  className="text-lg font-bold font-mono"
                  style={{ color: `var(--${stream.color})` }}
                >
                  {stream.value.toFixed(1)}
                </span>
                <span className="text-xs text-quantized-silver/60">
                  {stream.unit}
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-quantized-silver/10 rounded-full h-1.5 mt-3">
                <motion.div
                  className="h-1.5 rounded-full"
                  style={{ backgroundColor: `var(--${stream.color})` }}
                  animate={{ width: `${Math.min(100, (stream.value / 100) * 100)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Data flow animation */}
              <motion.div
                animate={{ 
                  x: [-20, 100],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  delay: index * 0.5,
                  ease: "easeInOut"
                }}
                className="absolute top-1/2 left-0 w-4 h-0.5 rounded-full"
                style={{ backgroundColor: `var(--${stream.color})` }}
              />
            </motion.div>
          )
        })}
      </div>

      {/* Fusion Process Visualization */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Data Ingestion",
            description: "Real-time sensor data collection from multiple sources",
            progress: 95
          },
          {
            title: "Pattern Recognition",
            description: "AI algorithms identify anomalies and trends",
            progress: 87
          },
          {
            title: "Predictive Analysis",
            description: "Generate actionable insights and predictions",
            progress: 92
          }
        ].map((process, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="text-center"
          >
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-electric-cyan/20 to-magenta/20 border border-electric-cyan/30 flex items-center justify-center mb-3">
                <span className="text-xl font-bold text-electric-cyan">
                  {index + 1}
                </span>
              </div>
              <h4 className="text-lg font-semibold text-quantized-silver mb-2">
                {process.title}
              </h4>
              <p className="text-sm text-quantized-silver/70 mb-3">
                {process.description}
              </p>
              
              {/* Progress indicator */}
              <div className="w-full bg-quantized-silver/10 rounded-full h-2">
                <motion.div
                  className="h-2 rounded-full bg-gradient-to-r from-electric-cyan to-magenta"
                  animate={{ width: `${process.progress}%` }}
                  transition={{ duration: 1, delay: 1 + index * 0.2 }}
                />
              </div>
              <div className="text-xs text-quantized-silver/50 mt-1">
                {process.progress}% Complete
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
