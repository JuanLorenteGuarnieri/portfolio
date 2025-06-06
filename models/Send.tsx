import * as THREE from 'three'
import React, { useRef, forwardRef, useState, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';

type GLTFResult = GLTF & {
  nodes: {
    Curve: THREE.Mesh
    Curve001: THREE.Mesh
  }
  materials: {
    Mat: THREE.MeshStandardMaterial
    ['Mat.001']: THREE.MeshStandardMaterial
  }
}

type LogoProps = JSX.IntrinsicElements['group'];

export const Send = forwardRef<Group, LogoProps>((props, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const { nodes, materials } = useGLTF('models/send.glb') as GLTFResult

  const position: [number, number, number] = isHovered ? [-0.017, 0, 0.017] : [-0.016, 0, 0.016];
  const scale = isHovered ? 0.096 : 0.089;

  const handlePointerEnter = (event: any) => {
    event.stopPropagation();
    setIsHovered(true);
  };
  const handlePointerLeave = () => setIsHovered(false);

  const CurveMesh = useMemo(() => (
    <mesh
      castShadow
      receiveShadow
      geometry={nodes.Curve.geometry}
      material={materials.Mat}
      position={position}
      scale={scale}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    />
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [nodes.Curve.geometry, materials.Mat, position, scale]);

  const Curve001Mesh = useMemo(() => (
    <mesh
      castShadow
      receiveShadow
      geometry={nodes.Curve001.geometry}
      material={materials['Mat.001']}
      position={position}
      scale={scale}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    />
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [nodes.Curve001.geometry, materials['Mat.001'], position, scale]);

  return (
    <group ref={ref} {...props} dispose={null}>
      {CurveMesh}
      {Curve001Mesh}
    </group>
  )
});

useGLTF.preload('models/send.glb')
