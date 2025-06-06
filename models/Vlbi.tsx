import * as THREE from 'three'
import React, { useRef, forwardRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';

type GLTFResult = GLTF & {
  nodes: {
    black_hole_black_hole_light2_0: THREE.Mesh
    center: THREE.Mesh
  }
  materials: {
    black_hole_light2: THREE.MeshStandardMaterial
    ['black_hole_center.002']: THREE.MeshStandardMaterial
  }
}

type Props = JSX.IntrinsicElements['group'] & {
};
export const Vlbi = forwardRef<Group, Props>((props, ref) => {
  const { nodes, materials } = useGLTF('models/vlbi.glb') as GLTFResult

  // Set materials to not be affected by scene lighting
  React.useEffect(() => {
    materials.black_hole_light2.emissiveIntensity = 0.5
    materials['black_hole_center.002'].roughness = 0
    materials.black_hole_light2.needsUpdate = true

    materials['black_hole_center.002'].roughness = 0
    materials['black_hole_center.002'].emissive.set('#000000')
    materials['black_hole_center.002'].needsUpdate = true
  }, [materials])

  const [rotateY, setRotateY] = React.useState(-Math.PI);

  React.useEffect(() => {
    let frameId: number;
    const animate = () => {
      setRotateY(prev => {
        const next = prev + 0.002;
        return next > Math.PI ? -Math.PI : next;
      });
      frameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Memoized meshes and groups
  const blackHoleMesh = useMemo(() => (
    <mesh
      castShadow
      receiveShadow
      geometry={nodes.black_hole_black_hole_light2_0.geometry}
      material={materials.black_hole_light2}
    // rotation and scale will be set in the parent group
    />
  ), [nodes.black_hole_black_hole_light2_0.geometry, materials.black_hole_light2]);

  const centerMesh = useMemo(() => (
    <mesh
      castShadow
      receiveShadow
      geometry={nodes.center.geometry}
      material={materials['black_hole_center.002']}
      scale={[1.766, 1.762, 1.776]}
    />
  ), [nodes.center.geometry, materials['black_hole_center.002']]);

  const innerGroup = useMemo(() => (
    <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
      {React.cloneElement(blackHoleMesh, {
        rotation: [rotateY / 1, -Math.PI, rotateY * 2e2],
        scale: 100,
      })}
    </group>
    // rotateY is a dependency because it changes the mesh rotation
  ), [blackHoleMesh, rotateY]);

  const outerGroup = useMemo(() => (
    <group rotation={[-Math.PI / 2, -0.375, 0]} scale={0.01}>
      {innerGroup}
    </group>
  ), [innerGroup]);

  return (
    <group ref={ref} {...props} dispose={null} >
      {outerGroup}
      {centerMesh}
    </group>
  )
});

useGLTF.preload('models/vlbi.glb')
