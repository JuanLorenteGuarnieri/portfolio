import React, { useRef, useEffect } from 'react';
import * as THREE from 'three'
import { Vector3 } from 'three';
import { SpotLight } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const SpotLightAberration = ({ position, target, intensity, scaleAngle, scaleAberration, cameraRef }) => {
  const position1 = [
    scaleAberration, 8, position / 2
  ];
  const position2 = [
    - 0.707 * scaleAberration, 8, position / 2 + 0.707 * scaleAberration
  ];
  const position3 = new Vector3(
    - 0.707 * scaleAberration, 8, position / 2 - 0.707 * scaleAberration
  );

  const spotLightRef1 = useRef();
  const spotLightRef2 = useRef();
  const spotLightRef3 = useRef();
  const targetRef = useRef();



  useEffect(() => {
    if (spotLightRef1.current) {
      spotLightRef1.current.target = targetRef.current;
    }
    if (spotLightRef2.current) {
      spotLightRef2.current.target = targetRef.current;
    }
    if (spotLightRef3.current) {
      spotLightRef3.current.target = targetRef.current;
    }
  }, []);

  return (
    <>
      <mesh ref={targetRef} position={target} />
      <SpotLight
        castShadow={true}
        ref={spotLightRef1}
        color={new THREE.Color(0x0000ff)}
        distance={25}
        angle={0.3 * scaleAngle}
        intensity={intensity}
        position={position1}
      />
      <SpotLight
        castShadow={true}
        ref={spotLightRef2}
        color={new THREE.Color(0x00ff00)}
        distance={25}
        angle={0.3 * scaleAngle}
        intensity={intensity}
        position={position2}
      />
      <SpotLight
        castShadow={true}
        ref={spotLightRef3}
        color={new THREE.Color(0xff0000)}
        distance={25}
        angle={0.3 * scaleAngle}
        intensity={intensity}
        position={position3}
      />
    </>
  );
}


export default SpotLightAberration;
