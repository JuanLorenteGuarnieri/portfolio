import { Bvh } from '@react-three/drei';
import * as THREE from 'three';
import TextAdvance from './TextAdvance';
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

function Skills({ isVisibleLight, pos }) {

  return (
    <mesh className="SKILLS & TOOLS" position={pos}>
      <TextAdvance position={[0, 0, 0]}
        text={"SKILLS & TOOLS"}
        font={fontTitle} size={0.3} height={0.1}
        colorPri={new THREE.Color(0xdddddd)} colorSec={new THREE.Color(0x333333)}
      />
      <Bvh firstHitOnly >
        <rectAreaLight intensity={15} position={[0, 1, 1.1]} rotation={[-Math.PI / 2, 0, 0]}
          visible={isVisibleLight(new THREE.Vector3(0, 5, pos[2] + 1.1), 6)}
          width={10} height={1} color={new THREE.Color(0x223060)} />
        <C scale={20} position={[-4, -0.08, 1.1]} rotation={[0, 0, 0]} />
        <Python scale={16} position={[-3, 0, 1.1]} rotation={[0, 0, 0]} />
        <Pytorch scale={20} position={[-2, 0, 1.1]} rotation={[0, 0, 0]} />
        <Git scale={20} position={[-1, -0.08, 1.1]} rotation={[0, 0, 0]} />
        <Vscode scale={20} position={[0, -0.08, 1.1]} rotation={[0, 0, 0]} />
        <Unity scale={20} position={[1, -0.02, 1.1]} rotation={[0, 0, 0]} />
        <Blender scale={20} position={[2, -0.08, 1.1]} rotation={[0, 0, 0]} />
        <Threejs scale={20} position={[3, -0.08, 1.1]} rotation={[0, 0, 0]} />
        <Reacts scale={20} position={[4, -0.08, 1.1]} rotation={[0, 0, 0]} />
      </Bvh>
    </mesh>
  );
}

export default Skills;
