import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text3D } from '@react-three/drei';
import * as THREE from 'three';

const Text3DInteractive = ({
  id,
  change,
  typeForm,
  font,
  height,
  size,
  colorPri,
  position,
  maxCharacters = 29,
  maxLengthCharacters = 41,
  textParagraph = false,
  text,
  setText
}) => {
  const textRef = useRef();
  const [textProps, setTextProps] = useState({ font, size, height });
  const { gl } = useThree();
  const [cursorPosition, setCursorPosition] = useState(0);
  const [sizeRatio, setSizeRatio] = useState(1);

  const cursorRef = useRef();
  const [showCursor, setShowCursor] = useState(true);

  const handleKeyDown = (e) => {
    if (!(typeForm == id)) return;

    if (e.key === 'Enter') {
      gl.domElement.removeAttribute('tabindex');
      setCursorPosition(text.length);
      change(id + 1);
    } else if (e.key === 'Backspace') {
      if (cursorPosition > 0) {
        const newText = text.substring(0, cursorPosition - 1) + text.substring(cursorPosition);
        setText(newText);
        setCursorPosition(cursorPosition - 1);
      }
    } else if (e.key === 'ArrowLeft') {
      setCursorPosition(Math.max(0, cursorPosition - 1));
    } else if (e.key === 'ArrowRight') {
      setCursorPosition(Math.min(text.length, cursorPosition + 1));
    } else if (e.key.length === 1 && maxLengthCharacters > text.length) {
      const newText = text.substring(0, cursorPosition) + e.key + text.substring(cursorPosition);
      setText(newText);
      setCursorPosition(cursorPosition + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [text, gl.domElement, typeForm, cursorPosition]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (typeForm == id) {
        setShowCursor(prev => !prev);
      } else {
        setCursorPosition(text.length);
        setShowCursor(false);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [id, typeForm]);

  useEffect(() => {
    const textLength = text.length;
    if (textLength > maxCharacters && !textParagraph) {
      const newSize = Math.max(size * (maxCharacters / textLength), 0.1);
      setSizeRatio(newSize / size);
      setTextProps({ font, size: newSize, height });
    } else {
      if (textLength <= maxCharacters) {
        setSizeRatio(1);
      }
      setTextProps({ font, size, height });
    }
  }, [text, font, height, size, maxCharacters]);

  // Memoized Text3D lines for paragraph mode
  const memoizedParagraphLines = useMemo(() => {
    if (!textParagraph) return null;
    const lines = [];
    for (let i = 0; i < 5; i++) {
      lines.push(
        <Text3D
          key={i}
          ref={null}
          castShadow
          receiveShadow
          position={[position[0], position[1], position[2] + 0.3 * i]}
          rotation={[-Math.PI / 2, 0, 0]}
          {...textProps}
        >
          {text.slice(i * 28, (i + 1) * 28)}
          <meshPhongMaterial attach="material" color={colorPri} />
        </Text3D>
      );
    }
    return lines;
    // eslint-disable-next-line
  }, [text, textProps, colorPri, position, textParagraph]);

  // Memoized cursor for paragraph mode
  const memoizedParagraphCursor = useMemo(() => {
    if (!textParagraph || !showCursor) return null;
    const line = Math.min(Math.floor(cursorPosition / 28), 4);
    const col = (line === 4 ? 28 : cursorPosition % 28);
    return (
      <Text3D
        ref={cursorRef}
        castShadow
        receiveShadow
        position={[
          position[0] - 0.05 + 0.1161 * col,
          position[1],
          position[2] + 0.3 * line
        ]}
        rotation={[-Math.PI / 2, 0, 0]}
        {...textProps}
      >
        {'|'}
        <meshPhongMaterial attach="material" color={colorPri} />
      </Text3D>
    );
    // eslint-disable-next-line
  }, [showCursor, cursorPosition, textProps, colorPri, position, textParagraph]);

  // Memoized Text3D for single line
  const memoizedSingleLine = useMemo(() => {
    if (textParagraph) return null;
    return (
      <Text3D
        ref={textRef}
        castShadow
        receiveShadow
        position={position}
        rotation={[-Math.PI / 2, 0, 0]}
        {...textProps}
      >
        {text}
        <meshPhongMaterial attach="material" color={colorPri} />
      </Text3D>
    );
    // eslint-disable-next-line
  }, [text, textProps, colorPri, position, textParagraph]);

  // Memoized cursor for single line
  const memoizedSingleCursor = useMemo(() => {
    if (textParagraph || !showCursor) return null;
    return (
      <Text3D
        ref={cursorRef}
        castShadow
        receiveShadow
        position={[
          position[0] - 0.05 + 0.116 * cursorPosition * sizeRatio,
          position[1],
          position[2]
        ]}
        rotation={[-Math.PI / 2, 0, 0]}
        {...textProps}
      >
        {'|'}
        <meshPhongMaterial attach="material" color={colorPri} />
      </Text3D>
    );
    // eslint-disable-next-line
  }, [showCursor, cursorPosition, textProps, colorPri, position, sizeRatio, textParagraph]);

  return (
    <group>
      {textParagraph ? (
        <>
          {memoizedParagraphLines}
          {memoizedParagraphCursor}
        </>
      ) : (
        <>
          {memoizedSingleLine}
          {memoizedSingleCursor}
        </>
      )}
    </group>
  );
};

export default Text3DInteractive;
