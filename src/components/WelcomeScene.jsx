"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import SkyDome from "./SkyDome";
import StarField from "./StarField";
import Hills from "./Hills";
import Fireflies from "./Fireflies";
import FallingDebris from "./FallingDebris";

/**
 * SceneFog — sets real Three.js fog on the scene so distant hills/stars
 * genuinely haze out with depth, rather than a faked CSS blur.
 */
function SceneFog() {
  const { scene } = useThree();
  scene.fog = new THREE.Fog("#5a4f78", 70, 260);
  return null;
}

/**
 * CameraDrift — subtle camera parallax tied to pointer position. Kept
 * gentle since this is a title card, not free-roam exploration.
 */
function CameraDrift() {
  const { camera, pointer } = useThree();
  const target = useRef(new THREE.Vector3(0, 2, -40));

  useFrame(() => {
    const targetX = pointer.x * 4;
    const targetY = 14 + pointer.y * 2;
    camera.position.x += (targetX - camera.position.x) * 0.02;
    camera.position.y += (targetY - camera.position.y) * 0.02;
    camera.lookAt(target.current);
  });

  return null;
}

export default function WelcomeScene() {
  return (
    <Canvas
      camera={{ position: [0, 14, 42], fov: 50, near: 0.1, far: 600 }}
      gl={{ antialias: true }}
      dpr={[1, 2]}
    >
      <SceneFog />
      <CameraDrift />

      {/* Brighter, warmer light so the hill grass texture actually reads
          with color (meshStandardMaterial needs real light to show its
          map), matching the lush moonlit-meadow look in the references */}
      <ambientLight intensity={0.85} color="#aabfd6" />
      <directionalLight
        position={[-40, 35, -20]}
        intensity={1.1}
        color="#f0d9b0"
      />
      <directionalLight
        position={[20, 15, 30]}
        intensity={0.35}
        color="#8a7bb5"
      />

      <SkyDome />
      <StarField />
      <Hills />
      <Fireflies count={35} />
      <FallingDebris leafCount={16} petalCount={14} />
    </Canvas>
  );
}
