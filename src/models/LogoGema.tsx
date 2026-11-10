import * as THREE from 'three'
import React, { useRef, forwardRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { Group } from 'three';
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    LogoCentro: THREE.Mesh
  }
  materials: {
    M_Logo: THREE.MeshStandardMaterial
  }
}

type LogoProps = JSX.IntrinsicElements['group'] & {};

export const LogoGema = forwardRef<Group, LogoProps>((props, ref) => {
  const { nodes, materials } = useGLTF('models/logoGema.glb') as GLTFResult

  // Memoize the mesh element
  const logoMesh = useMemo(() => (
    <mesh
      geometry={nodes.LogoCentro.geometry}
      material={materials.M_Logo}
      position={[0.49, 2.864, -1.438]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[-1.038, -0.6, -1.475]}
    />
  ), [nodes.LogoCentro.geometry, materials.M_Logo])

  return (
    <group ref={ref} {...props} dispose={null}>
      {logoMesh}
    </group>
  )
});

useGLTF.preload('models/logoGema.glb')
