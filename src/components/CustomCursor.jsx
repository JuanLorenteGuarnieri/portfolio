import React, { useEffect, useRef } from 'react';

function CustomCursor({ color, size }) {
  const cursorRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  useEffect(() => {
    const updateMouse = (e) => {
      mouse.current.x = e.clientX - size / 2;
      mouse.current.y = e.clientY - size / 2;
      if (!rafId.current) {
        rafId.current = requestAnimationFrame(updatePosition);
      }
    };

    const updatePosition = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0)`;
      }
      rafId.current = null;
    };

    window.addEventListener('mousemove', updateMouse);
    return () => {
      window.removeEventListener('mousemove', updateMouse);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [size]);

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9999,
        transform: `translate3d(-${size / 2}px, -${size / 2}px, 0)`,
        transition: 'background 0.2s, width 0.2s, height 0.2s',
      }}
    />
  );
}

export default CustomCursor;
