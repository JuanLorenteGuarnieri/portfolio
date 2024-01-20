import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three'
import { Vector3 } from 'three';
import { SpotLight } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';

const SpotLightAberration = ({ position, target, intensity, maxDistance, scaleAberration, cameraRef }) => {
  const position2 = [
    position[0],
    position[1],
    position[2] + 0.2 * scaleAberration
  ];
  const position3 = new Vector3(
    position[0],
    position[1],
    position[2] - 0.2 * scaleAberration
  );

  const spotLightRef1 = useRef();
  const spotLightRef2 = useRef();
  const spotLightRef3 = useRef();
  const targetRef = useRef();

  const [isWithinRange, setIsWithinRange] = useState(true);
  const [distance, setDistance] = useState(0);

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

  useFrame(() => {
    setDistance(spotLightRef1.current.position.distanceTo(cameraRef.current.position));

    if (spotLightRef1.current) {
      spotLightRef1.current.intensity = distance < maxDistance ? intensity : 0;
      spotLightRef2.current.intensity = spotLightRef1.current.intensity;
      spotLightRef3.current.intensity = spotLightRef1.current.intensity;
    }
    // setDistance(cameraRef.current.position.distanceTo(position));
    // setIsWithinRange(distance < maxDistance);
  });

  return (
    <>
      <mesh ref={targetRef} position={target} />
      {isWithinRange && (
        <SpotLight
          ref={spotLightRef1}
          color={new THREE.Color(0x00ff00)}
          distance={25}
          angle={0.3}
          intensity={intensity}
          attenuation={2}
          anglePower={5} // Diffuse-cone anglePower (default: 5)
          position={position1}
        />
      )}
      {isWithinRange && (
        <SpotLight
          ref={spotLightRef2}
          color={new THREE.Color(0x0000ff)}
          distance={25}
          angle={0.3}
          intensity={intensity}
          attenuation={2}
          anglePower={5} // Diffuse-cone anglePower (default: 5)
          position={position2}
        />
      )}
      {isWithinRange && (
        <SpotLight
          ref={spotLightRef3}
          color={new THREE.Color(0xff0000)}
          distance={25}
          angle={0.3}
          intensity={intensity}
          attenuation={2}
          anglePower={5} // Diffuse-cone anglePower (default: 5)
          position={position3}
        />
      )}
    </>
  );
}


export default SpotLightAberration;
