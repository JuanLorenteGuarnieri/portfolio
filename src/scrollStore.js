// Estado de scroll compartido FUERA del estado de React.
//
// Antes cada evento 'scroll' hacía setState en <App/> y re-renderizaba toda la escena
// (secciones, proyectos y decenas de Text3D). Ahora hay un único listener pasivo y las
// notificaciones se agrupan en una por frame (requestAnimationFrame). Quien necesite el
// scroll se suscribe y actúa de forma imperativa (mover la cámara, rotar un modelo...).

let scrollY = 0;
let frame = 0;
let started = false;
const listeners = new Set();

const flush = () => {
  frame = 0;
  scrollY = window.scrollY;
  listeners.forEach((fn) => fn(scrollY));
};

const onScroll = () => {
  if (!frame) frame = requestAnimationFrame(flush);
};

function start() {
  if (started || typeof window === 'undefined') return;
  started = true;
  scrollY = window.scrollY;
  window.addEventListener('scroll', onScroll, { passive: true });
}

/** Último valor de scroll notificado (px). */
export const getScrollY = () => {
  start();
  return scrollY;
};

/** Suscribe una función (y: number) => void; devuelve la función para cancelar. */
export function subscribeScroll(fn) {
  start();
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Posición Z de la cámara para un scroll dado (px). */
export const scrollToCameraZ = (y) => y * 0.00461 + 24.5;
