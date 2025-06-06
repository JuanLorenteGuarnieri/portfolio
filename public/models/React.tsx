import * as THREE from 'three'
import React, { useRef, forwardRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';

type GLTFResult = GLTF & {
  nodes: {
    Curve008: THREE.Mesh
    Curve009: THREE.Mesh
  }
  materials: {
    Mat: THREE.MeshStandardMaterial
  }
}

type ContextType = Record<string, React.ForwardRefExoticComponent<JSX.IntrinsicElements['mesh']>>

type LogoProps = JSX.IntrinsicElements['group'] & {
  // Aquí puedes añadir cualquier otra prop personalizada si es necesario
};

export const Reacts = forwardRef<Group, LogoProps>((props, ref) => {
  const { nodes, materials } = useGLTF('models/react.glb') as GLTFResult

  const meshes = useMemo(() => [
    <mesh
      key="curve008"
      castShadow
      receiveShadow
      geometry={nodes.Curve008.geometry}
      material={materials.Mat}
      position={[-0.019, 0, 0.022]}
    />,
    <mesh
      key="curve009"
      castShadow
      receiveShadow
      geometry={nodes.Curve009.geometry}
      material={materials.Mat}
      position={[-0.019, 0, 0.022]}
    />
  ], [nodes, materials])

  return (
    <group ref={ref} {...props} dispose={null}>
      {meshes}
    </group>
  )
});

useGLTF.preload('models/react.glb')
