import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';

const ContactMe = () => {
  return (
    <Html
      transform
      rotation={[Math.PI / 2, 0, 0]}
      position={[2, 0, 0]}
      sprite
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

export default ContactMe;
