import { Bvh } from '@react-three/drei';
import * as THREE from 'three';
import TextAdvance from '../components/TextAdvance';
import fontTitle from '../assets/fonts/Encode_Sans_Semi_Expanded/Encode_Sans_Semi_Expanded_Bold.json';
import fontText from '../assets/fonts/Source_Code_Pro/static/Source_Code_Pro_Regular.json';
import { Juan } from '../../public/models/Juan';
import { useMemo } from 'react';

const colorPriTitle = "white";
const colorSecTitle = new THREE.Color(0x333333);
const colorLight = new THREE.Color(0x223060);

const aboutText = [
  "I'm a ",
  new Date().getFullYear() - 2003,
  "-year-old developer from Spain, \npassionate about computer graphics and \ncomputer vision. \n\nI enjoy learning by developing visual \nsystems from physically based renderers\nto real-time techniques and applications\nof machine learning in these fields."
].join('');

function About({ isVisibleLight, pos }) {

  // Memoize components
  const Title = useMemo(() => (
    <TextAdvance
      position={[0, 0, 0]}
      text="ABOUT"
      font={fontTitle}
      size={0.3}
      height={0.1}
      colorPri={colorPriTitle}
      colorSec={colorSecTitle}
    />
  ), []);

  const JuanModel = useMemo(() => (
    <Bvh firstHitOnly>
      <Juan
        scale={0.6}
        position={[-3.2, 0.8, 1.8]}
        rotation={[-Math.PI / 6 + 0.2, Math.PI / 2 + 0.8, -0.08]}
      />
    </Bvh>
  ), []);

  const AboutText = useMemo(() => (
    <TextAdvance
      position={[0.75, 0, 0.8]}
      text={aboutText}
      font={fontText}
      size={0.16}
      height={0.1}
      colorPri="white"
      colorSec={colorLight}
    />
  ), []);

  const PointLight1 = useMemo(() => (
    <pointLight
      intensity={200}
      position={[0, 2, 1.5]}
      color={colorLight}
    />
  ), []);

  const PointLight2 = useMemo(() => (
    <pointLight
      intensity={100}
      position={[-3.5, 3, 1.3]}
      color={colorLight}
    />
  ), []);

  return (
    <mesh className="ABOUT" position={pos} visible={isVisibleLight(new THREE.Vector3(0, 5, pos[2]), 9)}>
      {Title}
      {JuanModel}
      {/* {PointLight1}
      {PointLight2} */}
      {AboutText}
    </mesh>
  );
}

export default About;
