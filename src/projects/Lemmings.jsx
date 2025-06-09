import * as THREE from 'three';
import { useMemo } from 'react';
import TextAdvance from '../components/TextAdvance';
import fontText from '../assets/fonts/Source_Code_Pro/static/Source_Code_Pro_Regular.json';
import { Bvh } from '@react-three/drei';
import { Github } from '../../public/models/Github';
import { Windows } from '../../public/models/Windows';
import { C } from '../../public/models/C';
import { Lemming } from '../../public/models/Lemming';
import { Docs } from '../../public/models/Docs';
import { Sdl } from '../../public/models/Sdl';

function Lemmings({ isVisibleLight, pos, parentPos }) {
  // Memoriza los textos repetidos
  const TitleText = useMemo(() => (
    <TextAdvance
      position={[0, 0, 0.9]}
      text={"LEMMINGS CLONE"}
      font={fontText}
      size={0.2}
      height={0.08}
      colorPri={"white"}
      colorSec={new THREE.Color(0x223060)}
    />
  ), []);

  const Underline1 = useMemo(() => (
    <TextAdvance
      position={[0, 0, 0.9]}
      text={"______________"}
      font={fontText}
      size={0.2}
      height={0.08}
      colorPri={"white"}
      colorSec={new THREE.Color(0x223060)}
    />
  ), []);

  const Underline2 = useMemo(() => (
    <TextAdvance
      position={[0, 0, 0.9]}
      text={"_____________"}
      font={fontText}
      size={0.2}
      height={0.08}
      colorPri={"white"}
      colorSec={new THREE.Color(0x223060)}
    />
  ), []);

  const DescriptionText = useMemo(() => (
    <TextAdvance
      position={[0, 0, 1.5]}
      text={"Pixel to pixel destruction and \n2D physics in real time"}
      font={fontText}
      size={0.16}
      height={0.08}
      colorPri={"white"}
      colorSec={new THREE.Color(0x223060)}
    />
  ), []);

  // Memoriza el componente C
  const CModel = useMemo(() => (
    <>
      <C scale={20} position={[3, -0.08, 1.6]} rotation={[0, 0, 0]} />
      <Sdl scale={20} position={[4, -0.08, 1.58]} rotation={[0, 0, 0]} />
    </>
  ), []);

  // Memoriza el Github link
  const GithubLink = useMemo(() => (
    <Bvh firstHitOnly>
      <Windows link='https://drive.google.com/file/d/1Q5Ernxro459w8ib38GBHCS0tqSxGjtLu/view?usp=sharing' scale={12} position={[-0.7, -0.05, 0]} rotation={[0, 0, 0]} />
      <Github link='https://github.com/fernando-lahoz/videojuegos-lemmings' scale={12} position={[0, -0.07, 0]} rotation={[0, 0, 0]} />
      <Docs link='https://JuanLorenteGuarnieri.github.io/portfolio/Lemmings-Report.pdf' scale={15} position={[0.7, -0.09, 0]} rotation={[0, 0, 0]} />
    </Bvh>
  ), []);

  // Memoriza el Lemming model
  const LemmingModel = useMemo(() => (
    <Bvh firstHitOnly>
      <Lemming position={[-3.9, 0.0, 2.2]} scale={0.08} />
    </Bvh>
  ), []);

  // Memoriza la luz del Lemming
  const LemmingLight = useMemo(() => (
    <pointLight
      intensity={30}
      position={[-3.3, 1, 1.4]}
      color={new THREE.Color(0x223060)}
    />
  ), []);

  // Memoriza la luz del modelo C
  const CLight = useMemo(() => (
    <pointLight
      intensity={15}
      position={[3, 1, 1.6]}
      color={new THREE.Color(0x223060)}
    />
  ), []);

  // Memoriza el mesh de LINKS
  const LinksMesh = useMemo(() => (
    <mesh className="LINKS" position={[0, 0, 2.3]}>
      {GithubLink}
    </mesh>
  ), [GithubLink]);

  // Memoriza el mesh del Lemming y su luz
  const LemmingMesh = useMemo(() => (
    <mesh className="MODEL">
      {/* {LemmingLight} */}
      {LemmingModel}
    </mesh>
  ), [LemmingLight, LemmingModel]);

  return (
    <mesh
      className="LEMMINGS CLONE"
      position={pos}
      visible={isVisibleLight(new THREE.Vector3(0, 5, pos[2] + parentPos[2]), 8)}
    >
      {LemmingMesh}
      {TitleText}
      {Underline1}
      {Underline2}
      {DescriptionText}
      {CModel}
      {/* {CLight} */}
      {LinksMesh}
    </mesh>
  );
}

export default Lemmings;
