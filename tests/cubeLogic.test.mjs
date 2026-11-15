import assert from 'node:assert/strict';
import { createCube, standardHomes, applyMove, isSolved, pushMove, invertSequence, randomScramble, layerIds, cubiePos, normQ, ambientStep } from '../src/lib/cubeLogic.js';

const fresh = () => createCube(standardHomes());
const snapshot = (c) => JSON.stringify(c.cubies.map((x) => [x.id, cubiePos(x), x.m]));
let seed = 12345; const rng = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;

// 1) Estructura básica
const c0 = fresh();
assert.equal(c0.cubies.length, 26); assert.ok(isSolved(c0));
for (let axis = 0; axis < 3; axis++) {
  assert.equal(layerIds(c0, axis, 1).length, 9, 'capa exterior: 9 cubies');
  assert.equal(layerIds(c0, axis, 0).length, 8, 'capa central: 8 cubies (sin el centro)');
}
// 2) Cuatro cuartos de vuelta = identidad; un cuarto de vuelta NO está resuelto; q=2 son dos cuartos
for (let axis = 0; axis < 3; axis++) for (const layer of [-1, 0, 1]) {
  const c = fresh(); const s0 = snapshot(c);
  applyMove(c, { axis, layer, q: 1 });
  if (layer !== 0) assert.ok(!isSolved(c), `un giro de cara ${axis},${layer} descoloca`);
  for (let k = 0; k < 3; k++) applyMove(c, { axis, layer, q: 1 });
  assert.equal(snapshot(c), s0);
  const d = fresh(); applyMove(d, { axis, layer, q: 2 }); const e = fresh(); applyMove(e, { axis, layer, q: 1 }); applyMove(e, { axis, layer, q: 1 });
  assert.equal(snapshot(d), snapshot(e)); applyMove(d, { axis, layer, q: -1 }); applyMove(d, { axis, layer, q: -1 }); assert.equal(snapshot(d), s0);
}
// 3) Órdenes conocidos. El orden clásico (R U = 105) no cuenta la orientación de los centros, que
//    giran sobre sí mismos (por eso con la matriz completa salen 4×105 = 420).
{ const noCenters = (c) => JSON.stringify(c.cubies.map((x) => [cubiePos(x), x.home.filter(Boolean).length === 1 ? 0 : x.m]));
  const base = noCenters(fresh());
  const orderOf = (seq, cmp) => { const c = fresh(); for (let n = 1; n <= 2000; n++) { for (const m of seq) applyMove(c, m); if (cmp(c)) return n; } return -1; };
  const R = (q) => ({ axis: 0, layer: 1, q }), U = (q) => ({ axis: 1, layer: 1, q }), L = (q) => ({ axis: 0, layer: -1, q });
  assert.equal(orderOf([R(-1), U(-1)], (c) => noCenters(c) === base), 105, 'orden de R U');
  assert.equal(orderOf([R(-1), U(-1)], (c) => snapshot(c) === snapshot(fresh())), 420, 'con centros orientados: 4×105');
  assert.equal(orderOf([R(-1), U(1)], (c) => noCenters(c) === base), 63, "orden de R U'");
  assert.equal(orderOf([R(1), U(1), R(-1), U(-1)], (c) => snapshot(c) === snapshot(fresh())), 6, "sexy move");
  assert.equal(orderOf([R(2), U(2)], (c) => snapshot(c) === snapshot(fresh())), 6, 'R2 U2');
  assert.equal(orderOf([R(1), L(1)], (c) => snapshot(c) === snapshot(fresh())), 4, 'R L (capas opuestas, mismo eje)');
  const c = fresh(); for (let i = 0; i < 105; i++) { applyMove(c, R(-1)); applyMove(c, U(-1)); }
  assert.ok(isSolved(c), '(R U)^105 deja cada cara de un color'); }
// 4) Una cara girada 90° y las 3 vecinas: el cubo se mantiene consistente (permutación): 26 posiciones distintas
{ const c = fresh(); for (const m of randomScramble(40, rng)) applyMove(c, m);
  const keys = new Set(c.cubies.map((x) => cubiePos(x).join(','))); assert.equal(keys.size, 26); assert.ok(!keys.has('0,0,0')); }
// 5) Resolver = deshacer el historial. Con mezclas, giros del usuario y capas centrales incluidos.
for (let trial = 0; trial < 300; trial++) {
  const c = fresh(); const hist = [];
  const n = 5 + Math.floor(rng() * 60);
  for (let i = 0; i < n; i++) {
    const m = { axis: Math.floor(rng() * 3), layer: [-1, 0, 1][Math.floor(rng() * 3)], q: [1, -1, 2][Math.floor(rng() * 3)] };
    applyMove(c, m); pushMove(hist, m);
  }
  assert.ok(hist.length <= n, 'el historial nunca crece más que los movimientos');
  // el historial reducido hace lo mismo que la secuencia completa
  const check = fresh(); for (const m of hist) applyMove(check, m); assert.equal(snapshot(check), snapshot(c), 'historial reducido equivalente');
  for (const m of invertSequence(hist)) applyMove(c, m);
  assert.equal(snapshot(c), snapshot(fresh())); assert.ok(isSolved(c));
}
// 6) Reducción: R R' desaparece; R R -> R2; R L R' -> L (capas del mismo eje conmutan); ejes distintos cortan
{ let h = []; pushMove(h, { axis: 0, layer: 1, q: 1 }); pushMove(h, { axis: 0, layer: 1, q: -1 }); assert.equal(h.length, 0);
  pushMove(h, { axis: 0, layer: 1, q: 1 }); pushMove(h, { axis: 0, layer: 1, q: 1 }); assert.deepEqual(h, [{ axis: 0, layer: 1, q: 2 }]);
  pushMove(h, { axis: 0, layer: 1, q: 1 }); assert.deepEqual(h, [{ axis: 0, layer: 1, q: -1 }]);
  h = []; pushMove(h, { axis: 0, layer: 1, q: 1 }); pushMove(h, { axis: 0, layer: -1, q: 1 }); pushMove(h, { axis: 0, layer: 1, q: -1 }); assert.deepEqual(h, [{ axis: 0, layer: -1, q: 1 }]);
  h = []; pushMove(h, { axis: 0, layer: 1, q: 1 }); pushMove(h, { axis: 1, layer: 1, q: 1 }); pushMove(h, { axis: 0, layer: 1, q: -1 }); assert.equal(h.length, 3, 'otro eje por medio: no se fusionan'); }
// 7) Mezcla aleatoria: 25 giros, capas exteriores, nunca el mismo eje seguidos, y deja el cubo sin resolver
{ const s = randomScramble(25, rng); assert.equal(s.length, 25);
  s.forEach((m, i) => { assert.ok([-1, 1].includes(m.layer)); assert.ok(i === 0 || s[i - 1].axis !== m.axis); });
  const c = fresh(); const h = []; for (const m of s) { applyMove(c, m); pushMove(h, m); } assert.equal(h.length, 25, 'la mezcla no se acorta'); assert.ok(!isSolved(c)); }
// 8) "Resuelto" cuenta aunque se hayan girado las capas centrales (cubo entero rotado respecto al marco)
{ const c = fresh(); applyMove(c, { axis: 0, layer: 0, q: 1 }); applyMove(c, { axis: 0, layer: 1, q: 1 }); applyMove(c, { axis: 0, layer: -1, q: 1 });
  assert.ok(isSolved(c), 'x = M + R + L (mismo sentido): el cubo entero girado sigue resuelto'); assert.notEqual(snapshot(c), snapshot(fresh())); }
// 9) Animación ambiente: nunca acumula desorden. Se alterna scramble/unwind y el historial vuelve a vacío (= resuelto)
{ const c = fresh(); const hist = []; const amb = { phase: 'scramble', target: 4, prevAxis: -1 }; let maxLen = 0, empties = 0, wasSolvedWhenEmpty = true, prevAxis = -1;
  for (let i = 0; i < 6000; i++) {
    const wasUnwinding = amb.phase === 'unwind' && hist.length > 0;
    const before = hist.length; const m = ambientStep(amb, hist, { rand: rng });
    assert.ok([-1, 1].includes(m.layer) || amb.phase === 'unwind', 'solo capas exteriores');
    if (amb.phase === 'scramble') assert.notEqual(m.axis, prevAxis, 'no repite eje al mezclar');
    prevAxis = amb.prevAxis; applyMove(c, m); pushMove(hist, m);
    if (amb.phase === 'unwind') assert.equal(hist.length, before - 1, 'cada giro de unwind deshace exactamente uno');
    maxLen = Math.max(maxLen, hist.length);
    if (hist.length === 0) { empties++; wasSolvedWhenEmpty &&= isSolved(c) && snapshot(c) === snapshot(fresh()); } }
  assert.ok(maxLen <= 8, 'historial acotado (max ' + maxLen + ')'); assert.ok(empties > 200, 'vuelve a resuelto muchas veces (' + empties + ')'); assert.ok(wasSolvedWhenEmpty, 'con historial vacío el cubo está resuelto');
  // Si el usuario lo deja desordenado (historial largo), la animación lo va deshaciendo sola y acaba resuelto
  const c2 = fresh(), h2 = []; for (const m of randomScramble(30, rng)) { applyMove(c2, m); pushMove(h2, m); } const a2 = { phase: 'scramble', target: 4, prevAxis: -1 };
  for (let i = 0; i < 200 && !(a2.phase === 'unwind' && h2.length === 0); i++) { const m = ambientStep(a2, h2, { rand: rng }); applyMove(c2, m); pushMove(h2, m); if (h2.length === 0) break; }
  assert.equal(h2.length, 0); assert.ok(isSolved(c2) && snapshot(c2) === snapshot(fresh())); }
assert.equal(normQ(3), -1); assert.equal(normQ(-3), 1); assert.equal(normQ(4), 0); assert.equal(normQ(-2), 2);
console.log('OK ✔ cubeLogic (giros, órdenes de (RU)^105 y sexy^6, resolver por historial en 300 casos, reducción, mezcla, animación ambiente acotada)');
