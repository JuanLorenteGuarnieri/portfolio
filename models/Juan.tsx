import * as THREE from 'three'
import React, { forwardRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';

type GLTFResult = GLTF & {
  nodes: Record<`mesh${'' | `_${number}`}`, THREE.Mesh>
  materials: Record<`material${string}`, THREE.MeshStandardMaterial>
}

type LogoProps = JSX.IntrinsicElements['group'];

export const Juan = forwardRef<Group, LogoProps>((props, ref) => {
  const { nodes, materials } = useGLTF('models/juan.glb') as GLTFResult

  // Agrupa los meshes en subgrupos para facilitar el frustum culling y jerarquía
  const meshGroups = useMemo(() => {
    const meshCount = 62;//Object.keys(nodes).length;
    const groupSize = Math.min(10, meshCount);
    const groups: JSX.Element[] = [];
    for (let g = 0; g < meshCount; g += groupSize) {
      const meshes: JSX.Element[] = [];
      for (let i = g; i < Math.min(g + groupSize, meshCount); i++) {
        const meshKey = i === 0 ? 'mesh' : `mesh_${i}`;
        const materialKey = `material${i.toString().padStart(4, '0')}`;
        meshes.push(
          <mesh
            key={meshKey}
            geometry={nodes[meshKey].geometry}
            material={materials[materialKey]}
            // Desactiva sombras si no son necesarias
            receiveShadow
            castShadow
            matrixAutoUpdate={false}
          />
        );
      }
      groups.push(
        <group key={`group_${g}`} frustumCulled>
          {meshes}
        </group>
      );
    }
    return groups;
  }, [nodes, materials]);

  return (
    <group ref={ref} {...props} dispose={null}>
      <group rotation={[Math.PI / 2, 0, 0]}>
        {meshGroups}
      </group>
    </group>
  )
});

useGLTF.preload('models/juan.glb')
