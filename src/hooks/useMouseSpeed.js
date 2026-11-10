import { useState, useRef, useEffect, useCallback } from 'react';

export function useMouseSpeed() {
  const [mouseSpeed, setMouseSpeed] = useState(0);
  const lastMousePos = useRef({ x: 0, y: 0, t: Date.now() });

  const updateMouseSpeed = useCallback((x, y) => {
    const now = Date.now();
    const { x: lastX, y: lastY, t: lastT } = lastMousePos.current;
    const dt = now - lastT;

    if (dt > 0) {
      const dx = x - lastX;
      const dy = y - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const normalizedSpeed = Math.min(dist / dt / 0.8, 1);
      setMouseSpeed(normalizedSpeed);
    }

    lastMousePos.current = { x, y, t: now };
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => {
      updateMouseSpeed(event.clientX, event.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [updateMouseSpeed]);

  return { mouseSpeed, updateMouseSpeed, lastMousePos };
}
