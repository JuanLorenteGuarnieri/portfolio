import * as THREE from 'three'
import React, { useRef, forwardRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';

type GLTFResult = GLTF & {
  nodes: {
    Curve001: THREE.Mesh
    Curve002: THREE.Mesh
  }
  materials: {
    Mat: THREE.MeshStandardMaterial
  }
}

type Props = JSX.IntrinsicElements['group'] & {};

export const Pytorch = forwardRef<Group, Props>((props, ref) => {
  const { nodes, materials } = useGLTF('models/pytorch.glb') as GLTFResult

  const mesh1 = useMemo(() => (
    <mesh
      castShadow
      receiveShadow
      geometry={nodes.Curve001.geometry}
      material={materials.Mat}
      position={[0, 0, 0.005]}
      scale={0.1}
    />
  ), [nodes.Curve001.geometry, materials.Mat])

  const mesh2 = useMemo(() => (
    <mesh
      castShadow
      receiveShadow
      geometry={nodes.Curve002.geometry}
      material={materials.Mat}
      position={[0.005, 0, -0.009]}
      scale={0.1}
    />
  ), [nodes.Curve002.geometry, materials.Mat])

  return (
    <group ref={ref} {...props} dispose={null}>
      {mesh1}
      {mesh2}
    </group>
  )
});

useGLTF.preload('models/pytorch.glb')
