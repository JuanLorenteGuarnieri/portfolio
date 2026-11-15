import assert from 'node:assert/strict';
import { bundle } from './bundle.mjs';
const store = await bundle('src/lib/cubeStore.js');
const { cubeGame, getCubeGame, getCubeElapsed, cubeFocus, registerCubeController, shuffleCube, solveCube } = store;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
cubeFocus.register({ anchor: {} }); cubeFocus.enter(); cubeFocus.setMode('active');

assert.equal(getCubeGame().phase, 'idle');
// Mover sin mezclar: no hay cronómetro
cubeGame.userMoveStarted(); assert.equal(getCubeGame().phase, 'idle'); cubeGame.userMoveDone(true); assert.equal(getCubeGame().phase, 'idle');
// Mezclar -> listo -> primer giro arranca -> girar sin resolver no para -> resolver para y fija el tiempo
cubeGame.scrambleStarted(); assert.equal(getCubeGame().phase, 'scrambling'); cubeGame.userMoveStarted(); assert.equal(getCubeGame().phase, 'scrambling', 'no arranca mientras mezcla');
cubeGame.scrambleDone(); assert.equal(getCubeGame().phase, 'ready'); assert.equal(getCubeElapsed(), 0);
await wait(30); assert.equal(getCubeElapsed(), 0, 'sigue en 0 hasta el primer giro');
cubeGame.userMoveStarted(); assert.equal(getCubeGame().phase, 'running'); await wait(60);
cubeGame.userMoveDone(false); assert.equal(getCubeGame().phase, 'running'); const t1 = getCubeElapsed(); assert.ok(t1 >= 50, 'el tiempo avanza: ' + t1);
await wait(40); cubeGame.userMoveDone(true);
const g = getCubeGame(); assert.equal(g.phase, 'solved'); assert.ok(g.elapsed >= 90 && g.elapsed < 400, 'tiempo final ' + g.elapsed); assert.equal(g.best, g.elapsed); assert.ok(g.newBest);
await wait(30); assert.equal(getCubeElapsed(), g.elapsed, 'el tiempo queda congelado');
// Segunda partida más lenta: no bate el récord
cubeGame.scrambleStarted(); cubeGame.scrambleDone(); cubeGame.userMoveStarted(); await wait(150); cubeGame.userMoveDone(true);
assert.ok(!getCubeGame().newBest); assert.equal(getCubeGame().best, g.best);
// Resolver automático cancela el cronómetro (no cuenta tiempo)
cubeGame.scrambleStarted(); cubeGame.scrambleDone(); cubeGame.userMoveStarted(); cubeGame.solveStarted(); assert.equal(getCubeGame().phase, 'solving'); cubeGame.userMoveDone(true); assert.equal(getCubeGame().phase, 'solving'); cubeGame.solveDone(); assert.equal(getCubeGame().phase, 'idle');
// Salir del modo en pleno cronómetro lo cancela; "solved" también se limpia
cubeGame.scrambleStarted(); cubeGame.scrambleDone(); cubeGame.userMoveStarted(); cubeGame.cancelTiming(); assert.equal(getCubeGame().phase, 'idle');
// Si la mezcla acaba cuando ya se ha salido del modo, no queda "ready" huérfano
cubeGame.scrambleStarted(); cubeFocus.exit(); cubeFocus.setMode('idle'); cubeGame.scrambleDone(); assert.equal(getCubeGame().phase, 'idle');
// Controlador
let calls = []; const off = registerCubeController({ shuffle: () => calls.push('s'), solve: () => calls.push('r') }); shuffleCube(); solveCube(); off(); shuffleCube(); assert.deepEqual(calls, ['s', 'r']);
console.log('OK ✔ cubeStore: fases del juego, cronómetro, mejor tiempo, resolver sin tiempo, cancelación');
