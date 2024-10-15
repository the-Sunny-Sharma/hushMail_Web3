import React, { useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export function EthereumLogo(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/ethereum_logo.glb");
  const { actions } = useAnimations(animations, group);
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group
          name="Sketchfab_model"
          rotation={[-Math.PI / 2, 0, 0]}
          scale={1.107}
        >
          <group
            name="161ee2e266e94c7791940d78a5a83d04fbx"
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.01}
          >
            <group name="Object_2">
              <group name="RootNode">
                <group
                  name="eth"
                  rotation={[-Math.PI, -1.556, -Math.PI]}
                  scale={[1, 1, 1.145]}
                >
                  <group
                    name="Pyramid_3"
                    position={[0.217, 73.807, 0.929]}
                    rotation={[0, Math.PI / 4, 0]}
                  >
                    <mesh
                      name="Pyramid_3_lambert3_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.Pyramid_3_lambert3_0.geometry}
                      material={materials.lambert3}
                    />
                    <mesh
                      name="Pyramid_3_lambert4_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.Pyramid_3_lambert4_0.geometry}
                      material={materials.lambert4}
                    />
                    <mesh
                      name="Pyramid_3_lambert2_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.Pyramid_3_lambert2_0.geometry}
                      material={materials.lambert2}
                    />
                  </group>
                  <group
                    name="Pyramid_1"
                    position={[-0.108, -36.302, 32.916]}
                    rotation={[-Math.PI / 2, 0, -Math.PI]}
                  >
                    <group name="transform1" />
                  </group>
                  <group
                    name="Pyramid"
                    position={[-0.108, -36.302, -33.845]}
                    rotation={[-Math.PI / 2, 0, 0]}
                  >
                    <group name="transform2" />
                  </group>
                </group>
                <group name="Pyramid_1">
                  <mesh
                    name="Pyramid_Default_Material_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Pyramid_Default_Material_0.geometry}
                    material={materials.Default_Material}
                  />
                  <mesh
                    name="Pyramid_lambert4_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Pyramid_lambert4_0.geometry}
                    material={materials.lambert4}
                  />
                  <mesh
                    name="Pyramid_lambert3_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Pyramid_lambert3_0.geometry}
                    material={materials.lambert3}
                  />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/ethereum_logo.glb");
