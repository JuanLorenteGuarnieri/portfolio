import * as THREE from 'three'
import React, { useRef, forwardRef, useMemo, useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';

type GLTFResult = GLTF & {
  nodes: {
    lemming_1_1_0png_11_0_mesh: THREE.Mesh
    lemming_1_1_0png_11_0_mesh_1: THREE.Mesh
    lemming_1_1_0png_11_0_mesh_2: THREE.Mesh
    lemming_1_1_1png_8_0_mesh: THREE.Mesh
    lemming_1_1_1png_8_0_mesh_1: THREE.Mesh
    lemming_1_1_1png_8_0_mesh_2: THREE.Mesh
    lemming_1_1_2png_7_0_mesh: THREE.Mesh
    lemming_1_1_2png_7_0_mesh_1: THREE.Mesh
    lemming_1_1_2png_7_0_mesh_2: THREE.Mesh
    lemming_1_1_3png_7_0_mesh001: THREE.Mesh
    lemming_1_1_3png_7_0_mesh001_1: THREE.Mesh
    lemming_1_1_3png_7_0_mesh001_2: THREE.Mesh
    lemming_1_1_4png_8_0_mesh: THREE.Mesh
    lemming_1_1_4png_8_0_mesh_1: THREE.Mesh
    lemming_1_1_4png_8_0_mesh_2: THREE.Mesh
    lemming_1_1_5png_8_0_mesh: THREE.Mesh
    lemming_1_1_5png_8_0_mesh_1: THREE.Mesh
    lemming_1_1_5png_8_0_mesh_2: THREE.Mesh
    lemming_1_1_6png_7_0_mesh: THREE.Mesh
    lemming_1_1_6png_7_0_mesh_1: THREE.Mesh
    lemming_1_1_6png_7_0_mesh_2: THREE.Mesh
    lemming_1_1_7png_7_0_mesh: THREE.Mesh
    lemming_1_1_7png_7_0_mesh_1: THREE.Mesh
    lemming_1_1_7png_7_0_mesh_2: THREE.Mesh
    lemming_1_1_8png_9_0_mesh: THREE.Mesh
    lemming_1_1_8png_9_0_mesh_1: THREE.Mesh
    lemming_1_1_8png_9_0_mesh_2: THREE.Mesh
  }
  materials: {
    White: THREE.MeshStandardMaterial
    Blue: THREE.MeshStandardMaterial
    Green: THREE.MeshStandardMaterial
  }
}

type Props = JSX.IntrinsicElements['group'] & {};

export const Lemming = forwardRef<Group, Props>((props, ref) => {
  const { nodes, materials } = useGLTF('models/lemming.glb') as GLTFResult

  const [frame, setFrame] = useState(0);

  const totalFrames = 8; // 0 to 8
  const duration = 2000; // duración total en ms (ajustable)
  const reverse = false; // poner en true para animar al revés

  useEffect(() => {
    let animationFrame: number;
    let startTime: number | null = null;

    function animate(now: number) {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      const progress = (elapsed % duration) / duration;
      let currentFrame = Math.floor(progress * totalFrames);

      if (reverse) {
        currentFrame = totalFrames - 1 - currentFrame;
      }

      setFrame(currentFrame);
      animationFrame = requestAnimationFrame(animate);
    }

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [duration, reverse, totalFrames]);

  // Memoized groups
  const groups = useMemo(() => [
    <group key={0} position={[11, 0, -11]}>
      <mesh castShadow receiveShadow geometry={nodes.lemming_1_1_0png_11_0_mesh.geometry} material={materials.White} />
      <mesh castShadow receiveShadow geometry={nodes.lemming_1_1_0png_11_0_mesh_1.geometry} material={materials.Blue} />
      <mesh castShadow receiveShadow geometry={nodes.lemming_1_1_0png_11_0_mesh_2.geometry} material={materials.Green} />
    </group>,
    <group key={1} position={[8, 0, -5]}>
      <mesh castShadow receiveShadow geometry={nodes.lemming_1_1_1png_8_0_mesh.geometry} material={materials.White} />
      <mesh castShadow receiveShadow geometry={nodes.lemming_1_1_1png_8_0_mesh_1.geometry} material={materials.Blue} />
      <mesh castShadow receiveShadow geometry={nodes.lemming_1_1_1png_8_0_mesh_2.geometry} material={materials.Green} />
    </group>,
    <group key={2} position={[7, 0, -5]}>
      <mesh castShadow receiveShadow geometry={nodes.lemming_1_1_2png_7_0_mesh.geometry} material={materials.White} />
      <mesh castShadow receiveShadow geometry={nodes.lemming_1_1_2png_7_0_mesh_1.geometry} material={materials.Blue} />
      <mesh castShadow receiveShadow geometry={nodes.lemming_1_1_2png_7_0_mesh_2.geometry} material={materials.Green} />
    </group>,
    <group key={3} position={[7, 0, -6]}>
      <mesh castShadow receiveShadow geometry={nodes.lemming_1_1_3png_7_0_mesh001.geometry} material={materials.White} />
      <mesh castShadow receiveShadow geometry={nodes.lemming_1_1_3png_7_0_mesh001_1.geometry} material={materials.Blue} />
      <mesh castShadow receiveShadow geometry={nodes.lemming_1_1_3png_7_0_mesh001_2.geometry} material={materials.Green} />
    </group>,
    <group key={4} position={[8, 0, -6]}>
      <mesh castShadow receiveShadow geometry={nodes.lemming_1_1_4png_8_0_mesh.geometry} material={materials.White} />
      <mesh castShadow receiveShadow geometry={nodes.lemming_1_1_4png_8_0_mesh_1.geometry} material={materials.Blue} />
      <mesh castShadow receiveShadow geometry={nodes.lemming_1_1_4png_8_0_mesh_2.geometry} material={materials.Green} />
    </group>,
    <group key={5} position={[8, 0, -5]}>
      <mesh castShadow receiveShadow geometry={nodes.lemming_1_1_5png_8_0_mesh.geometry} material={materials.White} />
      <mesh castShadow receiveShadow geometry={nodes.lemming_1_1_5png_8_0_mesh_1.geometry} material={materials.Blue} />
      <mesh castShadow receiveShadow geometry={nodes.lemming_1_1_5png_8_0_mesh_2.geometry} material={materials.Green} />
    </group>,
    <group key={6} position={[7, 0, -5]}>
      <mesh castShadow receiveShadow geometry={nodes.lemming_1_1_6png_7_0_mesh.geometry} material={materials.White} />
      <mesh castShadow receiveShadow geometry={nodes.lemming_1_1_6png_7_0_mesh_1.geometry} material={materials.Blue} />
      <mesh castShadow receiveShadow geometry={nodes.lemming_1_1_6png_7_0_mesh_2.geometry} material={materials.Green} />
    </group>,
    <group key={7} position={[7, 0, -5]}>
      <mesh castShadow receiveShadow geometry={nodes.lemming_1_1_7png_7_0_mesh.geometry} material={materials.White} />
      <mesh castShadow receiveShadow geometry={nodes.lemming_1_1_7png_7_0_mesh_1.geometry} material={materials.Blue} />
      <mesh castShadow receiveShadow geometry={nodes.lemming_1_1_7png_7_0_mesh_2.geometry} material={materials.Green} />
    </group>,
    <group key={8} position={[9, 0, -5]}>
      <mesh castShadow receiveShadow geometry={nodes.lemming_1_1_8png_9_0_mesh.geometry} material={materials.White} />
      <mesh castShadow receiveShadow geometry={nodes.lemming_1_1_8png_9_0_mesh_1.geometry} material={materials.Blue} />
      <mesh castShadow receiveShadow geometry={nodes.lemming_1_1_8png_9_0_mesh_2.geometry} material={materials.Green} />
    </group>,
  ], [nodes, materials]);

  return (
    <group ref={ref} {...props} dispose={null}>
      {groups.map((g, i) => React.cloneElement(g, { visible: frame === i }))}
    </group>
  )
});

useGLTF.preload('models/lemming.glb')
