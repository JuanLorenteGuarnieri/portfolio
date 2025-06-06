import { Bvh } from '@react-three/drei';
import * as THREE from 'three';
import TextAdvance from '../components/TextAdvance';
import fontTitle from '../assets/fonts/Encode_Sans_Semi_Expanded/Encode_Sans_Semi_Expanded_Bold.json';
import { C } from '../../public/models/C';
import { Blender } from '../../public/models/Blender';
import { Vscode } from '../../public/models/Vscode';
import { Git } from '../../public/models/Git';
import { Threejs } from '../../public/models/Threejs';
import { Reacts } from '../../public/models/React';
import { Unity } from '../../public/models/Unity';
import { Pytorch } from '../../public/models/Pytorch';
import { Python } from '../../public/models/Python';

import {
  computeBoundsTree,
  disposeBoundsTree,
  acceleratedRaycast,
} from 'three-mesh-bvh'
import { useEffect, useRef, useMemo } from 'react';

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree
THREE.Mesh.prototype.raycast = acceleratedRaycast

function Skills({ isVisibleLight, pos }) {
  const meshesRef = useRef();

  useEffect(() => {
    const mesh = meshesRef.current
    if (mesh) {
      mesh.geometry.computeBoundsTree()
    }
  }, [])

  // Memoiza los modelos para evitar recrearlos en cada render
  const models = useMemo(() => [
    <C key="c" scale={20} position={[-4, -0.08, 1.1]} rotation={[0, 0, 0]} />,
    <Python key="python" scale={16} position={[-3, 0, 1.1]} rotation={[0, 0, 0]} />,
    <Pytorch key="pytorch" scale={20} position={[-2, 0, 1.1]} rotation={[0, 0, 0]} />,
    <Git key="git" scale={20} position={[-1, -0.08, 1.1]} rotation={[0, 0, 0]} />,
    <Vscode key="vscode" scale={20} position={[0, -0.08, 1.1]} rotation={[0, 0, 0]} />,
    <Unity key="unity" scale={20} position={[1, -0.02, 1.1]} rotation={[0, 0, 0]} />,
    <Blender key="blender" scale={20} position={[2, -0.08, 1.1]} rotation={[0, 0, 0]} />,
    <Threejs key="threejs" scale={20} position={[3, -0.08, 1.1]} rotation={[0, 0, 0]} />,
    <Reacts key="reacts" scale={20} position={[4, -0.08, 1.1]} rotation={[0, 0, 0]} />,
  ], []);

  // Memoiza el componente TextAdvance
  const textAdvance = useMemo(() => (
    <TextAdvance
      position={[0, 0, 0]}
      text={"SKILLS & TOOLS"}
      font={fontTitle}
      size={0.3}
      height={0.1}
      colorPri={new THREE.Color(0xdddddd)}
      colorSec={new THREE.Color(0x333333)}
    />
  ), []);

  // Memoiza el componente rectAreaLight
  const rectLight = useMemo(() => (
    <rectAreaLight
      intensity={15}
      position={[0, 1, 1.1]}
      rotation={[-Math.PI / 2, 0, 0]}
      width={10}
      height={1}
      color={new THREE.Color(0x223060)}
    />
  ), []);

  return (
    <mesh className="SKILLS & TOOLS" position={pos} visible={isVisibleLight(new THREE.Vector3(0, 5, pos[2]), 8)}>
      {textAdvance}
      {rectLight}
      {models}
    </mesh>
  );
}

export default Skills;
