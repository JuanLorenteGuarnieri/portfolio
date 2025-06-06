import * as THREE from 'three'
import React, { useRef, forwardRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';

type GLTFResult = GLTF & {
  nodes: {
    option1_helmet: THREE.Mesh
    option1_helmet_1: THREE.Mesh
    option1_helmet_2: THREE.Mesh
  }
  materials: {
    ['Iron.011']: THREE.MeshStandardMaterial
    ['Leather.008']: THREE.MeshStandardMaterial
    ['Steel.010']: THREE.MeshStandardMaterial
  }
}

type Props = JSX.IntrinsicElements['group'] & {};

export const Helmet = forwardRef<Group, Props>((props, ref) => {
  const { nodes, materials } = useGLTF('models/helmet.glb') as GLTFResult

  const meshes = useMemo(() => [
    <mesh
      key="helmet"
      castShadow
      receiveShadow
      geometry={nodes.option1_helmet.geometry}
      material={materials['Iron.011']}
    />,
    <mesh
      key="helmet1"
      castShadow
      receiveShadow
      geometry={nodes.option1_helmet_1.geometry}
      material={materials['Leather.008']}
    />,
    <mesh
      key="helmet2"
      castShadow
      receiveShadow
      geometry={nodes.option1_helmet_2.geometry}
      material={materials['Steel.010']}
    />
  ], [nodes, materials]);

  return (
    <group ref={ref} {...props} dispose={null}>
      <group rotation={[-0.345, -0.819, -0.457]}>
        {meshes}
      </group>
    </group>
  )
});

useGLTF.preload('models/helmet.glb')
