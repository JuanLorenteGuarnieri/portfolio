import React, { useRef, useMemo } from 'react';
import { Text3D } from '@react-three/drei';
import * as THREE from 'three';

const TextAdvance = ({ text, position, align = 'center', font, size, height, colorPri, colorSec }) => {
  // Calcula las dimensiones del texto
  const textProps = useMemo(() => ({
    font,
    size,
    height: height * 0.7, // Altura ajustada
    bevelEnabled: true,
    bevelSize: 0.0001,
    bevelSegments: 1,
    bevelThickness: height * 0.25
  }), [font, size, height]);

  // Usa la ref para acceder a las dimensiones del texto
  const textRef = useRef();

  // Calcula la posición centrada
  const centeredPosition = useMemo(() => {
    if (textRef.current) {
      const textSize = new THREE.Box3().setFromObject(textRef.current).getSize(new THREE.Vector3());
      return [
        position[0] - textSize.x / 2,
        position[1] - textSize.y / 2,
        position[2]
      ];
    }
    return position;
  }, [position, text]);

  const rightAlignedPosition = useMemo(() => {
    if (textRef.current) {
      const textSize = new THREE.Box3().setFromObject(textRef.current).getSize(new THREE.Vector3());
      return [
        position[0] - textSize.x, // Desplazar completamente a la izquierda de la posición
        position[1] - textSize.y / 2, // Mantener el desplazamiento vertical como en el centrado
        position[2]
      ];
    }
    return position;
  }, [position, text]);

  const getPositionBasedOnAlignment = (alignment) => {
    const textSize = textRef.current ? new THREE.Box3().setFromObject(textRef.current).getSize(new THREE.Vector3()) : new THREE.Vector3();

    switch (alignment) {
      case 'left':
        return position;
      case 'center':
        return [position[0] - textSize.x / 2, position[1] - textSize.y / 2, position[2]];
      case 'right':
        return [position[0] - textSize.x, position[1] - textSize.y / 2, position[2]];
      default:
        return position;
    }
  };


  return (
    <>
      <mesh receiveShadow={true} castShadow={true}>
        <Text3D ref={textRef} position={getPositionBasedOnAlignment(align)} rotation={[-Math.PI / 2, 0, 0]} {...textProps}>
          {text}
          <meshPhongMaterial attach="material" color={colorSec} />
        </Text3D>
        <Text3D position={getPositionBasedOnAlignment(align)} rotation={[-Math.PI / 2, 0, 0]}
          font={font}
          height={height}
          size={size}>
          {text}
          <meshPhongMaterial attach="material" color={colorPri} />
        </Text3D>
      </mesh>
    </>
  );
};

export default TextAdvance;
