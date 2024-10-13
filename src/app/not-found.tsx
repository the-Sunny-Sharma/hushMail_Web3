"use client";

import { useState, useEffect, Suspense } from "react";
import {
  Environment,
  OrbitControls,
  Text3D,
  Center,
  Html,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { SkullModel } from "@/components/client/GLBmodels/Skull";

function LoadingFallback() {
  return (
    <Html center>
      <div className="text-white text-xl">Loading 3D Text...</div>
    </Html>
  );
}

function Text({
  children,
  position,
}: {
  children: string;
  position: [number, number, number];
}) {
  return (
    <Center position={position}>
      <Text3D
        font="/fonts/helvetiker_regular.typeface.json"
        size={3}
        height={0.2}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.01}
        bevelOffset={0}
        bevelSegments={5}
      >
        {children}
        <meshStandardMaterial color="#f87171" />
      </Text3D>
    </Center>
  );
}

export default function Page404() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/fonts/helvetiker_regular.typeface.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        console.log("Font file loaded successfully");
        setFontLoaded(true);
      })
      .catch((err) => {
        console.error("Error fetching font file:", err);
        setError("Failed to load font");
      });
  }, []);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!fontLoaded) {
    return <div className="text-gray-300">Loading 3D assets...</div>;
  }

  return (
    <div className="h-screen w-screen bg-gray-900 flex flex-col items-center justify-center">
      <div className="h-[70vh] w-full">
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <color attach="background" args={["#111827"]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          <Environment preset="city" />
          <OrbitControls enableZoom={false} />

          <Suspense fallback={<LoadingFallback />}>
            <Text position={[-5, 0, 0]}>4</Text>
            <SkullModel scale={2} position={[0, -1, 0]} />
            <Text position={[5, 0, 0]}>4</Text>
          </Suspense>
        </Canvas>
      </div>
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-red-400 mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-xl text-gray-300">
          It seems you've stumbled upon a lost page. Don't worry, even the best
          explorers get lost sometimes!
        </p>
      </div>
    </div>
  );
}
