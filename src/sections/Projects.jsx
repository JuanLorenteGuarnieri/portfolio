import { Bvh, Float, Plane, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import TextAdvance from '../components/TextAdvance';
import fontTitle from '../assets/fonts/Encode_Sans_Semi_Expanded/Encode_Sans_Semi_Expanded_Bold.json';

import {
  computeBoundsTree,
  disposeBoundsTree,
  acceleratedRaycast,
} from 'three-mesh-bvh'
import { useRef, useMemo } from 'react';
import Raytracer from '../projects/Raytracer';
import Webgame from '../projects/Webgame';
import Lemmings from '../projects/Lemmings';
import Bachelor from '../projects/Bachelor';
import Panorama from '../projects/Panorama';
import Robotics from '../projects/Robotics';
import SLAM from '../projects/SLAM';
import MSOA from '../projects/MSOA';
import CV from '../projects/CV';
import CI from '../projects/CI';
import ACI from '../projects/ACI';

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree
THREE.Mesh.prototype.raycast = acceleratedRaycast

function Projects({ isVisibleLight, pos }) {
  const projectRef = useRef();

  const margin = 2.4; // Margin between projects

  // PROJECTS POSITIONS
  const positions = useMemo(() => [
    [0, 0, margin * 0],
    [0, 0, margin * 1],
    [0, 0, margin * 2],
    [0, 0, margin * 3],
    [0, 0, margin * 4],
    [0, 0, margin * 5],
    [0, 0, margin * 6],
    [0, 0, margin * 7],
    [0, 0, margin * 8],
    [0, 0, margin * 9],
    [0, 0, margin * 10],
  ], [margin]);

  const projects = useMemo(() => [
    <Raytracer key="Raytracer" pos={positions[0]} parentPos={pos} isVisibleLight={isVisibleLight} />,
    <Webgame key="Webgame" pos={positions[1]} parentPos={pos} isVisibleLight={isVisibleLight} />,
    <Lemmings key="Lemmings" pos={positions[2]} parentPos={pos} isVisibleLight={isVisibleLight} />,
    <Robotics key="Robotics" pos={positions[3]} parentPos={pos} isVisibleLight={isVisibleLight} />,
    <Panorama key="Panorama" pos={positions[4]} parentPos={pos} isVisibleLight={isVisibleLight} />,
    <Bachelor key="Bachelor" pos={positions[5]} parentPos={pos} isVisibleLight={isVisibleLight} />,
    <CV key="CV" pos={positions[6]} parentPos={pos} isVisibleLight={isVisibleLight} />,
    <MSOA key="MSOA" pos={positions[7]} parentPos={pos} isVisibleLight={isVisibleLight} />,
    <CI key="CI" pos={positions[8]} parentPos={pos} isVisibleLight={isVisibleLight} />,
    <ACI key="ACI" pos={positions[9]} parentPos={pos} isVisibleLight={isVisibleLight} />,
    <SLAM key="SLAM" pos={positions[10]} parentPos={pos} isVisibleLight={isVisibleLight} />,
  ], [positions, pos, isVisibleLight]);

  return (
    <mesh className="PROJECTS" position={pos} ref={projectRef} visible={isVisibleLight(new THREE.Vector3(0, 5, pos[2]), positions.length * (margin + 0.5))}>
      <TextAdvance position={[0, 0, 0]}
        text={"PROJECTS"}
        font={fontTitle} size={0.3} height={0.1}
        colorPri={new THREE.Color(0xdddddd)} colorSec={new THREE.Color(0x333333)}
      />

      <rectAreaLight intensity={13} position={[0, 2, 13.5]} rotation={[-Math.PI / 2, 0, 0]}
        visible={isVisibleLight(new THREE.Vector3(0, 5, pos[2] + 2), 30)}
        width={3.} height={26} color={new THREE.Color(0x223060)} />

      {projects}
    </mesh >
  );
}

export default Projects;
