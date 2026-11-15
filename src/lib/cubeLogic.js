// -----------------------------------------------------------------------------------------
// Lógica del cubo de Rubik 3x3x3 (sin three ni React, para poder probarla fuera del navegador).
//
// El cubo es un conjunto de 26 cubies (el centro no existe). Cada cubie recuerda dónde empezó
// (`home`, con coordenadas -1/0/1 en cada eje) y cuánto ha girado desde entonces (`m`, matriz de
// rotación 3x3 con enteros, por filas). Su posición actual es siempre m · home.
//
// Un movimiento gira una capa 90°·q alrededor de un eje (0=x, 1=y, 2=z) siguiendo la regla de la
// mano derecha: {axis, layer, q}. `layer` es -1, 0 o 1 (la capa se elige por la coordenada del
// cubie en ese eje; 0 es la capa central). `q` es -1, 1 o 2 (cuartos de vuelta).
//
// El "estado resuelto" no se define como "cada cubie en su sitio" sino como "cada cara de un solo
// color": así también cuenta como resuelto un cubo cuyas capas centrales se han girado (los
// centros se mueven con los giros de capa media).
// -----------------------------------------------------------------------------------------

/** Matrices de un giro de +90° alrededor de x, y, z (por filas). Coinciden con makeRotationX/Y/Z de three. */
const ROT90 = [
  [1, 0, 0, 0, 0, -1, 0, 1, 0],
  [0, 0, 1, 0, 1, 0, -1, 0, 0],
  [0, -1, 0, 1, 0, 0, 0, 0, 1],
];

export const IDENTITY = [1, 0, 0, 0, 1, 0, 0, 0, 1];

const mulVec = (m, v) => [
  m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
  m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
  m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
];

const mulMat = (a, b) => {
  const r = new Array(9);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      r[i * 3 + j] = a[i * 3] * b[j] + a[i * 3 + 1] * b[3 + j] + a[i * 3 + 2] * b[6 + j];
    }
  }
  return r;
};

/** Normaliza una cantidad de cuartos de vuelta a {0, 1, 2, -1}. */
export const normQ = (q) => {
  const n = (((q % 4) + 4) % 4);
  return n === 3 ? -1 : n;
};

/** Posición actual de un cubie (enteros -1/0/1). */
export const cubiePos = (cubie) => mulVec(cubie.m, cubie.home);

/** @param {number[][]} homes  coordenadas de partida de cada cubie, p. ej. [[-1,-1,-1], ...] */
export function createCube(homes) {
  return { cubies: homes.map((home, id) => ({ id, home: home.slice(), m: IDENTITY.slice() })) };
}

/** Los 26 cubies de un cubo estándar (todas las combinaciones de -1/0/1 salvo el centro). */
export function standardHomes() {
  const homes = [];
  for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) {
    if (x || y || z) homes.push([x, y, z]);
  }
  return homes;
}

/** Índices de los cubies que están ahora en una capa. */
export function layerIds(cube, axis, layer) {
  const ids = [];
  for (const c of cube.cubies) if (cubiePos(c)[axis] === layer) ids.push(c.id);
  return ids;
}

/** Aplica un movimiento al estado (lo modifica). */
export function applyMove(cube, move) {
  const turns = ((move.q % 4) + 4) % 4;
  if (!turns) return cube;
  const r = ROT90[move.axis];
  for (const id of layerIds(cube, move.axis, move.layer)) {
    const c = cube.cubies[id];
    for (let k = 0; k < turns; k++) c.m = mulMat(r, c.m);
  }
  return cube;
}

/** ¿Tiene cada cara un solo color? (cuenta también si todo el cubo está girado respecto al marco) */
export function isSolved(cube) {
  const faces = new Map(); // cara actual -> color (cara de partida de la pegatina)
  for (const c of cube.cubies) {
    for (let a = 0; a < 3; a++) {
      if (!c.home[a]) continue;
      const n = [0, 0, 0];
      n[a] = Math.sign(c.home[a]); // normal de la pegatina al empezar
      const color = a * 2 + (n[a] > 0 ? 1 : 0);
      const cur = mulVec(c.m, n);
      const axis = cur.findIndex((v) => v !== 0);
      const face = axis * 2 + (cur[axis] > 0 ? 1 : 0);
      if (!faces.has(face)) faces.set(face, color);
      else if (faces.get(face) !== color) return false;
    }
  }
  return true;
}

// -----------------------------------------------------------------------------------------
// Historial: sirve para resolver (se deshace lo hecho) y se mantiene corto al vuelo.
// -----------------------------------------------------------------------------------------

/**
 * Añade un movimiento al historial fusionándolo con los anteriores si se puede: los giros de
 * capas distintas del mismo eje conmutan, así que se busca hacia atrás la misma capa y se suman
 * los cuartos de vuelta (R seguido de R' desaparece; R R pasa a R2; ...). Modifica `history`.
 */
export function pushMove(history, move) {
  const q = normQ(move.q);
  if (!q) return history;
  for (let i = history.length - 1; i >= 0; i--) {
    const h = history[i];
    if (h.axis !== move.axis) break;
    if (h.layer === move.layer) {
      const total = normQ(h.q + q);
      if (total === 0) history.splice(i, 1);
      else history[i] = { axis: h.axis, layer: h.layer, q: total };
      return history;
    }
  }
  history.push({ axis: move.axis, layer: move.layer, q });
  return history;
}

/** Secuencia que deshace otra: al revés y con cada giro invertido. */
export function invertSequence(moves) {
  return moves
    .slice()
    .reverse()
    .map((m) => ({ axis: m.axis, layer: m.layer, q: normQ(-m.q) }));
}

/**
 * Mezcla aleatoria: giros de las capas exteriores (así los centros no se mueven y el cubo sigue
 * orientado igual) sin repetir eje dos veces seguidas, de modo que ningún giro se anula con otro.
 */
export function randomScramble(length = 25, rand = Math.random) {
  const moves = [];
  let prevAxis = -1;
  for (let i = 0; i < length; i++) {
    let axis;
    do axis = Math.floor(rand() * 3); while (axis === prevAxis);
    prevAxis = axis;
    moves.push({
      axis,
      layer: rand() < 0.5 ? -1 : 1,
      q: [1, -1, 2][Math.floor(rand() * 3)],
    });
  }
  return moves;
}

/**
 * Siguiente giro de la animación ambiente (el cubo se mueve solo cuando nadie lo usa).
 * Para no acumular desorden sin fin se alterna entre dos fases: "scramble" (giros al azar de capas
 * exteriores, sin repetir eje) hasta llegar a `ambient.target` giros en el historial, y "unwind"
 * (se deshace el último giro del historial, uno por uno) hasta dejarlo vacío. Modifica `ambient`
 * ({ phase, target, prevAxis }); NO modifica el historial: quien aplique el giro debe anotarlo con
 * pushMove (así "Resolver" también deshace estos giros).
 *
 * @returns {{axis:number, layer:number, q:number}}
 */
export function ambientStep(ambient, history, { depthMin = 4, depthSpread = 5, rand = Math.random } = {}) {
  if (ambient.phase === 'scramble' && history.length >= ambient.target) ambient.phase = 'unwind';
  if (ambient.phase === 'unwind' && history.length === 0) {
    ambient.phase = 'scramble';
    ambient.target = depthMin + Math.floor(rand() * depthSpread);
  }
  let move;
  if (ambient.phase === 'unwind') {
    const last = history[history.length - 1];
    move = { axis: last.axis, layer: last.layer, q: normQ(-last.q) };
  } else {
    let axis;
    do axis = Math.floor(rand() * 3); while (axis === ambient.prevAxis);
    move = { axis, layer: rand() < 0.5 ? -1 : 1, q: [1, -1, 1, -1, 2][Math.floor(rand() * 5)] };
  }
  ambient.prevAxis = move.axis;
  return move;
}
