import * as THREE from 'three'
import React, { useRef, forwardRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';
import { useSharedMat } from '../../src/components/sharedMaterial';

type GLTFResult = GLTF & {
  nodes: {
    Curve003: THREE.Mesh
    Curve006: THREE.Mesh
    Curve007: THREE.Mesh
  }
  materials: {
    Mat: THREE.MeshStandardMaterial
  }
}

type LogoProps = JSX.IntrinsicElements['group'];

export const Vscode = forwardRef<Group, LogoProps>((props, ref) => {
  const { nodes } = useGLTF('models/vscode.glb') as GLTFResult
  const sharedMaterial = useSharedMat()

  const meshes = useMemo(() => [
    <mesh
      key="curve003"
      castShadow
      receiveShadow
      geometry={nodes.Curve003.geometry}
      material={sharedMaterial}
      position={[-0.015, 0.004, 0.013]}
      scale={0.732}
    />,
    <mesh
      key="curve006"
      castShadow
      receiveShadow
      geometry={nodes.Curve006.geometry}
      material={sharedMaterial}
      position={[-0.015, 0.006, 0.013]}
      scale={0.732}
    />,
    <mesh
      key="curve007"
      castShadow
      receiveShadow
      geometry={nodes.Curve007.geometry}
      material={sharedMaterial}
      position={[-0.015, 0.001, -0.014]}
      rotation={[0, 0, -Math.PI]}
      scale={-0.732}
    />
  ], [nodes]);

  return (
    <group ref={ref} {...props} dispose={null}>
      {meshes}
    </group>
  )
});

useGLTF.preload('models/vscode.glb')
