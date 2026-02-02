import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AnimatedFlightPathProps {
  startPos: [number, number, number];
  endPos: [number, number, number];
  color?: string;
  index: number;
}

export function AnimatedFlightPath({ startPos, endPos, color = '#fbbf24', index }: AnimatedFlightPathProps) {
  const groupRef = useRef<THREE.Group>(null);
  const particleRef = useRef<THREE.Mesh>(null);
  
  const { curve, curvePoints } = useMemo(() => {
    const start = new THREE.Vector3(...startPos);
    const end = new THREE.Vector3(...endPos);
    
    // Calculate midpoint with arc height based on distance
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const distance = start.distanceTo(end);
    const arcHeight = Math.max(0.5, distance * 0.4);
    mid.normalize().multiplyScalar(2 + arcHeight);
    
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const curvePoints = curve.getPoints(60);
    
    return { curve, curvePoints };
  }, [startPos, endPos]);

  // Animate the particle along the path
  useFrame((state) => {
    if (particleRef.current) {
      // Offset animation based on index for variety
      const t = ((state.clock.elapsedTime * 0.15 + index * 0.2) % 1);
      const point = curve.getPoint(t);
      particleRef.current.position.copy(point);
      
      // Pulse effect
      const scale = 0.03 + Math.sin(state.clock.elapsedTime * 3) * 0.01;
      particleRef.current.scale.setScalar(scale * 50);
    }
  });

  const positions = useMemo(() => {
    return new Float32Array(curvePoints.flatMap(p => [p.x, p.y, p.z]));
  }, [curvePoints]);

  return (
    <group ref={groupRef}>
      {/* Static arc path */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={curvePoints.length}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial 
          color={color} 
          transparent 
          opacity={0.4}
          linewidth={1}
        />
      </line>
      
      {/* Animated particle */}
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}
