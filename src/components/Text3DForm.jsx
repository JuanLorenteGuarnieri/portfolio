import React, { useState, useEffect, useRef } from 'react';
import { Text3D } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

const Text3DInteractive = ({ font, height, size, colorPri, position, isEditable }) => {
  const [text, setText] = useState('');
  const [isEditing, setIsEditing] = useState(true);
  const textRef = useRef();
  const { gl } = useThree();

  const handleObjectClick = () => {
    if (isEditable) {
      setIsEditing(true);
      gl.domElement.setAttribute('tabindex', '-1');
    }
  };

  const handleKeyDown = (e) => {
    if (!isEditing) return;

    if (e.key === 'Enter') {
      setIsEditing(false);
      gl.domElement.removeAttribute('tabindex');
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
  }, [isEditing, text, gl.domElement]);

  return (
    <group onClick={handleObjectClick}>
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
