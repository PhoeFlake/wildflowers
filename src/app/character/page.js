'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import ZodiacScene from '@/components/character/ZodiacScene'
import ZodiacGlyph from '@/components/character/ZodiacGlyph'
import { ZODIAC_SIGNS } from '@/components/character/zodiacData'

export default function CharacterSelectionPage() {
  const router = useRouter()

  // Continuous carousel step: 0 is Taurus (index 1, Her Patron Sign).
  // Stepping forward increments endlessly (Pisces at 10 -> Aries at 11 -> Taurus at 12...).
  // This guarantees an unbroken, continuous circle in both directions with zero reversal.
  const [carouselStep, setCarouselStep] = useState(0)

  // Timeline Phases: 'browsing' -> 'pedestal' (max 3s) -> 'pullingBack' -> 'aligned' (Image 2 state)
  const [phase, setPhase] = useState('browsing')
  const [initialFlash, setInitialFlash] = useState(false)
  const [isSolidWhiteFlash, setIsSolidWhiteFlash] = useState(false)

  const timeoutsRef = useRef([])

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }, [])

  useEffect(() => {
    return () => clearAllTimeouts()
  }, [clearAllTimeouts])

  const activeSignIndex = (((carouselStep + 1) % 12) + 12) % 12
  const activeSign = ZODIAC_SIGNS[activeSignIndex] || ZODIAC_SIGNS[1]

  // Multi-Phase Selection Sequence Choreography:
  // 1. t = 0s: Simultaneous initial flash + Image 1 side angle (fraction of a second ~0.4s).
  // 2. t = 0.4s: Camera glides to Top View of pedestal; sparkles start from center; constellation fades in to 90% over 1s.
  // 3. t = 3.4s: Sparkles alpha enters its last second. Simultaneously:
  //    - Fullscreen circle burst (Image 5 / pedestal_swirl.mp4 at 9.0s) plays.
  //    - Constellation fades out from 90% to 0% over 1s.
  // 4. t = 4.4s: That 1 second gets over! Whole screen goes blank with white flash.
  // 5. t = 4.7s: Automatically navigates to the new Character Details page!
  const handleConfirmSelection = useCallback(() => {
    if (phase !== 'browsing') return
    clearAllTimeouts()

    // 1. Simultaneous initial flash & Image 1 side view (fraction of a second)
    setInitialFlash(true)
    const t0 = setTimeout(() => setInitialFlash(false), 250)
    timeoutsRef.current.push(t0)

    setPhase('pedestal')

    // 2. Fraction of a second on Image 1 (0.4s), then glide to Top View
    const t1 = setTimeout(() => {
      setPhase('topView')
    }, 400)
    timeoutsRef.current.push(t1)

    // 3. At t = 3.4s (when the top view swirl & sparkles complete):
    // Whole screen goes blank with solid white flash!
    const t3 = setTimeout(() => {
      setIsSolidWhiteFlash(true)
      setPhase('flash')
    }, 3400)
    timeoutsRef.current.push(t3)

    // 5. At t = 3.7s: Automatically navigate to character details page
    const t4 = setTimeout(() => {
      router.push(`/character/details?sign=${activeSign.id}`)
    }, 3700)
    timeoutsRef.current.push(t4)
  }, [phase, activeSign.id, router, clearAllTimeouts])

  // Keyboard navigation (Arrow keys to rotate mechanism)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (phase !== 'browsing') return
      if (e.key === 'ArrowLeft') {
        setCarouselStep((prev) => prev - 1)
      } else if (e.key === 'ArrowRight') {
        setCarouselStep((prev) => prev + 1)
      } else if (e.key === 'Enter' || e.key === ' ') {
        handleConfirmSelection()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [phase, handleConfirmSelection])

  const handleResetSelection = () => {
    clearAllTimeouts()
    setInitialFlash(false)
    setIsSolidWhiteFlash(false)
    setPhase('browsing')
  }

  const handlePrevSign = () => {
    if (phase !== 'browsing') return
    setCarouselStep((prev) => prev - 1)
  }

  const handleNextSign = () => {
    if (phase !== 'browsing') return
    setCarouselStep((prev) => prev + 1)
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#06050b] select-none text-white font-sans">
      {/* 
        3D Cinematic Astronomical Sanctuary Canvas
        First-Person View (FPV)
      */}
      <div className="absolute inset-0 z-0">
        <ZodiacScene
          carouselStep={carouselStep}
          onStepChange={(newStep) => setCarouselStep(newStep)}
          activeSignIndex={activeSignIndex}
          phase={phase}
          onConfirmSelection={handleConfirmSelection}
          onResetSelection={handleResetSelection}
        />
      </div>

      {/* Top Left: Navigation Back to Horizon Valley */}
      <div className="absolute top-6 left-6 md:left-10 z-20 flex items-center gap-3">
        <Link
          href="/title"
          className="group px-4 py-2 rounded-xl bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/15 text-xs font-mono tracking-wider text-white/80 hover:text-white transition-all shadow-xl flex items-center gap-2 cursor-pointer"
        >
          <span className="text-amber-400 group-hover:-translate-x-0.5 transition-transform">←</span>
          <span>Valley Title</span>
        </Link>
      </div>

      {/* Top Center: Sanctuary Header & Active Sign Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: phase === 'constellation' ? 0.35 : 1,
          y: phase === 'constellation' ? -15 : 0,
        }}
        transition={{ duration: 0.8 }}
        className="pointer-events-none absolute top-6 left-0 right-0 z-10 flex flex-col items-center text-center px-4"
      >
        <p className="text-[11px] uppercase tracking-[0.35em] text-amber-200/75 font-mono mb-1">
          ANCIENT ASTRONOMICAL SANCTUARY
        </p>

        <div className="flex items-center gap-3">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-serif text-white font-normal tracking-wide drop-shadow-lg"
            style={{ fontFamily: 'var(--font-serif, "Cinzel", Georgia, serif)' }}
          >
            {activeSign.name}
          </h1>
          <ZodiacGlyph
            sign={activeSign.id}
            className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] inline-block"
          />
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-white/60 font-mono tracking-wider">
            {activeSign.dates} • {activeSign.creature}
          </span>
          {activeSign.isHerSign && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/60 text-amber-300 font-mono text-[10px] font-bold tracking-widest uppercase">
              ★ Her Patron Sign
            </span>
          )}
        </div>
      </motion.div>

      {/* Left & Right Stone Arrow Buttons for Accessible Mechanism Rotation */}
      {phase === 'browsing' && (
        <>
          <button
            onClick={handlePrevSign}
            aria-label="Previous Zodiac Sign"
            className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/50 hover:bg-black/80 active:scale-95 border border-white/20 hover:border-amber-400/60 text-amber-200 flex items-center justify-center text-lg transition-all shadow-2xl cursor-pointer backdrop-blur-sm"
          >
            ❮
          </button>
          <button
            onClick={handleNextSign}
            aria-label="Next Zodiac Sign"
            className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/50 hover:bg-black/80 active:scale-95 border border-white/20 hover:border-amber-400/60 text-amber-200 flex items-center justify-center text-lg transition-all shadow-2xl cursor-pointer backdrop-blur-sm"
          >
            ❯
          </button>
        </>
      )}

      {/* Bottom Center: Interactive State Prompts & Confirmation Action */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex flex-col items-center text-center px-4 pointer-events-none">
        <AnimatePresence mode="wait">
          {phase === 'browsing' && (
            <motion.div
              key="browsing-ui"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-3 pointer-events-auto"
            >
              {/* Primary Stone Button to Confirm & Descend Disc */}
              <button
                onClick={handleConfirmSelection}
                className="group px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 font-mono text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-2xl flex items-center gap-2.5 cursor-pointer border border-amber-300"
              >
                <span>✦</span>
                <span>Press Glyph to Align Sanctuary</span>
                <span>✦</span>
              </button>

              <div className="px-5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono tracking-widest text-amber-200/70 shadow-lg">
                Drag horizontally or use arrow keys to rotate • Click pedestal glyph to lock
              </div>
            </motion.div>
          )}



          {(phase === 'details' || phase === 'aligned') && (
            <motion.div
              key="details-ui"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 pointer-events-auto"
            >
              {/* Reset button to browse other signs */}
              <button
                onClick={handleResetSelection}
                className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-98 text-white/90 hover:text-white font-mono text-xs tracking-wider uppercase border border-white/20 transition-all cursor-pointer shadow-lg"
              >
                Rotate Mechanism Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>



      {/* 
        ============================================================
        SOLID WHITE FLASH COVERING THE ENTIRE SCREEN
        Succeeds Image 4 at t=9.7s-10.3s right as the swirl video ends
        ============================================================
      */}
      <AnimatePresence>
        {isSolidWhiteFlash && (
          <motion.div
            key="solid-white-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed inset-0 bg-white pointer-events-none z-50"
          />
        )}
      </AnimatePresence>

      {/* 
        ============================================================
        INITIAL CLICK SIMULTANEOUS FLASH
        Flashes immediately when user presses glyph at t=0s
        ============================================================
      */}
      <AnimatePresence>
        {initialFlash && (
          <motion.div
            key="initial-flash"
            initial={{ opacity: 0.95 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed inset-0 bg-white pointer-events-none z-50"
          />
        )}
      </AnimatePresence>
    </main>
  )
}
