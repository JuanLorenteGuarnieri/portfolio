import * as THREE from 'three'
import React, { useRef, forwardRef, useState, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';
import { useSharedMat } from '../../src/components/sharedMaterial';

type GLTFResult = GLTF & {
  nodes: {
    Curve: THREE.Mesh
  }
  materials: {
    Mat: THREE.MeshStandardMaterial
  }
}

type Props = JSX.IntrinsicElements['group'] & {
  link?: string;
};

const WindowsMesh = React.memo(function WindowsMesh({
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
      scale={isHovered ? [0.8541, 0.9, 0.8514] : [0.79716, 0.84, 0.79464]}
      onPointerEnter={event => { event.stopPropagation(); setIsHovered(true); }}
      onPointerLeave={() => setIsHovered(false)}
    />
  );
});

export const Windows = forwardRef<Group, Props>(({ link = 'https://github.com/JuanLorenteGuarnieri', ...props }, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const { nodes } = useGLTF('models/windows.glb') as GLTFResult
  const sharedMaterial = useSharedMat()

  // Memoriza el componente mesh para evitar recreaciones innecesarias
  const meshComponent = useMemo(() => (
    <WindowsMesh
      geometry={nodes.Curve.geometry}
      material={sharedMaterial}
      isHovered={isHovered}
      setIsHovered={setIsHovered}
    />
  ), [nodes.Curve.geometry, isHovered, setIsHovered]);

  return (
    <group
      ref={ref}
      {...props}
      dispose={null}
      onClick={e => { e.stopPropagation(); window.open(link, '_blank'); }}
    >
      {meshComponent}
    </group>
  )
});

useGLTF.preload('models/windows.glb')