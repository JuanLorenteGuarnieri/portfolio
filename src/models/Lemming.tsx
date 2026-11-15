import * as THREE from 'three'
import React, { useRef, forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Group } from 'three';
import { useFrame } from '@react-three/fiber';
import { lemmingPose } from '../lib/lemmingWalk';

type GLTFResult = GLTF & {
  nodes: Record<string, THREE.Mesh>
  materials: {
    White: THREE.MeshStandardMaterial
    Blue: THREE.MeshStandardMaterial
    Green: THREE.MeshStandardMaterial
  }
}

type Props = JSX.IntrinsicElements['group'] & {
  /** false (por defecto): sale del origen (0), camina hacia la izquierda hasta el extremo
   *  izquierdo (-RANGE_PX), da la vuelta y vuelve al origen, en bucle. true: va y vuelve entre
   *  los dos extremos (+RANGE_PX ↔ -RANGE_PX). */
  bounce?: boolean
};

// -----------------------------------------------------------------------------------------
// El lemming es pixel art hecho con malla: cada píxel del sprite es 1 unidad del modelo (un cubito
// aplastado), tumbado en el plano XZ (la cabeza hacia -z). El modelo trae 9 fotogramas, cada uno
// un grupo colocado en una rejilla común, y aquí se enseña uno cada vez.
//
// Comportamiento (ver lib/lemmingWalk.js):
//   - Está espejado: el modelo original mira a la derecha, aquí mira a la izquierda.
//   - Camina de derecha a izquierda, UN píxel por cada fotograma de la animación (y siempre píxeles
//     enteros: es pixel art), y puede alejarse RANGE_PX píxeles a cada lado de donde está colocado.
//   - El punto donde se coloca (la prop `position`) es el centro de sus pies. El tamaño de un píxel
//     en el mundo es la prop `scale` (0.04 = la mitad del 0.08 de antes).
// -----------------------------------------------------------------------------------------

const FRAMES = 8; // fotogramas del ciclo de caminar (el modelo trae un 9º que la animación nunca usó)
const FRAME_MS = 150; // ms por fotograma (= 2000 ms de ciclo / 8, como antes)
const RANGE_PX = 50; // píxeles que se aleja del punto de partida a cada lado

// Centro de los pies del sprite en las coordenadas del modelo: x = 10 (el centro de su celda de 6 px:
// de 7 a 13) y z = -5 (la línea de los pies). Espejar respecto a un entero mantiene todo sobre la rejilla.
const ANCHOR_X = 10;
const ANCHOR_Z = -5;

// [nombre base de la malla en el GLB, posición del fotograma en la rejilla común]. Cada malla tiene
// tres partes (White, Blue, Green) con sufijos "", "_1" y "_2".
const FRAME_DEFS: [string, [number, number, number]][] = [
  ['lemming_1_1_0png_11_0_mesh', [11, 0, -11]],
  ['lemming_1_1_1png_8_0_mesh', [8, 0, -5]],
  ['lemming_1_1_2png_7_0_mesh', [7, 0, -5]],
  ['lemming_1_1_3png_7_0_mesh001', [7, 0, -6]],
  ['lemming_1_1_4png_8_0_mesh', [8, 0, -6]],
  ['lemming_1_1_5png_8_0_mesh', [8, 0, -5]],
  ['lemming_1_1_6png_7_0_mesh', [7, 0, -5]],
  ['lemming_1_1_7png_7_0_mesh', [7, 0, -5]],
  ['lemming_1_1_8png_9_0_mesh', [9, 0, -5]],
];

export const Lemming = forwardRef<Group, Props>(({ bounce = false, ...props }, ref) => {
  const { nodes, materials } = useGLTF('models/lemming.glb') as GLTFResult

  const frameRefs = useRef<(Group | null)[]>([]);
  const walkRef = useRef<Group>(null);
  const mirrorRef = useRef<Group>(null);
  const startMs = useRef<number | null>(null);
  const lastTick = useRef(-1);

  // Se anima por frame sin estado de React: cada FRAME_MS cambia el fotograma visible, el
  // desplazamiento (en píxeles = unidades del modelo) y hacia dónde mira.
  useFrame((state) => {
    const now = state.clock.elapsedTime * 1000;
    if (startMs.current === null) startMs.current = now;
    const tick = Math.floor((now - startMs.current) / FRAME_MS);
    if (tick === lastTick.current) return;
    lastTick.current = tick;

    const pose = lemmingPose(tick, { frames: FRAMES, range: RANGE_PX, bounce });
    frameRefs.current.forEach((g, i) => { if (g) g.visible = i === pose.frame; });
    if (walkRef.current) walkRef.current.position.x = pose.offset;
    if (mirrorRef.current) mirrorRef.current.scale.x = pose.facingLeft ? -1 : 1;
  });

  return (
    <group ref={ref} {...props} dispose={null}>
      {/* Desplazamiento en píxeles (la escala de arriba lo convierte a mundo). En el tick 0 empieza
           en el origen (offset = 0) y cada FRAME_MS avanza 1 píxel (offset se sobrescribe del todo). */}
      <group ref={walkRef} position={[0, 0, 0]}>
        {/* Espejo alrededor del centro de los pies: x -> -x (mira a la izquierda) */}
        <group ref={mirrorRef} scale={[-1, 1, 1]}>
          {/* Se lleva el centro de los pies al origen */}
          <group position={[-ANCHOR_X, 0, -ANCHOR_Z]}>
            {FRAME_DEFS.map(([name, position], i) => (
              <group key={name} ref={(g) => { frameRefs.current[i] = g; }} position={position} visible={i === 0}>
                <mesh castShadow receiveShadow geometry={nodes[name].geometry} material={materials.White} />
                <mesh castShadow receiveShadow geometry={nodes[`${name}_1`].geometry} material={materials.Blue} />
                <mesh castShadow receiveShadow geometry={nodes[`${name}_2`].geometry} material={materials.Green} />
              </group>
            ))}
          </group>
        </group>
      </group>
    </group>
  )
});

useGLTF.preload('models/lemming.glb')
