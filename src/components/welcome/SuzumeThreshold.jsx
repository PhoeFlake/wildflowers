'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { useTexture, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function SuzumeThreshold({ onEnter }) {
  const [hovered, setHovered] = useState(false)
  const skyRef = useRef()
  const doorRef = useRef()

  // Smooth, silky cloud wisps
  const cloudBedBack = useRef()
  const cloudBedFront = useRef()
  const cloudLeftCorner = useRef()
  const cloudRightCorner = useRef()
  const doorFaceWisp = useRef()

  const driftAngle = useRef(0)
  const skyMouseY = useRef(0)
  const skyMouseX = useRef(0)

  const doorTexture = useTexture('/models/welcome/suzume_door_trimmed.png')
  const smoothBaseTexture = useTexture('/models/welcome/smooth_cloud_base.png')
  const smoothAccentTexture = useTexture('/models/welcome/smooth_cloud_accent.png')

  const { scene: skyGlobe } = useGLTF('/models/welcome/hdri_perfect_ski_panorama_e.glb')
  const skyScene = useMemo(() => skyGlobe.clone(), [skyGlobe])

  useEffect(() => {
    if (doorTexture) {
      // eslint-disable-next-line react-hooks/immutability
      doorTexture.colorSpace = THREE.SRGBColorSpace
      doorTexture.needsUpdate = true
    }
    if (smoothBaseTexture) {
      // eslint-disable-next-line react-hooks/immutability
      smoothBaseTexture.colorSpace = THREE.SRGBColorSpace
      smoothBaseTexture.needsUpdate = true
    }
    if (smoothAccentTexture) {
      // eslint-disable-next-line react-hooks/immutability
      smoothAccentTexture.colorSpace = THREE.SRGBColorSpace
      smoothAccentTexture.needsUpdate = true
    }
  }, [doorTexture, smoothBaseTexture, smoothAccentTexture])

  useEffect(() => {
    skyScene.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone()
        child.material.side = THREE.DoubleSide
        child.material.depthWrite = false
        child.material.toneMapped = false
        if (child.material.map) {
          child.material.map.colorSpace = THREE.SRGBColorSpace
          child.material.map.needsUpdate = true
        }
        if (child.material.emissiveMap) {
          child.material.emissiveMap.colorSpace = THREE.SRGBColorSpace
          child.material.emissiveIntensity = 1.0
        }
      }
    })
  }, [skyScene])

  useFrame((state, delta) => {
    // Keep sky dome centered on camera so you are perpetually inside the sky sphere
    if (skyRef.current) {
      skyRef.current.position.copy(state.camera.position)
      driftAngle.current += delta * 0.012
      skyMouseY.current = THREE.MathUtils.lerp(skyMouseY.current, -state.pointer.x * 0.22, delta * 2.8)
      skyMouseX.current = THREE.MathUtils.lerp(skyMouseX.current, state.pointer.y * 0.12, delta * 2.8)
      skyRef.current.rotation.y = driftAngle.current + skyMouseY.current
      skyRef.current.rotation.x = skyMouseX.current
    }

    // Weightless gentle floating animation for the door
    const time = state.clock.getElapsedTime()
    if (doorRef.current) {
      const floatY = 2.0 + Math.sin(time * 1.4) * 0.07
      doorRef.current.position.y = floatY

      const targetScale = hovered ? 1.025 : 1.0
      doorRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, 1), delta * 5)
    }

    // Silky organic drift of the clouds around the base
    if (cloudBedBack.current) {
      cloudBedBack.current.position.x = Math.sin(time * 0.4) * 0.08
    }
    if (cloudBedFront.current) {
      cloudBedFront.current.position.x = -Math.cos(time * 0.45) * 0.08
      cloudBedFront.current.material.opacity = 0.75 + Math.sin(time * 0.6) * 0.05
    }
    if (cloudLeftCorner.current) {
      cloudLeftCorner.current.position.x = -1.7 + Math.sin(time * 0.5) * 0.06
      cloudLeftCorner.current.material.opacity = 0.72 + Math.sin(time * 0.65) * 0.05
    }
    if (cloudRightCorner.current) {
      cloudRightCorner.current.position.x = 1.7 + Math.cos(time * 0.5) * 0.06
      cloudRightCorner.current.material.opacity = 0.68 + Math.cos(time * 0.65) * 0.05
    }
    if (doorFaceWisp.current) {
      doorFaceWisp.current.position.x = Math.sin(time * 0.35) * 0.10
      doorFaceWisp.current.material.opacity = 0.24 + Math.sin(time * 0.5) * 0.04
    }
  })

  return (
    <group>
      {/* Ambient and directional lighting */}
      <ambientLight intensity={1.8} color="#e0f0ff" />
      <directionalLight position={[5, 12, 8]} intensity={1.5} color="#ffffff" />
      <pointLight position={[0, 2.0, 1.5]} intensity={hovered ? 2.5 : 1.2} color="#fff8e7" distance={8} />

      {/* 360° Sky Globe Panorama */}
      <group ref={skyRef}>
        <primitive object={skyScene} scale={1} />
      </group>

      {/* Floating Door Group naturally nestled in between clouds */}
      <group ref={doorRef} position={[0, 2.0, 0]}>

        {/* --- BEHIND THE DOOR: Smooth, soft cloud wisp behind the threshold --- */}
        <mesh ref={cloudBedBack} position={[0, -2.05, -0.05]}>
          <planeGeometry args={[6.8, 2.4]} />
          <meshBasicMaterial
            map={smoothBaseTexture}
            transparent
            opacity={0.62}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        {/* Visual Door artwork floating cleanly in the sky */}
        <mesh>
          <planeGeometry args={[5.25, 4.8]} />
          <meshBasicMaterial 
            map={doorTexture} 
            transparent 
            toneMapped={false}
            side={THREE.FrontSide} 
          />
        </mesh>

        {/* --- IN FRONT OF THE DOOR: Subtle wisp across lower door face --- */}
        <mesh ref={doorFaceWisp} position={[0, -1.0, 0.04]}>
          <planeGeometry args={[3.4, 2.0]} />
          <meshBasicMaterial
            map={smoothAccentTexture}
            transparent
            opacity={0.24}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        {/* --- IN FRONT: Smooth, clearly present clouds wrapping the corners and base --- */}
        
        {/* Left Corner: soft, puffy wisp embracing the red bricks and loose bricks */}
        <mesh ref={cloudLeftCorner} position={[-1.7, -1.95, 0.08]}>
          <planeGeometry args={[3.4, 2.1]} />
          <meshBasicMaterial
            map={smoothAccentTexture}
            transparent
            opacity={0.72}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        {/* Right Corner: soft, puffy wisp embracing the wooden plank and ruins */}
        <mesh ref={cloudRightCorner} position={[1.7, -2.05, 0.08]} scale={[-1, 1, 1]}>
          <planeGeometry args={[3.4, 2.0]} />
          <meshBasicMaterial
            map={smoothAccentTexture}
            transparent
            opacity={0.68}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        {/* Front Base: soft, smooth cloud bed dissolving the bottom ground line */}
        <mesh ref={cloudBedFront} position={[0, -2.15, 0.08]}>
          <planeGeometry args={[5.8, 2.2]} />
          <meshBasicMaterial
            map={smoothBaseTexture}
            transparent
            opacity={0.75}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        {/* Tightly framed precision hitbox: only clicks directly on the wooden door frame trigger enter */}
        <mesh
          position={[0, 0.05, 0.15]}
          onClick={onEnter}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHovered(true)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHovered(false)
            document.body.style.cursor = 'auto'
          }}
        >
          <planeGeometry args={[2.3, 4.6]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
    </group>
  )
}