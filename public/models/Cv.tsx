import * as THREE from 'three'
import React, { useRef, forwardRef, useState, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';

type GLTFResult = GLTF & {
  nodes: {
    Curve006: THREE.Mesh
    Curve007: THREE.Mesh
  }
  materials: {
    Mat: THREE.MeshStandardMaterial
  }
}

type Props = JSX.IntrinsicElements['group'] & {
  link?: string;
};

const MeshComponent = ({
  geometry,
  material,
  position,
  scale,
  onPointerEnter,
  onPointerLeave,
}: {
  geometry: THREE.BufferGeometry
  material: THREE.Material
  position: [number, number, number]
  scale: number
  onPointerEnter: (e: any) => void
  onPointerLeave: () => void
}) => (
  <mesh
    castShadow
    receiveShadow
    geometry={geometry}
    material={material}
    position={position}
    scale={scale}
    onPointerEnter={onPointerEnter}
    onPointerLeave={onPointerLeave}
  />
);

export const CV = forwardRef<Group, Props>(({ link = 'https://juanlorenteguarnieri.github.io/portfolio/CV.pdf', ...props }, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const { nodes, materials } = useGLTF('models/cv.glb') as GLTFResult

  const meshProps = useMemo(() => ({
    position: isHovered ? [-0.06, 0, 0.039] as [number, number, number] : [-0.054, 0, 0.036] as [number, number, number],
    scale: isHovered ? 2.257 : 2.057,
    onPointerEnter: (event: any) => { event.stopPropagation(); setIsHovered(true); },
    onPointerLeave: () => setIsHovered(false),
  }), [isHovered]);

  const meshes = useMemo(() => [
    <MeshComponent
      key="Curve006"
      geometry={nodes.Curve006.geometry}
      material={materials.Mat}
      {...meshProps}
    />,
    <MeshComponent
      key="Curve007"
      geometry={nodes.Curve007.geometry}
      material={materials.Mat}
      {...meshProps}
    />
  ], [nodes, materials, meshProps]);

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

useGLTF.preload('models/cv.glb')
