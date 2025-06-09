import * as THREE from 'three'
import React, { useRef, forwardRef, useState, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';
import { useSharedMat } from '../../src/components/sharedMaterial';

type GLTFResult = GLTF & {
  nodes: {
    Curve002: THREE.Mesh
  }
  materials: {
    Mat: THREE.MeshStandardMaterial
  }
}

type Props = JSX.IntrinsicElements['group'] & {
  link?: string;
};

const GithubMesh = React.memo(function GithubMesh({
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
      position={isHovered ? [-0.012, 0, 0.012] : [-0.011, 0, 0.011]}
      scale={isHovered ? 0.9 : 0.84}
      onPointerEnter={event => { event.stopPropagation(); setIsHovered(true); }}
      onPointerLeave={() => setIsHovered(false)}
    />
  );
});

export const Github = forwardRef<Group, Props>(({ link = 'https://github.com/JuanLorenteGuarnieri', ...props }, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const { nodes } = useGLTF('models/github.glb') as GLTFResult
  const sharedMaterial = useSharedMat()

  // Memoriza el componente mesh para evitar recreaciones innecesarias
  const meshComponent = useMemo(() => (
    <GithubMesh
      geometry={nodes.Curve002.geometry}
      material={sharedMaterial}
      isHovered={isHovered}
      setIsHovered={setIsHovered}
    />
  ), [nodes.Curve002.geometry, isHovered, setIsHovered]);

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

useGLTF.preload('models/github.glb')
