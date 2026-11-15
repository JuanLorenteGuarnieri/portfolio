// -----------------------------------------------------------------------------------------
// Posición del ratón proyectada sobre el plano XZ (igual que la luz del cursor en Home.jsx).
// Vive FUERA del estado de React para no re-renderizar la escena en cada movimiento del ratón.
// -----------------------------------------------------------------------------------------
import { useSyncExternalStore } from 'react';

let mouseX = 0;
let mouseZ = 0;
let hasMouse = false;
const listeners = new Set();

const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const setMousePos = (x, z) => {
  mouseX = x;
  mouseZ = z;
  hasMouse = true;
  listeners.forEach((fn) => fn());
};

export const getMousePos = () => ({ x: mouseX, z: mouseZ, has: hasMouse });

/** Hook de React: devuelve { x, z, has } */
export const useMousePos = () => useSyncExternalStore(subscribe, getMousePos, getMousePos);
