import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface Figure8ParticlesProps {
  particleCount: number;
  particleSize: number;
  speed: number;
  noise: number;
  opacity: number;
}

const Figure8Particles: React.FC<Figure8ParticlesProps> = ({ particleCount, particleSize, speed, noise, opacity }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const tempObject = useRef(new THREE.Object3D());
  const clock = useRef(new THREE.Clock());

  const FIGURE_8_SCALE = 3;

  const particlePositions = useMemo(() => new Float32Array(particleCount * 3), [particleCount]);
  const particleOffsets = useMemo(() => new Float32Array(particleCount), [particleCount]);
  const particleRandomOffsets = useMemo(() => new Float32Array(particleCount * 3), [particleCount]);

  useEffect(() => {
    for (let i = 0; i < particleCount; i++) {
      particleOffsets[i] = (i / particleCount) * Math.PI * 2;
      particleRandomOffsets[i * 3] = (Math.random() - 0.5) * noise;
      particleRandomOffsets[i * 3 + 1] = (Math.random() - 0.5) * noise;
      particleRandomOffsets[i * 3 + 2] = (Math.random() - 0.5) * noise;
    }
  }, [particleCount, noise, particleOffsets, particleRandomOffsets]);

  useFrame(() => {
    if (meshRef.current) {
      const time = clock.current.getElapsedTime() * speed;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        setParticlePosition(i, time, particlePositions, i3);

        tempObject.current.position.set(
          particlePositions[i3],
          particlePositions[i3 + 1],
          particlePositions[i3 + 2]
        );
        tempObject.current.updateMatrix();
        meshRef.current.setMatrixAt(i, tempObject.current.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  const setParticlePosition = (index: number, time: number, positions: Float32Array, offset: number) => {
    const t = (particleOffsets[index] + time) % (Math.PI * 2);

    const a = FIGURE_8_SCALE;
    const b = FIGURE_8_SCALE * 0.5;
    const c = FIGURE_8_SCALE * 0.3;

    const baseX = a * Math.sin(t);
    const baseY = b * Math.sin(2 * t);
    const baseZ = c * Math.cos(3 * t);

    positions[offset] = baseX + particleRandomOffsets[index * 3];
    positions[offset + 1] = baseY + particleRandomOffsets[index * 3 + 1];
    positions[offset + 2] = baseZ + particleRandomOffsets[index * 3 + 2];
  };

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
      <sphereGeometry args={[particleSize, 8, 8]} />
      <meshBasicMaterial color="white" transparent opacity={opacity} />
    </instancedMesh>
  );
};

export default Figure8Particles;
