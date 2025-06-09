import * as THREE from 'three';
import { useMemo } from 'react';
import TextAdvance from '../components/TextAdvance';
import fontText from '../assets/fonts/Source_Code_Pro/static/Source_Code_Pro_Regular.json';
import { Bvh } from '@react-three/drei';
import { Github } from '../../public/models/Github';
import { C } from '../../public/models/C';
import { Doc } from '../../public/models/Doc';
import { Docs } from '../../public/models/Docs';
import { Slides } from '../../public/models/Slides';
import { Slammap } from '../../public/models/Slammap';
import { Slamcamera } from '../../public/models/Slamcamera';

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
      text={"Simultaneous Localization and\nMapping | Visual and ORB-SLAM"}
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
      <Slides link='https://docs.google.com/presentation/d/16tmI6Ory_iThb4zdwZaD9s8LTg44JDVMDTcDbGcgR_w/edit?usp=sharing' scale={15} position={[-0.7, -0.09, 0]} rotation={[0, 0, 0]} />
      <Github link='https://github.com/hsunekichi/SLAM' scale={12} position={[0, -0.07, 0]} rotation={[0, 0, 0]} />
      <Docs link='https://drive.google.com/drive/folders/1f-CeERD3_n_MHRna1xsNCC8wOQILmZbV?usp=sharing' scale={15} position={[0.7, -0.09, 0]} rotation={[0, 0, 0]} />
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



  const slamModel = useMemo(() => (
    <>
      <Bvh firstHitOnly>
        <Slammap position={[-3.2, 0.39, 1.5]} scale={0.48} rotation={[-0.6, Math.PI - 0.35, Math.PI + 0.35]} />
      </Bvh>
      <Slamcamera position={[-3.2, 0.39, 1.5]} scale={0.48} rotation={[-0.6, Math.PI - 0.35, Math.PI + 0.35]} />
    </>
  ), []);

  const meshVisible = useMemo(() => isVisibleLight(new THREE.Vector3(0, 5, pos[2] + parentPos[2]), 8), [isVisibleLight, pos, parentPos]);

  const mainMesh = useMemo(() => (
    <mesh className="SLAM" position={pos} visible={meshVisible}>
      {slamModel}
      {slamTexts}
      {orbSlamText}
      {cModel}
      {/* {pointLight} */}
      {linksMesh}
    </mesh>
  ), [pos, meshVisible, slamModel, slamTexts, orbSlamText, cModel, pointLight, linksMesh]);

  return mainMesh;
}

export default SLAM;
