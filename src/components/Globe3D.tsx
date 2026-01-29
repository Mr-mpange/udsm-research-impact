import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import { countryMetrics, CountryMetrics } from '@/data/researchData';
import earthTexture from '@/assets/earth-hero.jpg';

interface GlobePointProps {
  position: [number, number, number];
  data: CountryMetrics;
  onHover: (data: CountryMetrics | null) => void;
}

function latLngToVector3(lat: number, lng: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return [x, y, z];
}

function GlobePoint({ position, data, onHover }: GlobePointProps) {
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

function GlobeMesh() {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredCountry, setHoveredCountry] = useState<CountryMetrics | null>(null);
  
  // Load Earth texture
  const texture = useLoader(THREE.TextureLoader, earthTexture);

  useFrame(() => {
    if (groupRef.current && !hoveredCountry) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  const points = useMemo(() => {
    return countryMetrics.map((country) => ({
      position: latLngToVector3(country.lat, country.lng, 2.02),
      data: country,
    }));
  }, []);

  // Create grid lines for the globe
  const gridLines = useMemo(() => {
    const lines: THREE.Vector3[][] = [];
    
    // Latitude lines
    for (let lat = -60; lat <= 60; lat += 30) {
      const pts: THREE.Vector3[] = [];
      for (let lng = 0; lng <= 360; lng += 5) {
        const [x, y, z] = latLngToVector3(lat, lng, 2.01);
        pts.push(new THREE.Vector3(x, y, z));
      }
      lines.push(pts);
    }
    
    // Longitude lines
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
      {/* Main globe sphere with Earth texture */}
      <Sphere args={[2, 64, 64]}>
        <meshStandardMaterial
          map={texture}
          transparent
          opacity={0.95}
          roughness={0.6}
          metalness={0.1}
        />
      </Sphere>
      
      {/* Globe outline glow */}
      <Sphere args={[2.005, 64, 64]}>
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Grid lines */}
      {gridLines.map((pts, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={pts.length}
              array={new Float32Array(pts.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#3b82f6" transparent opacity={0.15} />
        </line>
      ))}

      {/* Country data points */}
      {points.map((point, i) => (
        <GlobePoint
          key={i}
          position={point.position}
          data={point.data}
          onHover={setHoveredCountry}
        />
      ))}

      {/* Connection lines between UDSM and partners */}
      {points.slice(0, 8).map((point, i) => {
        const udsmPos = latLngToVector3(-6.7924, 39.2083, 2.02);
        const curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(...udsmPos),
          new THREE.Vector3(
            (udsmPos[0] + point.position[0]) / 2,
            (udsmPos[1] + point.position[1]) / 2 + 1,
            (udsmPos[2] + point.position[2]) / 2
          ),
          new THREE.Vector3(...point.position)
        );
        const curvePoints = curve.getPoints(50);
        
        return (
          <line key={`connection-${i}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={curvePoints.length}
                array={new Float32Array(curvePoints.flatMap(p => [p.x, p.y, p.z]))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#fbbf24" transparent opacity={0.3} />
          </line>
        );
      })}

      {/* UDSM marker */}
      <mesh position={latLngToVector3(-6.7924, 39.2083, 2.05)}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
    </group>
  );
}

export default function Globe3D() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
        <GlobeMesh />
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
