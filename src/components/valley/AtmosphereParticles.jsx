'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Deterministic pseudo-random number generator to satisfy React 19 purity rules
 */
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

/**
 * Creates a circular glowing soft sprite texture for particles
 */
function createGlowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)')
  gradient.addColorStop(0.3, 'rgba(255, 235, 140, 0.75)')
  gradient.addColorStop(0.7, 'rgba(180, 255, 120, 0.25)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function createSnowflakeTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 32
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)')
  gradient.addColorStop(0.5, 'rgba(235, 245, 255, 0.8)')
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 32, 32)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

export default function AtmosphereParticles({ season = 'summer', timeOfDay = 'dusk' }) {
  const pointsRef = useRef()
  const materialRef = useRef()

  const glowTexture = useMemo(() => {
    if (typeof window === 'undefined') return null
    return createGlowTexture()
  }, [])

  const snowTexture = useMemo(() => {
    if (typeof window === 'undefined') return null
    return createSnowflakeTexture()
  }, [])

  const count = season === 'winter' ? 350 : 80

  // Particle state arrays with deterministic pseudo-random generator
  const [positions, params] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const pms = []

    for (let i = 0; i < count; i++) {
      const r1 = seededRandom(i * 3.1 + 1)
      const r2 = seededRandom(i * 4.3 + 2)
      const r3 = seededRandom(i * 5.7 + 3)
      const r4 = seededRandom(i * 6.9 + 4)
      const r5 = seededRandom(i * 7.5 + 5)

      const x = (r1 - 0.5) * 18
      const y = r2 * 7 - 1.5
      const z = -r3 * 10 - 2

      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      pms.push({
        baseX: x,
        baseY: y,
        baseZ: z,
        speedX: 0.3 + r4 * 0.5,
        speedY: 0.4 + r5 * 0.4,
        speedZ: 0.3 + r1 * 0.4,
        radiusX: 1.2 + r2 * 1.8,
        radiusY: 0.6 + r3 * 1.2,
        radiusZ: 0.8 + r4 * 1.5,
        phase: r5 * Math.PI * 2,
        fallSpeed: 0.8 + r2 * 1.2,
        swaySpeed: 1.0 + r3 * 1.8,
      })
    }

    return [pos, pms]
  }, [count])

  useFrame((state) => {
    if (!pointsRef.current) return
    const time = state.clock.getElapsedTime()
    const posAttr = pointsRef.current.geometry.attributes.position
    const array = posAttr.array

    if (season === 'winter') {
      // Gentle swirling snowfall
      for (let i = 0; i < count; i++) {
        const p = params[i]
        array[i * 3 + 1] -= p.fallSpeed * 0.018
        array[i * 3] += Math.sin(time * p.swaySpeed + p.phase) * 0.01 + 0.006

        if (array[i * 3 + 1] < -2.5) {
          array[i * 3 + 1] = 7.0
          array[i * 3] = (seededRandom(time + i) - 0.5) * 18
        }
      }
    } else {
      // Subtle 3D flying fireflies wandering in loops
      for (let i = 0; i < count; i++) {
        const p = params[i]
        const t = time * 0.45 + p.phase

        array[i * 3] = p.baseX + Math.sin(t * p.speedX) * p.radiusX
        array[i * 3 + 1] = p.baseY + Math.sin(t * p.speedY) * p.radiusY
        array[i * 3 + 2] = p.baseZ + Math.cos(t * p.speedZ) * p.radiusZ
      }

      if (materialRef.current) {
        const isNightOrDusk = timeOfDay === 'night' || timeOfDay === 'dusk'
        const baseOpacity = isNightOrDusk ? 0.75 : 0.15
        materialRef.current.opacity = baseOpacity + Math.sin(time * 2.0) * 0.15
      }
    }

    posAttr.needsUpdate = true
  })

  const isNightOrDusk = timeOfDay === 'night' || timeOfDay === 'dusk'
  const particleColor = season === 'winter'
    ? '#e8f4ff'
    : isNightOrDusk
      ? '#e2ff7a'
      : '#fff3aa'

  const particleSize = season === 'winter' ? 0.14 : isNightOrDusk ? 0.18 : 0.10

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        map={season === 'winter' ? snowTexture : glowTexture}
        color={particleColor}
        size={particleSize}
        transparent
        opacity={season === 'winter' ? 0.8 : 0.75}
        blending={season === 'winter' ? THREE.NormalBlending : THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
