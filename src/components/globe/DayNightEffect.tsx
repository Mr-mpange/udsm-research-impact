import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface DayNightEffectProps {
  autoRotate: boolean;
}

export function DayNightEffect({ autoRotate }: DayNightEffectProps) {
  const shadowRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (shadowRef.current && autoRotate) {
      // Slowly rotate the shadow to simulate sun movement
      shadowRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={shadowRef}>
      {/* Night side shadow hemisphere */}
      <mesh rotation={[0, Math.PI * 0.5, 0]}>
        <sphereGeometry args={[2.015, 64, 64, 0, Math.PI]} />
        <meshBasicMaterial
          color="#000033"
          transparent
          opacity={0.5}
          side={THREE.FrontSide}
        />
      </mesh>
      
      {/* Twilight gradient zone */}
      <mesh rotation={[0, Math.PI * 0.3, 0]}>
        <sphereGeometry args={[2.012, 64, 64, 0, Math.PI * 0.15]} />
        <meshBasicMaterial
          color="#1a1a3e"
          transparent
          opacity={0.3}
          side={THREE.FrontSide}
        />
      </mesh>
      
      {/* City lights on night side */}
      <Sphere args={[2.016, 32, 32]} rotation={[0, Math.PI * 0.5, 0]}>
        <meshBasicMaterial
          color="#ffcc00"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
}
