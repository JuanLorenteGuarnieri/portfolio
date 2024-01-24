import React, { useState, useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text3D } from '@react-three/drei';

const Text3DInteractive = ({ id, change, typeForm, font, height, size, colorPri, position, isEditable }) => {
  const [text, setText] = useState('');
  // Inicializa isEditing basado en la comparación de id y typeForm
  const [isEditing, setIsEditing] = useState(id === typeForm);
  const textRef = useRef();
  const { gl } = useThree();

  const handleKeyDown = (e) => {
    if (!(typeForm == id)) return;

    if (e.key === 'Enter') {
      gl.domElement.removeAttribute('tabindex');
      change(0);
    } else if (e.key === 'Backspace') {
      setText(text.slice(0, -1));
    } else if (e.key.length === 1) { // Filtra teclas de control como 'Shift' o 'Ctrl'
      setText(text + e.key);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEditing, text, gl.domElement, typeForm]);

  return (
    <group>
      <Text3D ref={textRef} castShadow receiveShadow position={position} rotation={[-Math.PI / 2, 0, 0]}
        font={font}
        height={height}
        size={size}>
        {text}
        <meshPhongMaterial attach="material" color={colorPri} />
      </Text3D>
    </group>
  );
};

export default Text3DInteractive;
