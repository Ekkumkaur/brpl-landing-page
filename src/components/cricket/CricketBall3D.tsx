import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Float } from '@react-three/drei';
import * as THREE from 'three';

const Ball = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x += 0.002;
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={1}
    >
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <meshStandardMaterial
          color="#c62828"
          roughness={0.4}
          metalness={0.1}
        />
      </Sphere>
      {/* Seam line 1 */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[1.01, 0.02, 8, 100]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.5} />
      </mesh>
      {/* Seam line 2 */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.01, 0.02, 8, 100]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.5} />
      </mesh>
    </Float>
  );
};

const CricketBall3D = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        className="!absolute inset-0"
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#22c55e" />
        <pointLight position={[0, 0, 5]} intensity={0.5} color="#fbbf24" />
        <Ball />
      </Canvas>
    </div>
  );
};

export default CricketBall3D;
