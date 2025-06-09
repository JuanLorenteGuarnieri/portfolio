import * as THREE from 'three';
import TextAdvance from '../components/TextAdvance';
import fontText from '../assets/fonts/Source_Code_Pro/static/Source_Code_Pro_Regular.json';
import { Bvh } from '@react-three/drei';
import { C } from '../../public/models/C';
import { Helmet } from '../../public/models/Helmet';
import { useMemo } from 'react';
import { Doc } from '../../public/models/Doc';
import { Github } from '../../public/models/Github';
import { Image } from '../../public/models/Image';
import { Docs } from '../../public/models/Docs';

function MSOA({ isVisibleLight, pos, parentPos }) {
  const helmetMesh = useMemo(() => (
    <mesh className="MODEL" >
      {/* <pointLight
        intensity={30}
        position={[-3.3, 1, 1.4]}
        distance={isVisibleLight(new THREE.Vector3(0, 5, pos[2] + parentPos[2] + 1.4), 7) ? 4 : 0.01}
        color={new THREE.Color(0x223060)}
      /> */}
      <Bvh firstHitOnly>
        <Helmet position={[-3.2, 0.0, 1.5]} rotation={[0, Math.PI / 3, -Math.PI / 4.4]} />
      </Bvh>
    </mesh>
  ), [isVisibleLight, pos, parentPos]);

  const textLines = useMemo(() => ([
    <TextAdvance
      key="title"
      position={[0, 0, 0.9]}
      text={"RENDERING LEDA THE KNIGHT"}
      font={fontText}
      size={0.2}
      height={0.08}
      colorPri={"white"}
      colorSec={new THREE.Color(0x223060)}
    />,
    <TextAdvance
      key="line1"
      position={[0, 0, 0.9]}
      text={"_________________________"}
      font={fontText}
      size={0.2}
      height={0.08}
      colorPri={"white"}
      colorSec={new THREE.Color(0x223060)}
    />,
    <TextAdvance
      key="line2"
      position={[0, 0, 0.9]}
      text={"________________________"}
      font={fontText}
      size={0.2}
      height={0.08}
      colorPri={"white"}
      colorSec={new THREE.Color(0x223060)}
    />,
    <TextAdvance
      key="desc"
      position={[0, 0, 1.5]}
      text={"Nori based renderer with GGX,\nanisotropic beckmann, Dipole SSS..."}
      font={fontText}
      size={0.16}
      height={0.08}
      colorPri={"white"}
      colorSec={new THREE.Color(0x223060)}
    />
  ]), []);

  const cModel = useMemo(() => (
    <C scale={20} position={[3, -0.02, 1.6]} rotation={[0, 0, 0]} />
  ), []);

  const cLight = useMemo(() => (
    <pointLight
      intensity={15}
      position={[3, 1, 1.6]}
      color={new THREE.Color(0x223060)}
    />
  ), []);

  const links = useMemo(() => (
    <mesh className="LINKS" position={[0, 0, 2.3]}>
      <Bvh firstHitOnly>
        <Image link='https://drive.google.com/drive/folders/1TSSObTZ0PYL8OEWN4-ffV9e57B1nJurX?usp=sharing' scale={7} position={[-0.7, -0.06, 0]} rotation={[0, 0, 0]} />
        <Github link='https://github.com/hsunekichi/infGraf2' scale={12} position={[0, -0.07, 0]} rotation={[0, 0, 0]} />
        <Docs link='https://JuanLorenteGuarnieri.github.io/portfolio/msoa_report.pdf' scale={15} position={[0.7, -0.09, 0]} rotation={[0, 0, 0]} />
      </Bvh>
    </mesh>
  ), []);

  return (
    <mesh className="Modeling and Simulation of Appearance" position={pos} visible={isVisibleLight(new THREE.Vector3(0, 5, pos[2] + parentPos[2]), 8)}>
      {helmetMesh}
      {textLines}
      {cModel}
      {/* {cLight} */}
      {links}
    </mesh>
  );
}

export default MSOA;
