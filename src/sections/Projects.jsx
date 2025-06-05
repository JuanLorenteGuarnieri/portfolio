import { Bvh, Float, Plane, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import TextAdvance from '../components/TextAdvance';
import fontTitle from '../assets/fonts/Encode_Sans_Semi_Expanded/Encode_Sans_Semi_Expanded_Bold.json';
import fontText from '../assets/fonts/Source_Code_Pro/static/Source_Code_Pro_Regular.json';
import { Doc } from '../../public/models/Doc';
import { Github } from '../../public/models/Github';
import { RusticSpaceShip } from '../../public/models/RusticSpaceShip';
import { Threejs } from '../../public/models/Threejs';
import { Reacts } from '../../public/models/React';
import { C } from '../../public/models/C';
import { Python } from '../../public/models/Python';
import { Robot } from '../../public/models/Robot';

import {
  computeBoundsTree,
  disposeBoundsTree,
  acceleratedRaycast,
} from 'three-mesh-bvh'
import { useEffect, useRef } from 'react';
import { Lemming } from '../../public/models/Lemming';
import { Opencv } from '../../public/models/Opencv';
import { Pytorch } from '../../public/models/Pytorch';
import { Play } from '../../public/models/Play';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Pilar } from '../../public/models/Pilar';
import { SurfacePoint } from '../../public/models/SurfacePoint';


THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree
THREE.Mesh.prototype.raycast = acceleratedRaycast

function Projects({ isVisibleLight, pos }) {
  const projectRef = useRef();


  const margin = 2.4; // Margin between projects

  // PROJECTS POSITIONS
  const raytracesPos = [0, 0, margin * 0];
  const webgamePos = [0, 0, margin * 1];
  const lemmingsPos = [0, 0, margin * 2];
  const roboticsPos = [0, 0, margin * 3];
  const panoramasPos = [0, 0, margin * 4];
  const bachelorPos = [0, 0, margin * 5];
  const cvFinalPos = [0, 0, margin * 6];
  const modelingPos = [0, 0, margin * 7];
  const ciPos = [0, 0, margin * 8];
  const aciPos = [0, 0, margin * 9];
  const slamPos = [0, 0, margin * 10];


  const panoramaTexture = useLoader(TextureLoader, 'https://JuanLorenteGuarnieri.github.io/portfolio/panorama.png');
  const scanpathTexture = useLoader(TextureLoader, 'https://JuanLorenteGuarnieri.github.io/portfolio/scanpath.png');

  // useEffect(() => {
  //   const mesh = projectRef.current
  //   if (mesh) {
  //     // Once the text mesh is mounted, its geometry (TextGeometry) is available.
  //     // Call computeBoundsTree() to build the BVH structure on the geometry.
  //     mesh.geometry.computeBoundsTree()

  //     // Optionally, if you ever need to dispose or rebuild:
  //     // mesh.geometry.disposeBoundsTree()
  //     // mesh.geometry.computeBoundsTree()
  //   }
  // }, [])

  return (
    <mesh className="PROJECTS" position={pos} ref={projectRef}>
      <TextAdvance position={[0, 0, 0]}
        text={"PROJECTS"}
        font={fontTitle} size={0.3} height={0.1}
        colorPri={new THREE.Color(0xdddddd)} colorSec={new THREE.Color(0x333333)}
      />


      <rectAreaLight intensity={13} position={[0, 2, 13.5]} rotation={[-Math.PI / 2, 0, 0]}
        visible={isVisibleLight(new THREE.Vector3(0, 5, pos[2] + 2), 30)}
        width={3.} height={26} color={new THREE.Color(0x223060)} />
      {/* <pointLight intensity={100} position={[0, 2, 2.8]} distance={isVisibleLight(new THREE.Vector3(0, 5, pos[2] + 2.8), 8) ? 10 : 0.01}
        color={new THREE.Color(0x223060)} /> */}
      <mesh className="RAY TRACER" position={raytracesPos}>

        <mesh className="MODEL" position={[-3, 0.36, 2]} rotation={[-Math.PI / 6, Math.PI / 4, 0]}>
          <pointLight castShadow={true} distance={isVisibleLight(new THREE.Vector3(0, 5, raytracesPos[2] + pos[2] + 2), 8) ? 1.5 : 0.01} intensity={5} position={[0.1, 0.5, 0.3]} power={55} shadow-camera-near={0.05}
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
        <pointLight intensity={15} position={[3, 1, 1.6]} distance={isVisibleLight(new THREE.Vector3(0, 5, raytracesPos[2] + pos[2] + 1.6), 6) ? 2 : 0.01}
          color={new THREE.Color(0x223060)} />

        <mesh className="LINKS" position={[0, 0, 2.3]}>
          <Bvh firstHitOnly >
            <Doc link='https://github.com/JuanLorenteGuarnieri/RayTracer/blob/main/RayTracer.pdf' scale={12} position={[0.7, -0.08, 0]} rotation={[0, 0, 0]} />
            <Github link='https://github.com/JuanLorenteGuarnieri/RayTracer' scale={12} position={[0, -0.08, 0]} rotation={[0, 0, 0]} />
          </Bvh>
        </mesh>


      </mesh>
      <mesh className="WEBGAME" position={webgamePos}>

        <mesh className="MODEL" >
          <pointLight intensity={30} position={[-3.3, 1, 1.4]} distance={isVisibleLight(new THREE.Vector3(0, 5, webgamePos[2] + pos[2] + 1.4), 7) ? 4 : 0.01}
            color={new THREE.Color(0x223060)} />
          <Bvh firstHitOnly >
            <Float
              speed={4} // Animation speed, defaults to 1
              rotationIntensity={0.3} // XYZ rotation intensity, defaults to 1
              floatIntensity={0.01} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
              floatingRange={[-0.2, 0.1]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
            >
              <RusticSpaceShip position={[-3.5, 0.2, 1.8]} />
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
        <pointLight intensity={15} position={[3, 1, 1.58]} distance={isVisibleLight(new THREE.Vector3(0, 5, webgamePos[2] + pos[2] + 1.58), 6) ? 2 : 0.01}
          color={new THREE.Color(0x223060)} />

        <Reacts scale={20} position={[4, -0.08, 1.58]} rotation={[0, 0, 0]} />
        <pointLight intensity={15} position={[4, 1, 1.58]} distance={isVisibleLight(new THREE.Vector3(0, 5, webgamePos[2] + pos[2] + 1.58), 6) ? 2 : 0.01}
          color={new THREE.Color(0x223060)} />

        <mesh className="LINKS" position={[0, 0, 2.3]}>
          <Bvh firstHitOnly >
            <Play link='https://juanlorenteguarnieri.github.io/Spaceship-Controller/' scale={12} position={[-0.7, -0.08, 0]} rotation={[0, 0, 0]} />
            <Github link='https://github.com/JuanLorenteGuarnieri/Spaceship-Controller' scale={12} position={[0, -0.08, 0]} rotation={[0, 0, 0]} />
          </Bvh>
        </mesh>
      </mesh>
      <mesh className="LEMMINGS CLONE" position={lemmingsPos}>


        <mesh className="MODEL" >
          <pointLight intensity={30} position={[-3.3, 1, 1.4]} distance={isVisibleLight(new THREE.Vector3(0, 5, lemmingsPos[2] + pos[2] + 1.4), 7) ? 4 : 0.01}
            color={new THREE.Color(0x223060)} />
          <Bvh firstHitOnly >
            <Lemming position={[-3.9, 0.0, 2.2]} scale={0.08} />
          </Bvh>
        </mesh>

        <TextAdvance position={[0, 0, 0.9]}
          text={"LEMMINGS CLONE"}
          font={fontText} size={0.2} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />
        <TextAdvance position={[0, 0, 0.9]}
          text={"______________"}
          font={fontText} size={0.2} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />
        <TextAdvance position={[0, 0, 0.9]}
          text={"_____________"}
          font={fontText} size={0.2} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />

        <TextAdvance position={[0, 0, 1.5]}
          text={"Pixel to pixel destruction and \n2D physics in real time"}
          font={fontText} size={0.16} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />

        <C scale={20} position={[3, -0.08, 1.6]} rotation={[0, 0, 0]} />
        <pointLight intensity={15} position={[3, 1, 1.6]} distance={isVisibleLight(new THREE.Vector3(0, 5, lemmingsPos[2] + pos[2] + 1.6), 6) ? 2 : 0.01}
          color={new THREE.Color(0x223060)} />

        <mesh className="LINKS" position={[0, 0, 2.3]}>
          <Bvh firstHitOnly >
            {/* <Windows link='https://juanlorenteguarnieri.github.io/Spaceship-Controller/' scale={12} position={[-0.7, -0.08, 0]} rotation={[0, 0, 0]} /> */}
            <Github link='https://github.com/fernando-lahoz/videojuegos-lemmings' scale={12} position={[0, -0.08, 0]} rotation={[0, 0, 0]} />
          </Bvh>
        </mesh>
      </mesh>

      <mesh className="Robotics" position={roboticsPos}>


        <mesh className="MODEL" >
          <pointLight intensity={30} position={[-3.3, 1, 1.4]} distance={isVisibleLight(new THREE.Vector3(0, 5, roboticsPos[2] + pos[2] + 1.4), 7) ? 4 : 0.01}
            color={new THREE.Color(0x223060)} />
          <Bvh firstHitOnly >
            <Robot position={[-3.1, -0.05, 1.6]} rotation={[0, Math.PI / 4, 0]} scale={0.005} />
          </Bvh>
        </mesh>

        <TextAdvance position={[0, 0, 0.9]}
          text={"ROBOTICS"}
          font={fontText} size={0.2} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />
        <TextAdvance position={[0, 0, 0.9]}
          text={"________"}
          font={fontText} size={0.2} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />
        <TextAdvance position={[0, 0, 0.9]}
          text={"_______"}
          font={fontText} size={0.2} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />

        <TextAdvance position={[0, 0, 1.5]}
          text={"Robot escape a labyrinth using\ncomputer vision and pathfinding"}
          font={fontText} size={0.16} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />

        <Python scale={18} position={[3, -0.02, 1.6]} rotation={[0, 0, 0]} />
        <pointLight intensity={15} position={[3, 1, 1.6]} distance={isVisibleLight(new THREE.Vector3(0, 5, roboticsPos[2] + pos[2] + 1.6), 6) ? 2 : 0.01}
          color={new THREE.Color(0x223060)} />

        <TextAdvance position={[4, 0, 1.6]}
          text={"BrickPi3"}
          font={fontText} size={0.11} height={0.09}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />
        <pointLight intensity={15} position={[4, 1, 1.6]} distance={isVisibleLight(new THREE.Vector3(0, 5, roboticsPos[2] + pos[2] + 1.6), 6) ? 2 : 0.01}
          color={new THREE.Color(0x223060)} />

        <mesh className="LINKS" position={[0, 0, 2.3]}>
          <Bvh firstHitOnly >
            {/* <Doc link='https://juanlorenteguarnieri.github.io/Spaceship-Controller/' scale={12} position={[0.7, -0.08, 0]} rotation={[0, 0, 0]} /> */}
            <Github link='https://github.com/hsunekichi/Robotica' scale={12} position={[0, -0.08, 0]} rotation={[0, 0, 0]} />
          </Bvh>
        </mesh>
      </mesh>

      <mesh className="Panoramas" position={panoramasPos}>
        <mesh className="MODEL" >
          <pointLight intensity={30} position={[-3.3, 1, 1.4]} distance={isVisibleLight(new THREE.Vector3(0, 5, panoramasPos[2] + pos[2] + 1.4), 7) ? 4 : 0.01}
            color={new THREE.Color(0x223060)} />

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
        </mesh>

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

        <TextAdvance position={[0, 0, 1.5]}
          text={"Panorama using camera pose \nestimation with OpenCV"}
          font={fontText} size={0.16} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />

        <Python scale={18} position={[3, -0.02, 1.6]} rotation={[0, 0, 0]} />
        <pointLight intensity={15} position={[3, 1, 1.6]} distance={isVisibleLight(new THREE.Vector3(0, 5, panoramasPos[2] + pos[2] + 1.6), 6) ? 2 : 0.01}
          color={new THREE.Color(0x223060)} />

        <Opencv scale={20} position={[4, -0.02, 1.58]} rotation={[0, 0, 0]} />
        <pointLight intensity={15} position={[4, 1, 1.58]} distance={isVisibleLight(new THREE.Vector3(0, 5, panoramasPos[2] + pos[2] + 1.58), 6) ? 2 : 0.01}
          color={new THREE.Color(0x223060)} />

        <mesh className="LINKS" position={[0, 0, 2.3]}>
          <Bvh firstHitOnly >
            {/* <Doc link='https://juanlorenteguarnieri.github.io/Spaceship-Controller/' scale={12} position={[0.7, -0.08, 0]} rotation={[0, 0, 0]} /> */}
            <Github link='https://github.com/JuanLorenteGuarnieri/practicas-vision-por-computador' scale={12} position={[0, -0.08, 0]} rotation={[0, 0, 0]} />
          </Bvh>
        </mesh>
      </mesh>

      <mesh className="Bachelor project" position={bachelorPos}>

        <mesh className="MODEL" >
          <pointLight intensity={30} position={[-3.3, 1, 1.4]} distance={isVisibleLight(new THREE.Vector3(0, 5, bachelorPos[2] + pos[2] + 1.4), 7) ? 4 : 0.01}
            color={new THREE.Color(0x223060)} />
          <Bvh firstHitOnly >
            <Sphere position={[-2.8, 0.4, 1.5]} scale={0.4} rotation={[Math.PI / 2, -Math.PI / 1.5, Math.PI]} castShadow={true}>
              <meshPhysicalMaterial
                color={new THREE.Color(0xffffff)}
                side={THREE.DoubleSide}
                map={scanpathTexture}
              />
            </Sphere>
            <SurfacePoint position={[-2.8, 0.4, 1.5]} distance={0.4} centerLatLon={[60.0, 60.0]}
              sphereRadius={0.05} sphereColor={'red'} rotation={[-Math.PI / 2, Math.PI / 1.5, Math.PI]} />
          </Bvh>
        </mesh>

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

        <TextAdvance position={[0, 0, 1.5]}
          text={"Scanpath prediction methods\nfor 360º video"}
          font={fontText} size={0.16} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />

        <Python scale={18} position={[3, -0.02, 1.6]} rotation={[0, 0, 0]} />
        <pointLight intensity={15} position={[3, 1, 1.6]} distance={isVisibleLight(new THREE.Vector3(0, 5, bachelorPos[2] + pos[2] + 1.6), 6) ? 2 : 0.01}
          color={new THREE.Color(0x223060)} />

        <Pytorch scale={20} position={[4, -0.0, 1.58]} rotation={[0, 0, 0]} />
        <pointLight intensity={15} position={[4, 1, 1.58]} distance={isVisibleLight(new THREE.Vector3(0, 5, bachelorPos[2] + pos[2] + 1.58), 6) ? 2 : 0.01}
          color={new THREE.Color(0x223060)} />

        <mesh className="LINKS" position={[0, 0, 2.3]}>
          <Bvh firstHitOnly >
            {/* <Doc link='https://juanlorenteguarnieri.github.io/Spaceship-Controller/' scale={12} position={[0.7, -0.08, 0]} rotation={[0, 0, 0]} /> */}
            <Github link='https://github.com/JuanLorenteGuarnieri/scanpaths-for-360-video' scale={12} position={[0, -0.08, 0]} rotation={[0, 0, 0]} />
          </Bvh>
        </mesh>
      </mesh>

      <mesh className="CV Final Project" position={cvFinalPos}>

        <mesh className="MODEL" >
          <pointLight intensity={30} position={[-3.3, 1, 1.4]} distance={isVisibleLight(new THREE.Vector3(0, 5, cvFinalPos[2] + pos[2] + 1.4), 7) ? 4 : 0.01}
            color={new THREE.Color(0x223060)} />
          <Bvh firstHitOnly >
            <Pilar position={[-3.5, 0.2, 1.8]} scale={0.2} rotation={[2.3 * Math.PI / 4, -0.3 * Math.PI / 4, -0.5 * Math.PI / 4]} />
          </Bvh>
        </mesh>

        <TextAdvance position={[0, 0, 0.9]}
          text={"STRUCTURE FROM MOTION"}
          font={fontText} size={0.2} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />
        <TextAdvance position={[0, 0, 0.9]}
          text={"_____________________"}
          font={fontText} size={0.2} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />
        <TextAdvance position={[0, 0, 0.9]}
          text={"____________________"}
          font={fontText} size={0.2} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />

        <TextAdvance position={[0, 0, 1.5]}
          text={"Visual Place Recognition\nand Localisation"}
          font={fontText} size={0.16} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />

        <Python scale={18} position={[3, -0.02, 1.6]} rotation={[0, 0, 0]} />
        <pointLight intensity={15} position={[3, 1, 1.6]} distance={isVisibleLight(new THREE.Vector3(0, 5, cvFinalPos[2] + pos[2] + 1.6), 6) ? 2 : 0.01}
          color={new THREE.Color(0x223060)} />

        <mesh className="LINKS" position={[0, 0, 2.3]}>
          <Bvh firstHitOnly >
            {/* <Doc link='https://juanlorenteguarnieri.github.io/Spaceship-Controller/' scale={12} position={[0.7, -0.08, 0]} rotation={[0, 0, 0]} /> */}
            <Github link='https://github.com/JuanLorenteGuarnieri/CV_Course_assigment' scale={12} position={[0, -0.08, 0]} rotation={[0, 0, 0]} />
          </Bvh>
        </mesh>
      </mesh>


      <mesh className="Modeling and Simulation of Appearance" position={modelingPos}>

        <TextAdvance position={[0, 0, 0.9]}
          text={"RENDERING LEDA THE KNIGHT"}
          font={fontText} size={0.2} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />
        <TextAdvance position={[0, 0, 0.9]}
          text={"_________________________"}
          font={fontText} size={0.2} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />
        <TextAdvance position={[0, 0, 0.9]}
          text={"________________________"}
          font={fontText} size={0.2} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />

        <TextAdvance position={[0, 0, 1.5]}
          text={"Nori based renderer with GGX,\nanisotropic beckmann, Dipole SSS..."}
          font={fontText} size={0.16} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />

        <C scale={20} position={[3, -0.02, 1.6]} rotation={[0, 0, 0]} />
        <pointLight intensity={15} position={[3, 1, 1.6]} distance={isVisibleLight(new THREE.Vector3(0, 5, modelingPos[2] + pos[2] + 1.6), 6) ? 2 : 0.01}
          color={new THREE.Color(0x223060)} />

        <mesh className="LINKS" position={[0, 0, 2.3]}>
          <Bvh firstHitOnly >
            {/* <Doc link='https://juanlorenteguarnieri.github.io/Spaceship-Controller/' scale={12} position={[0.7, -0.08, 0]} rotation={[0, 0, 0]} /> */}
            {/* <Github link='https://github.com/JuanLorenteGuarnieri/CV_Course_assigment' scale={12} position={[0, -0.08, 0]} rotation={[0, 0, 0]} /> */}
          </Bvh>
        </mesh>
      </mesh>

      <mesh className="Computational Imaging" position={ciPos}>

        <TextAdvance position={[0, 0, 0.9]}
          text={"COMPUTATIONAL IMAGING"}
          font={fontText} size={0.2} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />
        <TextAdvance position={[0, 0, 0.9]}
          text={"_____________________"}
          font={fontText} size={0.2} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />
        <TextAdvance position={[0, 0, 0.9]}
          text={"____________________"}
          font={fontText} size={0.2} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />

        <TextAdvance position={[0, 0, 1.5]}
          text={"Camera Pipeline, Coded Aperture,\n HDR Imaging and NLOS Imaging"}
          font={fontText} size={0.16} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />

        <Python scale={18} position={[3, -0.02, 1.6]} rotation={[0, 0, 0]} />
        <pointLight intensity={15} position={[3, 1, 1.6]} distance={isVisibleLight(new THREE.Vector3(0, 5, ciPos[2] + pos[2] + 1.6), 6) ? 2 : 0.01}
          color={new THREE.Color(0x223060)} />

        <mesh className="LINKS" position={[0, 0, 2.3]}>
          <Bvh firstHitOnly >
            {/* <Doc link='https://juanlorenteguarnieri.github.io/Spaceship-Controller/' scale={12} position={[0.7, -0.08, 0]} rotation={[0, 0, 0]} /> */}
            <Github link='https://github.com/JuanLorenteGuarnieri/CI' scale={12} position={[0, -0.08, 0]} rotation={[0, 0, 0]} />
          </Bvh>
        </mesh>
      </mesh>

      <mesh className="Advanced Computational Imaging" position={aciPos}>

        <TextAdvance position={[0, 0, 0.9]}
          text={"ADVANCED CI"}
          font={fontText} size={0.2} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />
        <TextAdvance position={[0, 0, 0.9]}
          text={"___________"}
          font={fontText} size={0.2} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />
        <TextAdvance position={[0, 0, 0.9]}
          text={"__________"}
          font={fontText} size={0.2} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />

        <TextAdvance position={[0, 0, 1.5]}
          text={"Phasor-Field NLOS, Polarization\nbased and VLBI Imaging"}
          font={fontText} size={0.16} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />

        <Python scale={18} position={[3, -0.02, 1.6]} rotation={[0, 0, 0]} />
        <pointLight intensity={15} position={[3, 1, 1.6]} distance={isVisibleLight(new THREE.Vector3(0, 5, aciPos[2] + pos[2] + 1.6), 6) ? 2 : 0.01}
          color={new THREE.Color(0x223060)} />

        <mesh className="LINKS" position={[0, 0, 2.3]}>
          <Bvh firstHitOnly >
            {/* <Doc link='https://juanlorenteguarnieri.github.io/Spaceship-Controller/' scale={12} position={[0.7, -0.08, 0]} rotation={[0, 0, 0]} /> */}
            <Github link='https://github.com/JuanLorenteGuarnieri/ACI' scale={12} position={[0, -0.08, 0]} rotation={[0, 0, 0]} />
          </Bvh>
        </mesh>
      </mesh>

      <mesh className="SLAM" position={slamPos}>

        <TextAdvance position={[0, 0, 0.9]}
          text={"SLAM"}
          font={fontText} size={0.2} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />
        <TextAdvance position={[0, 0, 0.9]}
          text={"____"}
          font={fontText} size={0.2} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />
        <TextAdvance position={[0, 0, 0.9]}
          text={"___"}
          font={fontText} size={0.2} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />

        <TextAdvance position={[0, 0, 1.5]}
          text={"ORB-SLAM and Visual SLAM"}
          font={fontText} size={0.16} height={0.08}
          colorPri={"white"} colorSec={new THREE.Color(0x223060)}
        />

        <C scale={20} position={[3, -0.02, 1.6]} rotation={[0, 0, 0]} />
        <pointLight intensity={15} position={[3, 1, 1.6]} distance={isVisibleLight(new THREE.Vector3(0, 5, slamPos[2] + pos[2] + 1.6), 6) ? 2 : 0.01}
          color={new THREE.Color(0x223060)} />

        <mesh className="LINKS" position={[0, 0, 2.3]}>
          <Bvh firstHitOnly >
            {/* <Doc link='https://juanlorenteguarnieri.github.io/Spaceship-Controller/' scale={12} position={[0.7, -0.08, 0]} rotation={[0, 0, 0]} /> */}
            <Github link='https://github.com/hsunekichi/SLAM' scale={12} position={[0, -0.08, 0]} rotation={[0, 0, 0]} />
          </Bvh>
        </mesh>
      </mesh>
    </mesh >
  );
}

export default Projects;
