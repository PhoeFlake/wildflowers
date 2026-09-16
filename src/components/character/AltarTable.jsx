'use client'

import { useRef, useEffect } from 'react'
import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * AltarTable: The ancient dark stone celestial table holding the mandala and gold zodiac wheel.
 * Matches Option 1 & Option 4 from the user reference (media_1788714935006.png).
 */
export default function AltarTable({ wheelRotationRef, isHovered = false }) {
  const mandalaRef = useRef()
  const goldWheelRef = useRef()
  const mandalaAngle = useRef(0)
  const currentSpeed = useRef(0.025)

  // High-res textures
  const tableTexture = useTexture('/models/character/altar_stone_table.jpg')
  const mandalaTexture = useTexture('/models/character/faint_mandala.png')
  const goldWheelTexture = useTexture('/models/character/zodiac_gold_wheel.png')

  useEffect(() => {
    ;[tableTexture, mandalaTexture, goldWheelTexture].forEach((tex) => {
      if (tex) {
        tex.colorSpace = THREE.SRGBColorSpace
        tex.generateMipmaps = true
        tex.minFilter = THREE.LinearMipmapLinearFilter
        tex.magFilter = THREE.LinearFilter
        tex.needsUpdate = true
      }
    })
  }, [tableTexture, mandalaTexture, goldWheelTexture])

  useFrame((state, delta) => {
    // Mandala acceleration on hover (200ms phase: accelerates from 0.025 to 0.08 rad/s)
    const targetSpeed = isHovered ? 0.075 : 0.02
    currentSpeed.current = THREE.MathUtils.lerp(currentSpeed.current, targetSpeed, delta * 3.0)
    mandalaAngle.current += delta * currentSpeed.current

    if (mandalaRef.current) {
      mandalaRef.current.rotation.z = -mandalaAngle.current
    }

    // Gold Zodiac Wheel rotates with the browsing wheel rotation
    if (goldWheelRef.current && wheelRotationRef?.current !== undefined) {
      goldWheelRef.current.rotation.z = wheelRotationRef.current
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* 
        1. Base Dark Slate Altar Surface
        Size: 13 x 13 units
      */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[13, 13]} />
        <meshStandardMaterial
          map={tableTexture}
          roughness={0.85}
          metalness={0.2}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* 
        2. Expansive Faint Mandala Field (Option 4)
        Underneath everything, barely visible, slowly spinning
      */}
      <mesh ref={mandalaRef} position={[0, 0, 0.02]}>
        <planeGeometry args={[9.2, 9.2]} />
        <meshBasicMaterial
          map={mandalaTexture}
          transparent
          opacity={isHovered ? 0.55 : 0.35}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 
        3. Foundational Gold Zodiac Wheel (Option 1)
        Concentric engraved gold rings with degree marks & astrological glyphs
        Synchronized with wheel browsing rotation
      */}
      <mesh ref={goldWheelRef} position={[0, 0, 0.04]}>
        <planeGeometry args={[7.8, 7.8]} />
        <meshBasicMaterial
          map={goldWheelTexture}
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Warm Ambient Altar Point Light focusing in center */}
      <pointLight position={[0, 0, 2.8]} color="#fde047" intensity={1.2} distance={8} decay={2} />
    </group>
  )
}
