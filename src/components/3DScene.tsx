"use client"

import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment } from '@react-three/drei'
import { Suspense } from 'react'

// This component loads your 3D model
function Model(props) {
  // useGLTF hooks into the .glb file
  const { scene } = useGLTF('/transformer-part-2.glb')
  return <primitive object={scene} {...props} />
}

// This is your main 3D scene component
export default function Scene() {
  return (
    <div className="w-full h-[500px]">
      <Canvas>
        <Suspense fallback={null}>
          {/* Ambient light provides a soft, even light */}
          <ambientLight intensity={1.5} />
          
          {/* Directional light acts like a sun */}
          <directionalLight position={[10, 10, 5]} intensity={2.5} />

          {/* The Model component you defined above */}
          <Model scale={1.0} />

          {/* This adds a pre-made, high-quality environment lighting */}
          <Environment preset="city" />

          {/* This allows the user to rotate the model with their mouse */}
          <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} />
        </Suspense>
      </Canvas>
    </div>
  )
}
