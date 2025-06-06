import * as THREE from 'three';
import { useMemo } from 'react';
import TextAdvance from '../components/TextAdvance';
import fontText from '../assets/fonts/Source_Code_Pro/static/Source_Code_Pro_Regular.json';
import { Bvh } from '@react-three/drei';
import { Github } from '../../public/models/Github';
import { C } from '../../public/models/C';

function SLAM({ isVisibleLight, pos, parentPos }) {
  const textColorSec = useMemo(() => new THREE.Color(0x223060), []);
  const textProps = useMemo(() => ({
    font: fontText,
    size: 0.2,
    height: 0.08,
    colorPri: "white",
    colorSec: textColorSec,
  }), [textColorSec]);

  const slamTexts = useMemo(() => (
    <>
      <TextAdvance position={[0, 0, 0.9]} text={"SLAM"} {...textProps} />
      <TextAdvance position={[0, 0, 0.9]} text={"____"} {...textProps} />
      <TextAdvance position={[0, 0, 0.9]} text={"___"} {...textProps} />
    </>
  ), [textProps]);

  const orbSlamText = useMemo(() => (
    <TextAdvance
      position={[0, 0, 1.5]}
      text={"ORB-SLAM and Visual SLAM"}
      font={fontText}
      size={0.16}
      height={0.08}
      colorPri={"white"}
      colorSec={textColorSec}
    />
  ), [textColorSec]);

  const cModel = useMemo(() => (
    <C scale={20} position={[3, -0.02, 1.6]} rotation={[0, 0, 0]} />
  ), []);

  const githubLink = useMemo(() => (
    <Bvh firstHitOnly>
      <Github link='https://github.com/hsunekichi/SLAM' scale={12} position={[0, -0.08, 0]} rotation={[0, 0, 0]} />
    </Bvh>
  ), []);

  const linksMesh = useMemo(() => (
    <mesh className="LINKS" position={[0, 0, 2.3]}>
      {githubLink}
    </mesh>
  ), [githubLink]);

  const pointLight = useMemo(() => (
    <pointLight
      intensity={15}
      position={[3, 1, 1.6]}
      color={textColorSec}
    />
  ), [textColorSec]);

  const meshVisible = useMemo(() => isVisibleLight(new THREE.Vector3(0, 5, pos[2] + parentPos[2]), 8), [isVisibleLight, pos, parentPos]);

  const mainMesh = useMemo(() => (
    <mesh className="SLAM" position={pos} visible={meshVisible}>
      {slamTexts}
      {orbSlamText}
      {cModel}
      {pointLight}
      {linksMesh}
    </mesh>
  ), [pos, meshVisible, slamTexts, orbSlamText, cModel, pointLight, linksMesh]);

  return mainMesh;
}

export default SLAM;
