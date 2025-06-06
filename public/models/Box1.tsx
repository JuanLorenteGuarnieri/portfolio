import * as THREE from 'three'
import React, { useRef, forwardRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';

type GLTFResult = GLTF & {
  nodes: {
    Curve: THREE.Mesh
  }
  materials: {
    Mat: THREE.MeshStandardMaterial
  }
}

type LogoProps = JSX.IntrinsicElements['group']

export const Box1 = forwardRef<Group, LogoProps>((props, ref) => {
  const { nodes, materials } = useGLTF('models/box1.glb') as GLTFResult

  const mesh = useMemo(() => (
    <mesh
      castShadow
      receiveShadow
      geometry={nodes.Curve.geometry}
      material={materials.Mat}
      position={[0.078, 0, 0]}
    />
  ), [nodes.Curve.geometry, materials.Mat])

  return (
    <group ref={ref} {...props} dispose={null}>
      {mesh}
    </group>
  )
})

useGLTF.preload('models/box1.glb')
