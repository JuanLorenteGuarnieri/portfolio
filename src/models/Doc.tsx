import * as THREE from 'three'
import React, { useRef, forwardRef, useState, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';

type GLTFResult = GLTF & {
  nodes: {
    Curve004: THREE.Mesh
    Curve005: THREE.Mesh
    Curve008: THREE.Mesh
  }
  materials: {
    Mat: THREE.MeshStandardMaterial
    ['Mat.001']: THREE.MeshStandardMaterial
    ['Mat.002']: THREE.MeshStandardMaterial
  }
}

type Props = JSX.IntrinsicElements['group'] & {
  link?: string;
};

export const Doc = forwardRef<Group, Props>(({ link = 'https://books.google.com/', ...props }, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const { nodes, materials } = useGLTF('models/doc.glb') as GLTFResult

  const meshProps = useMemo(() => ({
    position: isHovered ? [-0.0128, 0, 0.0148] as [number, number, number] : [-0.012, 0, 0.014] as [number, number, number],
    scale: isHovered ? [0.2, 0.2, 0.2] as [number, number, number] : [0.184, 0.184, 0.184] as [number, number, number],
    onPointerEnter: (event: any) => { event.stopPropagation(); setIsHovered(true); },
    onPointerLeave: () => setIsHovered(false),
    castShadow: true,
    receiveShadow: true,
  }), [isHovered]);

  const mesh1 = useMemo(() => (
    <mesh
      geometry={nodes.Curve004.geometry}
      material={materials['Mat.001']}
      {...meshProps}
    />
  ), [nodes.Curve004.geometry, materials['Mat.001'], meshProps]);

  const mesh2 = useMemo(() => (
    <mesh
      geometry={nodes.Curve005.geometry}
      material={materials['Mat.001']}
      {...meshProps}
    />
  ), [nodes.Curve005.geometry, materials['Mat.001'], meshProps]);

  const mesh3 = useMemo(() => (
    <mesh
      geometry={nodes.Curve008.geometry}
      material={materials['Mat.002']}
      {...meshProps}
    />
  ), [nodes.Curve008.geometry, materials['Mat.002'], meshProps]);

  return (
    <group
      ref={ref}
      {...props}
      dispose={null}
      onClick={(e) => { e.stopPropagation(); window.open(link, '_blank'); }}
    >
      {mesh1}
      {mesh2}
      {mesh3}
    </group>
  )
});

useGLTF.preload('models/doc.glb')
