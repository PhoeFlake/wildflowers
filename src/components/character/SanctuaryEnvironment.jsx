/* eslint-disable react-hooks/immutability */
'use client'

import { useMemo, useEffect, useRef } from 'react'
import { useTexture, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * NebulaSkybox:
 * Uses the user's 16K nebula GLB (public/models/zodiac/nebula_skybox_16k.glb).
 * By keeping the sphere centered on the camera in useFrame, the player is perpetually
 * at the core of the 16K celestial sphere, gazing at 360° deep space and stellar nebulae.
 */
function NebulaSkybox() {
  const { scene: skyScene } = useGLTF('/models/zodiac/nebula_skybox_16k.glb')
  const skyRef = useRef()

  useEffect(() => {
    skyScene.traverse((child) => {
      if (child.isMesh) {
        child.raycast = () => null
        if (child.material) {
          child.material = child.material.clone()
          child.material.side = THREE.DoubleSide
          child.material.depthWrite = false
          child.material.toneMapped = false
          if (child.material.map) {
            child.material.map.colorSpace = THREE.SRGBColorSpace
            child.material.map.needsUpdate = true
          }
        }
      }
    })
  }, [skyScene])

  useFrame((state, delta) => {
    if (skyRef.current) {
      // Keep sphere centered on camera position so player is at the core
      skyRef.current.position.copy(state.camera.position)
      skyRef.current.rotation.y += delta * 0.006
    }
  })

  return (
    <group ref={skyRef}>
      <primitive
        object={skyScene}
        scale={0.35}
        position={[0, 0, 0]}
      />
    </group>
  )
}

if (typeof window !== 'undefined') {
  useGLTF.preload('/models/zodiac/nebula_skybox_16k.glb')
  useGLTF.preload('/models/zodiac/japanese_street_lamp.glb')
}

/**
 * StreetLantern:
 * Authentic stone lantern using public/models/zodiac/japanese_street_lamp.glb
 */
function StreetLantern({ position, rotation, lightRef }) {
  const { scene: lampScene } = useGLTF('/models/zodiac/japanese_street_lamp.glb')
  const clonedLamp = useMemo(() => {
    const clone = lampScene.clone(true)
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        if (child.material) {
          child.material = child.material.clone()
        }
      }
    })
    return clone
  }, [lampScene])

  return (
    <group position={position} rotation={rotation}>
      <primitive object={clonedLamp} scale={0.92} position={[0, 0, 0]} />
      {/* Warm flickering flame point light within the lantern housing */}
      <pointLight
        ref={lightRef}
        position={[0, 0.96, 0]}
        color="#f59e0b"
        intensity={2.6}
        distance={5.8}
        decay={2.0}
      />
    </group>
  )
}

export default function SanctuaryEnvironment({ pillarRadius = 7.8 }) {
  // Authentic PBR ground asset extracted from user sheet (media_1788992167303.jpg)
  const floorPbrTexture = useTexture('/models/sanctuary/sanctuary_floor_pbr.png')
  const stoneBaseTexture = useTexture('/models/sanctuary/stone_base_moss.png')
  const lanternLightsRef = useRef([])

  useEffect(() => {
    if (floorPbrTexture) {
      floorPbrTexture.colorSpace = THREE.SRGBColorSpace
      floorPbrTexture.generateMipmaps = true
      floorPbrTexture.minFilter = THREE.LinearMipmapLinearFilter
      floorPbrTexture.magFilter = THREE.LinearFilter
      floorPbrTexture.needsUpdate = true
    }
    if (stoneBaseTexture) {
      stoneBaseTexture.colorSpace = THREE.SRGBColorSpace
      stoneBaseTexture.generateMipmaps = true
      stoneBaseTexture.wrapS = THREE.RepeatWrapping
      stoneBaseTexture.wrapT = THREE.RepeatWrapping
      stoneBaseTexture.repeat.set(4, 4)
      stoneBaseTexture.needsUpdate = true
    }
  }, [floorPbrTexture, stoneBaseTexture])

  // 12 Lantern positions located in the gaps between the 12 pillars
  const lanterns = useMemo(() => {
    const items = []
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI * 2) / 12 + Math.PI / 12
      const dist = pillarRadius - 0.55
      items.push({
        x: Math.sin(a) * dist,
        z: Math.cos(a) * dist,
        angle: a,
      })
    }
    return items
  }, [pillarRadius])

  // Organic flickering of the 12 lanterns
  useFrame((state) => {
    const t = state.clock.elapsedTime
    lanternLightsRef.current.forEach((light, i) => {
      if (light) {
        light.intensity = 2.4 + Math.sin(t * 6.5 + i * 2.1) * 0.45 + Math.cos(t * 10 + i) * 0.25
      }
    })
  })

  return (
    <group position={[0, 0, 0]}>
      {/* 
        ============================================================
        1. 16K PANORAMIC CELESTIAL NEBULA SKYBOX (Centered on camera)
        ============================================================
      */}
      <NebulaSkybox />

      {/* 
        ============================================================
        2. ATMOSPHERIC LIGHTING SETUP
        ============================================================
      */}
      {/* Rich Ambient Sky & Stone Fill Light */}
      <ambientLight color="#6d6582" intensity={2.6} />

      {/* Main Celestial Moonlight illuminating the arena from high front-right */}
      <directionalLight
        position={[8, 16, 6]}
        color="#dbeafe"
        intensity={2.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      {/* Horizon Twilight Sky Rim Light */}
      <directionalLight
        position={[-6, 4, 18]}
        color="#fcd34d"
        intensity={1.6}
      />

      {/* Courtyard Center Fill Point Light */}
      <pointLight position={[0, 2.2, 2.0]} color="#fef08a" intensity={2.0} distance={8} decay={1.8} />

      {/* 
        ============================================================
        3. AUTHENTIC ANCIENT ZODIAC STONE SANCTUARY FLOOR
        Directly matches concept sheet (media_1788992167303.jpg):
        - 12 carved Roman/Greek zodiac glyph bands
        - Concentric ancient runic rings
        - Center 16-point stone sunburst star compass
        ============================================================
      */}
      {/* Main Intricate Carved Zodiac Courtyard Floor */}
      <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[pillarRadius + 0.5, 64]} />
        <meshStandardMaterial
          map={floorPbrTexture}
          roughness={0.72}
          metalness={0.16}
        />
      </mesh>

      {/* Circular Courtyard Perimeter Stone Curb (Zero background line artifacts) */}
      <mesh position={[0, -0.06, 0]} receiveShadow>
        <cylinderGeometry args={[pillarRadius + 0.52, pillarRadius + 0.52, 0.12, 64]} />
        <meshStandardMaterial
          map={stoneBaseTexture}
          roughness={0.85}
          metalness={0.08}
        />
      </mesh>

      {/* 
        ============================================================
        4. 12 AUTHENTIC STREET LAMPS (japanese_street_lamp.glb)
        Located in the colonnade gaps between each pair of stone pillars
        ============================================================
      */}
      {lanterns.map((l, idx) => (
        <StreetLantern
          key={idx}
          position={[l.x, 0, l.z]}
          rotation={[0, l.angle + Math.PI, 0]}
          lightRef={(el) => {
            if (el) lanternLightsRef.current[idx] = el
          }}
        />
      ))}
    </group>
  )
}
