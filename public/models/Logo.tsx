import * as THREE from 'three'
import React, { useRef, forwardRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { Group } from 'three'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    LogoDrch: THREE.Mesh
    LogoIzq: THREE.Mesh
  }
  materials: {
    M_Logo: THREE.MeshStandardMaterial
  }
}

type LogoProps = JSX.IntrinsicElements['group']

export const Logo = forwardRef<Group, LogoProps>((props, ref) => {
  const { nodes, materials } = useGLTF('models/logo.glb') as GLTFResult

  const meshes = useMemo(() => [
    <mesh
      key="LogoDrch"
      geometry={nodes.LogoDrch.geometry}
      material={materials.M_Logo}
      position={[-0.456, 2.864, -1.059]}
      rotation={[Math.PI / 2, 0, 0]}
      scale={[1.038, 0.6, 1.475]}
    />,
    <mesh
      key="LogoIzq"
      geometry={nodes.LogoIzq.geometry}
      material={materials.M_Logo}
      position={[0.49, 2.864, -1.059]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[-1.038, -0.6, -1.475]}
    />
  ], [nodes, materials])

  return (
    <group ref={ref} {...props} dispose={null}>
      {meshes}
    </group>
  )
})

useGLTF.preload('models/logo.glb')
