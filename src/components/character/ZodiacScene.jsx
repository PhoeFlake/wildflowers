'use client'

import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import SanctuaryEnvironment from './SanctuaryEnvironment'
import ZodiacPillarRing from './ZodiacPillarRing'
import AstronomicalPedestal from './AstronomicalPedestal'
import AscendingConstellation from './AscendingConstellation'

/**
 * FPV Camera Controller:
 * Recreates the exact camera angles from the reference storyboard:
 * - Browsing: Eye level (1.58m), looking past the ornate stone pedestal directly at Taurus
 * - Confirming/Descending: Smoothly steps closer and looks down onto the descending disc
 * - Constellation: Pulls back and tilts up to reveal the celestial Bull and constellation in the sky
 */
function SanctuaryFPVCamera({ phase = 'browsing', pillarRadius = 7.8 }) {
  const currentPos = useRef(new THREE.Vector3(0, 1.58, 0.4))
  const currentLookAt = useRef(new THREE.Vector3(0, 1.75, pillarRadius))

  const targetPos = useRef(new THREE.Vector3(0, 1.58, 0.4))
  const targetLookAt = useRef(new THREE.Vector3(0, 1.75, pillarRadius))

  useEffect(() => {
    if (phase === 'pedestal') {
      // Image 1: Side angle close-up on the pedestal (fraction of a second)
      // Snap instantly during initial flash so the user immediately sees Image 1
      currentPos.current.set(0, 1.35, 0.45)
      currentLookAt.current.set(0, 0.72, 2.0)
      targetPos.current.set(0, 1.35, 0.45)
      targetLookAt.current.set(0, 0.72, 2.0)
    } else if (phase === 'topView' || phase === 'bursting' || phase === 'flash' || phase === 'details') {
      // Top View: Camera glides up and tilts down to look directly at the top of the pedestal
      // Camera STAYS on top! It never goes back to front!
      targetPos.current.set(0, 2.30, 1.05)
      targetLookAt.current.set(0, 1.10, 2.0)
    } else {
      // Default cinematic browsing state: eye level looking at carousel pillar
      targetPos.current.set(0, 1.58, 0.4)
      targetLookAt.current.set(0, 1.75, pillarRadius)
    }
  }, [phase, pillarRadius])

  useFrame((state, delta) => {
    const isTop = phase === 'topView' || phase === 'bursting' || phase === 'flash' || phase === 'details'
    const lerpSpeed = isTop ? delta * 3.8 : delta * 2.8
    currentPos.current.lerp(targetPos.current, lerpSpeed)
    currentLookAt.current.lerp(targetLookAt.current, lerpSpeed)

    state.camera.position.copy(currentPos.current)
    state.camera.lookAt(currentLookAt.current)
  })

  return null
}

export default function ZodiacScene({
  carouselStep = 0,
  onStepChange,
  activeSignIndex = 1,
  phase = 'browsing',
  onConfirmSelection,
  onResetSelection,
  onSwirlBurst,
}) {
  const isDragging = useRef(false)
  const lastPointerX = useRef(0)

  // Drag rotation offset added to continuous base angle
  const [dragOffset, setDragOffset] = useState(0)

  // Continuous base angle directly derived from continuous carouselStep:
  // Step 0 is angle 0 (Taurus). Each forward step decreases angle by PI/6.
  // Never jumps or wraps backward!
  const baseAngle = -carouselStep * (Math.PI / 6)
  const rotationAngle = baseAngle + dragOffset

  // Pointer drag event handlers for rotating the mechanism
  const handlePointerDown = (e) => {
    if (phase !== 'browsing') return
    isDragging.current = true
    lastPointerX.current = e.clientX
  }

  const handlePointerMove = (e) => {
    if (!isDragging.current || phase !== 'browsing') return
    const deltaX = e.clientX - lastPointerX.current
    lastPointerX.current = e.clientX

    setDragOffset((prev) => prev + deltaX * 0.005)
  }

  const handlePointerUp = () => {
    if (!isDragging.current) return
    isDragging.current = false

    const step = Math.PI / 6
    const totalAngle = baseAngle + dragOffset
    const snappedAngle = Math.round(totalAngle / step) * step
    const newStep = Math.round(-snappedAngle / step)

    setDragOffset(0)
    if (onStepChange) {
      onStepChange(newStep)
    }
  }

  const pillarRadius = 7.8 // Intimate circular colonnade radius matching reference

  return (
    <div
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onWheel={(e) => {
        if (phase !== 'browsing') return
        if (Math.abs(e.deltaY) > 20) {
          const delta = e.deltaY > 0 ? 1 : -1
          if (onStepChange) {
            onStepChange(carouselStep + delta)
          }
        }
      }}
    >
      <Canvas
        camera={{ position: [0, 1.58, 0.4], fov: 52, near: 0.1, far: 2000 }}
        dpr={[1, 2.5]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        className="w-full h-full"
      >
        <SanctuaryFPVCamera phase={phase} pillarRadius={pillarRadius} />

        <Suspense fallback={null}>
          {/* 1. Atmospheric Courtyard Lighting, Twilight Sky & Ground Fire Braziers */}
          <SanctuaryEnvironment pillarRadius={pillarRadius} />

          {/* 
            2. The 12 Massive Weathered Travertine Stone Pillars Carousel
            Rotates around the player in unison with the central disc
          */}
          <ZodiacPillarRing
            rotationY={rotationAngle}
            activeSignIndex={activeSignIndex}
            isActivated={phase === 'constellation' || phase === 'activated'}
            radius={pillarRadius}
          />

          {/* 
            3. Permanent Fixed Central Stone Pedestal with Rotating Disc
            Positioned at [0, 0, 2.0], only the disc rotates & descends!
          */}
          <AstronomicalPedestal
            position={[0, 0, 2.0]}
            discRotationY={rotationAngle}
            activeSignIndex={activeSignIndex}
            isConfirming={phase === 'pedestal' || phase === 'topView' || phase === 'bursting' || phase === 'flash' || phase === 'details'}
            isDescended={phase === 'pedestal' || phase === 'topView' || phase === 'bursting' || phase === 'flash' || phase === 'details'}
            isTopView={phase === 'topView' || phase === 'bursting' || phase === 'flash' || phase === 'details'}
            onPressGlyph={() => {
              if (phase === 'browsing' && onConfirmSelection) {
                onConfirmSelection()
              }
            }}
            onSwirlBurst={onSwirlBurst}
          />

          {/* 
            4. Ascending Constellation
            ORIGINATES DIRECTLY FROM THE FRONT STONE SCULPTURE!
            (Kept dormant for now as requested, ready for when we return to constellations)
          */}
          <AscendingConstellation
            activeSignIndex={activeSignIndex}
            isActivated={false}
            pillarDistance={pillarRadius}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

