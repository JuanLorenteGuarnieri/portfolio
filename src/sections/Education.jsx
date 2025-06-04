import { Bvh } from '@react-three/drei';
import * as THREE from 'three';
import TextAdvance from '../components/TextAdvance';
import fontTitle from '../assets/fonts/Encode_Sans_Semi_Expanded/Encode_Sans_Semi_Expanded_Bold.json';
import fontText from '../assets/fonts/Source_Code_Pro/static/Source_Code_Pro_Regular.json';
import { Unizar } from '../../public/models/Unizar';

function Education({ isVisibleLight, pos }) {
  const bachelorPos = [0, 0, 0.9];
  const masterPos = [0, 0, 2.7];

  return (
    <mesh className="EDUCATION" position={pos}>
      <TextAdvance position={[0, 0, 0]}
        text={"EDUCATION"}
        font={fontTitle} size={0.3} height={0.1}
        colorPri={new THREE.Color(0xdddddd)} colorSec={new THREE.Color(0x333333)}
      />

      <rectAreaLight intensity={15} position={[0, 2, 2.6]} rotation={[-Math.PI / 2, 0, 0]}
        visible={isVisibleLight(new THREE.Vector3(0, 5, pos[2] + 2), 8)}
        width={5} height={3} color={new THREE.Color(0x223060)} />

      <mesh className="BACHELOR" position={bachelorPos}>
        <Bvh firstHitOnly >
          <Unizar link='https://estudios.unizar.es/estudio/asignaturas?anyo_academico=2024&estudio_id=20240148&centro_id=110&plan_id_nk=439&sort=curso'
            scale={20} position={[-1.85, -0.09, 0.37]} rotation={[0, 0, 0]} />
        </Bvh>
        <TextAdvance position={[-0.8, 0, 0]} align="left"
          text={"Computer Science \nUniversity of Zaragoza"}
          font={fontText} size={0.16} height={0.05}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />
        <TextAdvance position={[-0.8, 0, 0.7]} align="left"
          text={"2020 - 2024"}
          font={fontText} size={0.16} height={0.05}
          colorPri={new THREE.Color(0xaaaaaa)} colorSec={new THREE.Color(0x223060)}
        />
      </mesh>
      <mesh className="MASTER" position={masterPos}>
        <Bvh firstHitOnly >
          <Unizar link='https://eina.unizar.es/mrgcv'
            scale={20} position={[-1.85, -0.09, 0.37]} rotation={[0, 0, 0]} />
        </Bvh>
        <TextAdvance position={[-0.8, 0, 0]} align="left"
          text={"Master in Robotics, Graphics\n& Computer Vision \nUniversity of Zaragoza"}
          font={fontText} size={0.16} height={0.05}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />
        <TextAdvance position={[-0.8, 0, 1.05]} align="left"
          text={"2024 - 2025"}
          font={fontText} size={0.16} height={0.05}
          colorPri={new THREE.Color(0xaaaaaa)} colorSec={new THREE.Color(0x223060)}
        />
      </mesh>
    </mesh>
  );
}

export default Education;
