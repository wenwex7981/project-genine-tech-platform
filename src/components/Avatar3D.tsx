"use client";

import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';

interface Avatar3DProps {
  isSpeaking: boolean;
  modelUrl: string;
}

function Model({ isSpeaking, url }: { isSpeaking: boolean, url: string }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Idle floating animation
      const t = state.clock.getElapsedTime();
      
      if (isSpeaking) {
        // More erratic movement when speaking
        groupRef.current.position.y = Math.sin(t * 10) * 0.05 + 0.1;
        groupRef.current.rotation.y = Math.sin(t * 5) * 0.1;
        
        // Simulating jaw movement by scaling Y slightly very fast
        groupRef.current.scale.y = 1 + Math.sin(t * 20) * 0.05;
      } else {
        // Calm floating
        groupRef.current.position.y = Math.sin(t * 2) * 0.1;
        groupRef.current.rotation.y = Math.sin(t) * 0.05;
        groupRef.current.scale.y = 1;
      }
    }
  });

  return (
    <group ref={groupRef} dispose={null}>
      {/* 
        Adjusting scale and position generically. 
        Most raw FBX->GLB conversions come in huge or tiny. 
        We scale it to fit roughly in a standard camera view.
      */}
      <primitive object={scene} scale={0.02} position={[0, -2, 0]} />
    </group>
  );
}

// Preload the minion model
useGLTF.preload('/models/Minion.glb');

export const Avatar3D: React.FC<Avatar3DProps> = ({ isSpeaking, modelUrl }) => {
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
        <directionalLight position={[-10, 10, -5]} intensity={0.5} />
        <Environment preset="city" />
        
        <Suspense fallback={<Html center><div className="text-white font-bold animate-pulse text-lg text-center whitespace-nowrap">Loading 3D Model...<br/><span className="text-sm font-normal opacity-70">(25MB - First time only)</span></div></Html>}>
          <Model isSpeaking={isSpeaking} url={modelUrl} />
          <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={10} blur={2} far={4} />
        </Suspense>
        
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
      </Canvas>
    </div>
  );
};
