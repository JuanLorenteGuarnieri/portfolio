import * as THREE from 'three'
import React, { useRef, forwardRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';
import { useSharedMat } from '../../src/components/sharedMaterial';

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
  const { nodes } = useGLTF('models/git.glb') as GLTFResult
  const sharedMaterial = useSharedMat()

  const mesh = useMemo(() => (
    <mesh
      castShadow
      receiveShadow
      geometry={nodes.Curve010.geometry}
      material={sharedMaterial}
      position={[-0.014, 0, 0.013]}
      scale={1.572}
    />
  ), [nodes]);

  return (
    <group ref={ref} {...props} dispose={null}>
      {mesh}
    </group>
  )
});

useGLTF.preload('models/git.glb')
