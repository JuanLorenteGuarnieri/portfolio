import assert from 'node:assert/strict';
import { bundle } from './bundle.mjs';
// Se prueba con stubs de react/three/fiber (ver tests/bundle.mjs): la lógica del far no depende de las matemáticas 3D
globalThis.window = { innerWidth: 1920, innerHeight: 1080 };
const { default: FocusCameraRig } = await bundle('src/components/FocusCameraRig.jsx');
const { createFocusStore } = await bundle('src/lib/focusStore.js');

function makeRig(multiplier) {
  const store = createFocusStore(); store.register({ anchor: {} });
  FocusCameraRig({ id: 't' + multiplier, store, duration: 1, farMultiplier: multiplier, getPose: () => ({ position: [0, 0, 0], target: [0, 0, 0], zoom: 2, light: { position: [0, 0, 0], color: [1, 1, 1], intensity: 1, distance: 1 } }) });
  const frame = globalThis.__frame;
  const proj = { n: 0 };
  const cam = { far: 9, zoom: 1, fov: 63, aspect: 1.77, position: { x: 0, y: 5, z: 86, copy() {}, set() {} }, quaternion: { copy() { return this; }, slerp() { return this; } }, updateMatrixWorld() {}, updateProjectionMatrix() { proj.n++; } };
  cam.position = Object.assign(new (class { })(), { x: 0, y: 5, z: 86, copy() { return this; }, lerpVectors() { return this; }, fromArray() { return this; } });
  const step = (dt = 0.1) => frame({ camera: cam }, dt);
  return { store, cam, step, proj };
}
// --- Cubo (x3): al hacer clic el far se triplica YA y se restaura al terminar de salir ---
{ const { store, cam, step } = makeRig(3);
  step(); assert.equal(cam.far, 9, 'en reposo no se toca');
  assert.ok(store.enter()); step(0.016); assert.equal(cam.far, 27, 'triplicado en el primer frame tras el clic');
  for (let i = 0; i < 30; i++) { step(); assert.equal(cam.far, 27, 'se mantiene durante el vuelo y el modo'); if (store.getMode() === 'active') break; }
  assert.equal(store.getMode(), 'active'); for (let i = 0; i < 20; i++) step(); assert.equal(cam.far, 27, 'y mientras está activo');
  store.exit(); for (let i = 0; i < 6; i++) { step(); assert.equal(cam.far, 27, 'sigue triplicado durante el vuelo de vuelta'); }
  for (let i = 0; i < 30 && store.getMode() !== 'idle'; i++) step();
  assert.equal(store.getMode(), 'idle'); assert.equal(cam.far, 9, 'al salir vuelve exactamente al valor original');
  step(); assert.equal(cam.far, 9); }
// --- Si el far de la cámara era otro (p. ej. 13 en vertical o un valor calculado), se restaura ese valor ---
{ const { store, cam, step } = makeRig(3); cam.far = 13.37; store.enter(); step(); assert.ok(Math.abs(cam.far - 40.11) < 1e-9); store.setMode('active'); store.exit(); for (let i = 0; i < 40 && store.getMode() !== 'idle'; i++) step(); assert.equal(cam.far, 13.37); }
// --- Volver a entrar mientras sale: no se vuelve a triplicar (nunca ×9) ---
{ const { store, cam, step } = makeRig(3); store.enter(); step(); store.setMode('active'); for (let i = 0; i < 20; i++) step(); store.exit(); step(); step(); assert.equal(store.getMode(), 'leaving');
  assert.ok(store.enter()); for (let i = 0; i < 40; i++) { step(); assert.equal(cam.far, 27, 'sigue en ×3, nunca ×9'); } }
// --- Piano (×1): el far no se toca nunca, pero la matriz de proyección sí se actualiza al restaurar el zoom ---
{ const { store, cam, step, proj } = makeRig(1); store.enter(); for (let i = 0; i < 30; i++) step(); assert.equal(cam.far, 9); const before = proj.n; store.exit(); for (let i = 0; i < 40 && store.getMode() !== 'idle'; i++) step(); assert.equal(cam.far, 9); assert.ok(proj.n > before, 'se actualiza la proyección al restaurar el zoom'); assert.equal(cam.zoom, 1920 / 1080 / 1.6, 'zoom base restaurado'); }
console.log('OK ✔ rig: far ×3 al clicar el cubo, constante durante el modo, restaurado al salir; piano intacto');
