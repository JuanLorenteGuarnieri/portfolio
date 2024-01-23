/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 profile.glb -t -r ./ 
*/

import * as THREE from 'three'
import React, { useRef, forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';

type GLTFResult = GLTF & {
  nodes: {
    wood: THREE.Mesh
    imagen001: THREE.Mesh
  }
  materials: {
    Default: THREE.MeshStandardMaterial
    ['Default.001']: THREE.MeshStandardMaterial
  }
}

type ActionName = 'photo-frame-010|Take 001|Layer 001' | 'wood|Take 001|Layer 001' | 'photo-frame-010|Take 001|Layer 001.001' | 'imagen|Take 001|Layer 001.001'
interface GLTFAction extends THREE.AnimationClip {
  name: ActionName
}
type ContextType = Record<string, React.ForwardRefExoticComponent<JSX.IntrinsicElements['mesh']>>


type LogoProps = JSX.IntrinsicElements['group'] & {
  // Aquí puedes añadir cualquier otra prop personalizada si es necesario
};

export const Profile = forwardRef<Group, LogoProps>((props, ref) => {
  const { nodes, materials } = useGLTF('models/profile.glb') as GLTFResult
  return (
    <group ref={ref} {...props} dispose={null}>
      <group name="Scene">
        <group name="photo-frame-010001" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <mesh name="imagen001" geometry={nodes.imagen001.geometry} material={materials['Default.001']} />
        </group>
      </group>
    </group>
  )
});

useGLTF.preload('models/profile.glb')