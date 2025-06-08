import * as THREE from 'three'
import React, { useRef, forwardRef, useState, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';
import { useSharedMat } from '../../src/components/sharedMaterial';
import { useFrame } from '@react-three/fiber';

type GLTFResult = GLTF & {
  nodes: {
    camera119: THREE.SkinnedMesh
    camera_base114: THREE.SkinnedMesh
    camera_screw_1120: THREE.SkinnedMesh
    camera_screw_2121: THREE.SkinnedMesh
    camera_screw_3122: THREE.SkinnedMesh
    leg_1123: THREE.SkinnedMesh
    leg_2124: THREE.SkinnedMesh
    leg_3125: THREE.SkinnedMesh
    leg_4126: THREE.SkinnedMesh
    lower_body111: THREE.SkinnedMesh
    motor_1129: THREE.SkinnedMesh
    motor_2132: THREE.SkinnedMesh
    motor_3135: THREE.SkinnedMesh
    motor_4138: THREE.SkinnedMesh
    prop_1127: THREE.SkinnedMesh
    prop_2130: THREE.SkinnedMesh
    prop_3133: THREE.SkinnedMesh
    prop_4136: THREE.SkinnedMesh
    prop_bolt_cap_1143: THREE.SkinnedMesh
    prop_bolt_cap_2144: THREE.SkinnedMesh
    prop_bolt_cap_3145: THREE.SkinnedMesh
    prop_bolt_cap_4146: THREE.SkinnedMesh
    upper_body113: THREE.SkinnedMesh
    Root2: THREE.Bone
  }
  materials: {
    Material_29: THREE.MeshStandardMaterial
    Material_24: THREE.MeshStandardMaterial
    Material_30: THREE.MeshStandardMaterial
    Material_31: THREE.MeshStandardMaterial
    Material_32: THREE.MeshStandardMaterial
    Material_33: THREE.MeshStandardMaterial
    Material_34: THREE.MeshStandardMaterial
    Material_35: THREE.MeshStandardMaterial
    Material_36: THREE.MeshStandardMaterial
    Material_21: THREE.MeshStandardMaterial
    Material_39: THREE.MeshStandardMaterial
    Material_42: THREE.MeshStandardMaterial
    Material_45: THREE.MeshStandardMaterial
    Material_48: THREE.MeshStandardMaterial
    Material_37: THREE.MeshStandardMaterial
    Material_40: THREE.MeshStandardMaterial
    Material_43: THREE.MeshStandardMaterial
    Material_46: THREE.MeshStandardMaterial
    Material_53: THREE.MeshStandardMaterial
    Material_54: THREE.MeshStandardMaterial
    Material_55: THREE.MeshStandardMaterial
    Material_56: THREE.MeshStandardMaterial
    Material_23: THREE.MeshStandardMaterial
  }
}

type RobotProps = JSX.IntrinsicElements['group'] & {
  parentPos: [number, number, number]
};

export const Drone = forwardRef<Group, RobotProps>(({ parentPos, ...props }, ref) => {
  const { nodes, materials } = useGLTF('models/drone.glb') as GLTFResult
  const prop1 = useRef<THREE.Mesh>(null);
  const prop2 = useRef<THREE.Mesh>(null);
  const prop3 = useRef<THREE.Mesh>(null);
  const prop4 = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (prop1.current && prop2.current && prop3.current && prop4.current) {
      prop1.current.rotation.y += delta * Math.PI * 10
      prop2.current.rotation.y += delta * Math.PI * 10
      prop3.current.rotation.y -= delta * Math.PI * 10
      prop4.current.rotation.y -= delta * Math.PI * 10
    }
  })

  return (
    <group ref={ref} {...props} dispose={null}>
      <group position={[0, -0.158, 0]} scale={0.1}>
        <primitive object={nodes.Root2} />
        <mesh castShadow receiveShadow rotation={[0, 0, 0]} ref={prop1} geometry={nodes.prop_1127.geometry} material={materials.Material_37} position={[-8.698, 5.5, 7.943]} />
        <mesh castShadow receiveShadow rotation={[0, 0.1, 0]} ref={prop2} geometry={nodes.prop_2130.geometry} material={materials.Material_40} position={[-8.77, 5.5, -6.562]} />
        <mesh castShadow receiveShadow rotation={[0, 0.2, 0]} ref={prop3} geometry={nodes.prop_3133.geometry} material={materials.Material_43} position={[8.269, 5.5, -6.573]} />
        <mesh castShadow receiveShadow rotation={[0, 0.3, 0]} ref={prop4} geometry={nodes.prop_4136.geometry} material={materials.Material_46} position={[8.36, 5.5, 7.901]} />
        <skinnedMesh castShadow receiveShadow geometry={nodes.camera119.geometry} material={materials.Material_29} skeleton={nodes.camera119.skeleton} />
        <skinnedMesh castShadow receiveShadow geometry={nodes.camera_base114.geometry} material={materials.Material_24} skeleton={nodes.camera_base114.skeleton} />
        <skinnedMesh castShadow receiveShadow geometry={nodes.camera_screw_1120.geometry} material={materials.Material_30} skeleton={nodes.camera_screw_1120.skeleton} />
        <skinnedMesh castShadow receiveShadow geometry={nodes.camera_screw_2121.geometry} material={materials.Material_31} skeleton={nodes.camera_screw_2121.skeleton} />
        <skinnedMesh castShadow receiveShadow geometry={nodes.camera_screw_3122.geometry} material={materials.Material_32} skeleton={nodes.camera_screw_3122.skeleton} />
        <skinnedMesh castShadow receiveShadow geometry={nodes.leg_1123.geometry} material={materials.Material_33} skeleton={nodes.leg_1123.skeleton} />
        <skinnedMesh castShadow receiveShadow geometry={nodes.leg_2124.geometry} material={materials.Material_34} skeleton={nodes.leg_2124.skeleton} />
        <skinnedMesh castShadow receiveShadow geometry={nodes.leg_3125.geometry} material={materials.Material_35} skeleton={nodes.leg_3125.skeleton} />
        <skinnedMesh castShadow receiveShadow geometry={nodes.leg_4126.geometry} material={materials.Material_36} skeleton={nodes.leg_4126.skeleton} />
        <skinnedMesh castShadow receiveShadow geometry={nodes.lower_body111.geometry} material={materials.Material_21} skeleton={nodes.lower_body111.skeleton} />
        <skinnedMesh castShadow receiveShadow geometry={nodes.motor_1129.geometry} material={materials.Material_39} skeleton={nodes.motor_1129.skeleton} />
        <skinnedMesh castShadow receiveShadow geometry={nodes.motor_2132.geometry} material={materials.Material_42} skeleton={nodes.motor_2132.skeleton} />
        <skinnedMesh castShadow receiveShadow geometry={nodes.motor_3135.geometry} material={materials.Material_45} skeleton={nodes.motor_3135.skeleton} />
        <skinnedMesh castShadow receiveShadow geometry={nodes.motor_4138.geometry} material={materials.Material_48} skeleton={nodes.motor_4138.skeleton} />
        <skinnedMesh castShadow receiveShadow geometry={nodes.prop_bolt_cap_1143.geometry} material={materials.Material_53} skeleton={nodes.prop_bolt_cap_1143.skeleton} />
        <skinnedMesh castShadow receiveShadow geometry={nodes.prop_bolt_cap_2144.geometry} material={materials.Material_54} skeleton={nodes.prop_bolt_cap_2144.skeleton} />
        <skinnedMesh castShadow receiveShadow geometry={nodes.prop_bolt_cap_3145.geometry} material={materials.Material_55} skeleton={nodes.prop_bolt_cap_3145.skeleton} />
        <skinnedMesh castShadow receiveShadow geometry={nodes.prop_bolt_cap_4146.geometry} material={materials.Material_56} skeleton={nodes.prop_bolt_cap_4146.skeleton} />
        <skinnedMesh castShadow receiveShadow geometry={nodes.upper_body113.geometry} material={materials.Material_23} skeleton={nodes.upper_body113.skeleton} />
      </group>
    </group >
  )
});

useGLTF.preload('models/drone.glb')
