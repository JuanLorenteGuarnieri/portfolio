import React, { useEffect } from 'react';

function CustomCursor({ color, size }) {
  useEffect(() => {
    const cursor = document.createElement('div');
    cursor.style.position = 'fixed';
    cursor.style.left = '0';
    cursor.style.top = '0';
    cursor.style.width = `${size}px`;
    cursor.style.height = `${size}px`;
    cursor.style.backgroundColor = color;
    cursor.style.borderRadius = '50%';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '9999';
    cursor.style.willChange = 'transform';
    cursor.style.transform = `translate3d(-${size / 2}px, -${size / 2}px, 0)`;
    cursor.style.transition = 'background 0.2s, width 0.2s, height 0.2s';

    document.body.appendChild(cursor);

    const handleMouseMove = (e) => {
      const x = e.clientX - size / 2;
      const y = e.clientY - size / 2;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (cursor.parentElement) {
        cursor.parentElement.removeChild(cursor);
      }
    };
  }, [color, size]);

  return null;
}

export default CustomCursor;
