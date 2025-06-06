import * as THREE from 'three';
import { useMemo } from 'react';
import TextAdvance from '../components/TextAdvance';
import fontText from '../assets/fonts/Source_Code_Pro/static/Source_Code_Pro_Regular.json';
import { Bvh } from '@react-three/drei';
import { Github } from '../../public/models/Github';
import { Python } from '../../public/models/Python';
import { Pilar } from '../../public/models/Pilar';

function CV({ isVisibleLight, pos, parentPos }) {
  // Memoized components
  const titleText = useMemo(() => (
    <TextAdvance
      position={[0, 0, 0.9]}
      text={"STRUCTURE FROM MOTION"}
      font={fontText} size={0.2} height={0.08}
      colorPri={"white"} colorSec={new THREE.Color(0x223060)}
    />
  ), []);

  const line1 = useMemo(() => (
    <TextAdvance
      position={[0, 0, 0.9]}
      text={"_____________________"}
      font={fontText} size={0.2} height={0.08}
      colorPri={"white"} colorSec={new THREE.Color(0x223060)}
    />
  ), []);

  const line2 = useMemo(() => (
    <TextAdvance
      position={[0, 0, 0.9]}
      text={"____________________"}
      font={fontText} size={0.2} height={0.08}
      colorPri={"white"} colorSec={new THREE.Color(0x223060)}
    />
  ), []);

  const subtitleText = useMemo(() => (
    <TextAdvance
      position={[0, 0, 1.5]}
      text={"Visual Place Recognition\nand Localisation"}
      font={fontText} size={0.16} height={0.08}
      colorPri={"white"} colorSec={new THREE.Color(0x223060)}
    />
  ), []);

  const pythonModel = useMemo(() => (
    <Python scale={18} position={[3, -0.02, 1.6]} rotation={[0, 0, 0]} />
  ), []);

  const githubLink = useMemo(() => (
    <Bvh firstHitOnly>
      <Github link='https://github.com/JuanLorenteGuarnieri/CV_Course_assigment' scale={12} position={[0, -0.08, 0]} rotation={[0, 0, 0]} />
    </Bvh>
  ), []);

  const pilarModel = useMemo(() => (
    <Bvh firstHitOnly>
      <Pilar position={[-3.5, 0.2, 1.5]} scale={0.2} rotation={[2.3 * Math.PI / 4, -0.3 * Math.PI / 4, -0.5 * Math.PI / 4]} />
    </Bvh>
  ), []);

  // Memoized lights
  const pilarLight = useMemo(() => (
    <pointLight intensity={30} position={[-3.3, 1, 1.4]} color={new THREE.Color(0x223060)} />
  ), []);

  const pythonLight = useMemo(() => (
    <pointLight intensity={15} position={[3, 1, 1.6]} color={new THREE.Color(0x223060)} />
  ), []);

  // Memoized mesh for LINKS
  const linksMesh = useMemo(() => (
    <mesh className="LINKS" position={[0, 0, 2.3]}>
      {githubLink}
    </mesh>
  ), [githubLink]);

  // Memoized MODEL mesh
  const modelMesh = useMemo(() => (
    <mesh className="MODEL">
      {pilarLight}
      {pilarModel}
    </mesh>
  ), [pilarLight, pilarModel]);

  return (
    <mesh
      className="CV Final Project"
      position={pos}
      visible={isVisibleLight(new THREE.Vector3(0, 5, pos[2] + parentPos[2]), 8)}
    >
      {/* {modelMesh} */}
      {titleText}
      {line1}
      {line2}
      {subtitleText}
      {pythonModel}
      {pythonLight}
      {linksMesh}
    </mesh>
  );
}

export default CV;
