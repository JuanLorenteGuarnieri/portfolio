import * as THREE from 'three'
import React, { useRef, forwardRef, useState, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';
import { useSharedMat } from '../../src/components/sharedMaterial';

type GLTFResult = GLTF & {
  nodes: {
    Path001: THREE.Mesh
    Shape001: THREE.Mesh
    Path004: THREE.Mesh
  }
  materials: {
    Mat6: THREE.MeshStandardMaterial
    Mat: THREE.MeshStandardMaterial
    Mat7: THREE.MeshStandardMaterial
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

export const Docs = forwardRef<Group, Props>(({ link = 'https://github.com/JuanLorenteGuarnieri', ...props }, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const { nodes, materials } = useGLTF('models/docs.glb') as GLTFResult
  const sharedMaterial = useSharedMat()

  // Memoriza el componente mesh para evitar recreaciones innecesarias
  const meshComponent = useMemo(() => (
    <MeshModel
      geometry={nodes.Path001.geometry}
      material={materials.Mat6}
      isHovered={isHovered}
      setIsHovered={setIsHovered}
    />
  ), [nodes.Path001.geometry, isHovered, setIsHovered, materials]);

  const meshComponent2 = useMemo(() => (
    <MeshModel
      geometry={nodes.Shape001.geometry}
      material={sharedMaterial}
      isHovered={isHovered}
      setIsHovered={setIsHovered}
    />
  ), [nodes.Shape001.geometry, isHovered, setIsHovered]);

  const meshComponent3 = useMemo(() => (
    <MeshModel
      geometry={nodes.Path004.geometry}
      material={materials.Mat7}
      isHovered={isHovered}
      setIsHovered={setIsHovered}
    />
  ), [nodes.Path004.geometry, isHovered, setIsHovered, materials]);

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

useGLTF.preload('models/docs.glb')