import { useState, useEffect, useRef, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { Text3D } from '@react-three/drei';

const TEXT_LINE_LENGTH = 28;
const DEFAULT_CURSOR_OFFSET = 0.116;
const DEFAULT_SIZE_NORMALIZER = 0.05;

function Text3DLine({ position, rotation, text, textProps, colorPri }) {
  return (
    <Text3D castShadow receiveShadow position={position} rotation={rotation} {...textProps}>
      {text}
      <meshPhongMaterial attach="material" color={colorPri} />
    </Text3D>
  );
}

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
  setText,
}) => {
  const { gl } = useThree();
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const latest = useRef({ text, typeForm, cursorPosition });

  useEffect(() => {
    latest.current = { text, typeForm, cursorPosition };
  }, [text, typeForm, cursorPosition]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const { text: currentText, typeForm: currentTypeForm, cursorPosition: currentCursor } = latest.current;
      if (currentTypeForm !== id) return;

      if (e.key === 'Enter') {
        gl.domElement.removeAttribute('tabindex');
        setCursorPosition(currentText.length);
        change(id + 1);
      } else if (e.key === 'Backspace') {
        if (currentCursor > 0) {
          const newText = currentText.substring(0, currentCursor - 1) + currentText.substring(currentCursor);
          setText(newText);
          setCursorPosition(currentCursor - 1);
        }
      } else if (e.key === 'ArrowLeft') {
        setCursorPosition((pos) => Math.max(0, pos - 1));
      } else if (e.key === 'ArrowRight') {
        setCursorPosition((pos) => Math.min(currentText.length, pos + 1));
      } else if (e.key.length === 1 && maxLengthCharacters > currentText.length) {
        const newText = currentText.substring(0, currentCursor) + e.key + currentText.substring(currentCursor);
        setText(newText);
        setCursorPosition(currentCursor + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [id, change, gl.domElement, maxLengthCharacters, setText]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (typeForm === id) {
        setShowCursor((prev) => !prev);
      } else {
        setCursorPosition(text.length);
        setShowCursor(false);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [id, typeForm, text.length]);

  const textProps = useMemo(() => {
    if (!textParagraph && text.length > maxCharacters) {
      const newSize = Math.max(size * (maxCharacters / text.length), 0.1);
      return { font, size: newSize, height };
    }
    return { font, size, height };
  }, [text, textParagraph, font, height, maxCharacters, size]);

  const sizeRatio = useMemo(() => {
    if (!textParagraph && text.length > maxCharacters) {
      return Math.max(size * (maxCharacters / text.length), 0.1) / size;
    }
    return 1;
  }, [text, textParagraph, maxCharacters, size]);

  const paragraphLines = textParagraph
    ? Array.from({ length: 5 }, (_, i) => {
        const sliceText = text.slice(i * TEXT_LINE_LENGTH, (i + 1) * TEXT_LINE_LENGTH);
        return (
          <Text3DLine
            key={i}
            position={[position[0], position[1], position[2] + 0.3 * i]}
            rotation={[-Math.PI / 2, 0, 0]}
            text={sliceText}
            textProps={textProps}
            colorPri={colorPri}
          />
        );
      })
    : null;

  const paragraphCursor = textParagraph && showCursor ? (() => {
    const line = Math.min(Math.floor(cursorPosition / TEXT_LINE_LENGTH), 4);
    const col = line === 4 ? TEXT_LINE_LENGTH : cursorPosition % TEXT_LINE_LENGTH;
    return (
      <Text3DLine
        position={[position[0] - DEFAULT_SIZE_NORMALIZER + 0.1161 * col, position[1], position[2] + 0.3 * line]}
        rotation={[-Math.PI / 2, 0, 0]}
        text="|"
        textProps={textProps}
        colorPri={colorPri}
      />
    );
  })() : null;

  const singleLine = !textParagraph ? (
    <Text3DLine
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      text={text}
      textProps={textProps}
      colorPri={colorPri}
    />
  ) : null;

  const singleCursor = !textParagraph && showCursor ? (
    <Text3DLine
      position={[position[0] - DEFAULT_SIZE_NORMALIZER + DEFAULT_CURSOR_OFFSET * cursorPosition * sizeRatio, position[1], position[2]]}
      rotation={[-Math.PI / 2, 0, 0]}
      text="|"
      textProps={textProps}
      colorPri={colorPri}
    />
  ) : null;

  return (
    <group>
      {textParagraph ? (
        <>
          {paragraphLines}
          {paragraphCursor}
        </>
      ) : (
        <>
          {singleLine}
          {singleCursor}
        </>
      )}
    </group>
  );
};

export default Text3DInteractive;
