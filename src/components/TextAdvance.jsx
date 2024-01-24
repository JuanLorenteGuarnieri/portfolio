import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Text3D } from '@react-three/drei';
import * as THREE from 'three';

const TextAdvance = ({ text, position, align = 'center', font, size, height, colorPri }) => {
  const textRef = useRef();
  const [textPosition, setTextPosition] = useState(position); // Estado para almacenar la posición actualizada del texto

  const textProps = useMemo(() => ({
    font,
    size,
    height: height * 0.7, // Altura ajustada
    bevelEnabled: true,
    bevelSize: 0.0001,
    bevelSegments: 1,
    bevelThickness: height * 0.25
  }), [font, size, height]);

  useEffect(() => {
    if (textRef.current) {
      const textSize = new THREE.Box3().setFromObject(textRef.current).getSize(new THREE.Vector3());

      let newPosition;
      switch (align) {
        case 'left':
          newPosition = position;
          break;
        case 'center':
          newPosition = [position[0] - textSize.x / 2, position[1] - textSize.y / 2, position[2]];
          break;
        case 'right':
          newPosition = [position[0] - textSize.x, position[1] - textSize.y / 2, position[2]];
          break;
        default:
          newPosition = position;
      }

      setTextPosition(newPosition);
    }
  }, [textRef.current, align, position]); // Dependencias del efecto

  return (
    <>
      <mesh>
        <Text3D
          ref={textRef}
          castShadow
          receiveShadow
          position={textPosition}
          rotation={[-Math.PI / 2, 0, 0]}
          {...textProps}
        >
          {text}
          <meshPhongMaterial attach="material" color={colorPri} />
        </Text3D>
      </mesh>
    </>
  );
};

export default TextAdvance;
