import * as THREE from 'three'
import React, { useRef, forwardRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';

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
  const { nodes, materials } = useGLTF('models/vscode.glb') as GLTFResult

  const meshes = useMemo(() => [
    <mesh
      key="curve003"
      castShadow
      receiveShadow
      geometry={nodes.Curve003.geometry}
      material={materials.Mat}
      position={[-0.015, 0.004, 0.013]}
      scale={0.732}
    />,
    <mesh
      key="curve006"
      castShadow
      receiveShadow
      geometry={nodes.Curve006.geometry}
      material={materials.Mat}
      position={[-0.015, 0.006, 0.013]}
      scale={0.732}
    />,
    <mesh
      key="curve007"
      castShadow
      receiveShadow
      geometry={nodes.Curve007.geometry}
      material={materials.Mat}
      position={[-0.015, 0.001, -0.014]}
      rotation={[0, 0, -Math.PI]}
      scale={-0.732}
    />
  ], [nodes, materials]);

  return (
    <group ref={ref} {...props} dispose={null}>
      {meshes}
    </group>
  )
});

useGLTF.preload('models/vscode.glb')
