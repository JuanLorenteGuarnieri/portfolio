import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { splitKeys, assignNotes } from '../lib/splitKeys';
import { pianoSynth } from '../lib/pianoSynth';
import {
  getPianoMode,
  getPianoProgress,
  registerPianoInfo,
  subscribePiano,
} from '../lib/pianoStore';

// -----------------------------------------------------------------------------------------
// Las 96 teclas del piano (56 blancas + 40 negras), cada una como un objeto independiente que
// gira alrededor de su extremo trasero al pulsarla y hace sonar su nota.
//
// El GLB trae las teclas fusionadas en dos mallas; aquí se separan con splitKeys() (ver lib/).
// En modo piano las teclas se alargan un poco (KEY_STRETCH) para que el teclado, visto a pantalla
// completa, tenga unas teclas más cómodas de pulsar y proporciones más cercanas a las de un piano real.
// -----------------------------------------------------------------------------------------

const FIRST_MIDI = 24; // la primera tecla del modelo es un Do (C1); 96 teclas => hasta B8
const KEY_STRETCH = 1.6; // alargamiento de las teclas en modo piano (hacia el pianista)
const PRESS_ANGLE_WHITE = 0.065; // rad (~3,7º)
const PRESS_ANGLE_BLACK = 0.06;
const MIDDLE_C = 60;

// Colores (espacio lineal). El teclado se ilumina con emisivo en modo piano: la luz de la escena
// (pensada para el suelo) no llega a la cara superior de las teclas.
const lin = (r, g, b) => new THREE.Color().setRGB(r, g, b);
const WHITE = { emissive: lin(0.0, 0.0, 0.0), pressEmissive: lin(0.012, 0.014, 0.015), pressColor: lin(0.85, 0.85, 0.85) };
const BLACK = { emissive: lin(0.0, 0.0, 0.0), pressEmissive: lin(0.07, 0.07, 0.07), pressColor: lin(0.15, 0.15, 0.15) };

// Teclado del ordenador -> semitonos desde el Do central (distribución típica de piano virtual)
const KEYMAP = {
  KeyA: 0, KeyW: 1, KeyS: 2, KeyE: 3, KeyD: 4, KeyF: 5, KeyT: 6, KeyG: 7,
  KeyY: 8, KeyH: 9, KeyU: 10, KeyJ: 11, KeyK: 12, KeyO: 13, KeyL: 14, KeyP: 15, Semicolon: 16,
};

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function readAttribute(attr, size) {
  if (!attr) return null;
  const out = new Float32Array(attr.count * size);
  for (let i = 0; i < attr.count; i++) {
    out[i * size] = attr.getX(i);
    if (size > 1) out[i * size + 1] = attr.getY(i);
    if (size > 2) out[i * size + 2] = attr.getZ(i);
  }
  return out;
}

const extract = (geometry) => ({
  positions: readAttribute(geometry.attributes.position, 3),
  normals: readAttribute(geometry.attributes.normal, 3),
  uvs: readAttribute(geometry.attributes.uv, 2),
  index: geometry.index.array,
});

function toGeometry(key) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(key.positions, 3));
  if (key.normals) g.setAttribute('normal', new THREE.BufferAttribute(key.normals, 3));
  if (key.uvs) g.setAttribute('uv', new THREE.BufferAttribute(key.uvs, 2));
  g.setIndex(new THREE.BufferAttribute(key.index, 1));
  return g;
}

/**
 * @param {object} props
 * @param {THREE.BufferGeometry} props.whiteGeometry  malla fusionada de las teclas blancas
 * @param {THREE.BufferGeometry} props.blackGeometry  malla fusionada de las teclas negras
 * @param {THREE.Material} props.blackMaterial        material de las teclas negras (del GLB)
 * @param {{position:number[], scale:number}} props.whiteTransform  transformación del nodo original
 * @param {{position:number[], scale:number}} props.blackTransform
 */
const PianoKeys = ({ whiteGeometry, blackGeometry, blackMaterial, whiteTransform, blackTransform }) => {
  // 1) Separar las teclas y asignarles nota ---------------------------------------------------
  const built = useMemo(() => {
    const white = splitKeys(extract(whiteGeometry));
    const black = splitKeys(extract(blackGeometry));
    const { keys, patternOk } = assignNotes(
      white,
      black,
      FIRST_MIDI,
      whiteTransform.position[0] / whiteTransform.scale,
      blackTransform.position[0] / blackTransform.scale,
    );
    if (!patternOk) console.warn('[Piano] El patrón de teclas blancas/negras no encaja con un teclado estándar.');

    const whites = keys.filter((k) => !k.black);
    const box = whites.reduce(
      (b, k) => ({
        minX: Math.min(b.minX, k.bounds.minX), maxX: Math.max(b.maxX, k.bounds.maxX),
        maxY: Math.max(b.maxY, k.bounds.maxY),
        minZ: Math.min(b.minZ, k.bounds.minZ), maxZ: Math.max(b.maxZ, k.bounds.maxZ),
      }),
      { minX: Infinity, maxX: -Infinity, maxY: -Infinity, minZ: Infinity, maxZ: -Infinity },
    );
    return { keys, box };
  }, [whiteGeometry, blackGeometry, whiteTransform, blackTransform]);

  const { keys, box } = built;

  // 2) Recursos propios (geometría y material por tecla) ------------------------------------------
  const resources = useMemo(() => {
    const whiteBase = new THREE.MeshPhysicalMaterial({ color: 0xaaaaaa, roughness: 0.3, metalness: 0.1 });
    const geometries = keys.map(toGeometry);
    const materials = keys.map((k) => {
      const m = (k.black ? blackMaterial : whiteBase).clone();
      m.userData.baseColor = m.color.clone();
      m.userData.baseEmissive = m.emissive.clone();
      return m;
    });
    return { whiteBase, geometries, materials };
  }, [keys, blackMaterial]);

  useEffect(() => () => {
    resources.geometries.forEach((g) => g.dispose());
    resources.materials.forEach((m) => m.dispose());
    resources.whiteBase.dispose();
  }, [resources]);

  // 3) Estado de cada tecla (mutable, fuera de React) -----------------------------------------
  const states = useMemo(() => keys.map(() => ({ value: 0, pressed: false, owners: 0, dirty: true })), [keys]);
  const groups = useRef([]);
  const held = useRef(new Map()); // id de puntero (o de tecla del ordenador) -> índice de tecla

  const releaseOwner = useCallback((i) => {
    const s = states[i];
    s.owners = Math.max(0, s.owners - 1);
    if (s.owners === 0 && s.pressed) {
      s.pressed = false;
      pianoSynth.noteOff(keys[i].midi);
    }
  }, [keys, states]);

  const pressKey = useCallback((i, pointerId, velocity = 0.8) => {
    const prev = held.current.get(pointerId);
    if (prev === i) return;
    if (prev !== undefined) releaseOwner(prev);
    held.current.set(pointerId, i);
    const s = states[i];
    s.owners += 1;
    if (!s.pressed) {
      s.pressed = true;
      pianoSynth.unlock();
      pianoSynth.noteOn(keys[i].midi, velocity);
    }
  }, [keys, states, releaseOwner]);

  const releasePointer = useCallback((pointerId) => {
    const i = held.current.get(pointerId);
    if (i === undefined) return;
    held.current.delete(pointerId);
    releaseOwner(i);
  }, [releaseOwner]);

  const releaseAll = useCallback(() => {
    Array.from(held.current.keys()).forEach(releasePointer);
  }, [releasePointer]);

  // 4) Registro para la cámara: objeto de referencia (centro de la cara superior) y medidas ---------
  const anchorRef = useRef();
  const width = box.maxX - box.minX;
  const depth = box.maxZ - box.minZ;
  useEffect(
    () => registerPianoInfo({ anchor: anchorRef.current, width, depth, stretch: KEY_STRETCH }),
    [width, depth],
  );

  // 5) Eventos globales: soltar teclas, teclado del ordenador, salir del modo --------------------------
  useEffect(() => {
    const onPointerEnd = (e) => releasePointer(e.pointerId);
    // Si se suelta el botón fuera de la ventana no llega el pointerup: se detecta al volver
    const onPointerMove = (e) => {
      if (e.pointerType === 'mouse' && e.buttons === 0 && held.current.has(e.pointerId)) releasePointer(e.pointerId);
    };
    const onKeyDown = (e) => {
      if (getPianoMode() !== 'active' || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      const offset = KEYMAP[e.code];
      if (offset === undefined) return;
      const i = MIDDLE_C + offset - FIRST_MIDI;
      if (!keys[i]) return;
      e.preventDefault();
      pressKey(i, `kb:${e.code}`, 0.8);
    };
    const onKeyUp = (e) => releasePointer(`kb:${e.code}`);

    window.addEventListener('pointerup', onPointerEnd);
    window.addEventListener('pointercancel', onPointerEnd);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', releaseAll);
    const unsubscribe = subscribePiano((mode) => {
      if (mode === 'leaving' || mode === 'idle') releaseAll();
    });
    return () => {
      window.removeEventListener('pointerup', onPointerEnd);
      window.removeEventListener('pointercancel', onPointerEnd);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', releaseAll);
      unsubscribe();
      releaseAll();
    };
  }, [keys, pressKey, releasePointer, releaseAll]);

  // 6) Animación: las teclas bajan al pulsarlas y se alargan al entrar en modo piano -----------------------
  const lastAmount = useRef(-1);
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const amount = easeInOutCubic(getPianoProgress());
    const modeChanged = Math.abs(amount - lastAmount.current) > 1e-4;
    lastAmount.current = amount;
    const stretch = 1 + (KEY_STRETCH - 1) * amount;

    for (let i = 0; i < keys.length; i++) {
      const s = states[i];
      const target = s.pressed ? 1 : 0;
      let v = s.value;
      if (v !== target) {
        // Baja rápido (como un dedo) y sube un poco más despacio (como el muelle)
        v += (target - v) * (1 - Math.exp(-dt * (target > v ? 45 : 16)));
        if (Math.abs(target - v) < 0.003) v = target;
      }
      if (v === s.value && !modeChanged && !s.dirty) continue;
      s.value = v;
      s.dirty = false;

      const g = groups.current[i];
      if (g) {
        g.rotation.x = v * (keys[i].black ? PRESS_ANGLE_BLACK : PRESS_ANGLE_WHITE);
        g.scale.z = stretch;
      }
      const m = resources.materials[i];
      const palette = keys[i].black ? BLACK : WHITE;
      m.color.copy(m.userData.baseColor).lerp(palette.pressColor, v);
      m.emissive.copy(palette.emissive).multiplyScalar(amount).lerp(palette.pressEmissive, v);
    }
  });

  // 7) Eventos de los punteros sobre las teclas ----------------------------------------------------------------
  const pointerIdOf = (e) => e.pointerId ?? e.nativeEvent?.pointerId ?? 0;

  // Pulsar cerca del extremo delantero suena más fuerte que cerca del fondo
  const velocityFromHit = (e, i) => {
    const b = keys[i].bounds;
    const len = b.maxZ - b.minZ;
    if (!e.point || !e.object || !len) return 0.8;
    const local = e.object.worldToLocal(e.point.clone());
    return 0.5 + 0.45 * Math.min(1, Math.max(0, local.z / len));
  };

  const onDown = (e, i) => {
    if (getPianoMode() !== 'active') return;
    e.stopPropagation();
    pressKey(i, pointerIdOf(e), velocityFromHit(e, i));
  };

  // Arrastrar con el puntero pulsado por encima de otras teclas las hace sonar (glissando)
  const onOver = (e, i) => {
    if (getPianoMode() !== 'active') return;
    const id = pointerIdOf(e);
    if (!held.current.has(id)) return;
    e.stopPropagation();
    pressKey(i, id, 0.7);
  };

  const renderKeys = (black) =>
    keys.map((k, i) => {
      if (k.black !== black) return null;
      return (
        <group key={i} ref={(g) => { groups.current[i] = g; }} position={k.pivot}>
          <mesh
            receiveShadow
            geometry={resources.geometries[i]}
            material={resources.materials[i]}
            onPointerDown={(e) => onDown(e, i)}
            onPointerOver={(e) => onOver(e, i)}
          />
        </group>
      );
    });

  return (
    <>
      <group position={whiteTransform.position} scale={whiteTransform.scale}>
        {/* Centro de la cara superior de las teclas blancas: referencia para encuadrar la cámara */}
        <group ref={anchorRef} position={[(box.minX + box.maxX) / 2, box.maxY, box.minZ + depth / 2]} />
        {renderKeys(false)}
      </group>
      <group position={blackTransform.position} scale={blackTransform.scale}>
        {renderKeys(true)}
      </group>
    </>
  );
};

export default PianoKeys;
