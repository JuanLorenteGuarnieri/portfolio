import assert from 'node:assert/strict';
import { lemmingPose } from '../src/lib/lemmingWalk.js';

// --- Modo por defecto (bounce = false): origen → extremo izquierdo → origen, en bucle.
{ const poses = Array.from({ length: 21 * 5 }, (_, t) => lemmingPose(t));
  assert.equal(poses[0].offset, 0, 'empieza en el origen (0)');
  assert.equal(poses[10].offset, -10, 'llega al extremo izquierdo (-10) tras 10 píxeles');
  assert.equal(poses[11].offset, -9, 'da la vuelta y empieza a volver hacia el origen');
  assert.equal(poses[20].offset, 0, 'vuelve al origen tras 20 ticks');
  assert.equal(poses[21].offset, -1, 'y reinicia el bucle hacia la izquierda');
  poses.forEach((p, t) => {
    assert.ok(Number.isInteger(p.offset) && Math.abs(p.offset) <= 10, 'píxel entero dentro de ±10');
    assert.equal(p.frame, t % 8, 'el fotograma avanza de 1 en 1 (ciclo de 8)');
    if (t > 0) assert.equal(Math.abs(p.offset - poses[t - 1].offset), 1, 'siempre exactamente 1 píxel por tick');
  });
  poses.slice(0, 20).forEach((p, t) => {
    const goingLeft = t < 10; const movingLeft = poses[t + 1].offset < p.offset;
    assert.equal(p.facingLeft, goingLeft && movingLeft, 'mira a la izquierda solo yendo al extremo izquierda');
  });
  const visited = new Set(poses.slice(0, 20).map((p) => p.offset));
  assert.equal(visited.size, 11, 'recorre los 11 píxeles del origen (0) al extremo izquierdo (-10)'); }

// --- Modo bounce: ida y vuelta entre los dos extremos, 1 píxel por tick, se da la vuelta en los extremos ---
{ const poses = Array.from({ length: 200 }, (_, t) => lemmingPose(t, { bounce: true }));
  assert.equal(poses[0].offset, 10); assert.equal(poses[20].offset, -10); assert.equal(poses[40].offset, 10);
  poses.forEach((p, t) => { assert.ok(Math.abs(p.offset) <= 10);
    if (t > 0) assert.equal(Math.abs(p.offset - poses[t - 1].offset), 1, 'siempre exactamente 1 píxel por tick');
    const movingLeft = t < 199 && poses[t + 1].offset < p.offset; if (t < 199 && t % 20 !== 0) assert.equal(p.facingLeft, movingLeft, 'mira hacia donde va'); }); }

// --- Parámetros: otro rango, otro número de fotogramas y ticks negativos no rompen ---
{ assert.equal(lemmingPose(0, { range: 3 }).offset, 0, 'otro rango: empieza en el origen');
  assert.equal(lemmingPose(3, { range: 3 }).offset, -3, 'otro rango: toca el extremo izquierdo');
  assert.equal(lemmingPose(5, { range: 3 }).offset, -1, 'otro rango: de vuelta hacia el origen');
  assert.equal(lemmingPose(6, { range: 3 }).offset, 0, 'otro rango: cerrado el bucle en el origen');
  assert.equal(lemmingPose(9, { frames: 9 }).frame, 0, 'otro número de fotogramas');
  const n = lemmingPose(-1); assert.ok(n.frame >= 0 && n.frame < 8 && Math.abs(n.offset) <= 10, 'ticks negativos no rompen'); }
console.log('OK ✔ lemmingWalk: 1 píxel por fotograma, bucle origen → extremo izquierdo → origen (y va/vuelve entre extremos con bounce)');
