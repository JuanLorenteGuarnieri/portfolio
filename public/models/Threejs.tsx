import * as THREE from 'three'
import React, { useRef, forwardRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';

type GLTFResult = GLTF & {
  nodes: {
    Curve004: THREE.Mesh
  }
  materials: {
    Mat: THREE.MeshStandardMaterial
  }
}

type LogoProps = JSX.IntrinsicElements['group'] & {
  // Aquí puedes añadir cualquier otra prop personalizada si es necesario
};

export const Threejs = forwardRef<Group, LogoProps>((props, ref) => {
  const { nodes, materials } = useGLTF('models/threejs.glb') as GLTFResult

  const mesh = useMemo(() => (
    <mesh
      castShadow
      receiveShadow
      geometry={nodes.Curve004.geometry}
      material={materials.Mat}
      position={[-0.016, 0, 0.017]}
      scale={0.368}
    />
  ), [nodes.Curve004.geometry, materials.Mat])

  return (
    <group ref={ref} {...props} dispose={null}>
      {mesh}
    </group>
  )
});

useGLTF.preload('models/threejs.glb')
