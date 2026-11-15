import * as THREE from 'three'
import React, { useRef, forwardRef, useImperativeHandle } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';
import { useFrame } from '@react-three/fiber';
import PianoKeys from './PianoKeys';
import { enterPiano } from '../lib/pianoStore';
import { isFocusBusy } from '../lib/focusModes';

type GLTFResult = GLTF & {
  nodes: {
    _1: THREE.Mesh
    _2: THREE.Mesh
    _21: THREE.Mesh
    _3: THREE.Mesh
    _4: THREE.Mesh
  }
  materials: {
    ['Piano Material']: THREE.MeshStandardMaterial
    ['Wood-10']: THREE.MeshStandardMaterial
    ['Fluegel-02']: THREE.MeshStandardMaterial
    ['Fluegel-03']: THREE.MeshStandardMaterial
    ['Fluegel-04']: THREE.MeshStandardMaterial
  }
}

type Props = JSX.IntrinsicElements['group'];

const NODE_SCALE = 571.937;
const BASE_SCALE = 1.3;
const HOVER_SCALE = 1.35;

// Transformaciones originales de las mallas de teclas (blancas y negras) dentro del GLB.
// Son constantes de módulo para que PianoKeys no recalcule nada en cada render.
const WHITE_KEYS = { position: [0.013, 9.65, 8.147] as [number, number, number], scale: NODE_SCALE };
const BLACK_KEYS = { position: [0.013, 9.79, 7.804] as [number, number, number], scale: NODE_SCALE };

// Al hacer clic en el piano la cámara se acerca al teclado (modo piano) y las teclas se pueden tocar.
// Ver lib/pianoStore.js, components/PianoCameraRig.jsx y models/PianoKeys.jsx.
export const Piano = forwardRef<Group, Props>((props, ref) => {
  const { nodes, materials } = useGLTF('models/piano.glb') as GLTFResult
  const groupRef = useRef<Group>(null);
  const hovered = useRef(false);
  useImperativeHandle(ref, () => groupRef.current as Group);

  // El piano "crece" un poco al pasar el ratón (solo fuera del modo piano). Se anima por frame
  // en vez de con estado de React: así no se re-renderiza nada al pasar el ratón.
  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;
    const target = hovered.current && !isFocusBusy() ? HOVER_SCALE : BASE_SCALE;
    const s = g.scale.x;
    if (Math.abs(target - s) > 1e-4) g.scale.setScalar(s + (target - s) * (1 - Math.exp(-Math.min(delta, 0.05) * 14)));
  });

  return (
    <group
      ref={groupRef}
      {...props}
      dispose={null}
      scale={BASE_SCALE}
      onPointerOver={(e) => { e.stopPropagation(); hovered.current = true; }}
      onPointerOut={() => { hovered.current = false; }}
      onClick={(e) => {
        e.stopPropagation();
        hovered.current = false;
        if (!isFocusBusy()) enterPiano();
      }}
    >
      <group position={[0, -0.001, 0]} scale={0.088}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes._1.geometry}
          position={[-0.06, 12.762, -5.007]}
          scale={NODE_SCALE}
        >
          <meshPhysicalMaterial color={0x000000} roughness={0.6} metalness={0.2} />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes._2.geometry}
          material={materials['Wood-10']}
          position={[0.013, 6.591, -5.639]}
          scale={NODE_SCALE}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes._21.geometry}
          material={materials['Fluegel-02']}
          position={[0.013, 6.591, -5.639]}
          scale={NODE_SCALE}
        />
        {/* Teclas: 56 blancas + 40 negras independientes (antes eran dos mallas fusionadas) */}
        <PianoKeys
          whiteGeometry={nodes._3.geometry}
          blackGeometry={nodes._4.geometry}
          blackMaterial={materials['Fluegel-04']}
          whiteTransform={WHITE_KEYS}
          blackTransform={BLACK_KEYS}
        />
      </group>
    </group>
  )
});

useGLTF.preload('models/piano.glb')
