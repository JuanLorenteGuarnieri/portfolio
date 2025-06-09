import * as THREE from 'three'
import React, { useRef, forwardRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';
import { useSharedMat } from '../../src/components/sharedMaterial';

type GLTFResult = GLTF & {
  nodes: {
    Curve: THREE.Mesh
    Curve001: THREE.Mesh
  }
  materials: {
    Mat: THREE.MeshStandardMaterial
  }
}

type LogoProps = JSX.IntrinsicElements['group'];

export const Blender = forwardRef<Group, LogoProps>((props, ref) => {
  const { nodes } = useGLTF('models/blender.glb') as GLTFResult
  const sharedMaterial = useSharedMat()

  const meshes = useMemo(() => [
    <mesh
      key="curve"
      castShadow
      receiveShadow
      geometry={nodes.Curve.geometry}
      material={sharedMaterial}
      position={[-0.015, 0, 0.013]}
      scale={0.819}
    />,
    <mesh
      key="curve001"
      castShadow
      receiveShadow
      geometry={nodes.Curve001.geometry}
      material={sharedMaterial}
      position={[-0.015, 0, 0.013]}
      scale={0.819}
    />
  ], [nodes]);

  return (
    <group ref={ref} {...props} dispose={null}>
      {meshes}
    </group>
  )
});

useGLTF.preload('models/blender.glb')
