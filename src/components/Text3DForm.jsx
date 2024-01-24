import React, { useState, useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text3D } from '@react-three/drei';
import * as THREE from 'three';

const Text3DInteractive = ({ id, change, typeForm, font, height, size, colorPri, position, maxCharacters = 29, maxLengthCharacters = 41, textParagraph = false, text, setText }) => {
  const textRef = useRef();
  const [textProps, setTextProps] = useState({ font, size, height });
  const { gl } = useThree();

  const handleKeyDown = (e) => {
    if (!(typeForm == id)) return;

    if (e.key === 'Enter') {
      gl.domElement.removeAttribute('tabindex');
      change(0);
    } else if (e.key === 'Backspace') {
      setText(text.slice(0, -1));
    } else if (e.key.length === 1 && maxLengthCharacters > text.length) { // Filtra teclas de control como 'Shift' o 'Ctrl'
      setText(text + e.key);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [text, gl.domElement, typeForm]);


  // Ajusta el tamaño del texto en función del número de caracteres
  useEffect(() => {
    const textLength = text.length;
    if (textLength > maxCharacters && !textParagraph) {
      const newSize = Math.max(size * (maxCharacters / textLength), 0.1); // Asegura un tamaño mínimo
      setTextProps({ font, size: newSize, height });
    } else {
      setTextProps({ font, size, height });
    }
  }, [text, font, height, size, maxCharacters]);

  // Renderizado condicional basado en textParagraph
  const renderText = () => {
    if (textParagraph) {
      // Comportamiento cuando textParagraph es true
      return (
        <group>
          <Text3D ref={null} castShadow receiveShadow position={position} rotation={[-Math.PI / 2, 0, 0]} {...textProps}>
            {text.slice(0, 28)}
            <meshPhongMaterial attach="material" color={colorPri} />
          </Text3D>
          <Text3D ref={null} castShadow receiveShadow position={[position[0], position[1], position[2] + 0.3]} rotation={[-Math.PI / 2, 0, 0]} {...textProps}>
            {text.slice(28, 56)}
            <meshPhongMaterial attach="material" color={colorPri} />
          </Text3D>
          <Text3D ref={null} castShadow receiveShadow position={[position[0], position[1], position[2] + 0.6]} rotation={[-Math.PI / 2, 0, 0]} {...textProps}>
            {text.slice(56, 84)}
            <meshPhongMaterial attach="material" color={colorPri} />
          </Text3D>
          <Text3D ref={null} castShadow receiveShadow position={[position[0], position[1], position[2] + 0.9]} rotation={[-Math.PI / 2, 0, 0]} {...textProps}>
            {text.slice(84, 112)}
            <meshPhongMaterial attach="material" color={colorPri} />
          </Text3D>
          <Text3D ref={null} castShadow receiveShadow position={[position[0], position[1], position[2] + 1.2]} rotation={[-Math.PI / 2, 0, 0]} {...textProps}>
            {text.slice(112, 140)}
            <meshPhongMaterial attach="material" color={colorPri} />
          </Text3D>
        </group>
      );
    } else {
      // Comportamiento cuando textParagraph es false
      return (
        <Text3D ref={textRef} castShadow receiveShadow position={position} rotation={[-Math.PI / 2, 0, 0]} {...textProps}>
          {text}
          <meshPhongMaterial attach="material" color={colorPri} />
        </Text3D>
      );
    }
  };

  return (
    <group>
      {renderText()}
    </group>
  );
};

export default Text3DInteractive;
