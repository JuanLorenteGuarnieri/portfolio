import * as THREE from 'three'
import React, { useRef, forwardRef, useState, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';
import { ThreeEvent } from '@react-three/fiber';

type GLTFResult = GLTF & {
  nodes: {
    Curve: THREE.Mesh
    Curve001: THREE.Mesh
    Curve002: THREE.Mesh
    Curve003: THREE.Mesh
    Curve004: THREE.Mesh
    Curve005: THREE.Mesh
    Curve006: THREE.Mesh
    Curve007: THREE.Mesh
    Curve008: THREE.Mesh
    Curve009: THREE.Mesh
    Curve010: THREE.Mesh
    Curve011: THREE.Mesh
    Curve013: THREE.Mesh
    Curve014: THREE.Mesh
    Curve015: THREE.Mesh
    Curve016: THREE.Mesh
    Curve017: THREE.Mesh
    Curve018: THREE.Mesh
    Curve019: THREE.Mesh
    Curve020: THREE.Mesh
    Curve021: THREE.Mesh
    Curve022: THREE.Mesh
    Curve023: THREE.Mesh
    Curve024: THREE.Mesh
    Curve025: THREE.Mesh
    Curve026: THREE.Mesh
    Curve027: THREE.Mesh
    Curve028: THREE.Mesh
    Curve029: THREE.Mesh
    Curve030: THREE.Mesh
    Curve031: THREE.Mesh
    Curve032: THREE.Mesh
    Curve033: THREE.Mesh
  }
  materials: {
    ['SVGMat.001']: THREE.MeshStandardMaterial
    ['SVGMat.002']: THREE.MeshStandardMaterial
    ['SVGMat.003']: THREE.MeshStandardMaterial
    ['SVGMat.004']: THREE.MeshStandardMaterial
    ['SVGMat.005']: THREE.MeshStandardMaterial
    ['SVGMat.006']: THREE.MeshStandardMaterial
    ['SVGMat.007']: THREE.MeshStandardMaterial
    ['SVGMat.008']: THREE.MeshStandardMaterial
    ['SVGMat.009']: THREE.MeshStandardMaterial
    ['SVGMat.011']: THREE.MeshStandardMaterial
    ['SVGMat.012']: THREE.MeshStandardMaterial
    ['SVGMat.013']: THREE.MeshStandardMaterial
    ['SVGMat.014']: THREE.MeshStandardMaterial
    ['SVGMat.015']: THREE.MeshStandardMaterial
    ['SVGMat.016']: THREE.MeshStandardMaterial
    ['SVGMat.017']: THREE.MeshStandardMaterial
    ['SVGMat.018']: THREE.MeshStandardMaterial
    ['SVGMat.019']: THREE.MeshStandardMaterial
    ['SVGMat.020']: THREE.MeshStandardMaterial
    ['SVGMat.021']: THREE.MeshStandardMaterial
    ['SVGMat.022']: THREE.MeshStandardMaterial
    ['SVGMat.023']: THREE.MeshStandardMaterial
  }
}

type Props = JSX.IntrinsicElements['group'] & {
  link?: string;
};

export const Duolingo = forwardRef<Group, Props>(({ link = 'https://duome.eu/Qassiel', ...props }, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const { nodes, materials } = useGLTF('models/duolingo.glb') as GLTFResult
  const hoverCount = useRef(0);

  // set all the materials metalness to 0.5
  Object.values(materials).forEach((material) => {
    if (material instanceof THREE.MeshStandardMaterial) {
      material.metalness = 0.2;
      material.roughness = 0.1;
      material.needsUpdate = true;
    }
  });

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

  const meshes = useMemo(() => [
    <mesh key="Curve" geometry={nodes.Curve.geometry} material={materials['SVGMat.001']} position={[0, 0, 0.002]} scale={0.264} castShadow receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />,
    <mesh key="Curve001" geometry={nodes.Curve001.geometry} material={materials['SVGMat.002']} position={[0.001, 0, -0.003]} scale={0.264} castShadow receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />,
    <mesh key="Curve002" geometry={nodes.Curve002.geometry} material={materials['SVGMat.003']} position={[0, 0, -0.001]} scale={0.264} castShadow receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />,
    <mesh key="Curve003" geometry={nodes.Curve003.geometry} material={materials['SVGMat.004']} position={[0.001, 0, -0.008]} scale={0.264} castShadow receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />,
    <mesh key="Curve004" geometry={nodes.Curve004.geometry} material={materials['SVGMat.005']} position={[0, 0, 0.005]} scale={0.264} castShadow receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />,
    <mesh key="Curve005" geometry={nodes.Curve005.geometry} material={materials['SVGMat.006']} position={[-0.002, 0, -0.014]} scale={0.264} castShadow receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />,
    <mesh key="Curve006" geometry={nodes.Curve006.geometry} material={materials['SVGMat.007']} position={[0, 0, -0.004]} scale={0.264} castShadow receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />,
    <mesh key="Curve007" geometry={nodes.Curve007.geometry} material={materials['SVGMat.006']} position={[0.011, 0, 0.016]} scale={0.264} castShadow receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />,
    <mesh key="Curve008" geometry={nodes.Curve008.geometry} material={materials['SVGMat.006']} position={[-0.013, 0, 0.014]} scale={0.264} castShadow receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />,
    <mesh key="Curve009" geometry={nodes.Curve009.geometry} material={materials['SVGMat.008']} position={[-0.003, 0, -0.007]} scale={0.264} castShadow receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />,
    <mesh key="Curve010" geometry={nodes.Curve010.geometry} material={materials['SVGMat.009']} position={[0.008, 0, 0.009]} scale={0.264} castShadow receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />,
    <mesh key="Curve011" geometry={nodes.Curve011.geometry} material={materials['SVGMat.009']} position={[-0.008, 0, 0.01]} scale={0.264} castShadow receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />,
    <mesh key="Curve013" geometry={nodes.Curve013.geometry} material={materials['SVGMat.011']} position={[0, 0, -0.004]} scale={0.264} castShadow receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />,
    <mesh key="Curve014" geometry={nodes.Curve014.geometry} material={materials['SVGMat.012']} position={[-0.02, 0, -0.016]} scale={0.264} castShadow receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />,
    <mesh key="Curve015" geometry={nodes.Curve015.geometry} material={materials['SVGMat.012']} position={[0.019, 0, 0.018]} scale={0.264} castShadow receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />,
    <mesh key="Curve016" geometry={nodes.Curve016.geometry} material={materials['SVGMat.013']} position={[-0.004, 0, -0.01]} scale={0.264} castShadow receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />,
    <mesh key="Curve017" geometry={nodes.Curve017.geometry} material={materials['SVGMat.014']} position={[-0.011, 0, 0.023]} scale={0.264} castShadow receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />,
    <mesh key="Curve018" geometry={nodes.Curve018.geometry} material={materials['SVGMat.015']} position={[0.005, 0, -0.01]} scale={0.264} castShadow receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />,
    <mesh key="Curve019" geometry={nodes.Curve019.geometry} material={materials['SVGMat.016']} position={[0.001, 0, -0.005]} scale={0.264} castShadow receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />,
    <mesh key="Curve020" geometry={nodes.Curve020.geometry} material={materials['SVGMat.017']} position={[0.002, 0, 0.002]} scale={0.264} castShadow receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />,
    <mesh key="Curve021" geometry={nodes.Curve021.geometry} material={materials['SVGMat.017']} position={[-0.002, 0, 0.002]} scale={0.264} castShadow receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />,
    <mesh key="Curve022" geometry={nodes.Curve022.geometry} material={materials['SVGMat.015']} position={[0, 0, 0.004]} scale={0.264} castShadow receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />,
    <mesh key="Curve023" geometry={nodes.Curve023.geometry} material={materials['SVGMat.014']} position={[0.015, 0, 0.017]} scale={0.264} castShadow receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />,
    <mesh key="Curve024" geometry={nodes.Curve024.geometry} material={materials['SVGMat.018']} position={[0.025, 0, 0.006]} scale={0.264} castShadow receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />,
    <mesh key="Curve025" geometry={nodes.Curve025.geometry} material={materials['SVGMat.019']} position={[-0.019, 0, 0.012]} scale={0.264} castShadow receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />,
    <mesh key="Curve026" geometry={nodes.Curve026.geometry} material={materials['SVGMat.014']} position={[0.003, 0, -0.019]} scale={0.264} castShadow receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />,
    <mesh key="Curve027" geometry={nodes.Curve027.geometry} material={materials['SVGMat.020']} position={[-0.001, 0, -0.021]} scale={0.264} castShadow receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />,
    <mesh key="Curve028" geometry={nodes.Curve028.geometry} material={materials['SVGMat.020']} position={[0.023, 0, 0.008]} scale={0.264} castShadow receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />,
    <mesh key="Curve029" geometry={nodes.Curve029.geometry} material={materials['SVGMat.021']} position={[-0.006, 0, 0.022]} scale={0.264} castShadow receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />,
    <mesh key="Curve030" geometry={nodes.Curve030.geometry} material={materials['SVGMat.012']} position={[0.014, 0, 0.02]} scale={0.264} castShadow receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />,
    <mesh key="Curve031" geometry={nodes.Curve031.geometry} material={materials['SVGMat.012']} position={[0.015, 0, -0.015]} scale={0.264} castShadow receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />,
    <mesh key="Curve032" geometry={nodes.Curve032.geometry} material={materials['SVGMat.022']} position={[-0.002, 0, -0.009]} scale={0.264} castShadow receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />,
    <mesh key="Curve033" geometry={nodes.Curve033.geometry} material={materials['SVGMat.023']} position={[0.002, 0, -0.009]} scale={0.264} castShadow receiveShadow
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [nodes, materials]); // Solo se recalcula si nodes o materials cambian

  return (
    <group ref={ref} {...props} dispose={null} scale={isHovered ? 27 : 24} onClick={(e) => { e.stopPropagation(); window.open(link, '_blank'); }}>
      {meshes}
    </group>
  )
});

useGLTF.preload('models/duolingo.glb')
