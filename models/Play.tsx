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

export const Play = forwardRef<Group, Props>(({ link = 'https://github.com/JuanLorenteGuarnieri', ...props }, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const { nodes } = useGLTF('models/play.glb') as GLTFResult
  const sharedMaterial = useSharedMat()

  const meshComponent = useMemo(() => (
    <mesh
      castShadow
      receiveShadow
      geometry={nodes.Curve.geometry}
      material={sharedMaterial}
      position={isHovered ? [-0.011, 0, 0.0118] : [-0.01, 0, 0.011]}
      scale={isHovered ? 0.7 : 0.651}
      onPointerEnter={event => { event.stopPropagation(); setIsHovered(true); }}
      onPointerLeave={() => setIsHovered(false)}
    />
  ), [isHovered, nodes]);

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

useGLTF.preload('models/play.glb')
