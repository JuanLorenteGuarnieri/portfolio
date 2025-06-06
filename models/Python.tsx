import * as THREE from 'three'
import React, { useRef, forwardRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';

type GLTFResult = GLTF & {
  nodes: {
    path1948: THREE.Mesh
    path1950: THREE.Mesh
  }
  materials: {
    Mat: THREE.MeshStandardMaterial
    Mat2: THREE.MeshStandardMaterial
  }
}

type Props = JSX.IntrinsicElements['group'] & {};

export const Python = forwardRef<Group, Props>((props, ref) => {
  const { nodes, materials } = useGLTF('models/python.glb') as GLTFResult

  const meshes = useMemo(() => [
    <mesh
      key="mesh1"
      castShadow
      receiveShadow
      geometry={nodes.path1948.geometry}
      material={materials.Mat2}
      position={[-0.004, 0, -0.007]}
    />,
    <mesh
      key="mesh2"
      castShadow
      receiveShadow
      geometry={nodes.path1950.geometry}
      material={materials.Mat}
      position={[0.005, 0, 0.006]}
    />
  ], [nodes, materials])

  return (
    <group ref={ref} {...props} dispose={null}>
      {meshes}
    </group>
  )
});

useGLTF.preload('models/python.glb')
