'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function CameraRig({ isEntering = false }) {
  const lookTarget = useRef(new THREE.Vector3(0, 2.0, 0))

  useFrame((state, delta) => {
    const { camera, pointer } = state

    // Dynamic mouse parallax for camera position
    const targetX = isEntering ? 0 : pointer.x * 1.5
    const targetY = isEntering ? 2.0 : 2.0 + pointer.y * 0.65
    // Idle distance at Z: 10.5 (framed gracefully further back), zooming in to Z: 1.4 on enter
    const targetZ = isEntering ? 1.4 : 10.5

    // Graceful lerping for the swoop-down shot on refresh and enter zoom
    const lerpSpeed = isEntering ? delta * 3.0 : delta * 1.8
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, lerpSpeed)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, lerpSpeed)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, lerpSpeed)

    // Dynamic mouse look tilt for both horizontal and vertical axis
    const destLookX = isEntering ? 0 : pointer.x * 0.75
    const destLookY = isEntering ? 2.0 : 2.0 + pointer.y * 0.4
    lookTarget.current.x = THREE.MathUtils.lerp(lookTarget.current.x, destLookX, delta * 2.8)
    lookTarget.current.y = THREE.MathUtils.lerp(lookTarget.current.y, destLookY, delta * 2.8)
    lookTarget.current.z = 0

    camera.lookAt(lookTarget.current)
  })

  return null
}