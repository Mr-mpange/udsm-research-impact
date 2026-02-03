import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { CountryMetrics } from '@/data/researchData';

interface AnimatedFlightPathProps {
  startPos: [number, number, number];
  endPos: [number, number, number];
  color?: string;
  index: number;
  destinationData?: CountryMetrics;
}

export function AnimatedFlightPath({ startPos, endPos, color = '#fbbf24', index, destinationData }: AnimatedFlightPathProps) {
  const groupRef = useRef<THREE.Group>(null);
  const particleRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const { curve, curvePoints, midPoint } = useMemo(() => {
    const start = new THREE.Vector3(...startPos);
    const end = new THREE.Vector3(...endPos);
    
    // Calculate midpoint with arc height based on distance
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const distance = start.distanceTo(end);
    const arcHeight = Math.max(0.5, distance * 0.4);
    mid.normalize().multiplyScalar(2 + arcHeight);
    
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const curvePoints = curve.getPoints(60);
    
    // Get the highest point of the arc for tooltip positioning
    const midPoint = curve.getPoint(0.5);
    
    return { curve, curvePoints, midPoint };
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
      {/* Invisible hitbox for hover detection along the path */}
      <mesh
        position={[midPoint.x, midPoint.y, midPoint.z]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Static arc path - brighter when hovered */}
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
          color={hovered ? '#ffffff' : color} 
          transparent 
          opacity={hovered ? 0.9 : 0.4}
          linewidth={1}
        />
      </line>
      
      {/* Animated particle */}
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial 
          color={hovered ? '#ffffff' : color} 
          transparent 
          opacity={0.9}
        />
      </mesh>

      {/* Tooltip on hover */}
      {hovered && destinationData && (
        <Html position={[midPoint.x, midPoint.y + 0.2, midPoint.z]} distanceFactor={8}>
          <div className="glass-panel px-4 py-3 min-w-[220px] pointer-events-none animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{destinationData.flag}</span>
              <span className="font-display font-semibold text-foreground text-sm">
                UDSM → {destinationData.name}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Collaborations:</span>
                <span className="ml-1 text-primary font-medium">{destinationData.collaborations}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Citations:</span>
                <span className="ml-1 text-secondary font-medium">{destinationData.citations.toLocaleString()}</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Partners:</span>
                <span className="ml-1 text-foreground/80 text-[10px]">
                  {destinationData.partnerUniversities.slice(0, 2).join(', ')}
                </span>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
