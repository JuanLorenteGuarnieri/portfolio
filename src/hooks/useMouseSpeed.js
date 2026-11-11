import { useRef, useEffect, useCallback } from 'react';

/**
 * Velocidad del ratón normalizada (0..1) SIN estado de React: llama a `onSpeed` en cada
 * movimiento, así que mover el ratón ya no re-renderiza la escena.
 *
 * Nota: se conserva la normalización que usaba Home (px/ms ÷ 800), con la que la velocidad
 * queda prácticamente en 0 y el mapa de sombras casi siempre en 400 px. La versión anterior de
 * este hook dividía por 0.8 (800 px/s), lo que haría desaparecer las sombras al mover el ratón
 * rápido: si ese es el efecto deseado, cambia la constante.
 */
const SPEED_DIVISOR = 800;

export function useMouseSpeed(onSpeed) {
  const lastMousePos = useRef({ x: 0, y: 0, t: Date.now() });
  const onSpeedRef = useRef(onSpeed);
  onSpeedRef.current = onSpeed;

  const updateMouseSpeed = useCallback((x, y) => {
    const now = Date.now();
    const last = lastMousePos.current;
    const dt = now - last.t;

    if (dt > 0) {
      const dx = x - last.x;
      const dy = y - last.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = dist / dt; // px/ms
      if (onSpeedRef.current) onSpeedRef.current(Math.min(speed / SPEED_DIVISOR, 1));
    }

    last.x = x;
    last.y = y;
    last.t = now;
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => {
      updateMouseSpeed(event.clientX, event.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [updateMouseSpeed]);

  return { updateMouseSpeed, lastMousePos };
}
