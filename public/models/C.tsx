import * as THREE from 'three'
import React, { useRef, forwardRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';
import { useSharedMat } from '../../src/components/sharedMaterial';

type GLTFResult = GLTF & {
  nodes: {
    Curve011: THREE.Mesh
    Curve012: THREE.Mesh
    Curve013: THREE.Mesh
    Curve014: THREE.Mesh
  }
  materials: {
    ['Mat.001']: THREE.MeshStandardMaterial
    ['Mat.002']: THREE.MeshStandardMaterial
    Mat: THREE.MeshStandardMaterial
  }
}

type LogoProps = JSX.IntrinsicElements['group'];

export const C = forwardRef<Group, LogoProps>((props, ref) => {
  const { nodes, materials } = useGLTF('models/c.glb') as GLTFResult
  const sharedMaterial = useSharedMat()

  const meshes = useMemo(() => [
    <mesh
      key="Curve011"
      castShadow
      receiveShadow
      geometry={nodes.Curve011.geometry}
      material={materials['Mat.001']}
      position={[-0.013, 0, 0.013]}
      scale={0.767}
    />,
    <mesh
      key="Curve012"
      castShadow
      receiveShadow
      geometry={nodes.Curve012.geometry}
      material={materials['Mat.002']}
      position={[-0.013, 0, 0.013]}
      scale={0.767}
    />,
    <mesh
      key="Curve013"
      castShadow
      receiveShadow
      geometry={nodes.Curve013.geometry}
      material={sharedMaterial}
      position={[-0.013, 0, 0.013]}
      scale={0.767}
    />,
    <mesh
      key="Curve014"
      castShadow
      receiveShadow
      geometry={nodes.Curve014.geometry}
      material={sharedMaterial}
      position={[-0.013, 0, 0.013]}
      scale={0.767}
    />,
  ], [nodes, materials]);

  return (
    <group ref={ref} {...props} dispose={null}>
      {meshes}
    </group>
  )
});

useGLTF.preload('models/c.glb')
