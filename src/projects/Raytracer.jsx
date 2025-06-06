import * as THREE from 'three';
import TextAdvance from '../components/TextAdvance';
import fontText from '../assets/fonts/Source_Code_Pro/static/Source_Code_Pro_Regular.json';
import { Bvh, CubeCamera, Plane, Sphere } from '@react-three/drei';
import { Doc } from '../../public/models/Doc';
import { Github } from '../../public/models/Github';
import { C } from '../../public/models/C';
import React, { useMemo } from 'react';

function Raytracer({ isVisibleLight, pos, parentPos }) {

  // Definir los componentes estáticos con useMemo
  const planes = useMemo(() => (
    <>
      <Plane args={[1, 1, 1, 1]} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color={new THREE.Color(0xffffff)} side={THREE.DoubleSide} castShadow />
      </Plane>
      <Plane args={[1, 1, 1, 1]} position={[0, 1, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color={new THREE.Color(0xffffff)} side={THREE.DoubleSide} castShadow />
      </Plane>
      <Plane args={[1, 1, 1, 1]} position={[0, 0.5, -0.5]} rotation={[0, 0, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color={new THREE.Color(0xffffff)} side={THREE.DoubleSide} castShadow />
      </Plane>
      <Plane args={[1, 1, 1, 1]} position={[-0.5, 0.5, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color={new THREE.Color(0xff0000)} side={THREE.DoubleSide} castShadow />
      </Plane>
      <Plane args={[1, 1, 1, 1]} position={[0.5, 0.5, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color={new THREE.Color(0x00ff00)} side={THREE.DoubleSide} castShadow />
      </Plane>
    </>
  ), []);

  const staticTexts = useMemo(() => (
    <>
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
    </>
  ), []);

  const links = useMemo(() => (
    <mesh className="LINKS" position={[0, 0, 2.3]}>
      <Bvh firstHitOnly>
        <Doc link='https://github.com/JuanLorenteGuarnieri/RayTracer/blob/main/RayTracer.pdf' scale={12} position={[0.7, -0.08, 0]} rotation={[0, 0, 0]} />
        <Github link='https://github.com/JuanLorenteGuarnieri/RayTracer' scale={12} position={[0, -0.08, 0]} rotation={[0, 0, 0]} />
      </Bvh>
    </mesh>
  ), []);

  const cModel = useMemo(() => (
    <C scale={20} position={[3, -0.08, 1.6]} rotation={[0, 0, 0]} />
  ), []);

  const pointLightModel = useMemo(() => (
    <pointLight castShadow intensity={5} position={[0.1, 0.5, 0.3]} power={55} shadow-camera-near={0.05}
      shadow-bias={-0.005}
      onUpdate={light => {
        light.shadow.mapSize.width = 128
        light.shadow.mapSize.height = 128
        light.shadow.needsUpdate = true
      }}
      color={new THREE.Color(0x223060)} />
  ), []);

  const sphereStatic = useMemo(() => (
    <Sphere args={[0.15]} position={[-0.2, 0.15, -0.2]} rotation={[0, -Math.PI / 2, 0]} castShadow receiveShadow>
      <meshPhysicalMaterial
        color={new THREE.Color(0x9db4ec)} side={THREE.DoubleSide}
        roughness={0.3} metalness={0.8}
      />
    </Sphere>
  ), []);

  const pointLightC = useMemo(() => (
    <pointLight intensity={15} position={[3, 1, 1.6]}
      color={new THREE.Color(0x223060)} />
  ), []);

  // Estado para controlar cuándo actualizar CubeCamera
  const [cubeCameraKey, setCubeCameraKey] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCubeCameraKey((k) => k + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <mesh className="RAY TRACER" position={pos} visible={isVisibleLight(new THREE.Vector3(0, 5, pos[2] + parentPos[2]), 8)}>
      {/* <mesh className="MODEL" position={[-3, 0.36, 2]} rotation={[-Math.PI / 6, Math.PI / 4, 0]}>
        {pointLightModel}
        <Bvh firstHitOnly>
          {planes}
          <CubeCamera key={cubeCameraKey} frames={1} far={0.6} resolution={32}>
            {(texture) => (
              <Sphere args={[0.15, 64, 64]} position={[0.2, 0.15, 0]} castShadow receiveShadow>
                <meshPhysicalMaterial
                  color={new THREE.Color(0xffffff)}
                  roughness={0}
                  metalness={1}
                  envMap={texture}
                  side={THREE.DoubleSide}
                />
              </Sphere>
            )}
          </CubeCamera>
          {sphereStatic}
        </Bvh>
      </mesh> */}

      {staticTexts}
      {cModel}
      {pointLightC}
      {links}
    </mesh>
  );
}

export default Raytracer;
