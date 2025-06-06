import * as THREE from 'three'
import React, { useRef, forwardRef, useState, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';

type GLTFResult = GLTF & {
  nodes: {
    Cylinder002: THREE.Mesh
  }
  materials: {
    ['Material.001']: THREE.MeshStandardMaterial
  }
}

type Props = JSX.IntrinsicElements['group'] & {
  link?: string;
};

export const Chess = forwardRef<Group, Props>(({ link = 'https://www.chess.com/member/qassiel', ...props }, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const { nodes, materials } = useGLTF('models/chess.glb') as GLTFResult

  const meshComponent = useMemo(() => (
    <mesh
      castShadow
      receiveShadow
      geometry={nodes.Cylinder002.geometry}
      material={materials['Material.001']}
      position={[-0.003, -0.027, -0.01]}
    />
  ), [nodes, materials]);

  return (
    <group
      ref={ref}
      {...props}
      dispose={null}
      onClick={(e) => { e.stopPropagation(); window.open(link, '_blank'); }}
    >
      {React.cloneElement(meshComponent, {
        scale: isHovered ? [0.0121, 0.0286, 0.0121] : [0.011, 0.026, 0.011],
        onPointerEnter: (event: any) => { event.stopPropagation(); setIsHovered(true); },
        onPointerLeave: () => setIsHovered(false),
      })}
    </group>
  )
});

useGLTF.preload('models/chess.glb')
