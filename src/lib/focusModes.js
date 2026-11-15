// Piano y cubo son "modos foco" que no pueden estar activos a la vez. Esto da una vista conjunta
// para el resto de la aplicación (scroll, navegación, cámara): ¿hay algún modo foco en marcha?
import { useSyncExternalStore } from 'react';
import { getPianoMode, subscribePiano } from './pianoStore';
import { getCubeMode, subscribeCube } from './cubeStore';

export const isFocusBusy = () => getPianoMode() !== 'idle' || getCubeMode() !== 'idle';

export function subscribeFocus(fn) {
  const offPiano = subscribePiano(fn);
  const offCube = subscribeCube(fn);
  return () => { offPiano(); offCube(); };
}

/** Hook de React: true mientras haya un modo foco en marcha (también durante el vuelo de ida y vuelta). */
export const useFocusBusy = () => useSyncExternalStore(subscribeFocus, isFocusBusy, isFocusBusy);
