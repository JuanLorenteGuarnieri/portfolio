import React, { useRef, useEffect, useState } from 'react';
import { Text3D } from '@react-three/drei';
import * as THREE from 'three';
import { useSharedMat } from './sharedMaterial';

const TextAdvance = ({
  text,
  position,
  align = 'center',
  font,
  size,
  height,
  colorPri,
}) => {
  const textRef = useRef();
  const [textPosition, setTextPosition] = useState(position);

  const sharedMaterial = useSharedMat();

  useEffect(() => {
    const mesh = textRef.current;
    if (mesh) {
      mesh.geometry.computeBoundsTree?.();
    }
  }, []);

  const textProps = {
    font,
    size,
    height: height * 0.7,
    bevelEnabled: true,
    bevelSize: 0.0001,
    bevelSegments: 1,
    bevelThickness: height * 0.25,
  };

  useEffect(() => {
    if (!textRef.current) return;

    const box = new THREE.Box3().setFromObject(textRef.current);
    const sizeVec = box.getSize(new THREE.Vector3());

    const newPosition = [...position];
    if (align === 'center') {
      newPosition[0] -= sizeVec.x / 2;
      newPosition[1] -= sizeVec.y / 2;
    } else if (align === 'right') {
      newPosition[0] -= sizeVec.x;
      newPosition[1] -= sizeVec.y / 2;
    }
    setTextPosition(newPosition);
    // eslint-disable-next-line
  }, [align, position, text, font, size, height]);

  return (
    <mesh>
      <Text3D
        ref={textRef}
        castShadow={true}
        receiveShadow={true}
        position={textPosition}
        rotation={[-Math.PI / 2, 0, 0]}
        {...textProps}
        material={sharedMaterial}
        color={colorPri}
      >
        {text}
        {colorPri !== 'white' && (
          <meshStandardMaterial
            attach="material"
            color={colorPri}
            emissive={colorPri}
            emissiveIntensity={0}
            roughness={0.0}
            metalness={0.1}
          />
        )}
      </Text3D>
    </mesh>
  );
};

export default TextAdvance;
