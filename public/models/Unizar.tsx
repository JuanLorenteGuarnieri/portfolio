import * as THREE from 'three'
import React, { useRef, forwardRef, useState, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';
import { ThreeEvent } from '@react-three/fiber';

type GLTFResult = GLTF & {
  nodes: {
    path102: THREE.Mesh
    path106: THREE.Mesh
    path110: THREE.Mesh
    path114: THREE.Mesh
    path118: THREE.Mesh
  }
  materials: {
    ['SVGMat.022']: THREE.MeshStandardMaterial
  }
}

type Props = JSX.IntrinsicElements['group'] & {
  link?: string;
};

export const Unizar = forwardRef<Group, Props>(({ link = 'https://www.unizar.es/', ...props }, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const { nodes, materials } = useGLTF('models/unizar.glb') as GLTFResult
  const hoverCount = useRef(0);

  const handlePointerEnter = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    hoverCount.current += 1;
    setIsHovered(true);
  };

  const handlePointerLeave = (event: ThreeEvent<PointerEvent>) => {
    hoverCount.current -= 1;
    if (hoverCount.current <= 0) {
      setIsHovered(false);
      hoverCount.current = 0;
    }
  };

  const meshProps = useMemo(() => ({
    castShadow: true,
    receiveShadow: true,
    material: materials['SVGMat.022'],
    position: isHovered ? ([-0.027, 0, 0.036] as [number, number, number]) : ([-0.025, 0, 0.033] as [number, number, number]),
    scale: isHovered ? (1.1 as number) : (1 as number),
    onPointerEnter: handlePointerEnter,
    onPointerLeave: handlePointerLeave,
  }), [isHovered, materials]);

  const meshes = useMemo(() => [
    <mesh key="path102" geometry={nodes.path102.geometry} {...meshProps} />,
    <mesh key="path106" geometry={nodes.path106.geometry} {...meshProps} />,
    <mesh key="path110" geometry={nodes.path110.geometry} {...meshProps} />,
    <mesh key="path114" geometry={nodes.path114.geometry} {...meshProps} />,
    <mesh key="path118" geometry={nodes.path118.geometry} {...meshProps} />,
  ], [nodes, meshProps]);

  return (
    <group ref={ref} {...props} dispose={null} onClick={(e) => { e.stopPropagation(); window.open(link, '_blank'); }}>
      {meshes}
    </group>
  )
});

useGLTF.preload('models/unizar.glb')
