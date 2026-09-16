'use client'

import { useRef, useState, useEffect } from 'react'
import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ELEMENT_COLORS } from './zodiacData'

/**
 * ZodiacTile: An individual flat talisman tile lying on the wheel.
 * Includes:
 * 1. Flat Element Halo Ring underneath (Option 3)
 * 2. Front & Back double-sided card with 180° flip
 * 3. Layered 0ms - 400ms hover sequence (vibration, lift, halo flare, flip)
 */
export default function ZodiacTile({
  sign,
  index,
  angle,
  radius = 3.35,
  isHovered = false,
  isAutoHighlighted = false,
  onHoverStart,
  onHoverEnd,
  onSelect,
  onHoverBurst,
}) {
  const groupRef = useRef()
  const cardGroupRef = useRef()
  const haloRef = useRef()

  // Front and back card face textures
  const frontTexture = useTexture(`/models/character/tiles/tile_front_${sign.id}.png`)
  const backTexture = useTexture(`/models/character/tiles/tile_back_${sign.id}.png`)
  const haloTexture = useTexture('/models/character/element_halo_ring.png')

  useEffect(() => {
    ;[frontTexture, backTexture, haloTexture].forEach((tex) => {
      if (tex) {
        tex.colorSpace = THREE.SRGBColorSpace
        tex.generateMipmaps = true
        tex.minFilter = THREE.LinearMipmapLinearFilter
        tex.magFilter = THREE.LinearFilter
        tex.needsUpdate = true
      }
    })
  }, [frontTexture, backTexture, haloTexture])

  // Hover timer tracking (0ms, 80ms, 200ms, 400ms)
  const hoverDuration = useRef(0)
  const burstFired = useRef(false)

  // Motion states
  const currentLift = useRef(0.06)
  const currentFlip = useRef(0)
  const currentHaloOpacity = useRef(0.4)
  const currentHaloScale = useRef(1.0)
  const [activeHover, setActiveHover] = useState(false)

  // Auto-highlight for Taurus on arrival
  const effectiveHover = isHovered || (isAutoHighlighted && sign.isHerSign)

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()

    if (effectiveHover) {
      hoverDuration.current += delta

      // 0ms: Micro-vibration (trembling with contained elemental energy)
      let vibX = 0
      let vibY = 0
      if (hoverDuration.current < 0.4) {
        vibX = (Math.sin(time * 65) * 0.01) * (1.0 - hoverDuration.current / 0.4)
        vibY = (Math.cos(time * 65) * 0.01) * (1.0 - hoverDuration.current / 0.4)
      }

      // 80ms: Card lifts +20px toward camera (Z from 0.06 to 0.45)
      const targetLift = hoverDuration.current >= 0.08 ? 0.45 : 0.06
      currentLift.current = THREE.MathUtils.lerp(currentLift.current, targetLift, delta * 8.0)

      // 80ms: Element halo flares
      const targetHaloOpacity = hoverDuration.current >= 0.08 ? 0.95 : 0.45
      const targetHaloScale = hoverDuration.current >= 0.08 ? 1.25 : 1.0
      currentHaloOpacity.current = THREE.MathUtils.lerp(currentHaloOpacity.current, targetHaloOpacity, delta * 7.0)
      currentHaloScale.current = THREE.MathUtils.lerp(currentHaloScale.current, targetHaloScale, delta * 7.0)

      // 200ms: Particle burst from halo
      if (hoverDuration.current >= 0.2 && !burstFired.current) {
        burstFired.current = true
        if (onHoverBurst) {
          onHoverBurst(sign)
        }
      }

      // 400ms: Card flips 180° on Y-axis to reveal character art & flavor quote
      const targetFlip = hoverDuration.current >= 0.4 ? Math.PI : 0
      currentFlip.current = THREE.MathUtils.lerp(currentFlip.current, targetFlip, delta * 6.5)

      // Idle gentle bobbing while holding hover
      const bobbing = Math.sin(time * 2.5 + index) * 0.02

      if (cardGroupRef.current) {
        cardGroupRef.current.position.set(vibX, vibY, currentLift.current + bobbing)
        cardGroupRef.current.rotation.y = currentFlip.current
      }
    } else {
      // Mouse away: reset smoothly
      hoverDuration.current = 0
      burstFired.current = false

      currentLift.current = THREE.MathUtils.lerp(currentLift.current, 0.06, delta * 6.0)
      currentFlip.current = THREE.MathUtils.lerp(currentFlip.current, 0, delta * 7.0)
      currentHaloOpacity.current = THREE.MathUtils.lerp(currentHaloOpacity.current, 0.4, delta * 5.0)
      currentHaloScale.current = THREE.MathUtils.lerp(currentHaloScale.current, 1.0, delta * 5.0)

      if (cardGroupRef.current) {
        cardGroupRef.current.position.set(0, 0, currentLift.current)
        cardGroupRef.current.rotation.y = currentFlip.current
      }
    }

    // Update halo mesh
    if (haloRef.current) {
      haloRef.current.material.opacity = currentHaloOpacity.current
      haloRef.current.scale.set(currentHaloScale.current, currentHaloScale.current, 1)
    }
  })

  // Position along the circular wheel
  const posX = Math.cos(angle) * radius
  const posY = Math.sin(angle) * radius

  return (
    <group ref={groupRef} position={[posX, posY, 0]}>
      {/* 
        1. Individual Element Halo Ring (Option 3)
        Lies flat on the wheel surface beneath the tile
      */}
      <mesh ref={haloRef} position={[0, 0, 0.02]}>
        <planeGeometry args={[1.45, 1.45]} />
        <meshBasicMaterial
          map={haloTexture}
          color={ELEMENT_COLORS[sign.element]?.halo || '#22c55e'}
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 
        2. Double-Sided Talisman Tile Card
        Flips 180° around its local Y-axis at 400ms hover
      */}
      <group
        ref={cardGroupRef}
        position={[0, 0, 0.06]}
        onPointerOver={(e) => {
          e.stopPropagation()
          setActiveHover(true)
          if (onHoverStart) onHoverStart(index, sign)
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          setActiveHover(false)
          if (onHoverEnd) onHoverEnd(index, sign)
        }}
        onClick={(e) => {
          e.stopPropagation()
          if (onSelect) onSelect(sign)
        }}
      >
        {/* Invisible enlarged hit target for easy interaction */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[0.9, 1.3]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* Front Face (Talisman with glowing medallion & glyph) */}
        <mesh position={[0, 0, 0.005]} castShadow receiveShadow>
          <planeGeometry args={[0.76, 1.14]} />
          <meshStandardMaterial
            map={frontTexture}
            roughness={0.55}
            metalness={0.25}
            side={THREE.FrontSide}
          />
        </mesh>

        {/* Back Face (Character portrait, title, and flavor quote) */}
        <mesh position={[0, 0, -0.005]} rotation={[0, Math.PI, 0]} castShadow receiveShadow>
          <planeGeometry args={[0.76, 1.14]} />
          <meshStandardMaterial
            map={backTexture}
            roughness={0.55}
            metalness={0.25}
            side={THREE.FrontSide}
          />
        </mesh>
      </group>
    </group>
  )
}
