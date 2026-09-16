'use client'

import { useRef, useEffect, useMemo } from 'react'
import { useTexture, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ZODIAC_SIGNS } from './zodiacData'

/**
 * AstronomicalPedestal:
 * Recreates the exact Central Pedestal from the concept asset sheet (media_1788988802000.jpg).
 *
 * Features:
 * - Authentic 3D stepped mossy stone plinths
 * - Twisted fluted column shaft with sculpted lion head capital
 * - Fixed tabletop with circular bronze rune ring & cardinal plaques
 * - Recessed socket cavity
 * - Rotating inner astrological disc that physically descends into the socket upon confirmation
 * - Surrounding light beam model (Effect_Exit.glb) appearing around the pedestal base on selection
 * - Pedestal swirl video (pedestal_swirl.mp4) playing from 0s upon selection and bursting in the last second
 * - Central illuminated active zodiac glyph on the disc matching Final State images
 */
// Aspect ratios of all 12 creature artworks to prevent any stretching
const CREATURE_ASPECTS = [
  973 / 1024, // 0: aries (0.950)
  973 / 1024, // 1: taurus (0.950)
  985 / 1024, // 2: gemini (0.962)
  973 / 1024, // 3: cancer (0.950)
  906 / 1024, // 4: leo (0.885)
  973 / 1024, // 5: virgo (0.950)
  1024 / 951, // 6: libra (1.077)
  967 / 1024, // 7: scorpio (0.944)
  973 / 1024, // 8: sagittarius (0.950)
  973 / 1024, // 9: capricorn (0.950)
  1024 / 985, // 10: aquarius (1.039)
  973 / 1024, // 11: pisces (0.950)
]

export default function AstronomicalPedestal({
  position = [0, 0, 2.0],
  discRotationY = 0,
  activeSignIndex = 1,
  isConfirming = false,
  isDescended = false,
  isTopView = false,
  onPressGlyph,
  onSwirlBurst,
}) {
  const discGroupRef = useRef()
  const discMeshRef = useRef()
  const socketLightRef = useRef()
  const pedestalBeamRef = useRef()
  const swirlMeshRef = useRef()
  const swirlVideoRef = useRef(null)
  const swirlTextureRef = useRef(null)

  // Sparkles Alpha Video & Floating Constellation Refs
  const sparklesVideoRef = useRef(null)
  const sparklesTextureRef = useRef(null)
  const sparklesMeshRef = useRef()
  const constellationMeshRef = useRef()
  const constellationMatRef = useRef()
  const sparklesMatRef = useRef()

  const sign = ZODIAC_SIGNS[activeSignIndex] || ZODIAC_SIGNS[1]

  // Controlled VideoTexture for pedestal swirl video
  useEffect(() => {
    if (typeof window === 'undefined') return
    const video = document.createElement('video')
    video.src = '/models/zodiac/pedestal_swirl.mp4'
    video.crossOrigin = 'anonymous'
    video.muted = true
    video.playsInline = true
    video.autoplay = false

    const videoTex = new THREE.VideoTexture(video)
    videoTex.colorSpace = THREE.SRGBColorSpace
    videoTex.minFilter = THREE.LinearFilter
    videoTex.magFilter = THREE.LinearFilter

    swirlVideoRef.current = video
    swirlTextureRef.current = videoTex

    return () => {
      video.pause()
      video.removeAttribute('src')
      video.load()
      videoTex.dispose()
      swirlVideoRef.current = null
      swirlTextureRef.current = null
    }
  }, [])

  // Reset or pre-seek swirl video so it can play instantly without buffer latency
  useEffect(() => {
    const video = swirlVideoRef.current
    if (!video) return
    if (isTopView || isConfirming) {
      if (video.currentTime < 9.0) {
        video.currentTime = 9.0
      }
    } else {
      video.pause()
      video.currentTime = 0
    }
  }, [isTopView, isConfirming, isDescended])

  // Sparkles Alpha Video Setup (/models/sparkles_alpha.webm + /models/sparkles_alpha.mov)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.muted = true
    video.playsInline = true
    video.autoplay = false

    const srcWebm = document.createElement('source')
    srcWebm.src = '/models/sparkles_alpha.webm'
    srcWebm.type = 'video/webm'
    video.appendChild(srcWebm)

    const srcMov = document.createElement('source')
    srcMov.src = '/models/sparkles_alpha.mov'
    srcMov.type = 'video/quicktime'
    video.appendChild(srcMov)

    video.load()

    const videoTex = new THREE.VideoTexture(video)
    videoTex.colorSpace = THREE.SRGBColorSpace
    videoTex.minFilter = THREE.LinearFilter
    videoTex.magFilter = THREE.LinearFilter

    sparklesVideoRef.current = video
    sparklesTextureRef.current = videoTex

    return () => {
      video.pause()
      video.removeAttribute('src')
      video.load()
      videoTex.dispose()
      sparklesVideoRef.current = null
      sparklesTextureRef.current = null
    }
  }, [])

  // Start sparkles alpha video when top view begins
  useEffect(() => {
    const video = sparklesVideoRef.current
    if (!video) return
    if (isTopView) {
      video.currentTime = 0
      video.play().catch(() => {})
    } else if (!isConfirming && !isDescended) {
      video.pause()
      video.currentTime = 0
    }
  }, [isTopView, isConfirming, isDescended])

  // Light beam GLB appearing around pedestal after selection
  const gltf = useGLTF('/models/zodiac/light_beam/source/Effect_Exit.glb')
  const pedestalBeamScene = useMemo(() => {
    const clone = gltf.scene.clone(true)
    clone.traverse((child) => {
      if (child.isLight) child.intensity = 0
      if (child.isMesh && child.material) {
        child.material = child.material.clone()
        child.material.transparent = true
        child.material.depthWrite = false
        child.material.blending = THREE.AdditiveBlending
        child.material.side = THREE.DoubleSide
      }
    })
    return clone
  }, [gltf.scene])

  const beamMixer = useMemo(() => {
    const m = new THREE.AnimationMixer(pedestalBeamScene)
    if (gltf.animations && gltf.animations.length > 0) {
      m.clipAction(gltf.animations[0]).play()
    }
    return m
  }, [pedestalBeamScene, gltf.animations])

  // Authentic textures extracted directly from user's concept sheets
  const discTexture = useTexture('/models/sanctuary/pedestal/pedestal_disc_inner.png')
  const tabletopTexture = useTexture('/models/sanctuary/pedestal/pedestal_tabletop_full.png')
  const shaftTexture = useTexture('/models/sanctuary/pedestal/pedestal_column_front.png')
  const baseTexture = useTexture('/models/sanctuary/stone_base_moss.png')

  // Golden glyph emblems for all 12 signs matching Final State sheets
  const glyphTextures = useTexture([
    '/models/sanctuary/pedestal/glyphs/glyph_aries.png',
    '/models/sanctuary/pedestal/glyphs/glyph_taurus.png',
    '/models/sanctuary/pedestal/glyphs/glyph_gemini.png',
    '/models/sanctuary/pedestal/glyphs/glyph_cancer.png',
    '/models/sanctuary/pedestal/glyphs/glyph_leo.png',
    '/models/sanctuary/pedestal/glyphs/glyph_virgo.png',
    '/models/sanctuary/pedestal/glyphs/glyph_libra.png',
    '/models/sanctuary/pedestal/glyphs/glyph_scorpio.png',
    '/models/sanctuary/pedestal/glyphs/glyph_sagittarius.png',
    '/models/sanctuary/pedestal/glyphs/glyph_capricorn.png',
    '/models/sanctuary/pedestal/glyphs/glyph_aquarius.png',
    '/models/sanctuary/pedestal/glyphs/glyph_pisces.png',
  ])
  const activeGlyphTexture = glyphTextures[activeSignIndex] || glyphTextures[1]

  // All 12 high-resolution transparent constellation creature textures
  const creatureTextures = useTexture([
    '/models/sanctuary/creatures/creature_aries.png',
    '/models/sanctuary/creatures/creature_taurus.png',
    '/models/sanctuary/creatures/creature_gemini.png',
    '/models/sanctuary/creatures/creature_cancer.png',
    '/models/sanctuary/creatures/creature_leo.png',
    '/models/sanctuary/creatures/creature_virgo.png',
    '/models/sanctuary/creatures/creature_libra.png',
    '/models/sanctuary/creatures/creature_scorpio.png',
    '/models/sanctuary/creatures/creature_sagittarius.png',
    '/models/sanctuary/creatures/creature_capricorn.png',
    '/models/sanctuary/creatures/creature_aquarius.png',
    '/models/sanctuary/creatures/creature_pisces.png',
  ])
  const activeCreatureTexture = creatureTextures[activeSignIndex] || creatureTextures[1]
  const activeAspect = CREATURE_ASPECTS[activeSignIndex] || (973 / 1024)

  useEffect(() => {
    ;[
      discTexture,
      tabletopTexture,
      shaftTexture,
      baseTexture,
      ...glyphTextures,
      ...creatureTextures,
    ].forEach((tex) => {
      if (tex) {
        tex.colorSpace = THREE.SRGBColorSpace
        tex.generateMipmaps = true
        tex.minFilter = THREE.LinearMipmapLinearFilter
        tex.magFilter = THREE.LinearFilter
        tex.needsUpdate = true
      }
    })
  }, [discTexture, tabletopTexture, shaftTexture, baseTexture, glyphTextures, creatureTextures])

  // Disc descent: from resting y = 1.11 down to y = 0.96 into socket
  const currentY = useRef(1.11)
  const targetY = useRef(1.11)
  const flareIntensity = useRef(1.0)
  const currentDiscRotY = useRef(discRotationY)

  useEffect(() => {
    if (isDescended) {
      targetY.current = 0.95
    } else {
      targetY.current = 1.11
    }
  }, [isDescended])

  const beamProgress = useRef(0)
  const topViewTimer = useRef(0)
  const constellationOpacity = useRef(0)
  const sparklesOpacity = useRef(0)

  useFrame((state, delta) => {
    currentY.current = THREE.MathUtils.lerp(currentY.current, targetY.current, delta * 3.6)

    if (discGroupRef.current) {
      discGroupRef.current.position.y = currentY.current
    }

    currentDiscRotY.current = THREE.MathUtils.damp(
      currentDiscRotY.current,
      discRotationY,
      7.0,
      delta
    )

    if (discMeshRef.current) {
      discMeshRef.current.rotation.y = -currentDiscRotY.current
    }

    if (isConfirming || isDescended) {
      beamProgress.current = Math.min(1.0, beamProgress.current + delta * 2.2)
      beamMixer.update(delta)
    } else {
      beamProgress.current = Math.max(0.0, beamProgress.current - delta * 3.0)
    }

    if (pedestalBeamRef.current) {
      const s = 3.5 * beamProgress.current
      pedestalBeamRef.current.scale.set(s, s, s)
      pedestalBeamRef.current.visible = beamProgress.current > 0.02
    }

    // Swirl video playback & burst tracking
    const video = swirlVideoRef.current
    let swirlTime = 0
    let burstProgress = 0

    if (video && (isConfirming || isDescended)) {
      swirlTime = video.currentTime

      // Burst during the last second of pedestal_swirl.mp4 (9.0s to 10.0s)
      if (swirlTime >= 9.0) {
        burstProgress = Math.min(1.0, (swirlTime - 9.0) / 0.95)
      }

      if (onSwirlBurst) {
        onSwirlBurst(burstProgress, swirlTime)
      }
    }

    if (swirlMeshRef.current) {
      if ((isConfirming || isDescended) && video && video.readyState >= 2 && !video.paused && swirlTime > 0.05) {
        if (!swirlMeshRef.current.material.map && swirlTextureRef.current) {
          swirlMeshRef.current.material.map = swirlTextureRef.current
          swirlMeshRef.current.material.needsUpdate = true
        }

        if (burstProgress > 0) {
          // Last second: swirl bursts outwards in 3D across tabletop and space
          const burstScale = 1.0 + Math.pow(burstProgress, 1.6) * 4.0
          swirlMeshRef.current.scale.set(burstScale, burstScale, 1)

          // 0.8s smooth fade-in transition
          const discFadeIn = Math.min(1.0, Math.max(0, swirlTime - 9.0) / 0.8)
          const discOpacity = 0.95 * Math.sin((discFadeIn * Math.PI) / 2)
          swirlMeshRef.current.material.opacity = discOpacity
        } else {
          swirlMeshRef.current.scale.set(1, 1, 1)
          const discFadeIn = Math.min(1.0, swirlTime / 0.8)
          swirlMeshRef.current.material.opacity = Math.min(0.85, discFadeIn * 0.85)
        }
        swirlMeshRef.current.visible = true
      } else {
        swirlMeshRef.current.visible = false
      }
    }

    const targetFlare = isConfirming ? 2.5 : isDescended ? 2.0 : 1.0
    flareIntensity.current = THREE.MathUtils.lerp(flareIntensity.current, targetFlare, delta * 4.0)

    if (socketLightRef.current) {
      socketLightRef.current.intensity = isConfirming || isDescended
        ? flareIntensity.current * 1.2
        : 1.8
      socketLightRef.current.color.set('#fde68a')
    }

    // Sparkles & Constellation animation during Top View
    if (isTopView) {
      topViewTimer.current += delta
      const t = topViewTimer.current

      if (t < 1.0) {
        // 0s - 1s: Fade in to 90% opacity
        const targetOpacity = (t / 1.0) * 0.90
        constellationOpacity.current = THREE.MathUtils.lerp(
          constellationOpacity.current,
          targetOpacity,
          delta * 8.0
        )
      } else if (t < 2.0) {
        // 1s - 2s: Stay at 90% opacity (subtle celestial translucency)
        constellationOpacity.current = 0.90
      } else if (t <= 3.0) {
        // 2s - 3s: Last 1s of sparkles alpha - constellation slowly fades out over 1s as requested
        const fadeOutProgress = (t - 2.0) / 1.0
        const targetOpacity = Math.max(0, 0.90 * (1 - fadeOutProgress))
        constellationOpacity.current = THREE.MathUtils.lerp(
          constellationOpacity.current,
          targetOpacity,
          delta * 8.0
        )

        // Simultaneously trigger the last 1s of swirl video (from 9.0s to 10.0s) on the tabletop!
        const sVideo = swirlVideoRef.current
        if (sVideo && (sVideo.paused || sVideo.currentTime < 9.0)) {
          sVideo.currentTime = 9.0
          sVideo.play().catch(() => {})
        }
      } else {
        constellationOpacity.current = 0
      }
    } else {
      topViewTimer.current = 0
      constellationOpacity.current = 0
    }

    if (constellationMeshRef.current) {
      if (constellationOpacity.current > 0.01) {
        constellationMeshRef.current.visible = true
        if (constellationMatRef.current) {
          constellationMatRef.current.opacity = constellationOpacity.current
        }
        // Always face the camera directly in 3D
        constellationMeshRef.current.lookAt(state.camera.position)
      } else {
        constellationMeshRef.current.visible = false
      }
    }

    // Sparkles animation management:
    // Originates from the middle of the pedestal, expanding outward
    const sVideo = sparklesVideoRef.current
    if (sparklesMeshRef.current) {
      if ((isTopView || (topViewTimer.current > 0 && isConfirming)) && sVideo && sVideo.readyState >= 2) {
        if (!sparklesMeshRef.current.material.map && sparklesTextureRef.current) {
          sparklesMeshRef.current.material.map = sparklesTextureRef.current
          sparklesMeshRef.current.material.needsUpdate = true
        }

        const sTime = sVideo.currentTime
        // Animation starts from the middle of the pedestal and expands outward encircling tabletop
        const expandProgress = Math.min(1.0, sTime / 0.8)
        const scale = 0.42 + expandProgress * 0.80
        sparklesMeshRef.current.scale.set(scale, scale, 1)

        // 0.8s smooth fade-in transition
        sparklesOpacity.current = Math.min(1.0, sTime / 0.8)
        if (sparklesMatRef.current) {
          sparklesMatRef.current.opacity = sparklesOpacity.current
        }
        sparklesMeshRef.current.visible = true

        // Always face the camera directly in 3D
        sparklesMeshRef.current.lookAt(state.camera.position)
      } else {
        sparklesMeshRef.current.visible = false
      }
    }
  })

  return (
    <group position={position}>
      {/* 
        ============================================================
        1. PERMANENT FIXED STONE PEDESTAL (Never rotates)
        Uses authentic textures from media_1788988802000.jpg
        ============================================================
      */}
      <group position={[0, 0, 0]}>
        {/* Tiered Circular Base Steps with Moss & Weathered Cracks */}
        <mesh position={[0, 0.08, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[0.66, 0.74, 0.16, 36]} />
          <meshStandardMaterial
            map={baseTexture}
            roughness={0.82}
            metalness={0.08}
          />
        </mesh>
        <mesh position={[0, 0.21, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[0.56, 0.64, 0.12, 36]} />
          <meshStandardMaterial
            map={baseTexture}
            roughness={0.80}
            metalness={0.08}
          />
        </mesh>

        {/* 
          Ornate Twisted Fluted Column Shaft with Lion Head Capital
          Textured with authentic column artwork from concept sheet
        */}
        <group position={[0, 0.60, 0]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.42, 0.48, 0.68, 32]} />
            <meshStandardMaterial
              map={shaftTexture}
              roughness={0.68}
              metalness={0.14}
            />
          </mesh>

          {/* Sculpted Lion Head Capital Collar at Top of Column */}
          <mesh position={[0, 0.34, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.58, 0.42, 0.18, 32]} />
            <meshStandardMaterial
              map={shaftTexture}
              roughness={0.65}
              metalness={0.16}
            />
          </mesh>
        </group>

        {/* 
          Carved Circular Stone Tabletop with Recessed Socket
          Height ~ 1.06m
        */}
        <mesh position={[0, 1.02, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.66, 0.60, 0.16, 48]} />
          <meshStandardMaterial
            map={baseTexture}
            roughness={0.76}
            metalness={0.10}
          />
        </mesh>

        {/* Stationary Carved Stone Tabletop Rim with Cardinal Plaques & Outer Bronze Ring */}
        <mesh position={[0, 1.102, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <ringGeometry args={[0.44, 0.66, 48]} />
          <meshStandardMaterial
            map={tabletopTexture}
            roughness={0.62}
            metalness={0.24}
          />
        </mesh>

        {/* Recessed Socket Walls */}
        <mesh position={[0, 1.01, 0]} receiveShadow>
          <cylinderGeometry args={[0.44, 0.44, 0.18, 36, 1, true]} />
          <meshStandardMaterial color="#2d2419" roughness={0.9} metalness={0.2} side={THREE.BackSide} />
        </mesh>

        {/* Recessed Socket Floor */}
        <mesh position={[0, 0.92, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[0.44, 36]} />
          <meshStandardMaterial color="#1f1811" roughness={0.92} metalness={0.15} />
        </mesh>
      </group>

      {/* 
        ============================================================
        2. EMBEDDED ROTATING ASTRONOMICAL DISC (Authentic Top View)
        ============================================================
      */}
      <group ref={discGroupRef} position={[0, 1.11, 0]}>
        <group ref={discMeshRef} rotation={[0, 0, 0]}>
          {/* Main Astronomical Rotating Disc Textured with Concept Art (Lying Horizontally) */}
          <mesh
            castShadow
            receiveShadow
            onClick={(e) => {
              e.stopPropagation()
              if (onPressGlyph) onPressGlyph()
            }}
            cursor="pointer"
          >
            <cylinderGeometry args={[0.43, 0.43, 0.04, 48]} />
            <meshStandardMaterial
              map={discTexture}
              roughness={0.46}
              metalness={0.55}
            />
          </mesh>

          {/* Active Golden Astrological Glyph Lying Flat on Top of Disc */}
          <mesh position={[0, 0.022, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.16, 48]} />
            <meshBasicMaterial
              map={activeGlyphTexture}
              transparent
              opacity={isConfirming ? 1.0 : isDescended ? 0.96 : 0.85}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>

          {/* Golden Outer Rune Channel Glow Ring Lying Flat on Top of Disc */}
          <mesh position={[0, 0.021, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.15, 0.23, 48]} />
            <meshBasicMaterial
              color="#fde047"
              transparent
              opacity={isConfirming ? 0.98 : isDescended ? 0.85 : 0.60}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>

        {/* Initial pedestal light beam cylinder (hidden for now as requested, preserved for later) */}
        {/* <mesh ref={lightBeamsRef} position={[0, 0.75, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 1.5, 32, 1, true]} />
          <meshBasicMaterial
            color="#fef08a"
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh> */}
      </group>

      {/* 
        ============================================================
        3. SURROUNDING LIGHT BEAM EFFECT AROUND PEDESTAL BASE
        Uses user's Effect_Exit.glb 3D animated model
        ============================================================
      */}
      <group
        ref={pedestalBeamRef}
        position={[0, 0.04, 0]}
        visible={false}
      >
        <primitive object={pedestalBeamScene} />
      </group>

      {/* 
        ============================================================
        4. PEDESTAL SWIRL VIDEO (pedestal_swirl.mp4)
        Radiates cosmic energy on the tabletop during selection & transition
        ============================================================
      */}
      <mesh
        ref={swirlMeshRef}
        position={[0, 1.115, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={4}
        visible={false}
      >
        <circleGeometry args={[0.43, 48]} />
        <meshBasicMaterial
          color="#ffea75"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Warm Golden Point Light above Pedestal */}
      <pointLight
        ref={socketLightRef}
        position={[0, 1.4, 0]}
        color="#fef08a"
        intensity={2.2}
        distance={4.8}
        decay={1.8}
      />

      {/* 
        ============================================================
        5. FLOATING CELESTIAL CONSTELLATION (Top View)
        Positioned inside the circular stone rim, encircled by the pedestal
        Fades in to 90% opaqueness over 1s as requested
        ============================================================
      */}
      <mesh
        ref={constellationMeshRef}
        position={[0, 1.36, -0.06]}
        renderOrder={10}
        visible={false}
      >
        <planeGeometry key={`constellation-${activeSignIndex}`} args={[0.74 * activeAspect, 0.74]} />
        <meshBasicMaterial
          ref={constellationMatRef}
          map={activeCreatureTexture}
          transparent
          opacity={0}
          depthWrite={false}
          depthTest={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 
        ============================================================
        6. SPARKLES ALPHA ANIMATION (sparkles_alpha.webm / .mov)
        Originates from the middle of the pedestal with AdditiveBlending
        Illuminates both the upper and lower halves of the circular pedestal seamlessly
        ============================================================
      */}
      <mesh
        ref={sparklesMeshRef}
        position={[0, 1.18, 0]}
        renderOrder={6}
        visible={false}
      >
        <planeGeometry args={[2.5, 1.55]} />
        <meshBasicMaterial
          ref={sparklesMatRef}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

if (typeof window !== 'undefined') {
  useGLTF.preload('/models/zodiac/light_beam/source/Effect_Exit.glb')
}
