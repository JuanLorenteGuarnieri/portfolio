import * as THREE from 'three'
import React, { useRef, forwardRef, useState, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';
import { ThreeEvent } from '@react-three/fiber';

type GLTFResult = GLTF & {
  nodes: {
    Iphone: THREE.Mesh
    Iphone001: THREE.Mesh
  }
  materials: {
    ['Material.002']: THREE.MeshStandardMaterial
  }
}

type Props = JSX.IntrinsicElements['group'] & {
  link?: string;
};

export const Iphone = forwardRef<Group, Props>(({ link = 'https://linktr.ee/JuanLorente', ...props }, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const { nodes, materials } = useGLTF('models/iphone.glb') as GLTFResult
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
      key="Iphone"
      geometry={nodes.Iphone.geometry}
      material={materials['Material.002']}
      rotation={[0, 0, Math.PI]}
      scale={isHovered ? 0.055 : 0.05}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    />,
    <mesh
      key="Iphone001"
      geometry={nodes.Iphone001.geometry}
      material={materials['Material.002']}
      rotation={[0, 0, Math.PI]}
      scale={isHovered ? 0.055 : 0.05}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    />
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [nodes, materials, isHovered]);

  return (
    <group ref={ref} {...props} dispose={null} onClick={(e) => { e.stopPropagation(); window.open(link, '_blank'); }}>
      {meshes}
    </group>
  )
});

useGLTF.preload('models/iphone.glb')
