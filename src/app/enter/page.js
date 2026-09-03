'use client'

import { Canvas } from '@react-three/fiber'
import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import CameraRig from '@/components/welcome/CameraRig'
import SuzumeThreshold from '@/components/welcome/SuzumeThreshold'
import WhiteCloudTransition from '@/components/welcome/WhiteCloudTransition'

export default function EnterPage() {
  const [isEntering, setIsEntering] = useState(false)
  const router = useRouter()

  const handleDoorEnter = () => {
    setIsEntering(true)
    // After the zoom-in accelerates and white clouds bloom across the screen, navigate to /title
    setTimeout(() => {
      router.push('/title')
    }, 1300)
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#70a6dd] select-none">
      {/* Click prompt overlay — pure floating white text with subtle shadow, zero background */}
      <AnimatePresence>
        {!isEntering && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 1.0, delay: 1.2 }}
            className="pointer-events-none absolute bottom-12 left-0 right-0 z-20 text-center font-mono tracking-[0.25em] text-xs sm:text-sm font-medium text-white"
            style={{
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.45)',
            }}
          >
            ✦ CLICK THE DOOR TO ENTER ✦
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-screen white clouds transition on zoom-in */}
      <WhiteCloudTransition active={isEntering} />

      {/* 3D Scene Canvas */}
      <Canvas 
        camera={{ position: [0, 10.0, 18.0], fov: 48, near: 0.1, far: 5000 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#70a6dd']} />
        <Suspense fallback={null}>
          <CameraRig isEntering={isEntering} />
          <SuzumeThreshold onEnter={handleDoorEnter} />
        </Suspense>
      </Canvas>
    </main>
  )
}
