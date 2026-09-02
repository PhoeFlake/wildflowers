"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * StarField — scattered twinkling stars + a denser Milky Way band,
 * both as THREE.Points on a far shell around the scene so they read
 * as distant background regardless of camera drift.
 */
export default function StarField() {
  const starsRef = useRef();
  const milkyWayRef = useRef();

  const starGeo = useMemo(() => {
    const count = 700;
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // distribute on a hemisphere shell (upper sky only)
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.45; // keep mostly upper sky
      const r = 480;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi) * 0.6 + r * 0.3;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      phases[i] = Math.random() * Math.PI * 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("phase", new THREE.BufferAttribute(phases, 1));
    return geo;
  }, []);

  const milkyWayGeo = useMemo(() => {
    const count = 1400;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = Math.random();
      const bandAngle = THREE.MathUtils.degToRad(35); // diagonal band
      const along = (t - 0.5) * 600;
      const spread = (Math.random() - 0.5) * 90;
      const r = 470;
      const baseTheta = along * 0.003;
      const x = Math.sin(baseTheta) * r + Math.cos(bandAngle) * spread;
      const y = Math.cos(along * 0.004) * 120 + 140 + Math.sin(bandAngle) * spread * 0.4;
      const z = Math.cos(baseTheta) * r * 0.7 - 60;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (starsRef.current) {
      starsRef.current.material.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  const starMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        transparent: true,
        depthWrite: false,
        vertexShader: `
          attribute float phase;
          uniform float uTime;
          varying float vAlpha;
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            vAlpha = 0.5 + 0.5 * sin(uTime * 1.2 + phase);
            gl_PointSize = 2.2;
          }
        `,
        fragmentShader: `
          varying float vAlpha;
          void main() {
            vec2 c = gl_PointCoord - vec2(0.5);
            float d = length(c);
            if (d > 0.5) discard;
            gl_FragColor = vec4(1.0, 0.97, 0.9, vAlpha * (1.0 - d * 1.6));
          }
        `,
      }),
    []
  );

  return (
    <>
      <points ref={starsRef} geometry={starGeo} material={starMaterial} />
      <points ref={milkyWayRef} geometry={milkyWayGeo}>
        <pointsMaterial
          size={1.3}
          color="#f0e8ff"
          transparent
          opacity={0.35}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </>
  );
}
