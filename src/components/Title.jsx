import { useRef } from 'react';
import { LogoGema } from '../../public/models/LogoGema';
import { Logo } from '../../public/models/Logo';
import { Bvh, Float } from '@react-three/drei';
import * as THREE from 'three';
import TextAdvance from './TextAdvance';
import { Linkedin } from '../../public/models/Linkedin';
import { Github } from '../../public/models/Github';
import { CV } from '../../public/models/Cv';
import fontTitle from '../assets/fonts/Encode_Sans_Semi_Expanded/Encode_Sans_Semi_Expanded_Bold.json';
import fontText from '../assets/fonts/Source_Code_Pro/static/Source_Code_Pro_Regular.json';

function Title({ isVisibleLight, pos }) {
  return (
    <mesh className="TITLE" position={pos}>

      <mesh className="LOGO" position={[0, 0, 0.5]}>
        <pointLight intensity={200} position={[0, 1, 0.5]} distance={isVisibleLight(new THREE.Vector3(0, 5, pos[2] + 0.5), 8) ? 7 : 0.01} shadow-bias={-0.005}
          color={new THREE.Color(0x223060)} />
        <pointLight intensity={200} position={[0, 1, 0]} distance={isVisibleLight(new THREE.Vector3(0, 5, pos[2] + 0.5), 8) ? 7 : 0.01} shadow-bias={-0.005}
          color={new THREE.Color(0x223060)} />
        <mesh position={[0, 0.2, 1]} scale={0.65} rotation={[-Math.PI / 3, 0, 0]}>
          <Bvh firstHitOnly >
            <Logo scale={[1, 1., 0.5]} />
            <Float
              speed={6} // Animation speed, defaults to 1
              rotationIntensity={0.3} // XYZ rotation intensity, defaults to 1
              floatIntensity={0.01} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
              floatingRange={[-0.2, 0.1]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
            >
              <LogoGema />
            </Float>
          </Bvh>
        </mesh>
      </mesh>

      <TextAdvance position={[0, 0, 2.4]}
        text={"Juan Lorente"}
        font={fontTitle} size={0.73} height={0.1} align='center'
        colorPri={new THREE.Color(0xdddddd)} colorSec={new THREE.Color(0x333333)}
      />
      <TextAdvance position={[0, 0, 2.8]}
        text={"Computer Vision & Graphics developer"}
        font={fontText} size={0.16} height={0.08} align='center'
        colorPri={"white"} colorSec={new THREE.Color(0x223060)}
      />

      <mesh className="LINKS" position={[0, 0, 3.15]} scale={1} rotation={[0, 0, 0]}>
        <Bvh firstHitOnly >
          <Linkedin scale={12} position={[0.7, -0.08, 0]} rotation={[0, 0, 0]} />
          <Github scale={12} position={[0, -0.08, 0]} rotation={[0, 0, 0]} />
          <CV scale={12} position={[-0.7, -0.08, 0]} rotation={[0, 0, 0]} />
        </Bvh>
      </mesh>
    </mesh>
  );
}

export default Title;
