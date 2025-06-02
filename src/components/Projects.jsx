import { Bvh, Float, Plane, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import TextAdvance from './TextAdvance';
import fontTitle from '../assets/fonts/Encode_Sans_Semi_Expanded/Encode_Sans_Semi_Expanded_Bold.json';
import fontText from '../assets/fonts/Source_Code_Pro/static/Source_Code_Pro_Regular.json';
import { Doc } from '../../public/models/Doc';
import { Github } from '../../public/models/Github';
import { RusticSpaceShip } from '../../public/models/RusticSpaceShip';
import { Threejs } from '../../public/models/Threejs';
import { Reacts } from '../../public/models/React';
import { C } from '../../public/models/C';

function Projects({ isVisibleLight, pos }) {

  return (
    <mesh className="PROJECTS" position={pos}>
      <TextAdvance position={[0, 0, 0]}
        text={"PROJECTS"}
        font={fontTitle} size={0.3} height={0.1}
        colorPri={new THREE.Color(0xdddddd)} colorSec={new THREE.Color(0x333333)}
      />
      <pointLight intensity={100} position={[0, 2, 2.8]} distance={isVisibleLight(new THREE.Vector3(0, 5, pos[2] + 2.8), 8) ? 10 : 0.01}
        color={new THREE.Color(0x223060)} />
      <mesh className="RAY TRACER" position={[0, 0, 0]}>

        <mesh className="MODEL" position={[-3, 0.4, 2]} rotation={[-Math.PI / 6, Math.PI / 4, 0]}>
          <pointLight castShadow={true} distance={isVisibleLight(new THREE.Vector3(0, 5, pos[2] + 2), 8) ? 1.5 : 0.01} intensity={2} position={[0.1, 0.5, 0.3]} power={55} shadow-camera-near={0.05}
            shadow-bias={-0.005}
            onUpdate={light => {
              light.shadow.mapSize.width = 128
              light.shadow.mapSize.height = 128
              light.shadow.needsUpdate = true
            }}
            color={new THREE.Color(0x223060)} />
          <Bvh firstHitOnly >
            <Plane args={[1, 1, 1, 1]} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow={true}
              receiveShadow>
              <meshPhysicalMaterial color={new THREE.Color(0xffffff)} side={THREE.DoubleSide} castShadow={true}
              />
            </Plane>
            <Plane args={[1, 1, 1, 1]} position={[0, 1, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow={true}
              receiveShadow>
              <meshPhysicalMaterial color={new THREE.Color(0xffffff)} side={THREE.DoubleSide} castShadow={true} />
            </Plane>
            <Plane args={[1, 1, 1, 1]} position={[0, 0.5, -0.5]} rotation={[0, 0, 0]} castShadow={true}
              receiveShadow>
              <meshPhysicalMaterial color={new THREE.Color(0xffffff)} side={THREE.DoubleSide} castShadow={true}
              />
            </Plane>
            <Plane args={[1, 1, 1, 1]} position={[-0.5, 0.5, 0]} rotation={[0, Math.PI / 2, 0]} castShadow={true}
              receiveShadow>
              <meshPhysicalMaterial color={new THREE.Color(0xff0000)} side={THREE.DoubleSide} castShadow={true}
              />
            </Plane>
            <Plane args={[1, 1, 1, 1]} position={[0.5, 0.5, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow={true}
              receiveShadow>
              <meshPhysicalMaterial color={new THREE.Color(0x00ff00)} side={THREE.DoubleSide} castShadow={true}
              />
            </Plane>
            <Sphere args={[0.15]} position={[0.2, 0.15, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow={true}
              receiveShadow >
              <meshPhysicalMaterial
                color={new THREE.Color(0x444444)}
                roughness={0}
                metalness={0.1} side={THREE.DoubleSide}
              />
            </Sphere>
            <Sphere args={[0.15]} position={[-0.2, 0.15, -0.2]} rotation={[0, -Math.PI / 2, 0]} castShadow={true}
              receiveShadow >
              <meshPhysicalMaterial
                color={new THREE.Color(0x9db4ec)} side={THREE.DoubleSide}
              />
            </Sphere>
          </Bvh>
        </mesh>

        <TextAdvance position={[0, 0, 0.9]}
          text={"RAY TRACER"}
          font={fontText} size={0.2} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />
        <TextAdvance position={[0, 0, 0.9]}
          text={"__________"}
          font={fontText} size={0.2} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />
        <TextAdvance position={[0, 0, 0.9]}
          text={"_________"}
          font={fontText} size={0.2} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />

        <TextAdvance position={[0, 0, 1.5]}
          text={"Path tracer & Photon Mapping \nraytracer from zero"}
          font={fontText} size={0.16} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />

        <C scale={20} position={[3, -0.08, 1.6]} rotation={[0, 0, 0]} />
        <pointLight intensity={15} position={[3, 1, 1.6]} distance={isVisibleLight(new THREE.Vector3(0, 5, pos[2] + 1.6), 6) ? 2 : 0.01}
          color={new THREE.Color(0x223060)} />

        <mesh className="LINKS" position={[0, 0, 2.3]}>
          <Bvh firstHitOnly >
            <Doc link='https://github.com/JuanLorenteGuarnieri/RayTracer/blob/main/RayTracer.pdf' scale={12} position={[0.7, -0.08, 0]} rotation={[0, 0, 0]} />
            <Github link='https://github.com/JuanLorenteGuarnieri/RayTracer' scale={12} position={[0, -0.08, 0]} rotation={[0, 0, 0]} />
          </Bvh>
        </mesh>


      </mesh>
      <mesh className="VIDEOGAME" position={[0, 0, 2.7]}>

        <mesh className="MODEL" >
          <pointLight intensity={30} position={[-3.3, 1, 1.4]} distance={isVisibleLight(new THREE.Vector3(0, 5, 2.7 + pos[2] + 1.4), 7) ? 4 : 0.01}
            color={new THREE.Color(0x223060)} />
          <Bvh firstHitOnly >
            <Float
              speed={4} // Animation speed, defaults to 1
              rotationIntensity={0.3} // XYZ rotation intensity, defaults to 1
              floatIntensity={0.01} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
              floatingRange={[-0.2, 0.1]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
            >
              <RusticSpaceShip position={[-3.5, 0.45, 1.8]} />
            </Float>
          </Bvh>
        </mesh>

        <TextAdvance position={[0, 0, 0.9]}
          text={"SPACESHIP CONTROLLER"}
          font={fontText} size={0.2} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />
        <TextAdvance position={[0, 0, 0.9]}
          text={"____________________"}
          font={fontText} size={0.2} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />
        <TextAdvance position={[0, 0, 0.9]}
          text={"___________________"}
          font={fontText} size={0.2} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />

        <TextAdvance position={[0, 0, 1.5]}
          text={"Project to practice 3D camera\ntranslation and rotation"}
          font={fontText} size={0.16} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />

        <Threejs scale={20} position={[3, -0.08, 1.58]} rotation={[0, 0, 0]} />
        <pointLight intensity={15} position={[3, 1, 1.58]} distance={isVisibleLight(new THREE.Vector3(0, 5, 2.7 + pos[2] + 1.58), 6) ? 2 : 0.01}
          color={new THREE.Color(0x223060)} />

        <Reacts scale={20} position={[4, -0.08, 1.58]} rotation={[0, 0, 0]} />
        <pointLight intensity={15} position={[4, 1, 1.58]} distance={isVisibleLight(new THREE.Vector3(0, 5, 2.7 + pos[2] + 1.58), 6) ? 2 : 0.01}
          color={new THREE.Color(0x223060)} />

      </mesh>

    </mesh>
  );
}

export default Projects;
