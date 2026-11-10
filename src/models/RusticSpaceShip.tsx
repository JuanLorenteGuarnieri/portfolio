import * as THREE from 'three'
import React, { useRef, forwardRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { Group } from 'three';
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Cube001_spaceship_racer_0: THREE.Mesh
    Cylinder002_spaceship_racer_0: THREE.Mesh
    Cylinder003_spaceship_racer_0: THREE.Mesh
    Cube003_spaceship_racer_0: THREE.Mesh
    Cylinder004_spaceship_racer_0: THREE.Mesh
    Cube001_RExtr001_spaceship_racer_0: THREE.Mesh
    Cube001_RPanel003_spaceship_racer_0: THREE.Mesh
    Cube001_RPanel003_RExtr_spaceship_racer_0: THREE.Mesh
    Cube002_spaceship_racer_0: THREE.Mesh
    Cube001_RPanel001_spaceship_racer_0: THREE.Mesh
    Cube001_RPanel003_RExtr001_spaceship_racer_0: THREE.Mesh
    Cube005_cockpit_0: THREE.Mesh
    Sphere_cockpit_0: THREE.Mesh
  }
  materials: {
    spaceship_racer: THREE.MeshStandardMaterial
    cockpit: THREE.MeshStandardMaterial
  }
}

type SpaceShipProps = JSX.IntrinsicElements['group'];

export const RusticSpaceShip = forwardRef<Group, SpaceShipProps>((props, ref) => {
  const { nodes, materials } = useGLTF('models/rusty_spaceship.glb') as GLTFResult
  const position: [number, number, number] = [0, 0, 0];
  const rotation: [number, number, number] = [0, Math.PI / 3, 0];
  const scale = 0.13;

  const meshes = useMemo(() => [
    <mesh key="Cube001_spaceship_racer_0" castShadow receiveShadow geometry={nodes.Cube001_spaceship_racer_0.geometry} material={materials.spaceship_racer} position={[739.257, -64.815, 64.771]} />,
    <mesh key="Cylinder002_spaceship_racer_0" castShadow receiveShadow geometry={nodes.Cylinder002_spaceship_racer_0.geometry} material={materials.spaceship_racer} position={[739.691, -59.39, -553.376]} rotation={[Math.PI / 2, 0, 0]} />,
    <mesh key="Cylinder003_spaceship_racer_0" castShadow receiveShadow geometry={nodes.Cylinder003_spaceship_racer_0.geometry} material={materials.spaceship_racer} position={[742.147, -64.535, -508.885]} rotation={[Math.PI / 2, 0, 0]} />,
    <mesh key="Cube003_spaceship_racer_0" castShadow receiveShadow geometry={nodes.Cube003_spaceship_racer_0.geometry} material={materials.spaceship_racer} position={[737.618, 46.842, -176.413]} />,
    <mesh key="Cylinder004_spaceship_racer_0" castShadow receiveShadow geometry={nodes.Cylinder004_spaceship_racer_0.geometry} material={materials.spaceship_racer} position={[789.518, 59.453, -224.912]} rotation={[1.003, 0, 0]} />,
    <mesh key="Cube001_RExtr001_spaceship_racer_0" castShadow receiveShadow geometry={nodes.Cube001_RExtr001_spaceship_racer_0.geometry} material={materials.spaceship_racer} position={[745.539, 159.319, -5.922]} />,
    <mesh key="Cube001_RPanel003_spaceship_racer_0" castShadow receiveShadow geometry={nodes.Cube001_RPanel003_spaceship_racer_0.geometry} material={materials.spaceship_racer} position={[739.257, 0, 0]} />,
    <mesh key="Cube001_RPanel003_RExtr_spaceship_racer_0" castShadow receiveShadow geometry={nodes.Cube001_RPanel003_RExtr_spaceship_racer_0.geometry} material={materials.spaceship_racer} position={[739.257, 0, 0]} />,
    <mesh key="Cube002_spaceship_racer_0" castShadow receiveShadow geometry={nodes.Cube002_spaceship_racer_0.geometry} material={materials.spaceship_racer} position={[736.789, -267.14, -33.214]} />,
    <mesh key="Cube001_RPanel001_spaceship_racer_0" castShadow receiveShadow geometry={nodes.Cube001_RPanel001_spaceship_racer_0.geometry} material={materials.spaceship_racer} position={[739.257, 0, 0]} />,
    <mesh key="Cube001_RPanel003_RExtr001_spaceship_racer_0" castShadow receiveShadow geometry={nodes.Cube001_RPanel003_RExtr001_spaceship_racer_0.geometry} material={materials.spaceship_racer} position={[739.257, 0, 0]} />,
    <mesh key="Cube005_cockpit_0" castShadow receiveShadow geometry={nodes.Cube005_cockpit_0.geometry} material={materials.cockpit} position={[739.446, 110.436, 307.179]} rotation={[0.087, 0, 0]} />,
    <mesh key="Sphere_cockpit_0" castShadow receiveShadow geometry={nodes.Sphere_cockpit_0.geometry} material={materials.cockpit} position={[739.365, 145.689, 315.602]} rotation={[0.175, 0, 0]} />,
  ], [nodes, materials]);

  return (
    <group ref={ref} {...props} scale={scale} dispose={null}>
      <group scale={0.005} rotation={rotation} position={position}>
        {meshes}
      </group>
    </group>
  )
});

useGLTF.preload('models/rusty_spaceship.glb')
