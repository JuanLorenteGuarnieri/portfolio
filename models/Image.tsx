import * as THREE from 'three'
import React, { useRef, forwardRef, useState, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';
import { useSharedMat } from '../../src/components/sharedMaterial';

type GLTFResult = GLTF & {
  nodes: {
    Curve008: THREE.Mesh
  }
  materials: {
    Mat: THREE.MeshStandardMaterial
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

export const Image = forwardRef<Group, Props>(({ link = 'https://github.com/JuanLorenteGuarnieri', ...props }, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const { nodes } = useGLTF('models/image.glb') as GLTFResult
  const sharedMaterial = useSharedMat()

  // Memoriza el componente mesh para evitar recreaciones innecesarias
  const meshComponent = useMemo(() => (
    <MeshModel
      geometry={nodes.Curve008.geometry}
      material={sharedMaterial}
      isHovered={isHovered}
      setIsHovered={setIsHovered}
    />
  ), [nodes.Curve008.geometry, isHovered, setIsHovered]);

  return (
    <group
      ref={ref} scale={0.615}
      {...props}
      dispose={null}
      onClick={e => { e.stopPropagation(); window.open(link, '_blank'); }}
    >
      {meshComponent}
    </group>
  )
});

useGLTF.preload('models/image.glb')
