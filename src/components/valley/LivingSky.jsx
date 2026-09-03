/* eslint-disable react-hooks/immutability */
'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useTexture } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { getSunPosition } from './astronomy'

export default function LivingSky({ season = 'summer', timeOfDay = 'dusk' }) {
  const backdropRef = useRef()
  const mistFarRef = useRef()
  const mistNearRef = useRef()
  const { gl, scene } = useThree()

  const driftAngle = useRef(0)
  const mouseX = useRef(0)
  const mouseY = useRef(0)

  // 8 Canonical Clean Landscapes with cache-busting query to ensure instant browser reload
  const summerDawn = useTexture('/models/valley/island_dawn.jpg?v=7')
  const summerDay = useTexture('/models/valley/island_day.jpg?v=7')
  const summerDusk = useTexture('/models/valley/island_dusk.jpg?v=7')
  const summerNight = useTexture('/models/valley/island_night.jpg?v=7')

  const winterDawn = useTexture('/models/valley/island_winter_dawn.jpg?v=7')
  const winterDay = useTexture('/models/valley/island_winter_day.jpg?v=7')
  const winterDusk = useTexture('/models/valley/island_winter_dusk.jpg?v=7')
  const winterNight = useTexture('/models/valley/island_winter_night.jpg?v=7')

  const cloudTexture = useTexture('/models/welcome/smooth_cloud_base.png')

  // Resolve active landscape texture based on season and timeOfDay
  const activeTexture = useMemo(() => {
    if (season === 'winter') {
      if (timeOfDay === 'dawn') return winterDawn
      if (timeOfDay === 'day') return winterDay
      if (timeOfDay === 'dusk') return winterDusk
      return winterNight
    }
    if (timeOfDay === 'dawn') return summerDawn
    if (timeOfDay === 'day') return summerDay
    if (timeOfDay === 'dusk') return summerDusk
    return summerNight
  }, [season, timeOfDay, summerDawn, summerDay, summerDusk, summerNight, winterDawn, winterDay, winterDusk, winterNight])

  // Atmosphere ambient colors
  const atmosphereColors = useMemo(() => {
    switch (timeOfDay) {
      case 'dawn':
        return { bg: '#251b2e' }
      case 'day':
        return { bg: '#5a96d8' }
      case 'dusk':
        return { bg: '#2c1524' }
      case 'night':
      default:
        return { bg: '#060b18' }
    }
  }, [timeOfDay])

  useEffect(() => {
    if (activeTexture) {
      activeTexture.colorSpace = THREE.SRGBColorSpace
      activeTexture.generateMipmaps = true
      activeTexture.minFilter = THREE.LinearMipmapLinearFilter
      activeTexture.magFilter = THREE.LinearFilter
      const maxAniso = gl.capabilities.getMaxAnisotropy ? gl.capabilities.getMaxAnisotropy() : 16
      activeTexture.anisotropy = maxAniso
      activeTexture.needsUpdate = true
    }
    scene.background = new THREE.Color(atmosphereColors.bg)
  }, [activeTexture, gl, scene, atmosphereColors])

  const sunData = useMemo(() => getSunPosition(timeOfDay), [timeOfDay])

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()

    // Gentle continuous organic drift
    driftAngle.current += delta * 0.006

    // Smooth bounded mouse parallax
    const targetX = -state.pointer.x * 2.2 + Math.sin(driftAngle.current) * 0.3
    const targetY = state.pointer.y * 1.1

    mouseY.current = THREE.MathUtils.lerp(mouseY.current, targetX, delta * 3.2)
    mouseX.current = THREE.MathUtils.lerp(mouseX.current, targetY, delta * 3.2)

    if (backdropRef.current) {
      backdropRef.current.position.x = mouseY.current
      backdropRef.current.position.y = mouseX.current
    }

    // Soft 3D Parallax Mist across mountains
    if (mistFarRef.current) {
      mistFarRef.current.position.x = mouseY.current * 1.35 + Math.sin(time * 0.08) * 1.5 - 2.0
      mistFarRef.current.position.y = mouseX.current * 1.25 + 1.2
    }

    // Soft 3D Parallax Mist rolling over shoreline
    if (mistNearRef.current) {
      mistNearRef.current.position.x = mouseY.current * 1.7 + Math.cos(time * 0.1) * 1.2 + 3.0
      mistNearRef.current.position.y = mouseX.current * 1.5 - 2.5
    }
  })

  // Directional sun light position
  const sunX = Math.sin(sunData.azimuth * Math.PI) * 25
  const sunY = sunData.elevation * 30
  const sunZ = -Math.cos(sunData.azimuth * Math.PI) * 25

  return (
    <group>
      {/* Natural Ambient & Directional Lighting */}
      <ambientLight color={sunData.ambientColor} intensity={sunData.lightIntensity * 0.9} />
      <directionalLight
        position={[sunX, sunY, sunZ]}
        color={sunData.sunColor}
        intensity={sunData.lightIntensity}
      />

      {/* 
        Cinema-Scope 16:9 Master Landscape at Z = -15:
        - Width: 36, Height: 20 (Exact 16:9 ratio, completely flat — ZERO outward convergence!)
        - 50% larger than screen view frustum: NO edges, NO black borders, NO corner cuts!
      */}
      <mesh
        ref={backdropRef}
        position={[0, 0, -15]}
      >
        <planeGeometry args={[36, 20]} />
        <meshBasicMaterial
          map={activeTexture}
          toneMapped={false}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* 
        Soft Translucent 3D Parallax Depth Mist Layers
      */}
      <mesh
        ref={mistFarRef}
        position={[-2, 1.2, -10]}
      >
        <planeGeometry args={[18, 5]} />
        <meshBasicMaterial
          map={cloudTexture}
          transparent
          opacity={timeOfDay === 'night' ? 0.08 : 0.14}
          depthWrite={false}
        />
      </mesh>

      <mesh
        ref={mistNearRef}
        position={[3, -2.5, -6]}
      >
        <planeGeometry args={[14, 4]} />
        <meshBasicMaterial
          map={cloudTexture}
          transparent
          opacity={timeOfDay === 'night' ? 0.06 : 0.10}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
