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

type Props = JSX.IntrinsicElements['group'] & {};

export const Unity = forwardRef<Group, Props>((props, ref) => {
  const { nodes, materials } = useGLTF('models/unity.glb') as GLTFResult

  const curveMesh = useMemo(() => (
    <mesh
      castShadow
      receiveShadow
      geometry={nodes.Curve.geometry}
      material={materials.Mat}
      scale={0.9}
    />
  ), [nodes.Curve.geometry, materials.Mat])

  return (
    <group ref={ref} {...props} dispose={null}>
      {curveMesh}
    </group>
  )
});

useGLTF.preload('models/unity.glb')
