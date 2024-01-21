import React, { useRef, useState, useEffect } from 'react';
import { Text3D } from '@react-three/drei';

const TextAdvance = ({ text, position, font, size, height, colorPri, colorSec }) => {
  return (
    <>
      <mesh receiveShadow={true} castShadow={true} >
        <Text3D position={position} rotation={[-Math.PI / 2, 0, 0]}
          font={font}
          bevelEnabled={true}
          bevelSize={0.0001}
          bevelSegments={1}
          bevelThickness={height * 0.25}
          height={height * 0.7}
          size={size}>
          {text}
          <meshStandardMaterial attach="material" color={colorSec} />
        </Text3D>
        <Text3D position={position} rotation={[-Math.PI / 2, 0, 0]}
          font={font}
          height={height}
          size={size}>
          {text}
          <meshStandardMaterial attach="material" color={colorPri} />
        </Text3D>
      </mesh>
    </>
  )
}

export default TextAdvance