import * as THREE from 'three';
import { useMemo } from 'react';
import TextAdvance from '../components/TextAdvance';
import fontTitle from '../assets/fonts/Encode_Sans_Semi_Expanded/Encode_Sans_Semi_Expanded_Bold.json';
import fontText from '../assets/fonts/Source_Code_Pro/static/Source_Code_Pro_Regular.json';
import { Gilab } from '../../public/models/Gilab';

function Experience({ isVisibleLight, pos }) {
  const gilabPos = [0, 0, 0.9];

  const titleText = useMemo(() => (
    <TextAdvance
      position={[0, 0, 0]}
      text={"EXPERIENCE"}
      font={fontTitle}
      size={0.3}
      height={0.1}
      colorPri={new THREE.Color(0xdddddd)}
      colorSec={new THREE.Color(0x333333)}
    />
  ), []);

  const rectLight = useMemo(() => (
    <rectAreaLight
      intensity={20}
      position={[0, 2, 1.3]}
      rotation={[-Math.PI / 2, 0, 0]}
      width={5}
      height={2}
      color={new THREE.Color(0x223060)}
    />
  ), []);

  const gilabModel = useMemo(() => (
    <Gilab scale={12} position={[-1.85, -0.1, 0.37]} rotation={[0, 0, 0]} />
  ), []);

  const gilabText = useMemo(() => (
    <TextAdvance
      position={[-0.8, 0, 0]}
      align="left"
      text={"Internship at Graphics \n& Imaging Lab\nUniversity of Zaragoza"}
      font={fontText}
      size={0.16}
      height={0.05}
      colorPri={"white"}
      colorSec={new THREE.Color(0x223060)}
    />
  ), []);

  const gilabDate = useMemo(() => (
    <TextAdvance
      position={[-0.8, 0, 0.7]}
      align="left"
      text={"\nFeb - May  2025"}
      font={fontText}
      size={0.16}
      height={0.05}
      colorPri={new THREE.Color(0xaaaaaa)}
      colorSec={new THREE.Color(0x223060)}
    />
  ), []);

  const gilabGroup = useMemo(() => (
    <mesh className="GILAB INTERNSHIP" position={gilabPos}>
      {gilabModel}
      {gilabText}
      {gilabDate}
    </mesh>
  ), [gilabModel, gilabText, gilabDate]);

  const meshVisible = useMemo(() => (
    <mesh
      className="EXPERIENCE"
      position={pos}
      visible={isVisibleLight(new THREE.Vector3(0, 5, pos[2]), 8)}
    >
      {titleText}
      {rectLight}
      {gilabGroup}
    </mesh>
  ), [pos, isVisibleLight, titleText, rectLight, gilabGroup]);

  return meshVisible;
}

export default Experience;
