import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Text3D } from '@react-three/drei';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei'



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

  const { materials } = useGLTF('models/box1.glb')
  materials.Mat.precision = 'lowp';

  const textProps = useMemo(
    () => ({
      font,
      size,
      height: height * 0.7,
      bevelEnabled: true,
      bevelSize: 0.0001,
      bevelSegments: 1,
      bevelThickness: height * 0.25,
    }),
    [font, size, height]
  );

  useEffect(() => {
    if (!textRef.current) return;

    const box = new THREE.Box3().setFromObject(textRef.current);
    const sizeVec = box.getSize(new THREE.Vector3());

    let newPosition = [...position];
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
        castShadow
        receiveShadow
        position={textPosition}
        rotation={[-Math.PI / 2, 0, 0]}
        {...textProps}
        material={materials.Mat}
      >
        {text}
        <meshStandardMaterial
          attach="material"
          color={colorPri}
          emissive={colorPri}
          emissiveIntensity={0}
          roughness={0.0}
          metalness={0.1}
        />
      </Text3D>
    </mesh>
  );
};

export default TextAdvance;
