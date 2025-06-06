import * as THREE from 'three'
import React, { useRef, forwardRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';
import { useSharedMat } from '../../src/components/sharedMaterial';

type GLTFResult = GLTF & {
  nodes: {
    Curve: THREE.Mesh
  }
  materials: {
    Mat: THREE.MeshStandardMaterial
  }
}

type Props = JSX.IntrinsicElements['group'] & {};

export const Opencv = forwardRef<Group, Props>((props, ref) => {
  const { nodes } = useGLTF('models/opencv.glb') as GLTFResult
  const sharedMaterial = useSharedMat()

  // Memoiza el mesh para evitar recrearlo en cada render
  const curveMesh = useMemo(() => (
    <mesh
      castShadow
      receiveShadow
      geometry={nodes.Curve.geometry}
      material={sharedMaterial}
      scale={0.2}
    />
  ), [nodes.Curve.geometry])

  return (
    <group ref={ref} {...props} dispose={null}>
      {curveMesh}
    </group>
  )
});

useGLTF.preload('models/opencv.glb')
