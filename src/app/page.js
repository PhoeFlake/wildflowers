'use client'

import { Canvas } from '@react-three/fiber'
import { useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CameraRig from '@/components/welcome/CameraRig'
import SuzumeThreshold from '@/components/welcome/SuzumeThreshold'
import WhiteCloudTransition from '@/components/welcome/WhiteCloudTransition'

export default function WelcomePage() {
  const [isEntering, setIsEntering] = useState(false)

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#70a6dd] select-none">
      {/* Click prompt overlay — appears gracefully after the swoop-down shot */}
      <AnimatePresence>
        {!isEntering && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 1.0, delay: 1.2 }}
            className="pointer-events-none absolute bottom-12 left-0 right-0 z-20 text-center text-white/90 font-mono tracking-[0.25em] text-xs sm:text-sm drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
          >
            ✦ CLICK THE DOOR TO ENTER ✦
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-screen white clouds transition on zoom-in */}
      <WhiteCloudTransition active={isEntering} />

      {/* 3D Scene Canvas — starts high at [0, 10, 18] for the cinematic arrival from top */}
      <Canvas 
        camera={{ position: [0, 10.0, 18.0], fov: 48, near: 0.1, far: 5000 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#70a6dd']} />
        <Suspense fallback={null}>
          <CameraRig isEntering={isEntering} />
          <SuzumeThreshold onEnter={() => setIsEntering(true)} />
        </Suspense>
      </Canvas>
    </main>
  )
}