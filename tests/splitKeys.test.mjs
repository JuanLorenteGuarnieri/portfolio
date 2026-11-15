import assert from 'node:assert/strict';
import { readGlb } from './glb.mjs';
import { splitKeys, assignNotes, isBlackMidi } from '../src/lib/splitKeys.js';

const m = readGlb(new URL('../public/models/piano.glb', import.meta.url).pathname);
const white = splitKeys(m._3);
const black = splitKeys(m._4);
console.log('blancas', white.length, 'negras', black.length);
assert.equal(white.length, 56); assert.equal(black.length, 40);

// No se pierde ni se duplica ningún triángulo
const triW = white.reduce((s, k) => s + k.index.length / 3, 0);
const triB = black.reduce((s, k) => s + k.index.length / 3, 0);
assert.equal(triW, m._3.index.length / 3); assert.equal(triB, m._4.index.length / 3);
// Los índices están dentro de rango y los normales/UV vienen completos
for (const k of [...white, ...black]) {
  const n = k.positions.length / 3;
  assert.ok(k.index.every((i) => i < n));
  assert.equal(k.normals.length, k.positions.length); assert.equal(k.uvs.length, n * 2);
  assert.ok(k.bounds.minZ < k.bounds.maxZ);
}
// Ninguna tecla se solapa con la siguiente en X (blancas entre sí y negras entre sí)
for (const set of [white, black]) for (let i = 1; i < set.length; i++) assert.ok(set[i].bounds.minX >= set[i - 1].bounds.maxX - 1e-6);

// Notas: patrón de teclado real empezando en Do (MIDI 24 = C1)
const dx = (m._3.node.translation[0] - m._4.node.translation[0]) / 571.937;
const { keys, patternOk } = assignNotes(white, black, 24, 0, -dx);
assert.equal(keys.length, 96); assert.ok(patternOk, 'el patrón blanca/negra no encaja');
console.log('MIDI', keys[0].midi, '→', keys[95].midi, '| patrón OK');
// Las negras quedan siempre entre dos blancas y más cortas/altas
const b0 = black[0], w0 = white[0];
console.log('alto blanca', (w0.bounds.maxY - w0.bounds.minY).toFixed(4), 'largo blanca', (w0.bounds.maxZ - w0.bounds.minZ).toFixed(4),
  '| largo negra', (b0.bounds.maxZ - b0.bounds.minZ).toFixed(4));
console.log('pivote blanca[0]', w0.pivot.map((v) => v.toFixed(4)), 'posiciones relativas: minZ =', Math.min(...w0.positions.filter((_, i) => i % 3 === 2)).toFixed(6));
console.log('OK ✔ splitKeys');
