import * as THREE from 'three'
import React, { useRef, forwardRef, useState, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';
import { useSharedMat } from '../../src/components/sharedMaterial';

type GLTFResult = GLTF & {
  nodes: {
    Path: THREE.Mesh
    Shape: THREE.Mesh
    Path002: THREE.Mesh
  }
  materials: {
    Mat3: THREE.MeshStandardMaterial
    Mat: THREE.MeshStandardMaterial
    Mat4: THREE.MeshStandardMaterial
  }
}

type Props = JSX.IntrinsicElements['group'] & {
  link?: string;
};

const MeshModel = React.memo(function MeshModel({
  geometry,
  material,
  isHovered,
  setIsHovered,
}: {
  geometry: THREE.BufferGeometry
  material: THREE.Material
  isHovered: boolean
  setIsHovered: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <mesh
      castShadow
      receiveShadow
      geometry={geometry}
      material={material}
      scale={isHovered ? 1.1 : 1}
      onPointerEnter={event => { event.stopPropagation(); setIsHovered(true); }}
      onPointerLeave={() => setIsHovered(false)}
    />
  );
});

export const Slides = forwardRef<Group, Props>(({ link = 'https://github.com/JuanLorenteGuarnieri', ...props }, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const { nodes, materials } = useGLTF('models/slides.glb') as GLTFResult
  const sharedMaterial = useSharedMat()

  // Memoriza el componente mesh para evitar recreaciones innecesarias
  const meshComponent = useMemo(() => (
    <MeshModel
      geometry={nodes.Path.geometry}
      material={materials.Mat3}
      isHovered={isHovered}
      setIsHovered={setIsHovered}
    />
  ), [nodes.Path.geometry, isHovered, setIsHovered, materials]);

  const meshComponent2 = useMemo(() => (
    <MeshModel
      geometry={nodes.Shape.geometry}
      material={sharedMaterial}
      isHovered={isHovered}
      setIsHovered={setIsHovered}
    />
  ), [nodes.Shape.geometry, isHovered, setIsHovered]);

  const meshComponent3 = useMemo(() => (
    <MeshModel
      geometry={nodes.Path002.geometry}
      material={materials.Mat4}
      isHovered={isHovered}
      setIsHovered={setIsHovered}
    />
  ), [nodes.Path002.geometry, isHovered, setIsHovered, materials]);

  return (
    <group
      ref={ref}
      {...props}
      dispose={null}
      onClick={e => { e.stopPropagation(); window.open(link, '_blank'); }}
    >
      {meshComponent}
      {meshComponent2}
      {meshComponent3}
    </group>
  )
});

useGLTF.preload('models/slides.glb')