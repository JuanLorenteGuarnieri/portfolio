import * as THREE from 'three';
import { TextureLoader } from 'three';
import TextAdvance from '../components/TextAdvance';
import fontText from '../assets/fonts/Source_Code_Pro/static/Source_Code_Pro_Regular.json';
import { Bvh, Sphere } from '@react-three/drei';
import { Github } from '../../public/models/Github';
import { Pytorch } from '../../public/models/Pytorch';
import { Python } from '../../public/models/Python';
import { SurfacePoint } from '../../public/models/SurfacePoint';
import { useLoader } from '@react-three/fiber';
import { useMemo } from 'react';

function Bachelor({ isVisibleLight, pos, parentPos }) {
  const scanpathTexture = useLoader(TextureLoader, 'https://JuanLorenteGuarnieri.github.io/portfolio/scanpath.png');

  const titleTexts = useMemo(() => (
    <>
      <TextAdvance position={[0, 0, 0.9]}
        text={"BACHELOR THESIS"}
        font={fontText} size={0.2} height={0.08}
        colorPri={"white"} colorSec={new THREE.Color(0x223060)}
      />
      <TextAdvance position={[0, 0, 0.9]}
        text={"_______________"}
        font={fontText} size={0.2} height={0.08}
        colorPri={"white"} colorSec={new THREE.Color(0x223060)}
      />
      <TextAdvance position={[0, 0, 0.9]}
        text={"______________"}
        font={fontText} size={0.2} height={0.08}
        colorPri={"white"} colorSec={new THREE.Color(0x223060)}
      />
    </>
  ), []);

  const subtitleText = useMemo(() => (
    <TextAdvance position={[0, 0, 1.5]}
      text={"Scanpath prediction methods\nfor 360º video"}
      font={fontText} size={0.16} height={0.08}
      colorPri={"white"} colorSec={new THREE.Color(0x223060)}
    />
  ), []);

  const pythonIcon = useMemo(() => (
    <Python scale={18} position={[3, -0.02, 1.6]} rotation={[0, 0, 0]} />
  ), []);

  const pytorchIcon = useMemo(() => (
    <Pytorch scale={20} position={[4, -0.0, 1.58]} rotation={[0, 0, 0]} />
  ), []);

  const githubLink = useMemo(() => (
    <Github link='https://github.com/JuanLorenteGuarnieri/scanpaths-for-360-video' scale={12} position={[0, -0.08, 0]} rotation={[0, 0, 0]} />
  ), []);

  const pythonLight = useMemo(() => (
    <pointLight intensity={15} position={[3, 1, 1.6]} color={new THREE.Color(0x223060)} />
  ), []);

  const pytorchLight = useMemo(() => (
    <pointLight intensity={15} position={[4, 1, 1.58]} color={new THREE.Color(0x223060)} />
  ), []);

  const leftLight = useMemo(() => (
    <pointLight intensity={30} position={[-3.3, 1, 1.4]} color={new THREE.Color(0x223060)} />
  ), []);

  const sphereModel = useMemo(() => (
    <Bvh firstHitOnly>
      <Sphere position={[-2.8, 0.4, 1.5]} scale={0.4} rotation={[Math.PI / 2, -Math.PI / 1.5, Math.PI]} castShadow={true}>
        <meshPhysicalMaterial
          color={new THREE.Color(0xffffff)}
          side={THREE.DoubleSide}
          emissive={new THREE.Color(0xffffff)}
          map={scanpathTexture}
          emissiveMap={scanpathTexture}
          emissiveIntensity={0.6}
        />
      </Sphere>
      <SurfacePoint position={[-2.8, 0.4, 1.5]} distance={0.4} centerLatLon={[60.0, 60.0]}
        sphereRadius={0.05} sphereColor={'red'} rotation={[-Math.PI / 2, Math.PI / 1.5, Math.PI]} />
    </Bvh>
  ), [scanpathTexture]);

  const linksMesh = useMemo(() => (
    <mesh className="LINKS" position={[0, 0, 2.3]}>
      <Bvh firstHitOnly>
        {githubLink}
      </Bvh>
    </mesh>
  ), [githubLink]);

  return (
    <mesh className="Bachelor project" position={pos} visible={isVisibleLight(new THREE.Vector3(0, 5, pos[2] + parentPos[2]), 8)}>
      <mesh className="MODEL">
        {leftLight}
        {/* {sphereModel} */}
      </mesh>
      {titleTexts}
      {subtitleText}
      {pythonIcon}
      {pythonLight}
      {pytorchIcon}
      {pytorchLight}
      {linksMesh}
    </mesh>
  );
}

export default Bachelor;
