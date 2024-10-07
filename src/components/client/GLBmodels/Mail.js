import React from "react";
import { useGLTF } from "@react-three/drei";

export function Mail(props) {
  const { nodes, materials } = useGLTF("/mail_icon.glb");
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_2.geometry}
          material={materials["Material.001"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_3.geometry}
          material={materials["Material.002"]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/mail_icon.glb");
