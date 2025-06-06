import * as THREE from 'three'
import React, { useRef, forwardRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';

type GLTFResult = GLTF & {
  nodes: {
    Curve010: THREE.Mesh
  }
  materials: {
    Mat: THREE.MeshStandardMaterial
  }
}

type LogoProps = JSX.IntrinsicElements['group'] & {};

export const Git = forwardRef<Group, LogoProps>((props, ref) => {
  const { nodes, materials } = useGLTF('models/git.glb') as GLTFResult

  const mesh = useMemo(() => (
    <mesh
      castShadow
      receiveShadow
      geometry={nodes.Curve010.geometry}
      material={materials.Mat}
      position={[-0.014, 0, 0.013]}
      scale={1.572}
    />
  ), [nodes, materials]);

  return (
    <group ref={ref} {...props} dispose={null}>
      {mesh}
    </group>
  )
});

useGLTF.preload('models/git.glb')
