/* eslint-disable react-hooks/immutability */
'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ELEMENT_COLORS } from './zodiacData'

/**
 * Deterministic pseudo-random number generator to satisfy React 19 purity rules
 */
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

/**
 * Creates soft glowing firefly / celestial dust particle texture
 * (Same organic type as the title screen fireflies and snowflakes, strictly no confetti).
 */
function createFireflyTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')

  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)')
  grad.addColorStop(0.35, 'rgba(255, 245, 200, 0.85)')
  grad.addColorStop(0.7, 'rgba(255, 220, 140, 0.3)')
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)')

  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 64, 64)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

export default function ElementParticles({
  hoveredSign = null,
  isHoverBurst = false,
  isExploding = false,
  explosionElement = 'earth',
}) {
  const pointsRef = useRef()
  const burstParticlesRef = useRef()
  const explosionPointsRef = useRef()

  const particleTexture = useMemo(() => createFireflyTexture(), [])

  // 1. Ambient Celestial Firefly Motes (180 particles)
  const count = 180
  const { ambientPositions, ambientVelocities, ambientColors } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const s = i * 4
      const radius = 0.5 + seededRandom(s) * 4.8
      const angle = seededRandom(s + 1) * Math.PI * 2
      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = Math.sin(angle) * radius
      pos[i * 3 + 2] = 0.05 + seededRandom(s + 2) * 1.5

      vel[i * 3] = (seededRandom(s + 3) - 0.5) * 0.005
      vel[i * 3 + 1] = (seededRandom(s + 4) - 0.5) * 0.005
      vel[i * 3 + 2] = 0.002 + seededRandom(s + 5) * 0.006

      // Warm golden-starlight tint with occasional elemental colors
      const rPick = seededRandom(s + 6)
      if (rPick > 0.75) {
        col[i * 3] = 1.0
        col[i * 3 + 1] = 0.85
        col[i * 3 + 2] = 0.4
      } else if (rPick > 0.5) {
        col[i * 3] = 0.3
        col[i * 3 + 1] = 0.9
        col[i * 3 + 2] = 1.0
      } else if (rPick > 0.25) {
        col[i * 3] = 0.4
        col[i * 3 + 1] = 1.0
        col[i * 3 + 2] = 0.5
      } else {
        col[i * 3] = 1.0
        col[i * 3 + 1] = 0.45
        col[i * 3 + 2] = 0.35
      }
    }
    return { ambientPositions: pos, ambientVelocities: vel, ambientColors: col }
  }, [count])

  // 2. Hover Burst Particles (60 particles spawned around hovered card)
  const burstCount = 60
  const burstPositions = useMemo(() => new Float32Array(burstCount * 3), [burstCount])
  const burstVelocities = useMemo(() => new Float32Array(burstCount * 3), [burstCount])
  const burstProgress = useRef(1.0)

  // Trigger burst when isHoverBurst changes to true
  useEffect(() => {
    if (isHoverBurst && hoveredSign && burstParticlesRef.current) {
      burstProgress.current = 0
      const haloCol = ELEMENT_COLORS[hoveredSign.element]?.particle || '#22c55e'
      burstParticlesRef.current.material.color.set(haloCol)

      for (let i = 0; i < burstCount; i++) {
        const a = (i / burstCount) * Math.PI * 2
        const spd = 0.025 + (i % 5) * 0.008
        burstPositions[i * 3] = Math.cos(a) * 0.6
        burstPositions[i * 3 + 1] = Math.sin(a) * 0.8
        burstPositions[i * 3 + 2] = 0.15

        burstVelocities[i * 3] = Math.cos(a) * spd
        burstVelocities[i * 3 + 1] = Math.sin(a) * spd
        burstVelocities[i * 3 + 2] = 0.01 + (i % 3) * 0.006
      }
      burstParticlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  }, [isHoverBurst, hoveredSign, burstCount, burstPositions, burstVelocities])

  // 3. Selection Explosion System (300 particles)
  const explosionCount = 300
  const explosionPositions = useMemo(() => new Float32Array(explosionCount * 3), [explosionCount])
  const explosionVelocities = useMemo(() => new Float32Array(explosionCount * 3), [explosionCount])
  const explosionProgress = useRef(1.0)

  useEffect(() => {
    if (isExploding && explosionPointsRef.current) {
      explosionProgress.current = 0
      const c = ELEMENT_COLORS[explosionElement]?.particle || '#22c55e'
      explosionPointsRef.current.material.color.set(c)

      for (let i = 0; i < explosionCount; i++) {
        explosionPositions[i * 3] = 0
        explosionPositions[i * 3 + 1] = 0
        explosionPositions[i * 3 + 2] = 0.3

        const theta = (i / explosionCount) * Math.PI * 2
        const phi = ((i % 10) / 10 - 0.5) * Math.PI
        const spd = 0.08 + (i % 7) * 0.02

        explosionVelocities[i * 3] = Math.cos(phi) * Math.cos(theta) * spd
        explosionVelocities[i * 3 + 1] = Math.cos(phi) * Math.sin(theta) * spd
        explosionVelocities[i * 3 + 2] = Math.sin(phi) * spd * 0.7 + 0.04
      }
      explosionPointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  }, [isExploding, explosionElement, explosionCount, explosionPositions, explosionVelocities])

  useFrame((state, delta) => {
    // Animate ambient fireflies
    if (pointsRef.current && pointsRef.current.geometry) {
      const posAttr = pointsRef.current.geometry.attributes.position
      const p = posAttr.array

      for (let i = 0; i < count; i++) {
        p[i * 3] += ambientVelocities[i * 3]
        p[i * 3 + 1] += ambientVelocities[i * 3 + 1]
        p[i * 3 + 2] += ambientVelocities[i * 3 + 2]

        // Wrap boundaries
        if (p[i * 3 + 2] > 2.2) {
          p[i * 3 + 2] = 0.05
        }
        const d = Math.hypot(p[i * 3], p[i * 3 + 1])
        if (d > 5.5) {
          p[i * 3] *= 0.2
          p[i * 3 + 1] *= 0.2
        }
      }
      posAttr.needsUpdate = true
    }

    // Animate hover burst
    if (burstProgress.current < 1.0 && burstParticlesRef.current) {
      burstProgress.current += delta * 1.8
      const posAttr = burstParticlesRef.current.geometry.attributes.position
      const p = posAttr.array

      for (let i = 0; i < burstCount; i++) {
        p[i * 3] += burstVelocities[i * 3]
        p[i * 3 + 1] += burstVelocities[i * 3 + 1]
        p[i * 3 + 2] += burstVelocities[i * 3 + 2]
      }
      posAttr.needsUpdate = true
      burstParticlesRef.current.material.opacity = Math.max(0, 1.0 - burstProgress.current)
    }

    // Animate selection explosion
    if (explosionProgress.current < 1.0 && explosionPointsRef.current) {
      explosionProgress.current += delta * 0.9
      const posAttr = explosionPointsRef.current.geometry.attributes.position
      const p = posAttr.array

      for (let i = 0; i < explosionCount; i++) {
        p[i * 3] += explosionVelocities[i * 3]
        p[i * 3 + 1] += explosionVelocities[i * 3 + 1]
        p[i * 3 + 2] += explosionVelocities[i * 3 + 2]
      }
      posAttr.needsUpdate = true
      explosionPointsRef.current.material.opacity = Math.max(0, 1.0 - explosionProgress.current)
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Ambient Fireflies / Dust motes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={ambientPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={ambientColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          map={particleTexture}
          vertexColors
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 2. Hover Burst Fireflies */}
      <points ref={burstParticlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={burstCount}
            array={burstPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.22}
          map={particleTexture}
          color="#eab308"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 3. Selection Explosion Dust Cloud */}
      <points ref={explosionPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={explosionCount}
            array={explosionPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.3}
          map={particleTexture}
          color="#eab308"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}
