// -----------------------------------------------------------------------------------------
// Máquina de estados de un "modo foco" (la cámara se acerca a un objeto para usarlo): piano y
// cubo de Rubik. Vive FUERA del estado de React, como scrollStore: la cámara, la luz y los
// objetos se animan de forma imperativa en cada frame, y solo la interfaz DOM se suscribe.
//
//   idle ──enter()──▶ entering ──(la cámara llega)──▶ active
//     ▲                                                  │
//     └──────(la cámara vuelve)── leaving ◀──exit()──────┘
// -----------------------------------------------------------------------------------------
import { useSyncExternalStore } from 'react';

export function createFocusStore() {
  let mode = 'idle';
  let progress = 0; // 0 = cámara en su sitio, 1 = cámara en el objeto (lo escribe FocusCameraRig)
  let info = null; // { anchor: Object3D, ... } lo registra el objeto 3D
  const listeners = new Set();

  const subscribe = (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  };
  const getMode = () => mode;
  const setMode = (next) => {
    if (next === mode) return;
    mode = next;
    listeners.forEach((fn) => fn(mode));
  };

  return {
    getMode,
    setMode,
    subscribe,
    getProgress: () => progress,
    setProgress: (p) => { progress = p; },
    getInfo: () => info,
    /** El objeto 3D registra aquí lo que la cámara necesita. Devuelve la función para darlo de baja. */
    register(next) {
      info = next;
      return () => { if (info === next) info = null; };
    },
    /** idle/leaving -> entering. Devuelve true si arrancó. */
    enter() {
      if (!info || (mode !== 'idle' && mode !== 'leaving')) return false;
      setMode('entering');
      return true;
    },
    exit() {
      if (mode === 'idle' || mode === 'leaving') return;
      setMode('leaving');
    },
    /** Hook de React: 'idle' | 'entering' | 'active' | 'leaving' */
    useMode: () => useSyncExternalStore(subscribe, getMode, getMode),
  };
}
