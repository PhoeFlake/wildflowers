'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { ZODIAC_SIGNS } from './zodiacData'
import ZodiacTile from './ZodiacTile'
import AltarTable from './AltarTable'
import ConstellationMap from './ConstellationMap'
import ElementParticles from './ElementParticles'

export default function ZodiacWheel({
  onSelectCharacter,
  isExploding = false,
  selectedSign = null,
}) {
  const wheelGroupRef = useRef()
  const { gl } = useThree()

  // Wheel angular state (radians)
  // Initialize so Taurus (index 1) is front and center
  const rotationAngle = useRef(-Math.PI * 0.45)
  const rotationVelocity = useRef(0)
  const isDragging = useRef(false)
  const lastPointerX = useRef(0)

  // Hover state
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [hoveredSign, setHoveredSign] = useState(null)
  const [isHoverBurst, setIsHoverBurst] = useState(false)
  const [autoHighlighted, setAutoHighlighted] = useState(true)

  // Turn off auto-highlight once user hovers any card or starts dragging
  const handleUserInteraction = useCallback(() => {
    setAutoHighlighted((prev) => (prev ? false : prev))
  }, [])

  // Pointer drag for wheel rotation
  useEffect(() => {
    const dom = gl.domElement

    const handleWheel = (e) => {
      e.preventDefault()
      handleUserInteraction()
      // Scroll to rotate wheel
      rotationVelocity.current += e.deltaY * 0.0012
    }

    const handlePointerDown = (e) => {
      isDragging.current = true
      lastPointerX.current = e.clientX
    }

    const handlePointerMove = (e) => {
      if (isDragging.current) {
        handleUserInteraction()
        const deltaX = e.clientX - lastPointerX.current
        lastPointerX.current = e.clientX
        rotationVelocity.current += deltaX * 0.003
      }
    }

    const handlePointerUp = () => {
      isDragging.current = false
    }

    dom.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      dom.removeEventListener('wheel', handleWheel)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [gl, handleUserInteraction])

  useFrame((state, delta) => {
    const isAnyHovered = hoveredIndex !== null

    if (!isAnyHovered && !isDragging.current) {
      // 0ms: When NOT hovered, slow continuous ambient wheel drift (0.04 rad/s)
      rotationAngle.current += delta * 0.035
    }

    // Apply drag/scroll velocity with smooth friction
    rotationAngle.current += rotationVelocity.current
    rotationVelocity.current = THREE.MathUtils.lerp(rotationVelocity.current, 0, delta * 4.5)

    if (wheelGroupRef.current) {
      wheelGroupRef.current.rotation.z = rotationAngle.current
    }
  })

  const radius = 3.35

  return (
    <group position={[0, 0, 0]}>
      {/* 
        1. Altar Stone Table with Faint Mandala & Foundational Gold Zodiac Wheel
        Matches Options 1 & 4 from media_1788714935006.png
      */}
      <AltarTable wheelRotationRef={rotationAngle} isHovered={hoveredIndex !== null} />

      {/* 
        2. Constellation Star Map connecting the 12 signs across the center
        Matches Option 2 from media_1788714935006.png
      */}
      <ConstellationMap
        radius={radius}
        wheelRotationRef={rotationAngle}
        hoveredIndex={hoveredIndex}
      />

      {/* 
        3. Rotating Wheel Group holding all 12 flat cards & their element halos
        Matches Option 3 from media_1788714935006.png
      */}
      <group ref={wheelGroupRef} position={[0, 0, 0]}>
        {ZODIAC_SIGNS.map((sign, idx) => {
          // Calculate angle so sign 0 starts at top
          const cardAngle = (idx * 30 * Math.PI) / 180 + Math.PI / 2

          return (
            <ZodiacTile
              key={sign.id}
              sign={sign}
              index={idx}
              angle={cardAngle}
              radius={radius}
              isHovered={hoveredIndex === idx}
              isAutoHighlighted={autoHighlighted}
              onHoverStart={(i, s) => {
                handleUserInteraction()
                setHoveredIndex(i)
                setHoveredSign(s)
                setIsHoverBurst(false)
              }}
              onHoverEnd={(i) => {
                if (hoveredIndex === i) {
                  setHoveredIndex(null)
                  setHoveredSign(null)
                  setIsHoverBurst(false)
                }
              }}
              onHoverBurst={() => {
                setIsHoverBurst(true)
              }}
              onSelect={(s) => {
                if (onSelectCharacter) {
                  onSelectCharacter(s)
                }
              }}
            />
          )
        })}
      </group>

      {/* 
        4. Ambient Fireflies, Hover Bursts, and Selection Explosion Cloud
        (Same organic motes as Horizon Valley, strictly no confetti)
      */}
      <ElementParticles
        hoveredSign={hoveredSign}
        isHoverBurst={isHoverBurst}
        isExploding={isExploding}
        explosionElement={selectedSign ? selectedSign.element : 'earth'}
      />
    </group>
  )
}
