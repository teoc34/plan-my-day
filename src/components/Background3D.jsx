import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';

function AnimatedSphere({ position, color, speed }) {
  const meshRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y = position[1] + Math.sin(time * speed) * 0.5;
    meshRef.current.rotation.x = time * 0.2;
    meshRef.current.rotation.y = time * 0.3;
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} position={position}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.4}
        metalness={0.8}
      />
    </Sphere>
  );
}

export default function Background3D() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      opacity: 0.3,
      pointerEvents: 'none',
    }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />

        <AnimatedSphere position={[-3, 0, 0]} color="#0ea5e9" speed={0.5} />
        <AnimatedSphere position={[3, 0, -2]} color="#10b981" speed={0.7} />
        <AnimatedSphere position={[0, 2, -1]} color="#f59e0b" speed={0.6} />
      </Canvas>
    </div>
  );
}
