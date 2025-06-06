import * as THREE from 'three';
import { useMemo } from 'react';
import TextAdvance from '../components/TextAdvance';
import fontText from '../assets/fonts/Source_Code_Pro/static/Source_Code_Pro_Regular.json';
import { Bvh } from '@react-three/drei';
import { Github } from '../../public/models/Github';
import { Python } from '../../public/models/Python';
import { Robot } from '../../public/models/Robot';

function Robotics({ isVisibleLight, pos, parentPos }) {
  // Memoriza los componentes que no dependen de props variables
  const robotModel = useMemo(() => (
    <Bvh firstHitOnly>
      <Robot position={[-3.1, -0.05, 1.6]} rotation={[0, Math.PI / 4, 0]} scale={0.005} />
    </Bvh>
  ), []);

  const pythonModel = useMemo(() => (
    <Python scale={18} position={[3, -0.02, 1.6]} rotation={[0, 0, 0]} />
  ), []);

  const githubLink = useMemo(() => (
    <Bvh firstHitOnly>
      <Github link='https://github.com/hsunekichi/Robotica' scale={12} position={[0, -0.08, 0]} rotation={[0, 0, 0]} />
    </Bvh>
  ), []);

  const roboticsText = useMemo(() => (
    <TextAdvance position={[0, 0, 0.9]}
      text={"ROBOTICS"}
      font={fontText} size={0.2} height={0.08}
      colorPri={"white"} colorSec={new THREE.Color(0x223060)}
    />
  ), []);

  const underline1 = useMemo(() => (
    <TextAdvance position={[0, 0, 0.9]}
      text={"________"}
      font={fontText} size={0.2} height={0.08}
      colorPri={"white"} colorSec={new THREE.Color(0x223060)}
    />
  ), []);

  const underline2 = useMemo(() => (
    <TextAdvance position={[0, 0, 0.9]}
      text={"_______"}
      font={fontText} size={0.2} height={0.08}
      colorPri={"white"} colorSec={new THREE.Color(0x223060)}
    />
  ), []);

  const descriptionText = useMemo(() => (
    <TextAdvance position={[0, 0, 1.5]}
      text={"Robot escape a labyrinth using\ncomputer vision and pathfinding"}
      font={fontText} size={0.16} height={0.08}
      colorPri={"white"} colorSec={new THREE.Color(0x223060)}
    />
  ), []);

  const brickPiText = useMemo(() => (
    <TextAdvance position={[4, 0, 1.6]}
      text={"BrickPi3"}
      font={fontText} size={0.11} height={0.09}
      colorPri={"white"} colorSec={new THREE.Color(0x223060)}
    />
  ), []);

  const pointLightRobot = useMemo(() => (
    <pointLight intensity={30} position={[-3.3, 1, 1.4]} color={new THREE.Color(0x223060)} />
  ), []);

  const pointLightPython = useMemo(() => (
    <pointLight intensity={15} position={[3, 1, 1.6]} color={new THREE.Color(0x223060)} />
  ), []);

  const pointLightBrickPi = useMemo(() => (
    <pointLight intensity={15} position={[4, 1, 1.6]} color={new THREE.Color(0x223060)} />
  ), []);

  const linksMesh = useMemo(() => (
    <mesh className="LINKS" position={[0, 0, 2.3]}>
      {githubLink}
    </mesh>
  ), [githubLink]);

  // Memoiza el visible para evitar recalcularlo en cada render
  const visible = useMemo(
    () => isVisibleLight(new THREE.Vector3(0, 5, pos[2] + parentPos[2]), 8),
    [isVisibleLight, pos, parentPos]
  );

  return (
    <mesh className="Robotics" position={pos} visible={visible}>
      <mesh className="MODEL" >
        {pointLightRobot}
        {/* {robotModel} */}
      </mesh>

      {roboticsText}
      {underline1}
      {underline2}
      {descriptionText}

      {pythonModel}
      {pointLightPython}

      {brickPiText}
      {pointLightBrickPi}

      {linksMesh}
    </mesh>
  );
}

export default Robotics;
