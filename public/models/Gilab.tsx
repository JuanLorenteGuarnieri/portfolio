import * as THREE from 'three'
import React, { useRef, forwardRef, useState, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';
import { ThreeEvent } from '@react-three/fiber';

type GLTFResult = GLTF & {
  nodes: {
    Curve001: THREE.Mesh
    Curve002: THREE.Mesh
    Curve003: THREE.Mesh
  }
  materials: {
    Mat: THREE.MeshStandardMaterial
  }
}
type Props = JSX.IntrinsicElements['group'] & {
  link?: string;
  scale?: number;
};

export const Gilab = forwardRef<Group, Props>(({ link = 'https://graphics.unizar.es/', scale = 1, ...props }, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const { nodes, materials } = useGLTF('models/gilab.glb') as GLTFResult
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

  const meshes = useMemo(() => [
    <mesh
      key="Curve001"
      castShadow
      receiveShadow
      geometry={nodes.Curve001.geometry}
      material={materials.Mat}
      position={[0.001, 0, 0.003]}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    />,
    <mesh
      key="Curve002"
      castShadow
      receiveShadow
      geometry={nodes.Curve002.geometry}
      material={materials.Mat}
      position={[0.012, 0, -0.015]}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    />,
    <mesh
      key="Curve003"
      castShadow
      receiveShadow
      geometry={nodes.Curve003.geometry}
      material={materials.Mat}
      position={[0.00, 0, -0.005]}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    />
    // Solo se vuelve a crear si nodes o materials cambian
  ], [nodes, materials, handlePointerEnter, handlePointerLeave]);

  return (
    <group
      ref={ref}
      {...props}
      dispose={null}
      onClick={(e) => { e.stopPropagation(); window.open(link, '_blank'); }}
      scale={isHovered ? 1.1 * scale : scale}
    >
      {meshes}
    </group>
  )
});

useGLTF.preload('models/gilab.glb')
