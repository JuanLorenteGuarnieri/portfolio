import * as THREE from 'three'
import React, { useRef, forwardRef, useState, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';
import { ThreeEvent } from '@react-three/fiber';

type GLTFResult = GLTF & {
  nodes: {
    _1: THREE.Mesh
    _2: THREE.Mesh
    _21: THREE.Mesh
    _3: THREE.Mesh
    _4: THREE.Mesh
  }
  materials: {
    ['Piano Material']: THREE.MeshStandardMaterial
    ['Wood-10']: THREE.MeshStandardMaterial
    ['Fluegel-02']: THREE.MeshStandardMaterial
    ['Fluegel-03']: THREE.MeshStandardMaterial
    ['Fluegel-04']: THREE.MeshStandardMaterial
  }
}

type Props = JSX.IntrinsicElements['group'] & {
  link?: string;
};

export const Piano = forwardRef<Group, Props>(({ link = 'https://recursivearts.com/es/virtual-piano/', ...props }, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const { nodes, materials } = useGLTF('models/piano.glb') as GLTFResult
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

  // Memoized meshes
  const mesh1 = useMemo(() => (
    <mesh
      castShadow
      receiveShadow
      geometry={nodes._1.geometry}
      position={[-0.06, 12.762, -5.007]}
      scale={571.937}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <meshPhysicalMaterial
        color={new THREE.Color(0x000000)}
        roughness={0.6}
        metalness={0.2}
      />
    </mesh>
  ), [nodes._1.geometry, handlePointerEnter, handlePointerLeave]);

  const mesh2 = useMemo(() => (
    <mesh
      castShadow
      receiveShadow
      geometry={nodes._2.geometry}
      material={materials['Wood-10']}
      position={[0.013, 6.591, -5.639]}
      scale={571.937}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    />
  ), [nodes._2.geometry, materials['Wood-10'], handlePointerEnter, handlePointerLeave]);

  const mesh21 = useMemo(() => (
    <mesh
      castShadow
      receiveShadow
      geometry={nodes._21.geometry}
      material={materials['Fluegel-02']}
      position={[0.013, 6.591, -5.639]}
      scale={571.937}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    />
  ), [nodes._21.geometry, materials['Fluegel-02'], handlePointerEnter, handlePointerLeave]);

  const mesh3 = useMemo(() => (
    <mesh
      castShadow
      receiveShadow
      geometry={nodes._3.geometry}
      position={[0.013, 9.65, 8.147]}
      scale={571.937}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <meshPhysicalMaterial
        color={new THREE.Color(0xaaaaaa)}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  ), [nodes._3.geometry, handlePointerEnter, handlePointerLeave]);

  const mesh4 = useMemo(() => (
    <mesh
      castShadow
      receiveShadow
      geometry={nodes._4.geometry}
      material={materials['Fluegel-04']}
      position={[0.013, 9.79, 7.804]}
      scale={571.937}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    />
  ), [nodes._4.geometry, materials['Fluegel-04'], handlePointerEnter, handlePointerLeave]);

  return (
    <group
      ref={ref}
      {...props}
      dispose={null}
      scale={isHovered ? 1.35 : 1.3}
      onClick={(e) => { e.stopPropagation(); window.open(link, '_blank'); }}
    >
      <group position={[0, -0.001, 0]} scale={0.088}>
        {mesh1}
        {mesh2}
        {mesh21}
        {mesh3}
        {mesh4}
      </group>
    </group>
  )
});

useGLTF.preload('models/piano.glb')
