'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * ConstellationMap: Geometric star map chords connecting the 12 signs across the center.
 * Matches Option 2 from the user reference (media_1788714935006.png).
 * Flares brightly like a cosmic circuit board when a card is hovered (80ms phase).
 */
export default function ConstellationMap({
  radius = 3.35,
  wheelRotationRef,
  hoveredIndex = null,
}) {
  const lineMeshRef = useRef()
  const starPointsRef = useRef()
  const glowPulse = useRef(0)

  // 12 sign node coordinates at resting wheel rotation 0
  const nodePositions = useMemo(() => {
    const pts = []
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 * Math.PI) / 180 + Math.PI / 2
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0.06))
    }
    return pts
  }, [radius])

  // Build chord connections:
  const { lineSegments, chordIndices } = useMemo(() => {
    const pairs = []
    const indices = []

    // Perimeter chords
    for (let i = 0; i < 12; i++) {
      const next = (i + 1) % 12
      pairs.push(nodePositions[i], nodePositions[next])
      indices.push([i, next])
    }

    // Elemental Trines (triangles of same element)
    for (let i = 0; i < 12; i++) {
      const trine = (i + 4) % 12
      if (i < trine) {
        pairs.push(nodePositions[i], nodePositions[trine])
        indices.push([i, trine])
      }
    }

    // Hexagram / Sextile chords (i <-> i+2)
    for (let i = 0; i < 12; i++) {
      const sextile = (i + 2) % 12
      if (i < sextile) {
        pairs.push(nodePositions[i], nodePositions[sextile])
        indices.push([i, sextile])
      }
    }

    const positions = new Float32Array(pairs.length * 3)
    const colors = new Float32Array(pairs.length * 3)

    for (let p = 0; p < pairs.length; p++) {
      positions[p * 3] = pairs[p].x
      positions[p * 3 + 1] = pairs[p].y
      positions[p * 3 + 2] = pairs[p].z

      colors[p * 3] = 0.85
      colors[p * 3 + 1] = 0.72
      colors[p * 3 + 2] = 0.45
    }

    return { lineSegments: { positions, colors }, chordIndices: indices }
  }, [nodePositions])

  const starPositions = useMemo(() => {
    const arr = new Float32Array(12 * 3)
    for (let i = 0; i < 12; i++) {
      arr[i * 3] = nodePositions[i].x
      arr[i * 3 + 1] = nodePositions[i].y
      arr[i * 3 + 2] = nodePositions[i].z + 0.01
    }
    return arr
  }, [nodePositions])

  useFrame((state, delta) => {
    glowPulse.current += delta * 2.0
    const rot = wheelRotationRef?.current ?? 0

    // Rotate entire constellation structure synchronously with wheel
    if (lineMeshRef.current) {
      lineMeshRef.current.rotation.z = rot
    }
    if (starPointsRef.current) {
      starPointsRef.current.rotation.z = rot
    }

    // Dynamically update line colors based on hover
    if (lineMeshRef.current && lineMeshRef.current.geometry) {
      const colorAttr = lineMeshRef.current.geometry.attributes.color
      if (!colorAttr) return

      const colors = colorAttr.array
      const pulse = 0.5 + Math.sin(glowPulse.current) * 0.25

      for (let k = 0; k < chordIndices.length; k++) {
        const [a, b] = chordIndices[k]
        const isConnected = hoveredIndex !== null && (a === hoveredIndex || b === hoveredIndex)

        const idx1 = k * 2 * 3
        const idx2 = (k * 2 + 1) * 3

        if (isConnected) {
          // Hovered sign connections flare into brilliant electric cyan-gold
          colors[idx1] = 0.4 + pulse * 0.6
          colors[idx1 + 1] = 0.95
          colors[idx1 + 2] = 1.0

          colors[idx2] = 0.4 + pulse * 0.6
          colors[idx2 + 1] = 0.95
          colors[idx2 + 2] = 1.0
        } else {
          colors[idx1] = 0.75 * 0.4
          colors[idx1 + 1] = 0.62 * 0.4
          colors[idx1 + 2] = 0.35 * 0.4

          colors[idx2] = 0.75 * 0.4
          colors[idx2 + 1] = 0.62 * 0.4
          colors[idx2 + 2] = 0.35 * 0.4
        }
      }
      colorAttr.needsUpdate = true
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Constellation Star Chords */}
      <lineSegments ref={lineMeshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={lineSegments.positions.length / 3}
            array={lineSegments.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={lineSegments.colors.length / 3}
            array={lineSegments.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={hoveredIndex !== null ? 0.95 : 0.65}
          linewidth={1.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Star Node Vertices */}
      <points ref={starPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={12}
            array={starPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.14}
          color="#fff5cc"
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}
