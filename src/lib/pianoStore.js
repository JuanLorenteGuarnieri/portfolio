// -----------------------------------------------------------------------------------------
// Estado del "modo piano" (cámara pegada al teclado para tocarlo). La máquina de estados
// (idle → entering → active → leaving) es la de focusStore.js; aquí solo se le pone el nombre
// de siempre y el desbloqueo del audio al entrar.
// -----------------------------------------------------------------------------------------
import { createFocusStore } from './focusStore';
import { pianoSynth } from './pianoSynth';

export const pianoFocus = createFocusStore();

export const getPianoMode = pianoFocus.getMode;
export const setPianoMode = pianoFocus.setMode;
export const isPianoBusy = () => pianoFocus.getMode() !== 'idle';
export const getPianoProgress = pianoFocus.getProgress;
export const setPianoProgress = pianoFocus.setProgress;
export const getPianoInfo = pianoFocus.getInfo;
export const subscribePiano = pianoFocus.subscribe;
export const registerPianoInfo = pianoFocus.register;
export const exitPiano = pianoFocus.exit;
export const usePianoMode = pianoFocus.useMode;

/** Lleva la cámara al teclado. Debe llamarse desde un gesto del usuario (clic) para poder activar el audio. */
export function enterPiano() {
  if (!pianoFocus.getInfo()) return;
  pianoSynth.unlock();
  pianoFocus.enter();
}
