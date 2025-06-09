import * as THREE from 'three';
import TextAdvance from '../components/TextAdvance';
import fontText from '../assets/fonts/Source_Code_Pro/static/Source_Code_Pro_Regular.json';
import { Bvh } from '@react-three/drei';
import { Github } from '../../public/models/Github';
import { Python } from '../../public/models/Python';
import { Nlos } from '../../public/models/Nlos';
import { useMemo } from 'react';
import { Doc } from '../../public/models/Doc';
import { Docs } from '../../public/models/Docs';
import { Matlab } from '../../public/models/Matlab';

function CI({ isVisibleLight, pos, parentPos }) {
  // Memoized models
  const nlosModel = useMemo(() => (
    <Bvh firstHitOnly>
      <Nlos position={[-2.9, 0.0, 1.7]} scale={0.015} rotation={[-Math.PI / 8, Math.PI, 0]} />
    </Bvh>
  ), []);

  const pythonModel = useMemo(() => (
    <>
      <Python scale={18} position={[3, -0.02, 1.6]} rotation={[0, 0, 0]} />
      <Matlab scale={20} position={[4, -0.08, 1.58]} rotation={[0, 0, 0]} />
    </>
  ), []);

  const githubLink = useMemo(() => (
    <Bvh firstHitOnly>
      <Github link='https://github.com/JuanLorenteGuarnieri/CI' scale={12} position={[0, -0.07, 0]} rotation={[0, 0, 0]} />
      <Docs link='https://drive.google.com/drive/folders/1QhiTT7H6CbZmZbyhMNpNuPmOxMm6MEdE?usp=sharing' scale={15} position={[0.7, -0.09, 0]} rotation={[0, 0, 0]} />
    </Bvh>
  ), []);

  // Memoized texts
  const titleText = useMemo(() => (
    <TextAdvance position={[0, 0, 0.9]}
      text={"COMPUTATIONAL IMAGING"}
      font={fontText} size={0.2} height={0.08}
      colorPri={"white"} colorSec={new THREE.Color(0x223060)}
    />
  ), []);

  const underline1 = useMemo(() => (
    <TextAdvance position={[0, 0, 0.9]}
      text={"_____________________"}
      font={fontText} size={0.2} height={0.08}
      colorPri={"white"} colorSec={new THREE.Color(0x223060)}
    />
  ), []);

  const underline2 = useMemo(() => (
    <TextAdvance position={[0, 0, 0.9]}
      text={"____________________"}
      font={fontText} size={0.2} height={0.08}
      colorPri={"white"} colorSec={new THREE.Color(0x223060)}
    />
  ), []);

  const descriptionText = useMemo(() => (
    <TextAdvance position={[0, 0, 1.5]}
      text={"Camera Pipeline, Coded Aperture,\n HDR Imaging and NLOS Imaging"}
      font={fontText} size={0.16} height={0.08}
      colorPri={"white"} colorSec={new THREE.Color(0x223060)}
    />
  ), []);

  // Memoized lights
  const modelLight = useMemo(() => (
    <pointLight intensity={30} position={[-3.3, 1, 1.4]} color={new THREE.Color(0x223060)} />
  ), []);

  const pythonLight = useMemo(() => (
    <pointLight intensity={15} position={[3, 1, 1.6]} color={new THREE.Color(0x223060)} />
  ), []);

  return (
    <mesh className="Computational Imaging" position={pos} visible={isVisibleLight(new THREE.Vector3(0, 5, pos[2] + parentPos[2]), 8)}>
      <mesh className="MODEL" >
        {/* {modelLight} */}
        {nlosModel}
      </mesh>

      {titleText}
      {underline1}
      {underline2}
      {descriptionText}

      {pythonModel}
      {/* {pythonLight} */}

      <mesh className="LINKS" position={[0, 0, 2.3]}>
        {githubLink}
      </mesh>
    </mesh>
  );
}

export default CI;
