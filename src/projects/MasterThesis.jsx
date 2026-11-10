import * as THREE from 'three';
import TextAdvance from '../components/TextAdvance';
import fontText from '../assets/fonts/Source_Code_Pro/static/Source_Code_Pro_Regular.json';
import { Bvh, Sphere } from '@react-three/drei';
import { Github } from '../models/Github';
import { Pytorch } from '../models/Pytorch';
import { Python } from '../models/Python';
import { SurfacePoint } from '../models/SurfacePoint';
import { useMemo, useEffect, useState } from 'react';
import { Doc } from '../models/Doc';
import { Docs } from '../models/Docs';
import { Slides } from '../models/Slides';

function Bachelor({ isVisibleLight, pos, parentPos }) {
  const [scanpathTexture, setScanpathTexture] = useState(null);

  useEffect(() => {
    const video = document.createElement('video');
    video.src = 'https://JuanLorenteGuarnieri.github.io/portfolio/scanpath.mp4';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';
    video.preload = 'auto';
    video.style.display = 'none';
    document.body.appendChild(video);

    const texture = new THREE.VideoTexture(video);
    texture.format = THREE.RGBAFormat;
    texture.encoding = THREE.sRGBEncoding;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    setScanpathTexture(texture);

    video.play().catch(() => {
      // autoplay may be blocked until user interaction
    });

    return () => {
      if (texture) {
        texture.dispose();
      }
      video.pause();
      video.src = '';
      document.body.removeChild(video);
    };
  }, []);

  const titleTexts = useMemo(() => (
    <>
      <TextAdvance position={[0, 0, 0.9]}
        text={"MASTER THESIS"}
        font={fontText} size={0.2} height={0.08}
        colorPri={"white"} colorSec={new THREE.Color(0x223060)}
      />
      <TextAdvance position={[0, 0, 0.9]}
        text={"_____________"}
        font={fontText} size={0.2} height={0.08}
        colorPri={"white"} colorSec={new THREE.Color(0x223060)}
      />
      <TextAdvance position={[0, 0, 0.9]}
        text={"____________"}
        font={fontText} size={0.2} height={0.08}
        colorPri={"white"} colorSec={new THREE.Color(0x223060)}
      />
    </>
  ), []);

  const subtitleText = useMemo(() => (
    <TextAdvance position={[0, 0, 1.5]}
      text={"Deep spatio-temporal scanpath\nprediction model for 360º video"}
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
    (!/Mobi|Android/i.test(navigator.userAgent) && scanpathTexture ? (
      <Bvh firstHitOnly>
        <Sphere position={[-2.8, 0.4, 1.5]} scale={0.4} rotation={[Math.PI / 2, -Math.PI / 3.9, Math.PI]} castShadow={true}>
          <meshPhysicalMaterial
            color={new THREE.Color(0xffffff)}
            side={THREE.DoubleSide}
            emissive={new THREE.Color(0xffffff)}
            map={scanpathTexture}
            emissiveMap={scanpathTexture}
            emissiveIntensity={0.0}
          />
        </Sphere>
        {/* <SurfacePoint position={[-2.8, 0.4, 1.5]} distance={0.4} centerLatLon={[60.0, 60.0]}
          sphereRadius={0.05} sphereColor={'red'} rotation={[-Math.PI / 2, Math.PI / 1.5, Math.PI]} /> */}
      </Bvh>) : null)
  ), [scanpathTexture]);

  const linksMesh = useMemo(() => (
    <mesh className="LINKS" position={[0, 0, 2.3]}>
      <Bvh firstHitOnly>
        <Docs link='https://JuanLorenteGuarnieri.github.io/portfolio/master_thesis.pdf' scale={15} position={[0.7, -0.09, 0]} rotation={[0, 0, 0]} />
        <Github link='https://github.com/JuanLorenteGuarnieri/A-Deep-Spatio-Temporal-Scanpath-Prediction-Model-in-360-Videos' scale={12} position={[0, -0.07, 0]} rotation={[0, 0, 0]} />
        <Slides link='https://docs.google.com/presentation/d/1eJqQhF6z1w68bB88BV_DFzTuK6wjIvRUCbAs6WZeQmM/edit?usp=sharing' scale={15} position={[-0.7, -0.09, 0]} rotation={[0, 0, 0]} />
      </Bvh>
    </mesh>
  ), []);

  return (
    <mesh className="Bachelor project" position={pos} visible={isVisibleLight(new THREE.Vector3(0, 5, pos[2] + parentPos[2]), 8)}>
      <mesh className="MODEL">
        {/* {leftLight} */}
        {sphereModel}
      </mesh>
      {titleTexts}
      {subtitleText}
      {pythonIcon}
      {/* {pythonLight} */}
      {pytorchIcon}
      {/* {pytorchLight} */}
      {linksMesh}
    </mesh>
  );
}

export default Bachelor;

