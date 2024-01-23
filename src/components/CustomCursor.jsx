import React, { useState, useEffect } from 'react';

function CustomCursor({ color, size }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (e) => {
      // Ajustar la posición para centrar el cursor
      setPosition({ x: e.clientX - size / 2, y: e.clientY - size / 2 });
    };

    window.addEventListener('mousemove', updatePosition);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
    };
  }, [size]); // Agregar 'size' como dependencia del useEffect

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        borderRadius: '50%',
        pointerEvents: 'none', // Asegúrate de que este elemento no interfiera con otros eventos del mouse
        zIndex: 9999,
      }}
    />
  );
}

export default CustomCursor;
