import * as THREE from 'three';
import { TextureLoader } from 'three';
import TextAdvance from '../components/TextAdvance';
import fontText from '../assets/fonts/Source_Code_Pro/static/Source_Code_Pro_Regular.json';
import { Bvh, Plane } from '@react-three/drei';
import { Github } from '../../public/models/Github';
import { Opencv } from '../../public/models/Opencv';
import { Python } from '../../public/models/Python';
import { useLoader } from '@react-three/fiber';
import { useMemo } from 'react';

function Panorama({ isVisibleLight, pos, parentPos }) {
  const panoramaTexture = useLoader(TextureLoader, 'https://JuanLorenteGuarnieri.github.io/portfolio/panorama.png');

  // Memoriza los componentes que no dependen de props dinámicas
  const titleTexts = useMemo(() => (
    <>
      <TextAdvance position={[0, 0, 0.9]}
        text={"PANORAMAS"}
        font={fontText} size={0.2} height={0.08}
        colorPri={"white"} colorSec={new THREE.Color(0x223060)}
      />
      <TextAdvance position={[0, 0, 0.9]}
        text={"_________"}
        font={fontText} size={0.2} height={0.08}
        colorPri={"white"} colorSec={new THREE.Color(0x223060)}
      />
      <TextAdvance position={[0, 0, 0.9]}
        text={"________"}
        font={fontText} size={0.2} height={0.08}
        colorPri={"white"} colorSec={new THREE.Color(0x223060)}
      />
    </>
  ), []);

  const descriptionText = useMemo(() => (
    <TextAdvance position={[0, 0, 1.5]}
      text={"Panorama using camera pose \nestimation with OpenCV"}
      font={fontText} size={0.16} height={0.08}
      colorPri={"white"} colorSec={new THREE.Color(0x223060)}
    />
  ), []);

  const pythonIcon = useMemo(() => (
    <Python scale={18} position={[3, -0.02, 1.6]} rotation={[0, 0, 0]} />
  ), []);

  const opencvIcon = useMemo(() => (
    <Opencv scale={20} position={[4, -0.02, 1.58]} rotation={[0, 0, 0]} />
  ), []);

  const githubLink = useMemo(() => (
    <Bvh firstHitOnly>
      <Github link='https://github.com/JuanLorenteGuarnieri/practicas-vision-por-computador' scale={12} position={[0, -0.08, 0]} rotation={[0, 0, 0]} />
    </Bvh>
  ), []);

  const planeComponent = useMemo(() => (
    <Bvh firstHitOnly >
      <Plane args={[0.664, 0.412, 1, 1]} position={[-3.0, 0.08, 1.6]} rotation={[-Math.PI / 2, 0, 0]} scale={2.3}
        receiveShadow={true} castShadow={true}>
        <meshPhysicalMaterial
          color={new THREE.Color(0xffffff)}
          side={THREE.DoubleSide}
          alphaTest={0.5}
          map={panoramaTexture}
        />
      </Plane>
    </Bvh>
  ), [panoramaTexture]);

  const pythonLight = useMemo(() => (
    <pointLight intensity={15} position={[3, 1, 1.6]}
      color={new THREE.Color(0x223060)} />
  ), []);

  const opencvLight = useMemo(() => (
    <pointLight intensity={15} position={[4, 1, 1.58]}
      color={new THREE.Color(0x223060)} />
  ), []);

  const mainLight = useMemo(() => (
    <pointLight intensity={30} position={[-3.3, 1, 1.4]}
      color={new THREE.Color(0x223060)} />
  ), []);

  return (
    <mesh className="Panoramas" position={pos} visible={isVisibleLight(new THREE.Vector3(0, 5, pos[2] + parentPos[2]), 8)}>
      <mesh className="MODEL" >
        {mainLight}
        {/* {planeComponent} */}
      </mesh>

      {titleTexts}
      {descriptionText}

      {pythonIcon}
      {pythonLight}

      {opencvIcon}
      {opencvLight}

      <mesh className="LINKS" position={[0, 0, 2.3]}>
        {githubLink}
      </mesh>
    </mesh>
  );
}

export default Panorama;
