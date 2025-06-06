import * as THREE from 'three'
import React, { useRef, forwardRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';

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
  const { nodes, materials } = useGLTF('models/blender.glb') as GLTFResult

  const meshes = useMemo(() => [
    <mesh
      key="curve"
      castShadow
      receiveShadow
      geometry={nodes.Curve.geometry}
      material={materials.Mat}
      position={[-0.015, 0, 0.013]}
      scale={0.819}
    />,
    <mesh
      key="curve001"
      castShadow
      receiveShadow
      geometry={nodes.Curve001.geometry}
      material={materials.Mat}
      position={[-0.015, 0, 0.013]}
      scale={0.819}
    />
  ], [nodes, materials]);

  return (
    <group ref={ref} {...props} dispose={null}>
      {meshes}
    </group>
  )
});

useGLTF.preload('models/blender.glb')
