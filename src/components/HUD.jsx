import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';

const HUD = () => {
  return (
    <Html
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, 0, 0]} // Posición en el espacio 3D, ajustar según sea necesario
      transform // Permite transformar la posición
      occlude // Opcional: oculta el HTML detrás de otros objetos 3D
      style={{ position: 'absolute', width: '100%', height: '100%' }}

    >
      <div style={{
        height: '100vh',
        borderRight: '55px solid black',
        position: 'absolute',
        right: '5px', // 5px de la derecha
        top: '0', // Alinea la parte superior del div con la parte superior del canvas
        pointerEvents: 'none' // Opcional: evita que el div interfiera con la interactividad del canvas
      }} />
    </Html>
  );
};

export default HUD;
