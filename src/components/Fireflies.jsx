"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Fireflies — glowing point sprites distributed through real 3D space
 * (varying x, y, AND z), so depth-of-field and parallax read correctly.
 * Soft additive-blended glow via a radial-gradient canvas texture.
 */
function makeGlowTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  grad.addColorStop(0, "rgba(255,244,180,1)");
  grad.addColorStop(0.4, "rgba(255,230,150,0.6)");
  grad.addColorStop(1, "rgba(255,230,150,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

export default function Fireflies({ count = 35 }) {
  const pointsRef = useRef();
  const texture = useMemo(() => makeGlowTexture(), []);

  const { positions, phases, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 140; // x
      positions[i * 3 + 1] = Math.random() * 18 - 6; // y, near ground level
      positions[i * 3 + 2] = -10 - Math.random() * 90; // z, real depth range
      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.3 + Math.random() * 0.5;
    }
    return { positions, phases, speeds };
  }, [count]);

  const basePositions = useRef(positions.slice());

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const posAttr = pointsRef.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      const bx = basePositions.current[i * 3];
      const by = basePositions.current[i * 3 + 1];
      const bz = basePositions.current[i * 3 + 2];
      const phase = phases[i];
      const speed = speeds[i];
      posAttr.array[i * 3] = bx + Math.sin(t * speed + phase) * 6;
      posAttr.array[i * 3 + 1] = by + Math.sin(t * speed * 1.4 + phase) * 3;
      posAttr.array[i * 3 + 2] = bz + Math.cos(t * speed * 0.8 + phase) * 4;
    }
    posAttr.needsUpdate = true;

    // gentle opacity pulse via material uniform-less trick: vary size instead
    const sizes = pointsRef.current.material;
    sizes.size = 2.4 + Math.sin(t * 1.5) * 0.6;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        size={2.4}
        sizeAttenuation
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
