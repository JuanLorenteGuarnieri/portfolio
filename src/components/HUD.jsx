import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';

const HUD = () => {
  return (
    <Html fullscreen>
      <div style={{
        height: '100vh', // Ajusta la altura según sea necesario
        borderRight: '55px solid black', // Estilo de la línea
        position: 'absolute',
        right: '5px' // 5px de la derecha
      }} />
    </Html>
  );
};

export default HUD;
