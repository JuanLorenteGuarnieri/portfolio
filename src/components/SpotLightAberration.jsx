import React, { useRef, useEffect } from 'react';
import * as THREE from 'three'
import { Vector3 } from 'three';
import { SpotLight } from '@react-three/drei';

const SpotLightAberration = ({ target, intensity, scaleAngle, scaleAberration, cameraRef }) => {
  const position1 = [
    0,
    8,
    target[2] + scaleAberration
  ];
  const position2 = [
    0.707 * scaleAberration,
    8,
    target[2] + 0.707 * scaleAberration
  ];
  const position3 = new Vector3(
    0.707 * scaleAberration,
    8,
    target[2] - 0.707 * scaleAberration
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
        ref={spotLightRef1}
        color={new THREE.Color(0x0000ff)}
        distance={25}
        angle={0.3 * scaleAngle}
        intensity={intensity}
        attenuation={2}
        anglePower={5} // Diffuse-cone anglePower (default: 5)
        position={position1}
      />
      <SpotLight
        ref={spotLightRef2}
        color={new THREE.Color(0x00ff00)}
        distance={25}
        angle={0.3 * scaleAngle}
        intensity={intensity}
        attenuation={2}
        anglePower={5} // Diffuse-cone anglePower (default: 5)
        position={position2}
      />
      <SpotLight
        ref={spotLightRef3}
        color={new THREE.Color(0xff0000)}
        distance={25}
        angle={0.3 * scaleAngle}
        intensity={intensity}
        attenuation={2}
        anglePower={5} // Diffuse-cone anglePower (default: 5)
        position={position3}
      />
    </>
  );
}


export default SpotLightAberration;
