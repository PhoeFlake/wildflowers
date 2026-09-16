/* eslint-disable react-hooks/purity */
'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ZODIAC_SIGNS } from './zodiacData'

/**
 * AscendingConstellation:
 * Activates ONLY after the pedestal disc has completely descended.
 *
 * Choreography:
 * - When activated, zodiac_appearance.mp4 plays in the sky along the pillar axis.
 * - After 1s of the appearance video, the constellation starts fading in.
 * - At 8s, the constellation reaches full brilliant appearance.
 * - At 10s (video end), the 10th second keeps playing in a live continuous loop.
 * - Image aspect ratios are dynamically matched to prevent any stretching.
 */
export default function AscendingConstellation({
  activeSignIndex = 1,
  isActivated = false,
  pillarDistance = 7.8,
}) {
  const groupRef = useRef()
  const beamOuterRef = useRef()
  const appearanceMeshRef = useRef()
  const creatureMeshRef = useRef()
  const risingParticlesRef = useRef()
  const videoRef = useRef(null)
  const textureRef = useRef(null)

  const sign = ZODIAC_SIGNS[activeSignIndex] || ZODIAC_SIGNS[1]

  useEffect(() => {
    if (typeof window === 'undefined') return
    const video = document.createElement('video')
    video.src = '/models/zodiac/zodiac_appearance.mp4'
    video.crossOrigin = 'anonymous'
    video.muted = true
    video.playsInline = true
    video.autoplay = false

    const videoTex = new THREE.VideoTexture(video)
    videoTex.colorSpace = THREE.SRGBColorSpace
    videoTex.minFilter = THREE.LinearFilter
    videoTex.magFilter = THREE.LinearFilter

    videoRef.current = video
    textureRef.current = videoTex

    return () => {
      video.pause()
      video.removeAttribute('src')
      video.load()
      videoTex.dispose()
      videoRef.current = null
      textureRef.current = null
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      if (isActivated) {
        video.currentTime = 0
        video.play().catch(() => {})
      } else {
        video.pause()
        video.currentTime = 0
      }
    }
  }, [isActivated])

  // Celestial creature textures extracted from authentic on-selection sheets
  const ariesTex = useTexture('/models/sanctuary/creatures/creature_aries.png')
  const taurusTex = useTexture('/models/sanctuary/creatures/creature_taurus.png')
  const geminiTex = useTexture('/models/sanctuary/creatures/creature_gemini.png')
  const cancerTex = useTexture('/models/sanctuary/creatures/creature_cancer.png')
  const leoTex = useTexture('/models/sanctuary/creatures/creature_leo.png')
  const virgoTex = useTexture('/models/sanctuary/creatures/creature_virgo.png')
  const libraTex = useTexture('/models/sanctuary/creatures/creature_libra.png')
  const scorpioTex = useTexture('/models/sanctuary/creatures/creature_scorpio.png')
  const sagittariusTex = useTexture('/models/sanctuary/creatures/creature_sagittarius.png')
  const capricornTex = useTexture('/models/sanctuary/creatures/creature_capricorn.png')
  const aquariusTex = useTexture('/models/sanctuary/creatures/creature_aquarius.png')
  const piscesTex = useTexture('/models/sanctuary/creatures/creature_pisces.png')

  const creatureTexture = useMemo(() => {
    switch (sign.id) {
      case 'aries': return ariesTex
      case 'gemini': return geminiTex
      case 'cancer': return cancerTex
      case 'leo': return leoTex
      case 'virgo': return virgoTex
      case 'libra': return libraTex
      case 'scorpio': return scorpioTex
      case 'sagittarius': return sagittariusTex
      case 'capricorn': return capricornTex
      case 'aquarius': return aquariusTex
      case 'pisces': return piscesTex
      case 'taurus':
      default:
        return taurusTex
    }
  }, [
    sign.id,
    ariesTex,
    taurusTex,
    geminiTex,
    cancerTex,
    leoTex,
    virgoTex,
    libraTex,
    scorpioTex,
    sagittariusTex,
    capricornTex,
    aquariusTex,
    piscesTex,
  ])

  useEffect(() => {
    ;[
      ariesTex,
      taurusTex,
      geminiTex,
      cancerTex,
      leoTex,
      virgoTex,
      libraTex,
      scorpioTex,
      sagittariusTex,
      capricornTex,
      aquariusTex,
      piscesTex,
    ].forEach((tex) => {
      if (tex) {
        tex.colorSpace = THREE.SRGBColorSpace
        tex.needsUpdate = true
      }
    })
  }, [
    ariesTex,
    taurusTex,
    geminiTex,
    cancerTex,
    leoTex,
    virgoTex,
    libraTex,
    scorpioTex,
    sagittariusTex,
    capricornTex,
    aquariusTex,
    piscesTex,
  ])

  // Precise geometry coordinates: Front pillar top is at z = pillarDistance - 0.33
  const beamZ = pillarDistance - 0.33
  const pillarTopY = 3.02
  const constellationCenterY = 6.80
  const beamHeight = constellationCenterY - pillarTopY // 3.78m
  const beamCenterY = pillarTopY + beamHeight * 0.5 // 4.91m

  // Base plane height (5.8m) - width is dynamically scaled by aspect ratio in useFrame
  const planeHeight = 5.8

  // Rising Golden Stardust Particles (40 motes streaming up directly along the beam column)
  const particleCount = 40
  const { particlePositions, particleVelocities } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const vel = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.5 // Centered on beam X
      pos[i * 3 + 1] = pillarTopY + Math.random() * beamHeight // Along beam Y
      pos[i * 3 + 2] = beamZ + (Math.random() - 0.5) * 0.4 // Centered on beam Z

      vel[i * 3] = (Math.random() - 0.5) * 0.005
      vel[i * 3 + 1] = 0.035 + Math.random() * 0.05 // Upward velocity
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.005
    }
    return { particlePositions: pos, particleVelocities: vel }
  }, [beamZ, pillarTopY, beamHeight])

  useFrame((state) => {
    const video = videoRef.current

    let t = 0
    if (video && isActivated) {
      t = video.currentTime

      // If video reaches the end (10s), keep playing the 10th second (9.1s -> 9.95s) live!
      if (t >= 9.92) {
        video.currentTime = 9.1
        video.play().catch(() => {})
      }
    }

    // Appearance video opacity (fades in smoothly at start of playback)
    if (appearanceMeshRef.current) {
      if (isActivated && t > 0.05) {
        if (!appearanceMeshRef.current.material.map && textureRef.current) {
          appearanceMeshRef.current.material.map = textureRef.current
          appearanceMeshRef.current.material.needsUpdate = true
        }
        appearanceMeshRef.current.material.opacity = Math.min(1.0, t * 2.0)
        appearanceMeshRef.current.visible = true
      } else {
        appearanceMeshRef.current.visible = false
      }
    }

    // Outer subtle golden light beam column
    if (beamOuterRef.current) {
      if (isActivated && t > 0.2) {
        beamOuterRef.current.material.opacity = Math.min(0.35, t * 0.08)
        const pulse = 1.0 + Math.sin(state.clock.elapsedTime * 2.4) * 0.03
        beamOuterRef.current.scale.set(pulse, 1, pulse)
        beamOuterRef.current.visible = true
      } else {
        beamOuterRef.current.visible = false
      }
    }

    // Celestial Constellation starts fading in after 1s of this mp4, reaches full appearance at 8s
    if (creatureMeshRef.current) {
      if (isActivated && t >= 1.0) {
        const fadeProgress = Math.min(1.0, (t - 1.0) / 7.0) // 1s to 8s
        creatureMeshRef.current.material.opacity = fadeProgress
        const pulse = 1.0 + Math.sin(state.clock.elapsedTime * 1.8) * 0.02
        const aspect = (creatureTexture?.image?.width && creatureTexture?.image?.height)
          ? creatureTexture.image.width / creatureTexture.image.height
          : 1.0
        creatureMeshRef.current.scale.set(pulse * aspect, pulse, 1)
        creatureMeshRef.current.visible = true
      } else {
        creatureMeshRef.current.visible = false
      }
    }

    // Animate rising stardust particles along the beam
    if (risingParticlesRef.current && isActivated && t > 0.6) {
      const posAttr = risingParticlesRef.current.geometry.attributes.position
      const arr = posAttr.array

      for (let i = 0; i < particleCount; i++) {
        arr[i * 3 + 1] += particleVelocities[i * 3 + 1]
        // Wrap back to pillar top
        if (arr[i * 3 + 1] > constellationCenterY + 0.5) {
          arr[i * 3 + 1] = pillarTopY
        }
      }
      posAttr.needsUpdate = true
      risingParticlesRef.current.material.opacity = Math.min(0.85, (t - 0.6) * 0.5)
      risingParticlesRef.current.visible = true
    } else if (risingParticlesRef.current) {
      risingParticlesRef.current.visible = false
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 
        ============================================================
        1. CELESTIAL ZODIAC APPEARANCE VIDEO (zodiac_appearance.mp4)
        Vertical 9:16 rising energy video playing upon activation
        ============================================================
      */}
      <mesh
        ref={appearanceMeshRef}
        position={[0, 5.0, beamZ - 0.06]}
        rotation={[0, Math.PI, 0]}
        visible={false}
      >
        <planeGeometry args={[4.28, 7.6]} />
        <meshBasicMaterial
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 
        ============================================================
        2. OUTER VOLUMETRIC GOLDEN LIGHT SHAFT
        Connects pillar capital directly into constellation image!
        ============================================================
      */}
      <mesh
        ref={beamOuterRef}
        position={[0, beamCenterY, beamZ]}
        visible={false}
      >
        <cylinderGeometry args={[0.72, 0.36, beamHeight, 32, 1, true]} />
        <meshBasicMaterial
          color="#fde047"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Rising Golden Stardust Motes */}
      <points ref={risingParticlesRef} visible={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          color="#fef08a"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 
        ============================================================
        3. CELESTIAL CONSTELLATION & CREATURE IN NIGHT SKY
        Centered precisely at [0, constellationCenterY, beamZ]
        Proportionally sized with exact aspect ratio (no stretching!)
        Fades in from 1s to 8s during zodiac appearance video
        ============================================================
      */}
      <mesh
        ref={creatureMeshRef}
        position={[0, constellationCenterY, beamZ]}
        rotation={[0, Math.PI, 0]}
        visible={false}
      >
        <planeGeometry args={[planeHeight, planeHeight]} />
        <meshBasicMaterial
          map={creatureTexture}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}
