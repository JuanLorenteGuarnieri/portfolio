import * as THREE from 'three'
import React, { useRef, forwardRef, useState, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';
import { useSharedMat } from '../../src/components/sharedMaterial';

type GLTFResult = GLTF & {
  nodes: {
    Curve001: THREE.Mesh
    Curve003: THREE.Mesh
    Curve004: THREE.Mesh
  }
  materials: {
    Mat5: THREE.MeshStandardMaterial
    Mat2: THREE.MeshStandardMaterial
    Mat: THREE.MeshStandardMaterial
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
    />
  );
});

export const Matlab = forwardRef<Group, Props>((props, ref) => {
  const { nodes, materials } = useGLTF('models/matlab.glb') as GLTFResult
  const sharedMaterial = useSharedMat()

  // Memoriza el componente mesh para evitar recreaciones innecesarias
  const meshComponent = useMemo(() => (
    <MeshModel
      geometry={nodes.Curve001.geometry}
      material={materials.Mat5}
    />
  ), [nodes.Curve001.geometry, materials]);

  const meshComponent2 = useMemo(() => (
    <MeshModel
      geometry={nodes.Curve003.geometry}
      material={materials.Mat2}
    />
  ), [nodes.Curve003.geometry, materials]);

  const meshComponent3 = useMemo(() => (
    <MeshModel
      geometry={nodes.Curve004.geometry}
      material={sharedMaterial}
    />
  ), [nodes.Curve004.geometry, sharedMaterial]);

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

useGLTF.preload('models/matlab.glb')