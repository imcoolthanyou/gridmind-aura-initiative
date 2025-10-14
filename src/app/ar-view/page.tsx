"use client"

import { Suspense, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { QrCode, Smartphone, Camera, Eye, AlertCircle, Monitor, Zap } from 'lucide-react'
import Header from '@/components/Header'
import dynamic from 'next/dynamic'
import { getARViewURL, generateQRCodeURL, getNetworkIPHint } from '@/lib/utils/url'

const ARViewer = dynamic(() => import('@/components/ARViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[80vh] bg-void">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-2 border-electric-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-quantized-silver">Loading AR Experience...</p>
      </div>
    </div>
  )
})

interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  hasCamera: boolean
}

export default function ARViewPage() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    hasCamera: false
  })
  const [isLoading, setIsLoading] = useState(true)
  const [networkHint, setNetworkHint] = useState<string | null>(null)

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
      const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent)
      const isDesktop = !isMobile && !isTablet

      setDeviceInfo({
        isMobile: isMobile && !isTablet,
        isTablet,
        isDesktop,
        hasCamera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices
      })
      
      setNetworkHint(getNetworkIPHint())
      setIsLoading(false)
    }

    detectDevice()
  }, [])

  const getQRCodeURL = () => {
    const arViewURL = getARViewURL()
    return generateQRCodeURL(arViewURL, 256)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-void text-quantized-silver">
        <Header />
        <div className="pt-24 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-2 border-electric-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Detecting device capabilities...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-void text-quantized-silver">
      <Header />
      
      <main className="pt-24 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Eye className="w-8 h-8 text-electric-cyan" />
              <h1 className="text-4xl md:text-6xl font-bold text-electric-cyan text-glow-cyan">
                AR Experience
              </h1>
            </div>
            <p className="text-xl text-quantized-silver/80 max-w-3xl mx-auto">
              Visualize GridMind's transformer models in augmented reality. 
              Experience the future of power grid diagnostics in your physical space.
            </p>
          </motion.div>


          {/* Desktop - QR Code for Mobile Scanning */}
          {deviceInfo.isDesktop && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass-panel p-8 text-center max-w-2xl mx-auto mb-8"
            >
              <QrCode className="w-16 h-16 text-electric-cyan mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-4">Scan for Mobile AR Experience</h2>
              <p className="text-quantized-silver/80 mb-6">
                Scan this QR code with your mobile device to experience the transformer model in augmented reality.
                Your phone or tablet camera will overlay the 3D model on your real environment.
              </p>
              
              <div className="bg-white p-6 rounded-lg inline-block mb-6">
                <img 
                  src={getQRCodeURL()} 
                  alt="QR Code for AR Experience"
                  className="w-64 h-64 mx-auto"
                />
              </div>
              
              {/* Development hint for mobile access */}
              {networkHint && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4 text-sm">
                  <p className="text-yellow-400 font-medium mb-1">🔧 Development Mode</p>
                  <p className="text-quantized-silver/80">{networkHint}</p>
                  <p className="text-quantized-silver/70 text-xs mt-2">
                    Make sure your mobile device is on the same network
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="bg-void/30 p-3 rounded-lg">
                  <Smartphone className="w-5 h-5 text-electric-cyan mx-auto mb-2" />
                  <p className="font-semibold text-electric-cyan mb-1">Step 1</p>
                  <p className="text-quantized-silver/70 text-xs">Open camera on phone</p>
                </div>
                <div className="bg-void/30 p-3 rounded-lg">
                  <QrCode className="w-5 h-5 text-electric-cyan mx-auto mb-2" />
                  <p className="font-semibold text-electric-cyan mb-1">Step 2</p>
                  <p className="text-quantized-silver/70 text-xs">Scan QR code</p>
                </div>
                <div className="bg-void/30 p-3 rounded-lg">
                  <Eye className="w-5 h-5 text-electric-cyan mx-auto mb-2" />
                  <p className="font-semibold text-electric-cyan mb-1">Step 3</p>
                  <p className="text-quantized-silver/70 text-xs">Experience AR</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Mobile/Tablet - Direct AR Viewer */}
          {(deviceInfo.isMobile || deviceInfo.isTablet) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="max-w-5xl mx-auto"
            >
              <div className="glass-panel p-6">
                <div className="text-center mb-4">
                  <Camera className="w-12 h-12 text-electric-cyan mx-auto mb-3" />
                  <h2 className="text-2xl font-bold mb-2">AR Transformer Viewer</h2>
                  <p className="text-quantized-silver/70">
                    Allow camera access when prompted to view the model in augmented reality
                  </p>
                </div>
                
                <Suspense fallback={
                  <div className="flex items-center justify-center h-[80vh] bg-void">
                    <div className="text-center">
                      <div className="animate-spin w-12 h-12 border-2 border-electric-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-quantized-silver">Loading AR Experience...</p>
                    </div>
                  </div>
                }>
                  <ARViewer />
                </Suspense>
              </div>
            </motion.div>
          )}

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <div className="glass-panel p-6 text-center">
              <Eye className="w-8 h-8 text-electric-cyan mx-auto mb-3" />
              <h3 className="font-bold mb-2">Real-time AR</h3>
              <p className="text-sm text-quantized-silver/70">
                View 3D models overlaid on your real environment
              </p>
            </div>
            
            <div className="glass-panel p-6 text-center">
              <Zap className="w-8 h-8 text-electric-cyan mx-auto mb-3" />
              <h3 className="font-bold mb-2">Interactive</h3>
              <p className="text-sm text-quantized-silver/70">
                Rotate, scale, and examine models from all angles
              </p>
            </div>
            
            <div className="glass-panel p-6 text-center">
              <Monitor className="w-8 h-8 text-electric-cyan mx-auto mb-3" />
              <h3 className="font-bold mb-2">Cross-Platform</h3>
              <p className="text-sm text-quantized-silver/70">
                Works on desktop with QR codes and mobile devices
              </p>
            </div>
            
            <div className="glass-panel p-6 text-center">
              <Smartphone className="w-8 h-8 text-electric-cyan mx-auto mb-3" />
              <h3 className="font-bold mb-2">Mobile First</h3>
              <p className="text-sm text-quantized-silver/70">
                Optimized for touch interactions and mobile cameras
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
