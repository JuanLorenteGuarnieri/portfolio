import assert from 'node:assert/strict';
import { readCubeGlb } from './glbCube.mjs';
import { splitCubies } from '../src/lib/splitCubies.js';
import { standardHomes } from '../src/lib/cubeLogic.js';

const mesh = readCubeGlb(new URL('../public/models/rubiks_cube.glb', import.meta.url).pathname);
const { cubies, core } = splitCubies(mesh);
assert.equal(cubies.length, 26, '26 cubies');
assert.ok(core && core.index.length / 3 === 12, 'núcleo: 6 cuadrados = 12 triángulos');
// Mismos "home" que el modelo lógico, en el mismo orden (createCube(cubies.map(c=>c.home)) basta, pero comprobamos el conjunto)
const key = (h) => h.join(','); const set = new Set(cubies.map((c) => key(c.home)));
for (const h of standardHomes()) assert.ok(set.has(key(h)), 'cubie ' + key(h));
// No se pierde ningún triángulo ni vértice
const totalTris = cubies.reduce((s, c) => s + c.index.length / 3, 0) + core.index.length / 3;
assert.equal(totalTris, mesh.index.length / 3);
assert.equal(cubies.reduce((s, c) => s + c.positions.length / 3, 0) + core.positions.length / 3, mesh.positions.length / 3);
// Cada cubie queda dentro de su celda (tolerancia de 0.05 por el borde) y tiene exactamente 6 láminas de 4..12 vértices
for (const c of cubies) {
  const n = c.positions.length / 3; assert.equal(c.normals.length, n * 3); assert.equal(c.uvs.length, n * 2);
  assert.ok(c.index.every((i) => i < n));
  for (let k = 0; k < 3; k++) { let mn = Infinity, mx = -Infinity;
    for (let v = 0; v < n; v++) { const x = c.positions[v * 3 + k]; mn = Math.min(mn, x); mx = Math.max(mx, x); }
    const lo = -3 + 2 * (c.home[k] + 1);
    assert.ok(mn >= lo - 0.05 && mx <= lo + 2 + 0.05, `cubie ${key(c.home)} eje ${k}: [${mn.toFixed(2)}, ${mx.toFixed(2)}] fuera de su celda`); }
}
// El conjunto de caras exteriores: 54 pegatinas = 9 por cara. Cuenta de láminas planas pegadas a cada cara del cubo
const outer = {};
for (const c of cubies) {
  // agrupamos vértices por lámina mirando qué vértices están en |coord|≈3
  for (let k = 0; k < 3; k++) for (const s of [-1, 1]) {
    let on = 0; const n = c.positions.length / 3;
    for (let v = 0; v < n; v++) if (Math.abs(c.positions[v * 3 + k] - s * 3) < 0.021) on++;
    if (on) outer[`${k}${s}`] = (outer[`${k}${s}`] || 0) + 1;
  }
}
assert.deepEqual(Object.values(outer).sort(), new Array(6).fill(9), 'cada cara exterior tiene 9 cubies con pegatina');
// Marco y-up: la normal de las pegatinas de la cara +y (arriba) apunta a +y
let upOk = 0; for (const c of cubies) { if (c.home[1] !== 1) continue; for (let v = 0; v < c.positions.length / 3; v++) if (Math.abs(c.positions[v * 3 + 1] - 3) < 0.005 && c.normals[v * 3 + 1] > 0.9) upOk++; }
assert.ok(upOk >= 9 * 4, 'normales de la cara superior apuntan hacia +y (' + upOk + ')');
// Relleno negro: el cuerpo del cubie mide 1,96 (±0,98). Ningún vértice de las láminas queda dentro de él
// (las pegatinas son almohadillas con la base a 0,98 y la cara a ~1,0), así que la caja no asoma por delante.
for (const c of cubies) { const cx = c.home.map((h) => 2 * h); let minReach = Infinity;
  for (let v = 0; v < c.positions.length / 3; v++) minReach = Math.min(minReach, Math.max(...[0, 1, 2].map((k) => Math.abs(c.positions[v * 3 + k] - cx[k]))));
  assert.ok(minReach >= 0.978, `cubie ${key(c.home)}: hay un vértice dentro de la caja de relleno (${minReach.toFixed(3)})`); }
console.log('OK ✔ splitCubies: 26 cubies + núcleo, sin perder triángulos, cada cubie en su celda, 9 pegatinas por cara');
