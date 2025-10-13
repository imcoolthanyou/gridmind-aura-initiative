"use client"

import { Suspense, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { QrCode, Smartphone, Camera, Eye, AlertCircle, Monitor, Zap } from 'lucide-react'
import Header from '@/components/Header'
import ARViewer from '@/components/ARViewer'
import { getARViewURL, generateQRCodeURL, getNetworkIPHint } from '@/lib/utils/url'

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
  const [cameraPermission, setCameraPermission] = useState<'pending' | 'granted' | 'denied'>('pending')
  const [showQRCode, setShowQRCode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [networkHint, setNetworkHint] = useState<string | null>(null)

  useEffect(() => {
    detectDevice()
    setNetworkHint(getNetworkIPHint())
  }, [])

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

    if (isDesktop) {
      setShowQRCode(true)
    }
    
    setIsLoading(false)
  }


  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      setCameraPermission('granted')
      
      // Stop the stream immediately as we just needed permission
      stream.getTracks().forEach(track => track.stop())
    } catch (error) {
      console.error('Camera permission denied:', error)
      setCameraPermission('denied')
    }
  }

  const getQRCodeURL = () => {
    const arViewURL = getARViewURL()
    return generateQRCodeURL(arViewURL, 200)
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


          {/* Desktop Experience - QR Code */}
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
                Make sure to allow camera permissions when prompted.
              </p>
              
              {showQRCode && (
                <div className="bg-white p-4 rounded-lg inline-block mb-4">
                  <img 
                    src={getQRCodeURL()} 
                    alt="QR Code for AR Experience"
                    className="w-48 h-48 mx-auto"
                  />
                </div>
              )}
              
              {/* Development hint for mobile access */}
              {networkHint && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4 text-sm">
                  <p className="text-yellow-400 font-medium mb-1">🔧 Development Setup</p>
                  <p className="text-quantized-silver/80">{networkHint}</p>
                  <p className="text-quantized-silver/70 text-xs mt-2">
                    Run: <code className="bg-void/50 px-1 py-0.5 rounded">npm run setup:mobile</code> to auto-configure
                  </p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-quantized-silver/60">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>Instant AR Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <span>Mobile Optimized</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>3D Visualization</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Mobile/Tablet Experience */}
          {(deviceInfo.isMobile || deviceInfo.isTablet) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass-panel p-8 max-w-2xl mx-auto"
            >
              <div className="text-center mb-6">
                <Camera className="w-16 h-16 text-electric-cyan mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">AR Experience Ready</h2>
                <p className="text-quantized-silver/80">
                  Grant camera access to view the transformer model in augmented reality overlaid on your real environment.
                </p>
              </div>

              {/* Camera Permission Flow */}
              {cameraPermission === 'pending' && (
                <div className="text-center">
                  <button
                    onClick={requestCameraPermission}
                    className="bg-electric-cyan text-void px-8 py-3 rounded-lg font-bold hover:bg-electric-cyan/80 transition-colors duration-200 inline-flex items-center gap-3"
                  >
                    <Camera className="w-5 h-5" />
                    Enable Camera Access
                  </button>
                  <p className="text-sm text-quantized-silver/60 mt-3">
                    Camera access is required for AR functionality
                  </p>
                </div>
              )}

              {cameraPermission === 'denied' && (
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <h3 className="font-bold text-red-400 mb-2">Camera Access Denied</h3>
                  <p className="text-quantized-silver/70 mb-4">
                    Please enable camera permissions in your browser settings to use AR features.
                  </p>
                  <button
                    onClick={requestCameraPermission}
                    className="text-electric-cyan hover:text-electric-cyan/80 underline"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {cameraPermission === 'granted' && (
                <div>
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full">
                      <Camera className="w-4 h-4" />
                      <span>Camera Access Granted</span>
                    </div>
                  </div>
                  
                  <Suspense fallback={
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-2 border-electric-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p>Loading AR Experience...</p>
                    </div>
                  }>
                    <ARViewer />
                  </Suspense>
                </div>
              )}
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
