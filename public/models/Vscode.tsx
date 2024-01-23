/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 vscode.glb -t -r ./ 
*/

import * as THREE from 'three'
import React, { useRef, forwardRef } from 'react'
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

type LogoProps = JSX.IntrinsicElements['group'] & {
  // Aquí puedes añadir cualquier otra prop personalizada si es necesario
};

export const Vscode = forwardRef<Group, LogoProps>((props, ref) => {
  const { nodes, materials } = useGLTF('models/vscode.glb') as GLTFResult
  return (
    <group ref={ref} {...props} dispose={null}>
      <mesh geometry={nodes.Curve003.geometry} material={materials.Mat} position={[-0.015, 0.004, 0.013]} scale={0.732} />
      <mesh geometry={nodes.Curve006.geometry} material={materials.Mat} position={[-0.015, 0.006, 0.013]} scale={0.732} />
      <mesh geometry={nodes.Curve007.geometry} material={materials.Mat} position={[-0.015, 0.001, -0.014]} rotation={[0, 0, -Math.PI]} scale={-0.732} />
    </group>
  )
});

useGLTF.preload('models/vscode.glb')
