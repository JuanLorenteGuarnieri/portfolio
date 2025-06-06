import * as THREE from 'three'
import React, { useRef, forwardRef, useState, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';
import { ThreeEvent } from '@react-three/fiber';

type GLTFResult = GLTF & {
  nodes: {
    XMLID_802_: THREE.Mesh
    XMLID_803_: THREE.Mesh
    XMLID_804_: THREE.Mesh
  }
  materials: {
    Mat: THREE.MeshStandardMaterial
  }
}

type Props = JSX.IntrinsicElements['group'] & {
  link?: string;
};

export const Linkedin = forwardRef<Group, Props>(({ link = 'https://www.linkedin.com/in/juanlorenteguarnieri/en/', ...props }, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const { nodes, materials } = useGLTF('models/linkedin.glb') as GLTFResult
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

  const meshes = useMemo(() => {
    const meshProps = {
      castShadow: true,
      receiveShadow: true,
      material: materials.Mat,
      position: isHovered ? [-0.012, 0, 0.0115] as [number, number, number] : [-0.012, 0, 0.01] as [number, number, number],
      scale: isHovered ? [0.122, 0.122, 0.122] as [number, number, number] : [0.112, 0.112, 0.112] as [number, number, number],
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
    } as const;

    return [
      <mesh key="mesh1" geometry={nodes.XMLID_802_.geometry} {...meshProps} />,
      <mesh key="mesh2" geometry={nodes.XMLID_803_.geometry} {...meshProps} />,
      <mesh key="mesh3" geometry={nodes.XMLID_804_.geometry} {...meshProps} />,
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered, nodes, materials]);

  return (
    <group
      ref={ref}
      {...props}
      dispose={null}
      onClick={(e) => { e.stopPropagation(); window.open(link, '_blank'); }}
    >
      {meshes}
    </group>
  )
});

useGLTF.preload('models/linkedin.glb')
