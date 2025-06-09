import { useMemo } from 'react';
import { LogoGema } from '../../public/models/LogoGema';
import { Logo } from '../../public/models/Logo';
import { Bvh, Float, Plane } from '@react-three/drei';
import * as THREE from 'three';
import TextAdvance from '../components/TextAdvance';
import { Linkedin } from '../../public/models/Linkedin';
import { Github } from '../../public/models/Github';
import { CV } from '../../public/models/Cv';
import fontTitle from '../assets/fonts/Encode_Sans_Semi_Expanded/Encode_Sans_Semi_Expanded_Bold.json';
import fontText from '../assets/fonts/Source_Code_Pro/static/Source_Code_Pro_Regular.json';
import { BakedLogo } from '../components/BakedLogo';

const LOGO_POSITION = [0, 0, 0.5];
const LOGO_MESH_POSITION = [0, 0.2, 1];
const LOGO_MESH_SCALE = 0.65;
const LOGO_MESH_ROTATION = [-Math.PI / 3, 0, 0];
const LOGO_SCALE = [1, 1, 0.5];

const TITLE_POSITION = [0, 0, 2.4];
const SUBTITLE_POSITION = [0, 0, 2.8];

const LINKS_POSITION = [0, 0, 3.15];
const LINKEDIN_POSITION = [0.7, -0.07, 0];
const GITHUB_POSITION = [0, -0.07, 0];
const CV_POSITION = [-0.7, -0.07, 0];
const LINKS_SCALE = 12;

const COLOR_PRIMARY = "white";
const COLOR_SECONDARY = new THREE.Color(0x333333);
const COLOR_SUBTITLE = "white";
const COLOR_POINTLIGHT = new THREE.Color(0x223060);

function Title({ isVisibleLight, pos }) {
  // Memoized Logo Mesh
  const LogoMesh = useMemo(() => (
    <mesh
      position={LOGO_MESH_POSITION}
      scale={LOGO_MESH_SCALE}
      rotation={LOGO_MESH_ROTATION}
    >
      <Bvh firstHitOnly>
        <Logo scale={LOGO_SCALE} />
        <Float
          speed={6}
          rotationIntensity={0.3}
          floatIntensity={0.01}
          floatingRange={[-0.2, 0.1]}
        >
          <LogoGema />
        </Float>
      </Bvh>
    </mesh>
  ), []);

  // Memoized Title Text
  const TitleText = useMemo(() => (
    <TextAdvance
      position={TITLE_POSITION}
      text="Juan Lorente"
      font={fontTitle}
      size={0.73}
      height={0.1}
      align="center"
      colorPri={COLOR_PRIMARY}
      colorSec={COLOR_SECONDARY}
    />
  ), []);

  // Memoized Subtitle Text
  const SubtitleText = useMemo(() => (
    <TextAdvance
      position={SUBTITLE_POSITION}
      text="Computer Vision & Graphics developer"
      font={fontText}
      size={0.16}
      height={0.08}
      align="center"
      colorPri="white"
      colorSec={COLOR_SUBTITLE}
    />
  ), []);

  // Memoized Links
  const Links = useMemo(() => (
    <mesh className="LINKS" position={LINKS_POSITION} scale={1} rotation={[0, 0, 0]}>
      <Bvh firstHitOnly>
        <Linkedin scale={LINKS_SCALE} position={LINKEDIN_POSITION} rotation={[0, 0, 0]} />
        <Github scale={LINKS_SCALE} position={GITHUB_POSITION} rotation={[0, 0, 0]} />
        <CV scale={LINKS_SCALE} position={CV_POSITION} rotation={[0, 0, 0]} />
      </Bvh>
    </mesh>
  ), []);

  // Memoized Lights
  const LogoLights = useMemo(() => (
    <>
      <pointLight
        intensity={200}
        position={[0, 1, 0.5]}
        shadow-bias={-0.005}
        color={COLOR_POINTLIGHT}
      />
      <pointLight
        intensity={200}
        position={[0, 1, 0]}
        shadow-bias={-0.005}
        color={COLOR_POINTLIGHT}
      />
    </>
  ), []);

  // Memoized Logo Container
  const LogoContainer = useMemo(() => (
    <mesh className="LOGO" position={LOGO_POSITION}>
      {LogoLights}
      {LogoMesh}
    </mesh>
  ), [LogoLights, LogoMesh]);

  return (
    <mesh className="TITLE" position={pos} visible={isVisibleLight(new THREE.Vector3(0, 5, pos[2]), 9)}>
      {LogoContainer}
      {TitleText}
      {SubtitleText}
      {Links}
    </mesh>
  );
}

export default Title;
