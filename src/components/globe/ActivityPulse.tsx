import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ActivityPulseProps {
  position: [number, number, number];
  intensity: number; // 0-1 scale
  color?: string;
  delay?: number;
}

export function ActivityPulse({ position, intensity, color = '#22c55e', delay = 0 }: ActivityPulseProps) {
  const ringRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  // Calculate normal vector for the ring to face outward from globe center
  const rotation = useMemo(() => {
    const pos = new THREE.Vector3(...position);
    const up = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(up, pos.clone().normalize());
    const euler = new THREE.Euler().setFromQuaternion(quaternion);
    return [euler.x, euler.y, euler.z] as [number, number, number];
  }, [position]);

  useFrame((state) => {
    const time = state.clock.elapsedTime + delay;
    
    if (ringRef.current) {
      // Expanding ring animation
      const cycle = (time * 0.8) % 2;
      const scale = 1 + cycle * 2;
      const opacity = Math.max(0, 1 - cycle / 2) * intensity;
      
      ringRef.current.scale.setScalar(scale);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.6;
    }
    
    if (glowRef.current) {
      // Pulsing glow
      const pulse = Math.sin(time * 3) * 0.5 + 0.5;
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = (0.3 + pulse * 0.4) * intensity;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Expanding ring pulse */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.03, 0.04, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      
      {/* Static glow center */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
}

// Component for multiple activity pulses across the globe
interface ActivityIndicatorsProps {
  activities: Array<{
    position: [number, number, number];
    intensity: number;
    type: 'read' | 'citation' | 'download' | 'collaboration';
  }>;
}

const activityColors = {
  read: '#3b82f6',      // Blue
  citation: '#22c55e',   // Green
  download: '#f59e0b',   // Amber
  collaboration: '#8b5cf6' // Purple
};

export function ActivityIndicators({ activities }: ActivityIndicatorsProps) {
  return (
    <group>
      {activities.map((activity, i) => (
        <ActivityPulse
          key={`activity-${i}`}
          position={activity.position}
          intensity={activity.intensity}
          color={activityColors[activity.type]}
          delay={i * 0.3}
        />
      ))}
    </group>
  );
}