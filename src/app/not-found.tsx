"use client";
import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { SkullModel } from "@/components/client/GLBmodels/Skull";

export default function page404() {
  return (
    <div className="h-[100vh] w-[100vw] bg-slate-700">
      <Canvas>
        <Environment preset="studio" />
        <OrbitControls />
        <SkullModel />
      </Canvas>
    </div>
  );
}
