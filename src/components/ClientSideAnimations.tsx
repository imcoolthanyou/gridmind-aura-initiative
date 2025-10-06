"use client"

import dynamic from 'next/dynamic'

const CustomCursor = dynamic(() => import('@/components/CustomCursor'), { ssr: false })
const GeometricBackground = dynamic(() => import('@/components/GeometricBackground'), { ssr: false })
const EnergyWaves = dynamic(() => import('@/components/EnergyWaves'), { ssr: false })
const EnhancedParticleField = dynamic(() => import('@/components/EnhancedParticleField'), { ssr: false })
const FloatingElements = dynamic(() => import('@/components/FloatingElements'), { ssr: false })
const RippleEffect = dynamic(() => import('@/components/RippleEffect'), { ssr: false })
const HolographicOverlay = dynamic(() => import('@/components/HolographicOverlay'), { ssr: false })

export default function ClientSideAnimations() {
  return (
    <>
      <CustomCursor />
      <GeometricBackground />
      <EnergyWaves />
      <EnhancedParticleField />
      <FloatingElements />
      <RippleEffect />
      <HolographicOverlay />
    </>
  )
}
