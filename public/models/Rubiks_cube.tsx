/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 rubiks_cube.glb -t -r ./ 
Author: BeyondDigital (https://sketchfab.com/BeyondDigital)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/rubiks-cube-d7d8aa83720246c782bca30dbadebb98
Title: Rubik's Cube
*/

import * as THREE from 'three'
import React, { useRef, forwardRef, useState, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';

type GLTFResult = GLTF & {
  nodes: {
    Baked_baked_0: THREE.Mesh
  }
  materials: {
    baked: THREE.MeshStandardMaterial
  }
}

type ContextType = Record<string, React.ForwardRefExoticComponent<JSX.IntrinsicElements['mesh']>>

type Props = JSX.IntrinsicElements['group'] & {
  link?: string;
};

export const RubikCube = forwardRef<Group, Props>(({ link = 'https://rubikscu.be/', ...props }, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const { nodes, materials } = useGLTF('models/rubiks_cube.glb') as GLTFResult

  // Memoize the mesh component to avoid redefining it on each render
  const RubikMesh = useMemo(() => {
    return (
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Baked_baked_0.geometry}
        material={materials.baked}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={isHovered ? 105 : 100}
        onPointerEnter={(event) => { event.stopPropagation(); setIsHovered(true); }}
        onPointerLeave={() => setIsHovered(false)}
      />
    );
    // Only nodes, materials, isHovered are dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes.Baked_baked_0.geometry, materials.baked, isHovered]);

  // Memoize the inner group
  const InnerGroup = useMemo(() => {
    return (
      <group scale={0.01}>
        {RubikMesh}
      </group>
    );
  }, [RubikMesh]);

  return (
    <group
      ref={ref}
      {...props}
      dispose={null}
      onClick={(e) => { e.stopPropagation(); window.open(link, '_blank'); }}
    >
      {InnerGroup}
    </group>
  )
});

useGLTF.preload('models/rubiks_cube.glb')
