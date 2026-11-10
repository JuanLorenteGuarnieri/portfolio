import * as THREE from 'three';
import TextAdvance from '../components/TextAdvance';
import fontTitle from '../assets/fonts/Encode_Sans_Semi_Expanded/Encode_Sans_Semi_Expanded_Bold.json';
import { C } from '../models/C';
import { Blender } from '../models/Blender';
import { Vscode } from '../models/Vscode';
import { Git } from '../models/Git';
import { Threejs } from '../models/Threejs';
import { Reacts } from '../models/React';
import { Unity } from '../models/Unity';
import { Pytorch } from '../models/Pytorch';
import { Python } from '../models/Python';

const skillModels = [
  { key: 'c', Component: C, props: { scale: 20, position: [-4, -0.08, 1.1], rotation: [0, 0, 0] } },
  { key: 'python', Component: Python, props: { scale: 16, position: [-3, 0, 1.1], rotation: [0, 0, 0] } },
  { key: 'pytorch', Component: Pytorch, props: { scale: 20, position: [-2, 0, 1.1], rotation: [0, 0, 0] } },
  { key: 'git', Component: Git, props: { scale: 20, position: [-1, -0.08, 1.1], rotation: [0, 0, 0] } },
  { key: 'vscode', Component: Vscode, props: { scale: 20, position: [0, -0.08, 1.1], rotation: [0, 0, 0] } },
  { key: 'unity', Component: Unity, props: { scale: 20, position: [1, -0.02, 1.1], rotation: [0, 0, 0] } },
  { key: 'blender', Component: Blender, props: { scale: 20, position: [2, -0.08, 1.1], rotation: [0, 0, 0] } },
  { key: 'threejs', Component: Threejs, props: { scale: 20, position: [3, -0.08, 1.1], rotation: [0, 0, 0] } },
  { key: 'reacts', Component: Reacts, props: { scale: 20, position: [4, -0.08, 1.1], rotation: [0, 0, 0] } },
];

function Skills({ isVisibleLight, pos }) {

  return (
    <mesh className="SKILLS & TOOLS" position={pos} visible={isVisibleLight(new THREE.Vector3(0, 5, pos[2]), 8)}>
      <TextAdvance
        position={[0, 0, 0]}
        text={"SKILLS & TOOLS"}
        font={fontTitle}
        size={0.3}
        height={0.1}
        colorPri={"white"}
        colorSec={new THREE.Color(0x333333)}
      />
      {skillModels.map(({ key, Component, props }) => (
        <Component key={key} {...props} />
      ))}
    </mesh>
  );
}

export default Skills;
