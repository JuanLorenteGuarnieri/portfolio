import * as THREE from 'three'
import React, { useRef, forwardRef, useState, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';

type GLTFResult = GLTF & {
  nodes: {
    book_a_0: THREE.Mesh
  }
  materials: {
    book_a: THREE.MeshStandardMaterial
  }
}

type Props = JSX.IntrinsicElements['group'] & {
  link?: string;
};

export const Book = forwardRef<Group, Props>(({ link = 'https://www.amazon.com/Laws-Human-Nature-Robert-Greene/dp/0525428143', ...props }, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const { nodes, materials } = useGLTF('models/book.glb') as GLTFResult

  const mesh = useMemo(() => (
    <mesh
      geometry={nodes.book_a_0.geometry}
      material={materials.book_a}
      position={isHovered ? [11.037, 0, -8.03] : [10.037, 0, -7.03]}
      scale={isHovered ? 1.1 : 1}
      castShadow
      receiveShadow
      onPointerEnter={event => { event.stopPropagation(); setIsHovered(true); }}
      onPointerLeave={() => setIsHovered(false)}
    />
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [nodes, materials, isHovered]);

  return (
    <group
      ref={ref}
      {...props}
      dispose={null}
      onClick={e => { e.stopPropagation(); window.open(link, '_blank'); }}
    >
      {mesh}
    </group>
  )
});

useGLTF.preload('models/book.glb')
