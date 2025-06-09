import * as THREE from 'three'
import React, { useRef, forwardRef, useState, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';
import { useSharedMat } from '../../src/components/sharedMaterial';

type GLTFResult = GLTF & {
  nodes: {
    Curve005: THREE.Mesh
    Curve006: THREE.Mesh
    Curve007: THREE.Mesh
  }
  materials: {
    Mat: THREE.MeshStandardMaterial
    Mat2: THREE.MeshStandardMaterial
  }
}

type Props = JSX.IntrinsicElements['group'] & {
};

const MeshModel = React.memo(function MeshModel({
  geometry,
  material,
}: {
  geometry: THREE.BufferGeometry
  material: THREE.Material
}) {
  return (
    <mesh
      castShadow
      receiveShadow
      geometry={geometry}
      material={material}
      position={[-0.018, 0, 0.018]}
    />
  );
});

export const Sdl = forwardRef<Group, Props>((props, ref) => {
  const { nodes, materials } = useGLTF('models/sdl.glb') as GLTFResult
  const sharedMaterial = useSharedMat()

  // Memoriza el componente mesh para evitar recreaciones innecesarias
  const meshComponent = useMemo(() => (
    <MeshModel
      geometry={nodes.Curve005.geometry}
      material={sharedMaterial}
    />
  ), [nodes.Curve005.geometry]);

  const meshComponent2 = useMemo(() => (
    <MeshModel
      geometry={nodes.Curve006.geometry}
      material={materials.Mat2}
    />
  ), [nodes.Curve006.geometry, materials]);

  const meshComponent3 = useMemo(() => (
    <MeshModel
      geometry={nodes.Curve007.geometry}
      material={materials.Mat2}
    />
  ), [nodes.Curve007.geometry, materials]);

  return (
    <group
      ref={ref}
      {...props}
      dispose={null}
    >
      {meshComponent}
      {meshComponent2}
      {meshComponent3}
    </group>
  )
});

useGLTF.preload('models/sdl.glb')