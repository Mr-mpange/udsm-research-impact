import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { countryMetrics, CountryMetrics } from '@/data/researchData';
import earthTexture from '@/assets/earth-hero.jpg';
import { GlobePoint } from './globe/GlobePoint';
import { DayNightEffect } from './globe/DayNightEffect';
import { AnimatedFlightPath } from './globe/AnimatedFlightPath';

function latLngToVector3(lat: number, lng: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return [x, y, z];
}

// UDSM coordinates (Dar es Salaam, Tanzania)
const UDSM_COORDS = { lat: -6.7924, lng: 39.2083 };

interface GlobeMeshProps {
  autoRotate: boolean;
}

function GlobeMesh({ autoRotate }: GlobeMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const [hoveredCountry, setHoveredCountry] = useState<CountryMetrics | null>(null);
  
  // Load Earth texture
  const texture = useLoader(THREE.TextureLoader, earthTexture);

  useFrame(() => {
    if (groupRef.current && !hoveredCountry && autoRotate) {
      groupRef.current.rotation.y += 0.002;
    }
    if (cloudRef.current && autoRotate) {
      cloudRef.current.rotation.y += 0.0025;
    }
  });

  const points = useMemo(() => {
    return countryMetrics.map((country) => ({
      position: latLngToVector3(country.lat, country.lng, 2.02),
      data: country,
    }));
  }, []);

  // Flight paths from UDSM to partner countries
  const flightPaths = useMemo(() => {
    const udsmPos = latLngToVector3(UDSM_COORDS.lat, UDSM_COORDS.lng, 2.02);
    return countryMetrics.slice(0, 10).map((country) => ({
      startPos: udsmPos,
      endPos: latLngToVector3(country.lat, country.lng, 2.02),
    }));
  }, []);

  // Grid lines for the globe
  const gridLines = useMemo(() => {
    const lines: THREE.Vector3[][] = [];
    
    for (let lat = -60; lat <= 60; lat += 30) {
      const pts: THREE.Vector3[] = [];
      for (let lng = 0; lng <= 360; lng += 5) {
        const [x, y, z] = latLngToVector3(lat, lng, 2.01);
        pts.push(new THREE.Vector3(x, y, z));
      }
      lines.push(pts);
    }
    
    for (let lng = 0; lng < 360; lng += 30) {
      const pts: THREE.Vector3[] = [];
      for (let lat = -90; lat <= 90; lat += 5) {
        const [x, y, z] = latLngToVector3(lat, lng, 2.01);
        pts.push(new THREE.Vector3(x, y, z));
      }
      lines.push(pts);
    }
    
    return lines;
  }, []);

  return (
    <group ref={groupRef}>
      {/* Main globe with Earth texture - no color tinting for clear continents */}
      <Sphere args={[2, 64, 64]}>
        <meshStandardMaterial
          map={texture}
          roughness={0.8}
          metalness={0.05}
        />
      </Sphere>
      
      {/* Subtle atmospheric glow */}
      <Sphere args={[2.015, 64, 64]}>
        <meshBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Outer atmosphere halo */}
      <Sphere args={[2.06, 64, 64]}>
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Light cloud layer */}
      <Sphere ref={cloudRef} args={[2.025, 48, 48]}>
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </Sphere>

      {/* Day/Night cycle effect */}
      <DayNightEffect autoRotate={autoRotate} />

      {/* Grid lines */}
      {gridLines.map((pts, i) => (
        <line key={`grid-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={pts.length}
              array={new Float32Array(pts.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#3b82f6" transparent opacity={0.1} />
        </line>
      ))}

      {/* Country data points */}
      {points.map((point, i) => (
        <GlobePoint
          key={`point-${i}`}
          position={point.position}
          data={point.data}
          onHover={setHoveredCountry}
        />
      ))}

      {/* Animated flight paths from UDSM */}
      {flightPaths.map((path, i) => (
        <AnimatedFlightPath
          key={`flight-${i}`}
          startPos={path.startPos}
          endPos={path.endPos}
          index={i}
          color="#fbbf24"
        />
      ))}

      {/* UDSM marker (origin point) */}
      <mesh position={latLngToVector3(UDSM_COORDS.lat, UDSM_COORDS.lng, 2.05)}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
      
      {/* UDSM glow ring */}
      <mesh position={latLngToVector3(UDSM_COORDS.lat, UDSM_COORDS.lng, 2.04)} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.08, 0.12, 32]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default function Globe3D() {
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <div className="w-full h-full relative">
      {/* Controls overlay */}
      <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-2">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className="glass-panel px-3 py-2 text-xs font-medium hover:bg-primary/10 transition-colors"
          title={autoRotate ? 'Pause rotation' : 'Resume rotation'}
        >
          {autoRotate ? '⏸ Pause' : '▶ Rotate'}
        </button>
        <div className="glass-panel px-3 py-2 text-xs text-muted-foreground">
          🖱️ Scroll to zoom
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-10 glass-panel px-3 py-2 text-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-full bg-secondary"></span>
          <span className="text-muted-foreground">UDSM (Origin)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary"></span>
          <span className="text-muted-foreground">Research Partners</span>
        </div>
      </div>
      
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 3, 5]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#3b82f6" />
        <GlobeMesh autoRotate={autoRotate} />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={3}
          maxDistance={8}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
