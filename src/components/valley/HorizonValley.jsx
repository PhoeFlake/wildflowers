'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import LivingSky from './LivingSky'
import AtmosphereParticles from './AtmosphereParticles'
import { isWinterSeason, getTimeOfDayFromDate } from './astronomy'

/**
 * Camera controller managing the cinematic entrance swoop and interactive hover
 */
function CinematicCamera({ isEntering, onSwoopComplete }) {
  const progress = useRef(0)

  useFrame((state, delta) => {
    if (isEntering && progress.current < 1.0) {
      progress.current = Math.min(1.0, progress.current + delta * 0.5)
      const t = progress.current

      // Smooth easeOutCubic curve
      const ease = 1 - Math.pow(1 - t, 3)

      state.camera.position.z = THREE.MathUtils.lerp(1.5, 0.0, ease)
      state.camera.position.y = THREE.MathUtils.lerp(-0.2, 0.0, ease)

      if (progress.current >= 1.0 && onSwoopComplete) {
        onSwoopComplete()
      }
    } else {
      // Gentle breathing idle float once landed
      const time = state.clock.getElapsedTime()
      state.camera.position.y = Math.sin(time * 0.6) * 0.02
    }
  })

  return null
}

export default function HorizonValley({ onSelectCharacter }) {
  const [now, setNow] = useState(() => new Date())
  const [titleVisible, setTitleVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Auto-derived Time of Day and Season from user's live clock & date
  const timeOfDay = getTimeOfDayFromDate(now)
  const season = isWinterSeason(now) ? 'winter' : 'summer'

  useEffect(() => {
    // Trigger title reveal 1.0s into the camera swoop
    const timer = setTimeout(() => {
      setTitleVisible(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleCtaClick = () => {
    setIsExiting(true)
    if (onSelectCharacter) {
      setTimeout(() => {
        onSelectCharacter()
      }, 1600)
    }
  }

  // Format real-time clock values
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const dateString = now.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black select-none">
      {/* 
        3D WebGL Living Environment — Fullscreen borderless 
        fov: 58 (zoomed out for expanded cinematic scale & high pixel density)
        dpr={[1, 2.5]} activates full Retina 4K/5K resolution rendering
      */}
      <Canvas
        camera={{ position: [0, 0, 0], fov: 58 }}
        dpr={[1, 2.5]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <CinematicCamera isEntering={!isExiting} onSwoopComplete={() => setTitleVisible(true)} />
          <LivingSky season={season} timeOfDay={timeOfDay} />
          <AtmosphereParticles season={season} timeOfDay={timeOfDay} />
        </Suspense>
      </Canvas>

      {/* Subtle Atmospheric Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/35 via-transparent to-black/20" />

      {/* Top Left: Digital Clock with Live Date */}
      <div className="absolute top-6 left-6 md:left-10 z-20 flex items-center">
        {/* Clock Box */}
        <div className="flex flex-col gap-0.5 px-4 py-2.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-lg text-white">
          <span
            suppressHydrationWarning
            className="font-mono text-xl md:text-2xl font-medium tracking-wider text-white/95"
          >
            {timeString}
          </span>
          <span
            suppressHydrationWarning
            className="text-xs text-white/65 font-sans tracking-wide"
          >
            {dateString}
          </span>
        </div>
      </div>

      {/* Editorial Title Reveal Sequence (Framer Motion) */}
      <AnimatePresence>
        {titleVisible && !isExiting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
          >
            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, filter: 'blur(6px)', y: 10 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{ duration: 1.0, delay: 0.2 }}
              className="text-xs md:text-sm uppercase tracking-[0.35em] text-amber-100/90 font-mono mb-3"
              style={{ textShadow: '0 1px 6px rgba(0, 0, 0, 0.5)' }}
            >
              a wanderer&apos;s atlas
            </motion.p>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, filter: 'blur(8px)', y: 16 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{ duration: 1.4, delay: 0.45 }}
              className="text-4xl md:text-6xl lg:text-7xl font-serif text-white font-normal tracking-wide mb-4"
              style={{
                fontFamily: 'var(--font-serif, "Cinzel", Georgia, serif)',
                textShadow: '0 2px 14px rgba(0, 0, 0, 0.45)',
              }}
            >
              Where the Wildflowers Grow
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, filter: 'blur(6px)', y: 12 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{ duration: 1.2, delay: 0.7 }}
              className="text-sm md:text-base italic text-white/85 font-light tracking-widest max-w-xl mb-10"
              style={{ textShadow: '0 1px 6px rgba(0, 0, 0, 0.4)' }}
            >
              fields &amp; faraway — a portfolio by Drishti Madaan
            </motion.p>

            {/* Pulsing CTA */}
            <motion.button
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.0, delay: 1.1 }}
              onClick={handleCtaClick}
              className="pointer-events-auto group relative px-7 py-3 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 backdrop-blur-md border border-white/30 text-white text-xs md:text-sm font-medium tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_2px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_24px_rgba(255,255,255,0.25)] animate-pulse"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>✦</span>
                <span>Click to choose your character</span>
                <span>✦</span>
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-300/20 via-white/20 to-amber-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cosmic Exit Transition Overlay */}
      <AnimatePresence>
        {isExiting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, ease: 'easeInOut' }}
            className="absolute inset-0 z-30 pointer-events-none bg-gradient-to-b from-[#0a0818] via-[#1a0f30] to-[#0a0715]"
          />
        )}
      </AnimatePresence>
    </div>
  )
}
