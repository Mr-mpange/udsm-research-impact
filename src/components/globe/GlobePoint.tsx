import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { CountryMetrics } from '@/data/researchData';

interface GlobePointProps {
  position: [number, number, number];
  data: CountryMetrics;
  onHover: (data: CountryMetrics | null) => void;
}

export function GlobePoint({ position, data, onHover }: GlobePointProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const [hovered, setHovered] = useState(false);
  
  const intensity = Math.log10(data.reads) / 5;
  const scale = 0.02 + intensity * 0.03;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(hovered ? scale * 1.5 : scale);
    }
    if (materialRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2 + data.reads * 0.001) * 0.3 + 1;
      materialRef.current.opacity = 0.7 * pulse;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover(data);
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(null);
      }}
    >
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial
        ref={materialRef}
        color={hovered ? '#fbbf24' : '#3b82f6'}
        transparent
        opacity={0.8}
      />
      {hovered && (
        <Html distanceFactor={10}>
          <div className="glass-panel px-4 py-3 min-w-[200px] pointer-events-none">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{data.flag}</span>
              <span className="font-display font-semibold text-foreground">{data.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Reads:</span>
                <span className="ml-1 text-primary font-medium">{data.reads.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Citations:</span>
                <span className="ml-1 text-secondary font-medium">{data.citations.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </Html>
      )}
    </mesh>
  );
}
