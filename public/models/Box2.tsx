import * as THREE from 'three'
import React, { useRef, forwardRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';
import { useSharedMat } from '../../src/components/sharedMaterial';

type GLTFResult = GLTF & {
  nodes: {
    Curve002: THREE.Mesh
  }
  materials: {
    Mat: THREE.MeshStandardMaterial
  }
}

type LogoProps = JSX.IntrinsicElements['group'];

export const Box2 = forwardRef<Group, LogoProps>((props, ref) => {
  const { nodes } = useGLTF('models/box2.glb') as GLTFResult
  const sharedMaterial = useSharedMat()

  const mesh = useMemo(() => (
    <mesh
      castShadow
      receiveShadow
      geometry={nodes.Curve002.geometry}
      material={sharedMaterial}
      position={[0.078, 0, 0]}
    />
  ), [nodes])

  return (
    <group ref={ref} {...props} dispose={null}>
      {mesh}
    </group>
  )
});

useGLTF.preload('models/box2.glb')
