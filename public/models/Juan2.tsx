/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 juan2.glb -t -r ./ 
*/

import * as THREE from 'three'
import React, { useRef, forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';

type GLTFResult = GLTF & {
  nodes: {
    mesh: THREE.Mesh
    mesh_1: THREE.Mesh
    mesh_2: THREE.Mesh
    mesh_3: THREE.Mesh
    mesh_4: THREE.Mesh
    mesh_5: THREE.Mesh
    mesh_6: THREE.Mesh
    mesh_7: THREE.Mesh
    mesh_8: THREE.Mesh
    mesh_9: THREE.Mesh
    mesh_10: THREE.Mesh
    mesh_11: THREE.Mesh
    mesh_12: THREE.Mesh
    mesh_13: THREE.Mesh
    mesh_14: THREE.Mesh
    mesh_15: THREE.Mesh
    mesh_16: THREE.Mesh
    mesh_17: THREE.Mesh
    mesh_18: THREE.Mesh
    mesh_19: THREE.Mesh
    mesh_20: THREE.Mesh
    mesh_21: THREE.Mesh
    mesh_22: THREE.Mesh
    mesh_23: THREE.Mesh
    mesh_24: THREE.Mesh
    mesh_25: THREE.Mesh
    mesh_26: THREE.Mesh
    mesh_27: THREE.Mesh
    mesh_28: THREE.Mesh
    mesh_29: THREE.Mesh
    mesh_30: THREE.Mesh
    mesh_31: THREE.Mesh
    mesh_32: THREE.Mesh
    mesh_33: THREE.Mesh
    mesh_34: THREE.Mesh
    mesh_35: THREE.Mesh
    mesh_36: THREE.Mesh
    mesh_37: THREE.Mesh
    mesh_38: THREE.Mesh
    mesh_39: THREE.Mesh
    mesh_40: THREE.Mesh
    mesh_41: THREE.Mesh
    mesh_42: THREE.Mesh
    mesh_43: THREE.Mesh
    mesh_44: THREE.Mesh
    mesh_45: THREE.Mesh
    mesh_46: THREE.Mesh
    mesh_47: THREE.Mesh
    mesh_48: THREE.Mesh
    mesh_49: THREE.Mesh
    mesh_50: THREE.Mesh
    mesh_51: THREE.Mesh
    mesh_52: THREE.Mesh
    mesh_53: THREE.Mesh
    mesh_54: THREE.Mesh
    mesh_55: THREE.Mesh
    mesh_56: THREE.Mesh
    mesh_57: THREE.Mesh
    mesh_58: THREE.Mesh
    mesh_59: THREE.Mesh
    mesh_60: THREE.Mesh
    mesh_61: THREE.Mesh
  }
  materials: {
    material0000: THREE.MeshStandardMaterial
    material0001: THREE.MeshStandardMaterial
    material0002: THREE.MeshStandardMaterial
    material0003: THREE.MeshStandardMaterial
    material0004: THREE.MeshStandardMaterial
    material0005: THREE.MeshStandardMaterial
    material0006: THREE.MeshStandardMaterial
    material0007: THREE.MeshStandardMaterial
    material0008: THREE.MeshStandardMaterial
    material0009: THREE.MeshStandardMaterial
    material0010: THREE.MeshStandardMaterial
    material0011: THREE.MeshStandardMaterial
    material0012: THREE.MeshStandardMaterial
    material0013: THREE.MeshStandardMaterial
    material0014: THREE.MeshStandardMaterial
    material0015: THREE.MeshStandardMaterial
    material0016: THREE.MeshStandardMaterial
    material0017: THREE.MeshStandardMaterial
    material0018: THREE.MeshStandardMaterial
    material0019: THREE.MeshStandardMaterial
    material0020: THREE.MeshStandardMaterial
    material0021: THREE.MeshStandardMaterial
    material0022: THREE.MeshStandardMaterial
    material0023: THREE.MeshStandardMaterial
    material0024: THREE.MeshStandardMaterial
    material0025: THREE.MeshStandardMaterial
    material0026: THREE.MeshStandardMaterial
    material0027: THREE.MeshStandardMaterial
    material0028: THREE.MeshStandardMaterial
    material0029: THREE.MeshStandardMaterial
    material0030: THREE.MeshStandardMaterial
    material0031: THREE.MeshStandardMaterial
    material0032: THREE.MeshStandardMaterial
    material0033: THREE.MeshStandardMaterial
    material0034: THREE.MeshStandardMaterial
    material0035: THREE.MeshStandardMaterial
    material0036: THREE.MeshStandardMaterial
    material0037: THREE.MeshStandardMaterial
    material0038: THREE.MeshStandardMaterial
    material0039: THREE.MeshStandardMaterial
    material0040: THREE.MeshStandardMaterial
    material0041: THREE.MeshStandardMaterial
    material0042: THREE.MeshStandardMaterial
    material0043: THREE.MeshStandardMaterial
    material0044: THREE.MeshStandardMaterial
    material0045: THREE.MeshStandardMaterial
    material0046: THREE.MeshStandardMaterial
    material0047: THREE.MeshStandardMaterial
    material0048: THREE.MeshStandardMaterial
    material0049: THREE.MeshStandardMaterial
    material0050: THREE.MeshStandardMaterial
    material0051: THREE.MeshStandardMaterial
    material0052: THREE.MeshStandardMaterial
    material0053: THREE.MeshStandardMaterial
    material0054: THREE.MeshStandardMaterial
    material0055: THREE.MeshStandardMaterial
    material0056: THREE.MeshStandardMaterial
    material0057: THREE.MeshStandardMaterial
    material0058: THREE.MeshStandardMaterial
    material0059: THREE.MeshStandardMaterial
    material0060: THREE.MeshStandardMaterial
    material0061: THREE.MeshStandardMaterial
  }
}

type ContextType = Record<string, React.ForwardRefExoticComponent<JSX.IntrinsicElements['mesh']>>

type LogoProps = JSX.IntrinsicElements['group'] & {
  // Aquí puedes añadir cualquier otra prop personalizada si es necesario
};


export const Juan = forwardRef<Group, LogoProps>((props, ref) => {
  const { nodes, materials } = useGLTF('models/juan2.glb') as GLTFResult
  return (
    <group ref={ref} {...props} dispose={null}>
      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh geometry={nodes.mesh.geometry} material={materials.material0000} />
        <mesh geometry={nodes.mesh_1.geometry} material={materials.material0001} />
        <mesh geometry={nodes.mesh_2.geometry} material={materials.material0002} />
        <mesh geometry={nodes.mesh_3.geometry} material={materials.material0003} />
        <mesh geometry={nodes.mesh_4.geometry} material={materials.material0004} />
        <mesh geometry={nodes.mesh_5.geometry} material={materials.material0005} />
        <mesh geometry={nodes.mesh_6.geometry} material={materials.material0006} />
        <mesh geometry={nodes.mesh_7.geometry} material={materials.material0007} />
        <mesh geometry={nodes.mesh_8.geometry} material={materials.material0008} />
        <mesh geometry={nodes.mesh_9.geometry} material={materials.material0009} />
        <mesh geometry={nodes.mesh_10.geometry} material={materials.material0010} />
        <mesh geometry={nodes.mesh_11.geometry} material={materials.material0011} />
        <mesh geometry={nodes.mesh_12.geometry} material={materials.material0012} />
        <mesh geometry={nodes.mesh_13.geometry} material={materials.material0013} />
        <mesh geometry={nodes.mesh_14.geometry} material={materials.material0014} />
        <mesh geometry={nodes.mesh_15.geometry} material={materials.material0015} />
        <mesh geometry={nodes.mesh_16.geometry} material={materials.material0016} />
        <mesh geometry={nodes.mesh_17.geometry} material={materials.material0017} />
        <mesh geometry={nodes.mesh_18.geometry} material={materials.material0018} />
        <mesh geometry={nodes.mesh_19.geometry} material={materials.material0019} />
        <mesh geometry={nodes.mesh_20.geometry} material={materials.material0020} />
        <mesh geometry={nodes.mesh_21.geometry} material={materials.material0021} />
        <mesh geometry={nodes.mesh_22.geometry} material={materials.material0022} />
        <mesh geometry={nodes.mesh_23.geometry} material={materials.material0023} />
        <mesh geometry={nodes.mesh_24.geometry} material={materials.material0024} />
        <mesh geometry={nodes.mesh_25.geometry} material={materials.material0025} />
        <mesh geometry={nodes.mesh_26.geometry} material={materials.material0026} />
        <mesh geometry={nodes.mesh_27.geometry} material={materials.material0027} />
        <mesh geometry={nodes.mesh_28.geometry} material={materials.material0028} />
        <mesh geometry={nodes.mesh_29.geometry} material={materials.material0029} />
        <mesh geometry={nodes.mesh_30.geometry} material={materials.material0030} />
        <mesh geometry={nodes.mesh_31.geometry} material={materials.material0031} />
        <mesh geometry={nodes.mesh_32.geometry} material={materials.material0032} />
        <mesh geometry={nodes.mesh_33.geometry} material={materials.material0033} />
        <mesh geometry={nodes.mesh_34.geometry} material={materials.material0034} />
        <mesh geometry={nodes.mesh_35.geometry} material={materials.material0035} />
        <mesh geometry={nodes.mesh_36.geometry} material={materials.material0036} />
        <mesh geometry={nodes.mesh_37.geometry} material={materials.material0037} />
        <mesh geometry={nodes.mesh_38.geometry} material={materials.material0038} />
        <mesh geometry={nodes.mesh_39.geometry} material={materials.material0039} />
        <mesh geometry={nodes.mesh_40.geometry} material={materials.material0040} />
        <mesh geometry={nodes.mesh_41.geometry} material={materials.material0041} />
        <mesh geometry={nodes.mesh_42.geometry} material={materials.material0042} />
        <mesh geometry={nodes.mesh_43.geometry} material={materials.material0043} />
        <mesh geometry={nodes.mesh_44.geometry} material={materials.material0044} />
        <mesh geometry={nodes.mesh_45.geometry} material={materials.material0045} />
        <mesh geometry={nodes.mesh_46.geometry} material={materials.material0046} />
        <mesh geometry={nodes.mesh_47.geometry} material={materials.material0047} />
        <mesh geometry={nodes.mesh_48.geometry} material={materials.material0048} />
        <mesh geometry={nodes.mesh_49.geometry} material={materials.material0049} />
        <mesh geometry={nodes.mesh_50.geometry} material={materials.material0050} />
        <mesh geometry={nodes.mesh_51.geometry} material={materials.material0051} />
        <mesh geometry={nodes.mesh_52.geometry} material={materials.material0052} />
        <mesh geometry={nodes.mesh_53.geometry} material={materials.material0053} />
        <mesh geometry={nodes.mesh_54.geometry} material={materials.material0054} />
        <mesh geometry={nodes.mesh_55.geometry} material={materials.material0055} />
        <mesh geometry={nodes.mesh_56.geometry} material={materials.material0056} />
        <mesh geometry={nodes.mesh_57.geometry} material={materials.material0057} />
        <mesh geometry={nodes.mesh_58.geometry} material={materials.material0058} />
        <mesh geometry={nodes.mesh_59.geometry} material={materials.material0059} />
        <mesh geometry={nodes.mesh_60.geometry} material={materials.material0060} />
        <mesh geometry={nodes.mesh_61.geometry} material={materials.material0061} />
      </group>
    </group>
  )
});

useGLTF.preload('models/juan2.glb')