import * as THREE from 'three';
import TextAdvance from '../components/TextAdvance';
import fontTitle from '../assets/fonts/Encode_Sans_Semi_Expanded/Encode_Sans_Semi_Expanded_Bold.json';
import Raytracer from '../projects/Raytracer';
import Webgame from '../projects/Webgame';
import Lemmings from '../projects/Lemmings';
import Robotics from '../projects/Robotics';
import Panorama from '../projects/Panorama';
import Bachelor from '../projects/Bachelor';
import CV from '../projects/CV';
import MSOA from '../projects/MSOA';
import CI from '../projects/CI';
import ACI from '../projects/ACI';
import SLAM from '../projects/SLAM';
import MasterThesis from '../projects/MasterThesis';

const margin = 2.4;
const projectPositions = [
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
  [0, 0, margin * 11],
];

const projectComponents = [
  { key: 'Bachelor', Component: Bachelor },
  { key: 'MasterThesis', Component: MasterThesis },
  { key: 'CI', Component: CI },
  { key: 'ACI', Component: ACI },
  { key: 'SLAM', Component: SLAM },
  { key: 'Robotics', Component: Robotics },
  { key: 'Raytracer', Component: Raytracer },
  { key: 'MSOA', Component: MSOA },
  { key: 'CV', Component: CV },
  { key: 'Panorama', Component: Panorama },
  { key: 'Webgame', Component: Webgame },
  { key: 'Lemmings', Component: Lemmings },
];

function Projects({ isVisibleLight, pos }) {
  const meshVisible = isVisibleLight(new THREE.Vector3(0, 5, pos[2]), projectPositions.length * (margin + 0.5));

  return (
    <mesh className="PROJECTS" position={pos} visible={meshVisible}>
      <TextAdvance
        position={[0, 0, 0]}
        text={"PROJECTS"}
        font={fontTitle}
        size={0.3}
        height={0.1}
        colorPri={"white"}
        colorSec={new THREE.Color(0x333333)}
      />
      {projectComponents.map(({ key, Component }, index) => (
        <Component
          key={key}
          pos={projectPositions[index]}
          parentPos={pos}
          isVisibleLight={isVisibleLight}
        />
      ))}
    </mesh>
  );
}

export default Projects;
