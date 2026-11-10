import * as THREE from 'three'
import React, { useRef, forwardRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';

type GLTFResult = GLTF & {
  nodes: { [key: string]: THREE.Mesh }
  materials: { [key: string]: THREE.MeshStandardMaterial }
}

type Props = JSX.IntrinsicElements['group'] & {};

export const Nlos = forwardRef<Group, Props>((props, ref) => {
  const { nodes, materials } = useGLTF('models/nlos.glb') as GLTFResult

  const meshes = useMemo(() => {
    return Array.from({ length: 152 }, (_, i) => {
      const meshKey = `obj1_${i + 1}`;
      const matKey = `mat${i}`;
      return (
        <mesh
          key={meshKey}
          castShadow
          receiveShadow
          geometry={nodes[meshKey]?.geometry}
          material={materials[matKey]}
        />
      );
    });
  }, [nodes, materials]);

  return (
    <group ref={ref} {...props} dispose={null} >
      <group rotation={[0.43, 0.396, -0.175]}>
        {meshes}
      </group>
    </group>
  )
});

useGLTF.preload('models/nlos.glb')
