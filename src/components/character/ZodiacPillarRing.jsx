'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ZODIAC_SIGNS } from './zodiacData'

// Module-level persistent singleton video texture for instant loading and zero duplicate fetches
let sharedVideoTexture = null
let sharedVideoElement = null

function getOrCreatePillarVideoTexture() {
  if (typeof window === 'undefined') return null
  if (sharedVideoTexture) return sharedVideoTexture

  const video = document.createElement('video')
  video.loop = true
  video.muted = true
  video.playsInline = true
  video.autoplay = true
  video.preload = 'auto'

  // Pre-fetch via blob to avoid slow Range requests in Next.js dev server
  const loadVideo = async () => {
    try {
      const isWebmSupported = video.canPlayType('video/webm; codecs="vp9"') || video.canPlayType('video/webm')
      const targetUrl = isWebmSupported ? '/models/zodiac/card_outline.webm' : '/models/zodiac/card_outline.mp4'

      const response = await fetch(targetUrl)
      if (response.ok) {
        const blob = await response.blob()
        video.src = URL.createObjectURL(blob)
      } else {
        video.src = '/models/zodiac/card_outline.mp4'
      }
    } catch {
      video.src = '/models/zodiac/card_outline.mp4'
    }
    video.play().catch(() => {})
  }

  loadVideo()

  const videoTex = new THREE.VideoTexture(video)
  videoTex.colorSpace = THREE.SRGBColorSpace
  videoTex.minFilter = THREE.LinearFilter
  videoTex.magFilter = THREE.LinearFilter

  sharedVideoElement = video
  sharedVideoTexture = videoTex

  return sharedVideoTexture
}

/**
 * SSR-safe hook to retrieve the persistent HTML5 VideoTexture for pillar card outlines.
 */
function usePillarVideoTexture() {
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    const tex = getOrCreatePillarVideoTexture()
    setTexture(tex)
    if (sharedVideoElement && sharedVideoElement.paused) {
      sharedVideoElement.play().catch(() => {})
    }
  }, [])

  return texture
}

/**
 * An individual weathered travertine stone pillar monolith.
 * Matches the authentic concept asset sheets:
 * - Front face (+Z): Authentic sculpted relief, Latin name, glyph & Corinthian capital
 * - Side faces (+X, -X): Authentic carved acanthus/vine leaf moldings
 * - Back face (-Z): Authentic astronomical compass & rune axis
 * - Base & Cornice: Weathered mossy stone plinths & classical entablature
 */
function ZodiacPillar({
  sign,
  angle,
  radius,
  isHighlighted = false,
  isActivated = false,
  videoTexture = null,
}) {
  const groupRef = useRef()
  const backAuraRef = useRef()
  const spotlightRef = useRef()
  const videoMeshRef = useRef()

  // Load authentic textures for this sign
  const frontTex = useTexture(`/models/sanctuary/pillars/${sign.id}_front.png`)
  const sideTex = useTexture(`/models/sanctuary/pillars/${sign.id}_side.png`)
  const backTex = useTexture(`/models/sanctuary/pillars/${sign.id}_back.png`)
  const baseTex = useTexture('/models/sanctuary/stone_base_moss.png')
  const softAuraTex = useTexture('/models/sanctuary/pillar_soft_aura.png')

  useEffect(() => {
    ;[frontTex, sideTex, backTex, baseTex, softAuraTex].forEach((tex) => {
      if (tex) {
        tex.colorSpace = THREE.SRGBColorSpace
        tex.generateMipmaps = true
        tex.minFilter = THREE.LinearMipmapLinearFilter
        tex.magFilter = THREE.LinearFilter
        tex.needsUpdate = true
      }
    })
  }, [frontTex, sideTex, backTex, baseTex, softAuraTex])

  // Multi-material mapping for the 6 faces of the main pillar monolith:
  // 0: +X (Right), 1: -X (Left), 2: +Y (Top), 3: -Y (Bottom), 4: +Z (Front), 5: -Z (Back)
  const materials = useMemo(() => {
    const sideMat = new THREE.MeshStandardMaterial({
      map: sideTex,
      roughness: 0.72,
      metalness: 0.12,
    })
    const frontMat = new THREE.MeshStandardMaterial({
      map: frontTex,
      roughness: 0.68,
      metalness: 0.14,
    })
    const backMat = new THREE.MeshStandardMaterial({
      map: backTex,
      roughness: 0.75,
      metalness: 0.12,
    })
    const stoneMat = new THREE.MeshStandardMaterial({
      map: baseTex,
      roughness: 0.82,
      metalness: 0.08,
    })

    return [sideMat, sideMat, stoneMat, stoneMat, frontMat, backMat]
  }, [sideTex, frontTex, backTex, baseTex])

  const x = Math.sin(angle) * radius
  const z = Math.cos(angle) * radius
  const rotY = angle + Math.PI // Face toward center courtyard

  const currentGlow = useRef(isHighlighted ? 1 : 0)

  useFrame((state, delta) => {
    const targetGlow = isHighlighted ? (isActivated ? 2.2 : 1.0) : 0.0
    currentGlow.current = THREE.MathUtils.lerp(currentGlow.current, targetGlow, delta * 6.0)

    if (backAuraRef.current) {
      backAuraRef.current.material.opacity = currentGlow.current * 0.85
      const pulse = 1.0 + Math.sin(state.clock.elapsedTime * 2.0) * 0.03
      backAuraRef.current.scale.set(pulse, pulse, 1)
    }
    if (videoMeshRef.current) {
      videoMeshRef.current.material.opacity = Math.min(1.0, currentGlow.current)
    }
    if (spotlightRef.current) {
      spotlightRef.current.intensity = isHighlighted ? (isActivated ? 5.8 : 4.2) : 0.5
    }
  })

  return (
    <group ref={groupRef} position={[x, 0, z]} rotation={[0, rotY, 0]}>
      {/* 
        ============================================================
        1. SOLID EMBEDDED FOUNDATION & STEPPED BASE
        Embeds firmly into the courtyard stone with no floating gaps!
        ============================================================
      */}
      {/* Sub-floor Embedded Foundation Anchor */}
      <mesh position={[0, -0.04, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.56, 0.16, 1.04]} />
        <meshStandardMaterial map={baseTex} roughness={0.88} metalness={0.06} />
      </mesh>
      {/* Bottom Plinth Step */}
      <mesh position={[0, 0.08, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.42, 0.14, 0.90]} />
        <meshStandardMaterial map={baseTex} roughness={0.82} metalness={0.08} />
      </mesh>
      {/* Upper Plinth Step */}
      <mesh position={[0, 0.21, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.28, 0.14, 0.78]} />
        <meshStandardMaterial map={baseTex} roughness={0.80} metalness={0.08} />
      </mesh>

      {/* 
        ============================================================
        2. MAIN PILLAR MONOLITH (6-Face Multi-Material 3D Box)
        ============================================================
      */}
      <mesh
        position={[0, 1.54, 0]}
        material={materials}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[1.12, 2.48, 0.66]} />
      </mesh>

      {/* 
        ============================================================
        3. 3D ARCHITECTURAL RELIEF PILASTERS & CORNICE LINTELS
        ============================================================
      */}
      {/* Left Front Pilaster Moulding */}
      <mesh position={[-0.48, 1.62, 0.345]} castShadow receiveShadow>
        <boxGeometry args={[0.06, 2.0, 0.03]} />
        <meshStandardMaterial map={baseTex} roughness={0.75} metalness={0.1} />
      </mesh>
      {/* Right Front Pilaster Moulding */}
      <mesh position={[0.48, 1.62, 0.345]} castShadow receiveShadow>
        <boxGeometry args={[0.06, 2.0, 0.03]} />
        <meshStandardMaterial map={baseTex} roughness={0.75} metalness={0.1} />
      </mesh>
      {/* Arch Top Lintel */}
      <mesh position={[0, 2.52, 0.345]} castShadow receiveShadow>
        <boxGeometry args={[1.02, 0.06, 0.03]} />
        <meshStandardMaterial map={baseTex} roughness={0.75} metalness={0.1} />
      </mesh>

      {/* 
        ============================================================
        4. TOP CLASSICAL ENTABLATURE & CORNICE CROWNING
        ============================================================
      */}
      <mesh position={[0, 2.86, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.28, 0.16, 0.78]} />
        <meshStandardMaterial map={baseTex} roughness={0.78} metalness={0.1} />
      </mesh>
      <mesh position={[0, 2.98, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.34, 0.08, 0.84]} />
        <meshStandardMaterial map={baseTex} roughness={0.82} metalness={0.08} />
      </mesh>

      {/* 
        ============================================================
        5. GLOW COMING FROM BEHIND THE PILLAR (Silhouetting the stone)
        Golden celestial aura radiating outward from behind the monolith
        ============================================================
      */}
      <mesh ref={backAuraRef} position={[0, 1.62, -0.38]}>
        <planeGeometry args={[2.5, 3.8]} />
        <meshBasicMaterial
          map={softAuraTex}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 
        ============================================================
        6. GLOWING ANIMATED CARD OUTLINE (MP4 Video Texture)
        Additively blends glowing animated video outline along the card
        ============================================================
      */}
      {isHighlighted && videoTexture && (
        <mesh ref={videoMeshRef} position={[0, 1.54, 0.348]}>
          <planeGeometry args={[1.14, 2.28]} />
          <meshBasicMaterial
            map={videoTexture}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* 
        ============================================================
        7. DEDICATED WARM SPOTLIGHT
        ============================================================
      */}
      <pointLight
        ref={spotlightRef}
        position={[0, 2.0, 1.8]}
        color={isHighlighted ? '#fef08a' : '#fed7aa'}
        intensity={isHighlighted ? 4.2 : 0.5}
        distance={6.5}
        decay={1.8}
      />
    </group>
  )
}

/**
 * ZodiacPillarRing:
 * 12 massive weathered stone pillars forming the outer carousel.
 * Smoothly interpolates carousel rotation for fluid turntable animation!
 */
export default function ZodiacPillarRing({
  rotationY = 0,
  activeSignIndex = 1,
  isActivated = false,
  radius = 7.8,
}) {
  const ringRef = useRef()
  const currentRotation = useRef(rotationY)
  const videoTexture = usePillarVideoTexture()

  // Angles for 12 signs so Taurus (index 1) is at angle 0 (directly front of player)
  const pillarAngles = useMemo(() => {
    return ZODIAC_SIGNS.map((sign, idx) => {
      return (idx - 1) * (Math.PI / 6)
    })
  }, [])

  useFrame((state, delta) => {
    // Smooth continuous carousel lerp
    currentRotation.current = THREE.MathUtils.damp(
      currentRotation.current,
      rotationY,
      7.0,
      delta
    )
    if (ringRef.current) {
      ringRef.current.rotation.y = currentRotation.current
    }
  })

  return (
    <group ref={ringRef} position={[0, 0, 0]}>
      {ZODIAC_SIGNS.map((sign, idx) => (
        <ZodiacPillar
          key={sign.id}
          sign={sign}
          angle={pillarAngles[idx]}
          radius={radius}
          isHighlighted={activeSignIndex === idx}
          isActivated={isActivated && activeSignIndex === idx}
          videoTexture={activeSignIndex === idx ? videoTexture : null}
        />
      ))}
    </group>
  )
}

