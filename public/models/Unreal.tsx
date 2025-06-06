import * as THREE from 'three'
import React, { useRef, forwardRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';

type GLTFResult = GLTF & {
  nodes: {
    Curve002: THREE.Mesh
  }
  materials: {
    Mat: THREE.MeshStandardMaterial
  }
}

type LogoProps = JSX.IntrinsicElements['group'] & {
  // Aquí puedes añadir cualquier otra prop personalizada si es necesario
};

export const Unreal = forwardRef<Group, LogoProps>((props, ref) => {
  const { nodes, materials } = useGLTF('models/unreal.glb') as GLTFResult

  const mesh = useMemo(() => (
    <mesh
      castShadow
      receiveShadow
      geometry={nodes.Curve002.geometry}
      material={materials.Mat}
      position={[-0.016, 0, 0.015]}
      scale={0.141}
    />
  ), [nodes.Curve002.geometry, materials.Mat])

  return (
    <group ref={ref} {...props} dispose={null}>
      {mesh}
    </group>
  )
});

useGLTF.preload('models/unreal.glb')
