'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { useTexture, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function SuzumeThreshold({ onEnter }) {
  const [hovered, setHovered] = useState(false)
  const skyRef = useRef()
  const doorRef = useRef()
  const driftAngle = useRef(0)
  const skyMouseY = useRef(0)
  const skyMouseX = useRef(0)

  const doorTexture = useTexture('/models/welcome/suzume_door_trimmed.png')
  const { scene: skyGlobe } = useGLTF('/models/welcome/hdri_perfect_ski_panorama_e.glb')
  const skyScene = useMemo(() => skyGlobe.clone(), [skyGlobe])

  useEffect(() => {
    if (doorTexture) {
      // eslint-disable-next-line react-hooks/immutability
      doorTexture.colorSpace = THREE.SRGBColorSpace
      doorTexture.needsUpdate = true
    }
  }, [doorTexture])

  useEffect(() => {
    skyScene.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone()
        // DoubleSide ensures interior of sphere is fully visible in all directions
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
      // Continuous gentle cloud drift
      driftAngle.current += delta * 0.012
      // Interactive mouse sensitivity: rotate sky dome smoothly with cursor
      skyMouseY.current = THREE.MathUtils.lerp(skyMouseY.current, -state.pointer.x * 0.22, delta * 2.8)
      skyMouseX.current = THREE.MathUtils.lerp(skyMouseX.current, state.pointer.y * 0.12, delta * 2.8)
      skyRef.current.rotation.y = driftAngle.current + skyMouseY.current
      skyRef.current.rotation.x = skyMouseX.current
    }

    // Weightless gentle floating animation so the door floats seamlessly in the sky
    if (doorRef.current) {
      const time = state.clock.getElapsedTime()
      const floatY = 2.0 + Math.sin(time * 1.4) * 0.07
      doorRef.current.position.y = floatY

      const targetScale = hovered ? 1.025 : 1.0
      doorRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, 1), delta * 5)
    }
  })

  return (
    <group>
      {/* Ambient and directional lighting for the scene */}
      <ambientLight intensity={1.8} color="#e0f0ff" />
      <directionalLight position={[5, 12, 8]} intensity={1.5} color="#ffffff" />
      <pointLight position={[0, 2.0, 1.5]} intensity={hovered ? 2.5 : 1.2} color="#fff8e7" distance={8} />

      {/* 360° Sky Globe Panorama */}
      <group ref={skyRef}>
        <primitive object={skyScene} scale={1} />
      </group>

      {/* Floating Door Group */}
      <group ref={doorRef} position={[0, 2.0, 0]}>
        {/* Visual Door artwork floating seamlessly in the sky */}
        <mesh>
          <planeGeometry args={[5.25, 4.8]} />
          <meshBasicMaterial 
            map={doorTexture} 
            transparent 
            toneMapped={false}
            side={THREE.FrontSide} 
          />
        </mesh>

        {/* Tightly framed precision hitbox: only clicks directly on the wooden door frame trigger enter */}
        <mesh
          position={[0, 0.05, 0.03]}
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