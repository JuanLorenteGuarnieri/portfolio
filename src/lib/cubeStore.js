// -----------------------------------------------------------------------------------------
// Estado del "modo cubo" (cámara pegada al cubo de Rubik para jugar con él) y del juego:
// mezclar, resolver automáticamente y cronómetro.
//
// Fases del juego (cubeGame.phase):
//   idle       juego libre: se puede girar todo sin cronómetro
//   scrambling el botón Mezclar está mezclando
//   ready      mezclado: el cronómetro arranca con el primer giro del usuario
//   running    cronómetro en marcha
//   solved     el usuario lo ha resuelto: se muestra su tiempo
//   solving    el botón Resolver está resolviéndolo (no cuenta tiempo)
// -----------------------------------------------------------------------------------------
import { useSyncExternalStore } from 'react';
import { createFocusStore } from './focusStore';

export const cubeFocus = createFocusStore();

export const getCubeMode = cubeFocus.getMode;
export const setCubeMode = cubeFocus.setMode;
export const getCubeProgress = cubeFocus.getProgress;
export const setCubeProgress = cubeFocus.setProgress;
export const getCubeInfo = cubeFocus.getInfo;
export const subscribeCube = cubeFocus.subscribe;
export const registerCubeInfo = cubeFocus.register;
export const enterCube = cubeFocus.enter;
export const exitCube = cubeFocus.exit;
export const useCubeMode = cubeFocus.useMode;

// ---- Mejor tiempo (se guarda en el navegador; si no hay almacenamiento, solo dura la sesión) ----
const BEST_KEY = 'portfolio.rubik.best';
function loadBest() {
  try {
    const v = Number(window.localStorage.getItem(BEST_KEY));
    return Number.isFinite(v) && v > 0 ? v : null;
  } catch { return null; }
}
function saveBest(ms) {
  try { window.localStorage.setItem(BEST_KEY, String(ms)); } catch { /* sin almacenamiento */ }
}

// ---- Estado del juego (objeto inmutable: se reemplaza en cada cambio, para useSyncExternalStore) ----
let game = { phase: 'idle', startedAt: 0, elapsed: 0, best: null, newBest: false, notice: '' };
let bestLoaded = false;
const gameListeners = new Set();
let noticeTimer = 0;
const setGame = (patch) => {
  game = { ...game, ...patch };
  gameListeners.forEach((fn) => fn());
};
export const getCubeGame = () => {
  if (!bestLoaded && typeof window !== 'undefined') {
    bestLoaded = true;
    game = { ...game, best: loadBest() };
  }
  return game;
};
export const subscribeCubeGame = (fn) => {
  gameListeners.add(fn);
  return () => gameListeners.delete(fn);
};
export const useCubeGame = () => useSyncExternalStore(subscribeCubeGame, getCubeGame, getCubeGame);

/** Tiempo transcurrido en ms según la fase (en marcha: se lee del reloj; terminado: el tiempo final). */
export const getCubeElapsed = () => {
  const g = getCubeGame();
  return g.phase === 'running' ? performance.now() - g.startedAt : g.elapsed;
};

/** Transiciones del juego (las llama el cubo 3D). */
export const cubeGame = {
  scrambleStarted: () => setGame({ phase: 'scrambling', elapsed: 0, newBest: false }),
  scrambleDone: () => setGame({ phase: cubeFocus.getMode() === 'active' || cubeFocus.getMode() === 'entering' ? 'ready' : 'idle' }),
  /** El usuario empieza a girar una capa: si estaba "ready", arranca el cronómetro. */
  userMoveStarted: () => {
    if (getCubeGame().phase === 'ready') setGame({ phase: 'running', startedAt: performance.now(), elapsed: 0 });
  },
  /** El usuario termina un giro: si estaba en marcha y el cubo está resuelto, se para el cronómetro. */
  userMoveDone: (solved) => {
    const g = getCubeGame();
    if (g.phase !== 'running' || !solved) return;
    const elapsed = performance.now() - g.startedAt;
    const newBest = g.best === null || elapsed < g.best;
    if (newBest) saveBest(elapsed);
    setGame({ phase: 'solved', elapsed, best: newBest ? elapsed : g.best, newBest });
  },
  solveStarted: () => setGame({ phase: 'solving', elapsed: 0, newBest: false }),
  solveDone: () => setGame({ phase: 'idle', elapsed: 0 }),
  /** Aviso breve que sustituye al mensaje de estado durante un par de segundos. */
  notice: (text, ms = 2000) => {
    setGame({ notice: text });
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => setGame({ notice: '' }), ms);
  },
  /** Al salir del modo cubo no se deja un cronómetro huérfano. */
  cancelTiming: () => {
    const p = getCubeGame().phase;
    if (p === 'running' || p === 'ready' || p === 'solved') setGame({ phase: 'idle', elapsed: 0, newBest: false });
  },
};

// ---- Controlador: el cubo 3D se registra aquí y los botones de la interfaz lo manejan ----
let controller = null;
export function registerCubeController(next) {
  controller = next;
  return () => { if (controller === next) controller = null; };
}
export const shuffleCube = () => controller?.shuffle();
export const solveCube = () => controller?.solve();
