import assert from 'node:assert/strict';
// useSyncExternalStore importa react: en Node puro lo sustituimos por un módulo vacío para probar solo la máquina de estados
import Module from 'node:module';
const { createFocusStore } = await import('data:text/javascript,' + encodeURIComponent((await (await import('node:fs/promises')).readFile(new URL('../src/lib/focusStore.js', import.meta.url), 'utf8')).replace("import { useSyncExternalStore } from 'react';", 'const useSyncExternalStore = () => null;')));
const { lightFocusSlot, releaseLightFocus, getLightFocus, isLightFocused, setCursorScreen, getCursorScreen } = await import('../src/lib/lightFocus.js');

const s = createFocusStore(); const seen = []; s.subscribe((m) => seen.push(m));
assert.equal(s.getMode(), 'idle'); assert.equal(s.enter(), false, 'sin objeto registrado no arranca');
const off = s.register({ anchor: {} });
assert.equal(s.enter(), true); assert.equal(s.getMode(), 'entering'); assert.equal(s.enter(), false, 'ya entrando');
s.setMode('active'); s.exit(); assert.equal(s.getMode(), 'leaving'); s.exit(); assert.equal(seen.join(), 'entering,active,leaving');
assert.equal(s.enter(), true, 'se puede volver a entrar mientras sale'); s.setMode('idle'); assert.equal(s.exit(), undefined); assert.equal(s.getMode(), 'idle');
off(); assert.equal(s.getInfo(), null);
// luz: gana la ranura con más peso; amount 0 = sigue al cursor
assert.equal(getLightFocus(), null); const a = lightFocusSlot('piano'), b = lightFocusSlot('cube');
a.amount = 0.3; assert.equal(getLightFocus(), a); b.amount = 0.8; assert.equal(getLightFocus(), b); assert.ok(isLightFocused());
releaseLightFocus('cube'); assert.equal(getLightFocus(), a); releaseLightFocus('piano'); assert.equal(isLightFocused(), false);
assert.equal(lightFocusSlot('piano'), a, 'la ranura se reutiliza'); setCursorScreen(10, 20); assert.deepEqual([getCursorScreen().x, getCursorScreen().y], [10, 20]);
console.log('OK ✔ focusStore + lightFocus');
