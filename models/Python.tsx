import * as THREE from 'three'
import React, { useRef, forwardRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';
import { useSharedMat } from '../../src/components/sharedMaterial';

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
  const { nodes } = useGLTF('models/python.glb') as GLTFResult
  const sharedMaterial = useSharedMat()

  // Creamos un material diferente para la segunda mesh
  const coloredMaterial = useMemo(() => {
    const mat = sharedMaterial.clone()
    mat.color = new THREE.Color('#dedeea') // Cambia el color aquí
    return mat
  }, [sharedMaterial])

  const meshes = useMemo(() => [
    <mesh
      key="mesh1"
      castShadow
      receiveShadow
      geometry={nodes.path1948.geometry}
      material={sharedMaterial}
      position={[-0.004, 0, -0.007]}
    />,
    <mesh
      key="mesh2"
      castShadow
      receiveShadow
      geometry={nodes.path1950.geometry}
      material={coloredMaterial}
      position={[0.005, 0, 0.006]}
    />
  ], [nodes, sharedMaterial, coloredMaterial])

  return (
    <group ref={ref} {...props} dispose={null}>
      {meshes}
    </group>
  )
});

useGLTF.preload('models/python.glb')
