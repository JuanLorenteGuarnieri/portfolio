import * as THREE from 'three';
import { useMemo } from 'react';
import TextAdvance from '../components/TextAdvance';
import fontText from '../assets/fonts/Source_Code_Pro/static/Source_Code_Pro_Regular.json';
import { Bvh } from '@react-three/drei';
import { Github } from '../../public/models/Github';
import { Python } from '../../public/models/Python';
import { Vlbi } from '../../public/models/Vlbi';

function ACI({ isVisibleLight, pos, parentPos }) {
  // Memoriza los textos y modelos que no dependen de props
  const titleText = useMemo(() => (
    <TextAdvance
      position={[0, 0, 0.9]}
      text={"ADVANCED CI"}
      font={fontText}
      size={0.2}
      height={0.08}
      colorPri={"white"}
      colorSec={new THREE.Color(0x223060)}
    />
  ), []);

  const underline1 = useMemo(() => (
    <TextAdvance
      position={[0, 0, 0.9]}
      text={"___________"}
      font={fontText}
      size={0.2}
      height={0.08}
      colorPri={"white"}
      colorSec={new THREE.Color(0x223060)}
    />
  ), []);

  const underline2 = useMemo(() => (
    <TextAdvance
      position={[0, 0, 0.9]}
      text={"__________"}
      font={fontText}
      size={0.2}
      height={0.08}
      colorPri={"white"}
      colorSec={new THREE.Color(0x223060)}
    />
  ), []);

  const subtitleText = useMemo(() => (
    <TextAdvance
      position={[0, 0, 1.5]}
      text={"Phasor-Field NLOS, Polarization\nbased and VLBI Imaging"}
      font={fontText}
      size={0.16}
      height={0.08}
      colorPri={"white"}
      colorSec={new THREE.Color(0x223060)}
    />
  ), []);

  const pythonIcon = useMemo(() => (
    <Python scale={18} position={[3, -0.02, 1.6]} rotation={[0, 0, 0]} />
  ), []);

  const githubLink = useMemo(() => (
    <Bvh firstHitOnly>
      <Github link='https://github.com/JuanLorenteGuarnieri/ACI' scale={12} position={[0, -0.08, 0]} rotation={[0, 0, 0]} />
    </Bvh>
  ), []);

  const vlbiModel = useMemo(() => (
    <Bvh firstHitOnly>
      <Vlbi position={[-2.9, 0.5, 1.7]} scale={0.1} rotation={[-Math.PI / 4, 1.8 * Math.PI, 0]} />
    </Bvh>
  ), []);

  const modelMesh = useMemo(() => (
    <mesh className="MODEL">
      <pointLight
        intensity={30}
        position={[-3.3, 1, 1.4]}
        color={new THREE.Color(0x223060)}
      />
      {vlbiModel}
    </mesh>
  ), [vlbiModel]);

  const pythonLight = useMemo(() => (
    <pointLight
      intensity={15}
      position={[3, 1, 1.6]}
      color={new THREE.Color(0x223060)}
    />
  ), []);

  const linksMesh = useMemo(() => (
    <mesh className="LINKS" position={[0, 0, 2.3]}>
      {githubLink}
    </mesh>
  ), [githubLink]);

  return (
    <mesh
      className="Advanced Computational Imaging"
      position={pos}
      visible={isVisibleLight(new THREE.Vector3(0, 5, pos[2] + parentPos[2]), 8)}
    >
      {/* {modelMesh} */}
      {titleText}
      {underline1}
      {underline2}
      {subtitleText}
      {pythonIcon}
      {pythonLight}
      {linksMesh}
    </mesh>
  );
}

export default ACI;
