import * as THREE from 'three';
import TextAdvance from '../components/TextAdvance';
import fontText from '../assets/fonts/Source_Code_Pro/static/Source_Code_Pro_Regular.json';
import { Bvh, Float } from '@react-three/drei';
import { Play } from '../../public/models/Play';
import { Github } from '../../public/models/Github';
import { Reacts } from '../../public/models/React';
import { Threejs } from '../../public/models/Threejs';
import { RusticSpaceShip } from '../../public/models/RusticSpaceShip';
import { useMemo } from 'react';

function Webgame({ isVisibleLight, pos, parentPos }) {
  // Memoriza los textos
  const titleTexts = useMemo(() => (
    <>
      <TextAdvance position={[0, 0, 0.9]}
        text={"SPACESHIP CONTROLLER"}
        font={fontText} size={0.2} height={0.08}
        colorPri={"white"} colorSec={new THREE.Color(0x223060)}
      />
      <TextAdvance position={[0, 0, 0.9]}
        text={"____________________"}
        font={fontText} size={0.2} height={0.08}
        colorPri={"white"} colorSec={new THREE.Color(0x223060)}
      />
      <TextAdvance position={[0, 0, 0.9]}
        text={"___________________"}
        font={fontText} size={0.2} height={0.08}
        colorPri={"white"} colorSec={new THREE.Color(0x223060)}
      />
    </>
  ), []);

  const descriptionText = useMemo(() => (
    <TextAdvance position={[0, 0, 1.5]}
      text={"Project to practice 3D camera\ntranslation and rotation"}
      font={fontText} size={0.16} height={0.08}
      colorPri={"white"} colorSec={new THREE.Color(0x223060)}
    />
  ), []);

  const techIcons = useMemo(() => (
    <>
      <Threejs scale={20} position={[3, -0.08, 1.58]} rotation={[0, 0, 0]} />
      <Reacts scale={20} position={[4, -0.08, 1.58]} rotation={[0, 0, 0]} />
    </>
  ), []);

  const links = useMemo(() => (
    <mesh className="LINKS" position={[0, 0, 2.3]}>
      <Bvh firstHitOnly >
        <Play link='https://juanlorenteguarnieri.github.io/Spaceship-Controller/' scale={11} position={[-0.7, -0.06, 0]} rotation={[0, 0, 0]} />
        <Github link='https://github.com/JuanLorenteGuarnieri/Spaceship-Controller' scale={12} position={[0, -0.07, 0]} rotation={[0, 0, 0]} />
      </Bvh>
    </mesh>
  ), []);

  const model = useMemo(() => (
    <mesh className="MODEL" >
      {/* <pointLight intensity={30} position={[-3.3, 1, 1.4]}
        color={new THREE.Color(0x223060)} /> */}
      <Bvh firstHitOnly >
        <Float
          speed={4}
          rotationIntensity={0.3}
          floatIntensity={0.01}
          floatingRange={[-0.2, 0.1]}
        >
          <RusticSpaceShip position={[-3.5, 0.2, 1.8]} />
        </Float>
      </Bvh>
    </mesh>
  ), []);

  const pointLights = useMemo(() => (
    <>
      <pointLight intensity={15} position={[3, 1, 1.58]} color={new THREE.Color(0x223060)} />
      <pointLight intensity={15} position={[4, 1, 1.58]} color={new THREE.Color(0x223060)} />
    </>
  ), []);

  // Memoiza el contenido del componente principal
  const content = useMemo(() => (
    <>
      {model}
      {titleTexts}
      {descriptionText}
      {techIcons}
      {/* {pointLights} */}
      {links}
    </>
  ), [titleTexts, descriptionText, techIcons, pointLights, links]);

  return (
    <mesh
      className="WEBGAME"
      position={pos}
      visible={isVisibleLight(new THREE.Vector3(0, 5, pos[2] + parentPos[2]), 8)}
    >
      {content}
    </mesh>
  );
}

export default Webgame;
