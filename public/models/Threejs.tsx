import * as THREE from 'three'
import React, { useRef, forwardRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';
import { useSharedMat } from '../../src/components/sharedMaterial';

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
  const { nodes } = useGLTF('models/threejs.glb') as GLTFResult
  const sharedMaterial = useSharedMat()

  const mesh = useMemo(() => (
    <mesh
      castShadow
      receiveShadow
      geometry={nodes.Curve004.geometry}
      material={sharedMaterial}
      position={[-0.016, 0, 0.017]}
      scale={0.368}
    />
  ), [nodes.Curve004.geometry])

  return (
    <group ref={ref} {...props} dispose={null}>
      {mesh}
    </group>
  )
});

useGLTF.preload('models/threejs.glb')
