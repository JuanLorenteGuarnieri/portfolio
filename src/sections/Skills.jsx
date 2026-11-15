import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
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
import { getMousePos } from '../lib/mousePosStore';

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

const COUNT = skillModels.length;
// Límites de movimiento: -1 del primer skill y +1 del último en X, mismo margen en Z
const BOUND_X = [-3, 3];
const BOUND_Z = [1.2, 1.3];
const MIN_DIST = 2.05; // distancia mínima antes de repelerse entre skills
const REPEL = 0.8; // fuerza de repulsión entre skills
const WALL = 2.5; // fuerza de repulsión de las paredes
const DAMP = 0.3; // amortiguación (inercia)
const UP = 0.06; // fuerza que devuelve el giro a "mirando hacia arriba"
const MIN_DIST_MOUSE = 1.0; // distancia mínima antes de repelerse del ratón
const REPEL_MOUSE = 2.135; // fuerza de repulsión del ratón sobre cada skill
function Skills({ isVisibleLight, pos }) {
  const groupRefs = useRef(Array.from({ length: COUNT }, () => null));
  const velRef = useRef(skillModels.map(() => new THREE.Vector3()));
  const angRef = useRef(skillModels.map(() => new THREE.Euler(0, 0, 0)));
  const initY = skillModels.map((p) => p.props.position[1]);

  useFrame(() => {
    const groups = groupRefs.current;
    if (!groups.every((g) => g)) return;

    // Offset del mesh padre (pos = skillsPos = [0, 0, 72]) para pasar de coords relativas a absolutas
    const ox = pos[0];
    const oz = pos[2];

    const xs = groups.map((g) => g.position.x);
    const zs = groups.map((g) => g.position.z);
    const absX = xs.map((x) => ox + x);
    const absZ = zs.map((z) => oz + z);

    // Proyección del ratón sobre el plano XZ (igual que la luz del cursor)
    const mouse = getMousePos();

    // Repulsión entre cada par de skills (sobre el plano XZ)
    for (let i = 0; i < COUNT; i++) {
      for (let j = i + 1; j < COUNT; j++) {
        const dx = xs[i] - xs[j];
        const dz = zs[i] - zs[j];
        const dist = Math.hypot(dx, dz);
        if (dist > 0 && dist < MIN_DIST) {
          const f = ((MIN_DIST - dist) * REPEL) / Math.max(dist, 0.01);
          const fx = dx * f;
          const fz = dz * f;
          velRef.current[i].x += fx;
          velRef.current[i].z += fz;
          velRef.current[j].x -= fx;
          velRef.current[j].z -= fz;
        }
      }
    }

    // Integración, paredes y giro vertical
    for (let i = 0; i < COUNT; i++) {
      const g = groups[i];
      const v = velRef.current[i];
      const a = angRef.current[i];

      // Paredes en X
      if (xs[i] < BOUND_X[0]) v.x += (BOUND_X[0] - xs[i]) * WALL;
      else if (xs[i] > BOUND_X[1]) v.x += (BOUND_X[1] - xs[i]) * WALL;
      // Paredes en Z
      if (zs[i] < BOUND_Z[0]) v.z += (BOUND_Z[0] - zs[i]) * WALL;
      else if (zs[i] > BOUND_Z[1]) v.z += (BOUND_Z[1] - zs[i]) * WALL;

      // Repulsión del ratón (si hay proyección válida, coordenadas absolutas)
      if (mouse.has) {
        const mx = absX[i] - mouse.x;
        const mz = absZ[i] - mouse.z;
        const mdist = Math.hypot(mx, mz);
        if (mdist > 0 && mdist < MIN_DIST_MOUSE) {
          const f = ((MIN_DIST_MOUSE - mdist) * REPEL_MOUSE) / Math.max(mdist, 0.01);
          v.x += mx * f;
          v.z += mz * f;
        }
      }

      v.multiplyScalar(DAMP);
      g.position.set(xs[i] + v.x, initY[i], zs[i] + v.z);

      // Vuelve a mirar hacia arriba (giro base [0, 0, 0])
      a.x *= DAMP;
      a.y *= DAMP;
      a.z *= DAMP;
      a.x -= g.rotation.x * UP;
      a.y -= g.rotation.y * UP;
      a.z -= g.rotation.z * UP;
      g.rotation.set(a.x, a.y, a.z);
    }
  });

  return (
    <mesh className="SKILLS & TOOLS" position={pos} visible={isVisibleLight(new THREE.Vector3(0, 5, pos[2]), 8)}>
      <TextAdvance
        position={[0, 0, 0]}
        text={"SKILLS & TOOLS"}
        font={fontTitle}
        size={0.25}
        height={0.1}
        colorPri={"white"}
        colorSec={new THREE.Color(0x333333)}
      />
      {skillModels.map(({ key, Component, props }, i) => (
        <Component
          key={key}
          ref={(el) => (groupRefs.current[i] = el)}
          {...props}
        />
      ))}
    </mesh>
  );
}

export default Skills;
