import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { splitCubies } from '../lib/splitCubies';
import {
  ambientStep,
  applyMove,
  createCube,
  cubiePos,
  invertSequence,
  isSolved,
  layerIds,
  normQ,
  pushMove,
  randomScramble,
} from '../lib/cubeLogic';
import { cubeGame, getCubeMode, getCubeProgress, registerCubeController, subscribeCube } from '../lib/cubeStore';

// -----------------------------------------------------------------------------------------
// El cubo de Rubik jugable: 26 cubies (más el núcleo fijo) que giran por capas.
//
//   - Arrastrar sobre una cara gira la capa en esa dirección y, al soltar, se ajusta al cuarto
//     de vuelta más cercano. Arrastrar sobre el fondo gira el cubo entero.
//   - Mezclar / Resolver (botones de CubeOverlay): animan una secuencia de giros. Resolver deshace
//     el historial de giros (mezcla + los del usuario), simplificado al vuelo (lib/cubeLogic.js).
//   - El cronómetro lo gobierna cubeStore: arranca con el primer giro del usuario tras mezclar y
//     se para cuando el cubo queda resuelto.
//   - Fuera del modo cubo, el cubo hace giros de capas aleatorios por sí solo (animación ambiente):
//     se aleja del estado resuelto unos pocos giros y los va deshaciendo, sin acumular desorden.
//   - Cada cubie lleva dentro una caja negra maciza: el modelo original solo tiene láminas sueltas
//     (pegatinas y paredes de un solo lado, con un hueco en las aristas), y al girar una capa o el
//     cubo entero se veía el interior hueco y las caras traseras de otras pegatinas.
//   - Al salir del modo, el cubo recupera la rotación (de cubo entero) que tenía antes de jugar.
//
// La lógica de estado (qué cubie está dónde, si está resuelto) es lib/cubeLogic.js; aquí solo hay
// presentación, animación y entrada.
//
// Marco: el cubo ocupa [-3, 3]^3 y su centro es el origen de `orientRef`. Los cubies tienen sus
// vértices en ese marco, así que girar un cubie = girar su grupo alrededor del origen.
// -----------------------------------------------------------------------------------------

const QUARTER = Math.PI / 2;
const DRAG_START_PX = 7; // píxeles antes de decidir qué capa se arrastra
const MIN_PX_PER_UNIT = 8; // por debajo, la cara se ve casi de canto (ver decideLayer)
const FLICK_RAD = 0.25; // un tirón de más de ~17° gira un cuarto aunque no llegue a 45°
const ROTATE_SPEED = 0.008; // rad/px al girar el cubo entero
const SCRAMBLE_LENGTH = 25;
const SCRAMBLE_SECONDS = 0.09; // por giro
const SOLVE_TOTAL_SECONDS = 5.5; // la resolución se reparte en este tiempo (con límites por giro)

// Caja negra de relleno = el cuerpo del cubie que el modelo no trae. Las pegatinas son "almohadillas"
// biseladas cuya base está a 0,98 del centro del cubie (y su cara a 0,999), así que el cuerpo mide
// 2 · 0,98 = 1,96: justo lo que queda bajo ellas y entre ellas, sin asomar por delante.
const FILL_BOX = 1.96;
const FILL_COLOR = 0x050505;

// Animación ambiente (fuera del modo cubo)
const AMBIENT_TURN_SECONDS = 0.6; // lo que tarda cada giro
const AMBIENT_WAIT_MIN = 0.9; // pausa entre giros (s): entre MIN y MIN + SPREAD
const AMBIENT_WAIT_SPREAD = 1.8;
const AMBIENT_DEPTH_MIN = 4; // giros de desorden antes de empezar a deshacerlos: entre MIN y MIN + SPREAD
const AMBIENT_DEPTH_SPREAD = 5;
const AMBIENT_REST_AFTER_MODE = 2; // s de calma tras salir del modo cubo

const AXES = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)];
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const smooth = (t) => t * t * (3 - 2 * t);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const IDENTITY_QUAT = new THREE.Quaternion();

// ¿Se está viendo? (alguna sección padre oculta no se anima: ahorra trabajo y se ve al llegar)
const isShown = (obj) => {
  for (let o = obj; o; o = o.parent) if (!o.visible) return false;
  return true;
};

// ---- geometría ----------------------------------------------------------------------------
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

function toGeometry(data) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(data.positions, 3));
  if (data.normals) g.setAttribute('normal', new THREE.BufferAttribute(data.normals, 3));
  if (data.uvs) g.setAttribute('uv', new THREE.BufferAttribute(data.uvs, 2));
  g.setIndex(new THREE.BufferAttribute(data.index, 1));
  return g;
}

// Objetos temporales reutilizados (los eventos de arrastre ocurren muchas veces por segundo)
const tmp = {
  m4: new THREE.Matrix4(),
  q: new THREE.Quaternion(),
  q1: new THREE.Quaternion(),
  q2: new THREE.Quaternion(),
  qParent: new THREE.Quaternion(),
  qCam: new THREE.Quaternion(),
  v: new THREE.Vector3(),
  v2: new THREE.Vector3(),
  axisX: new THREE.Vector3(),
  axisY: new THREE.Vector3(),
};

/**
 * @param {object} props
 * @param {THREE.BufferGeometry} props.geometry  malla única del GLB (se parte en cubies)
 * @param {THREE.Material} props.material        material "baked" del GLB
 */
const RubikCubePieces = ({ geometry, material }) => {
  const { camera, gl } = useThree();

  // 1) Partir el modelo y crear los recursos ---------------------------------------------------
  const built = useMemo(() => splitCubies(extract(geometry)), [geometry]);
  const resources = useMemo(
    () => ({
      cubies: built.cubies.map(toGeometry),
      core: built.core ? toGeometry(built.core) : null,
      fillGeometry: new THREE.BoxGeometry(FILL_BOX, FILL_BOX, FILL_BOX), // compartida por los 26 cubies
      fillMaterial: new THREE.MeshStandardMaterial({ color: FILL_COLOR, roughness: 0.65, metalness: 0 }),
    }),
    [built],
  );
  useEffect(() => () => {
    resources.cubies.forEach((g) => g.dispose());
    if (resources.core) resources.core.dispose();
    resources.fillGeometry.dispose();
    resources.fillMaterial.dispose();
  }, [resources]);

  // 2) Estado mutable (fuera de React) ----------------------------------------------------------
  const orientRef = useRef(null); // gira el cubo entero
  const cubieRefs = useRef([]); // un grupo por cubie
  const S = useMemo(() => {
    const homes = built.cubies.map((c) => c.home);
    return {
      homes,
      cube: createCube(homes), // estado lógico
      history: [], // giros hechos desde el estado resuelto (se simplifican al añadirlos)
      queue: [], // giros automáticos pendientes (mezclar / resolver)
      auto: false, // hay una mezcla o una resolución en curso
      onQueueDone: null,
      anim: null, // animación de capa en curso
      drag: null, // arrastre de capa del usuario
      orbit: null, // arrastre para girar el cubo entero
      layerDown: false, // el último pointerdown cayó sobre un cubie
      leaveQuat: null, // rotación del cubo entero al empezar a salir del modo (para devolverla a la original)
      ambient: { wait: 1.5, phase: 'scramble', target: AMBIENT_DEPTH_MIN, prevAxis: -1 }, // animación ambiente (ver ambientStep)
      rest: homes.map(() => new THREE.Quaternion()), // orientación "asentada" de cada cubie
    };
  }, [built]);

  // 3) Aplicar el estado lógico a los grupos 3D ---------------------------------------------------
  const syncCubie = useCallback((id) => {
    const m = S.cube.cubies[id].m;
    tmp.m4.set(m[0], m[1], m[2], 0, m[3], m[4], m[5], 0, m[6], m[7], m[8], 0, 0, 0, 0, 1);
    S.rest[id].setFromRotationMatrix(tmp.m4);
    const g = cubieRefs.current[id];
    if (g) g.quaternion.copy(S.rest[id]);
  }, [S]);

  const syncAll = useCallback(() => {
    for (let i = 0; i < S.homes.length; i++) syncCubie(i);
  }, [S, syncCubie]);

  // Gira una capa un ángulo (rad) respecto a su orientación asentada
  const setLayerAngle = useCallback((axis, ids, theta) => {
    tmp.q.setFromAxisAngle(AXES[axis], theta);
    for (const id of ids) {
      const g = cubieRefs.current[id];
      if (g) g.quaternion.copy(tmp.q).multiply(S.rest[id]);
    }
  }, [S]);

  // 4) Animaciones y cola de giros automáticos -------------------------------------------------------
  const pump = useCallback(() => {
    if (S.anim || (S.drag && S.drag.decided)) return;
    const next = S.queue.shift();
    if (next) {
      const ids = layerIds(S.cube, next.move.axis, next.move.layer);
      S.anim = {
        axis: next.move.axis, layer: next.move.layer, ids,
        from: 0, to: normQ(next.move.q) * QUARTER,
        t: 0, duration: next.duration, ease: smooth,
        move: next.move, source: next.source,
      };
    } else if (S.onQueueDone) {
      const done = S.onQueueDone;
      S.onQueueDone = null;
      done();
    }
  }, [S]);

  // Un giro termina: se actualiza el estado lógico, el historial y el cronómetro
  const finishMove = useCallback((anim) => {
    const move = anim.move;
    if (normQ(move.q)) {
      applyMove(S.cube, move);
      if (anim.source !== 'solve') pushMove(S.history, move);
    }
    for (const id of anim.ids) syncCubie(id); // orientación exacta (sin errores de redondeo)
    S.anim = null;
    if (anim.source === 'user') cubeGame.userMoveDone(isSolved(S.cube));
    pump();
  }, [S, syncCubie, pump]);

  // Animación ambiente: un giro aleatorio de una capa exterior de vez en cuando; el cubo se aleja unos
  // pocos giros del estado resuelto y los va deshaciendo, sin acumular desorden (ver ambientStep en
  // lib/cubeLogic.js). Los giros se anotan en el historial como cualquier otro, así que "Solve" los
  // deshace también.
  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    [],
  );
  const startAmbientMove = useCallback(() => {
    const A = S.ambient;
    const move = ambientStep(A, S.history, { depthMin: AMBIENT_DEPTH_MIN, depthSpread: AMBIENT_DEPTH_SPREAD });
    A.wait = AMBIENT_WAIT_MIN + Math.random() * AMBIENT_WAIT_SPREAD;
    S.anim = {
      axis: move.axis, layer: move.layer, ids: layerIds(S.cube, move.axis, move.layer),
      from: 0, to: normQ(move.q) * QUARTER,
      t: 0, duration: AMBIENT_TURN_SECONDS, ease: smooth,
      move, source: 'ambient',
    };
  }, [S]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const mode = getCubeMode();
    const orient = orientRef.current;

    // Al salir del modo el cubo recupera la rotación original, al mismo ritmo que la cámara
    if (orient) {
      if (mode === 'leaving') {
        if (!S.leaveQuat) S.leaveQuat = orient.quaternion.clone();
        orient.quaternion.copy(IDENTITY_QUAT).slerp(S.leaveQuat, easeInOutCubic(getCubeProgress()));
      } else if (S.leaveQuat) {
        if (mode === 'idle') orient.quaternion.copy(IDENTITY_QUAT);
        S.leaveQuat = null;
      }
    }

    const a = S.anim;
    if (a) {
      a.t += dt / a.duration;
      const t = Math.min(1, a.t);
      setLayerAngle(a.axis, a.ids, a.from + (a.to - a.from) * a.ease(t));
      if (t >= 1) finishMove(a);
    } else if (mode === 'idle' && !reducedMotion && !S.auto && !S.drag && S.queue.length === 0 && orient && isShown(orient)) {
      S.ambient.wait -= dt;
      if (S.ambient.wait <= 0) startAmbientMove();
    }
  });

  const busy = useCallback(() => S.anim || S.auto || S.drag || S.queue.length > 0, [S]);

  const shuffle = useCallback(() => {
    if (busy()) return;
    S.auto = true;
    cubeGame.scrambleStarted();
    S.queue = randomScramble(SCRAMBLE_LENGTH).map((move) => ({ move, duration: SCRAMBLE_SECONDS, source: 'scramble' }));
    S.onQueueDone = () => { S.auto = false; cubeGame.scrambleDone(); };
    pump();
  }, [S, busy, pump]);

  const solve = useCallback(() => {
    if (busy()) return;
    const sequence = invertSequence(S.history);
    if (!sequence.length) { // historial vacío = el cubo está como al empezar
      cubeGame.notice('Already solved!');
      return;
    }
    S.auto = true;
    cubeGame.solveStarted();
    const duration = clamp(SOLVE_TOTAL_SECONDS / sequence.length, 0.08, 0.28);
    S.queue = sequence.map((move) => ({ move, duration, source: 'solve' }));
    S.onQueueDone = () => {
      S.auto = false;
      S.history.length = 0;
      if (!isSolved(S.cube)) { // no debería ocurrir; por si acaso se restablece el cubo
        S.cube = createCube(S.homes);
        syncAll();
      }
      cubeGame.solveDone();
    };
    pump();
  }, [S, busy, pump, syncAll]);

  useEffect(() => registerCubeController({ shuffle, solve }), [shuffle, solve]);

  // 5) Entrada: arrastrar caras y girar el cubo ------------------------------------------------------------
  const screenOf = useCallback((localPoint, out) => {
    const orient = orientRef.current;
    const rect = gl.domElement.getBoundingClientRect();
    tmp.v2.copy(localPoint);
    orient.localToWorld(tmp.v2);
    tmp.v2.project(camera);
    out[0] = rect.left + ((tmp.v2.x + 1) / 2) * rect.width;
    out[1] = rect.top + ((1 - tmp.v2.y) / 2) * rect.height;
  }, [camera, gl]);

  // Según hacia dónde se arrastra sobre la cara, decide qué capa gira.
  //
  // Sobre una cara hay dos direcciones de arrastre posibles: las dos líneas de la cuadrícula (ejes
  // u ≠ eje de la cara). Se elige la que más se parece, en pantalla, al arrastre. La capa que gira
  // es la perpendicular al tercer eje w: arrastrar a lo largo de u mueve la superficie alrededor de w.
  // El ángulo sigue al dedo: un punto de la cara a distancia 3 del centro se desliza a lo largo de u
  // a razón de vu = (w × p)·u ≈ ±3 unidades por radián, así que θ = (arrastre en unidades) / vu.
  const decideLayer = useCallback((drag, dx, dy) => {
    const orient = orientRef.current;
    orient.updateWorldMatrix(true, false);
    const STEP = 0.5; // unidades del modelo para medir hacia dónde apunta cada eje en pantalla
    const p0 = [0, 0];
    const p1 = [0, 0];
    screenOf(drag.local, p0);
    const dlen = Math.hypot(dx, dy);
    let best = null;
    for (let u = 0; u < 3; u++) {
      if (u === drag.face) continue;
      tmp.v.copy(AXES[u]).multiplyScalar(STEP).add(drag.local);
      screenOf(tmp.v, p1);
      const su = [(p1[0] - p0[0]) / STEP, (p1[1] - p0[1]) / STEP]; // píxeles por unidad del modelo
      const len = Math.hypot(su[0], su[1]);
      if (len < MIN_PX_PER_UNIT) continue; // cara casi de canto: no se puede arrastrar con precisión
      const score = Math.abs(dx * su[0] + dy * su[1]) / (len * dlen);
      if (!best || score > best.score) best = { u, su, len2: len * len, score };
    }
    if (!best) return null;
    const w = 3 - drag.face - best.u; // el tercer eje (0+1+2 = 3)
    tmp.v.copy(AXES[w]).cross(drag.local);
    const vu = tmp.v.dot(AXES[best.u]);
    if (Math.abs(vu) < 0.5) return null;
    const layer = cubiePos(S.cube.cubies[drag.cubie])[w];
    return { axis: w, layer, ids: layerIds(S.cube, w, layer), su: best.su, len2: best.len2, vu, theta: 0 };
  }, [S, screenOf]);

  // Suelta una capa arrastrada: se ajusta al cuarto de vuelta más cercano
  const endDrag = useCallback(() => {
    const drag = S.drag;
    S.drag = null;
    if (!drag || !drag.decided) return;
    const { axis, layer, ids, theta } = drag.decided;
    let q = Math.round(theta / QUARTER);
    if (q === 0 && Math.abs(theta) > FLICK_RAD) q = Math.sign(theta);
    q = clamp(q, -2, 2);
    const to = q * QUARTER;
    S.anim = {
      axis, layer, ids, from: theta, to,
      t: 0, duration: 0.08 + 0.14 * Math.min(1, Math.abs(to - theta) / QUARTER), ease: easeOut,
      move: { axis, layer, q: normQ(q) }, source: 'user',
    };
  }, [S]);

  // Pulsar sobre un cubie (R3F): empieza un posible arrastre de capa
  const onCubieDown = useCallback((e, i) => {
    if (getCubeMode() !== 'active' || busy()) return;
    e.stopPropagation();
    S.layerDown = true;
    const orient = orientRef.current;
    orient.updateWorldMatrix(true, false);
    const local = orient.worldToLocal(e.point.clone());
    let face = 0; // la cara tocada es la del eje en el que el punto está más lejos del centro
    if (Math.abs(local.y) > Math.abs(local.getComponent(face))) face = 1;
    if (Math.abs(local.z) > Math.abs(local.getComponent(face))) face = 2;
    const native = e.nativeEvent;
    S.drag = { pointerId: native.pointerId, x0: native.clientX, y0: native.clientY, cubie: i, local, face, decided: null };
  }, [S, busy]);

  useEffect(() => {
    const canvas = gl.domElement;

    const onPointerDown = (e) => {
      if (S.layerDown) { S.layerDown = false; return; } // lo ha recogido un cubie
      if (getCubeMode() !== 'active' || busy() || e.target !== canvas) return;
      S.orbit = { pointerId: e.pointerId, x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e) => {
      const drag = S.drag;
      if (drag && e.pointerId === drag.pointerId) {
        const dx = e.clientX - drag.x0;
        const dy = e.clientY - drag.y0;
        if (!drag.decided) {
          if (dx * dx + dy * dy < DRAG_START_PX * DRAG_START_PX) return;
          drag.decided = decideLayer(drag, dx, dy);
          if (!drag.decided) { S.drag = null; return; }
          cubeGame.userMoveStarted(); // el primer giro del usuario arranca el cronómetro
        }
        const d = drag.decided;
        d.theta = clamp((dx * d.su[0] + dy * d.su[1]) / d.len2 / d.vu, -Math.PI, Math.PI);
        setLayerAngle(d.axis, d.ids, d.theta);
        return;
      }
      const orbit = S.orbit;
      if (orbit && e.pointerId === orbit.pointerId) {
        const dx = e.clientX - orbit.x;
        const dy = e.clientY - orbit.y;
        orbit.x = e.clientX;
        orbit.y = e.clientY;
        // Se gira alrededor de la vertical del mundo y del eje "derecha" de la cámara
        const orient = orientRef.current;
        orient.parent.getWorldQuaternion(tmp.qParent).invert();
        tmp.axisY.set(0, 1, 0).applyQuaternion(tmp.qParent);
        camera.getWorldQuaternion(tmp.qCam);
        tmp.axisX.set(1, 0, 0).applyQuaternion(tmp.qCam).applyQuaternion(tmp.qParent);
        tmp.q1.setFromAxisAngle(tmp.axisY, dx * ROTATE_SPEED);
        tmp.q2.setFromAxisAngle(tmp.axisX, dy * ROTATE_SPEED);
        orient.quaternion.premultiply(tmp.q2).premultiply(tmp.q1).normalize();
      }
    };

    const onPointerEnd = (e) => {
      S.layerDown = false;
      if (S.drag && e.pointerId === S.drag.pointerId) {
        endDrag();
        if (S.anim) return;
        pump();
      }
      if (S.orbit && e.pointerId === S.orbit.pointerId) S.orbit = null;
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerEnd);
    window.addEventListener('pointercancel', onPointerEnd);

    // Al salir del modo se suelta lo que se esté arrastrando y no se deja un cronómetro huérfano
    const unsubscribe = subscribeCube((mode) => {
      if (mode === 'entering') {
        // Un giro ambiente a medias se acaba enseguida: así los botones y el arrastre responden ya
        if (S.anim && S.anim.source === 'ambient') S.anim.duration = Math.min(S.anim.duration, 0.2);
        return;
      }
      if (mode !== 'leaving') return;
      S.ambient.wait = Math.max(S.ambient.wait, AMBIENT_REST_AFTER_MODE);
      if (S.drag && S.drag.decided) endDrag();
      else S.drag = null;
      S.orbit = null;
      cubeGame.cancelTiming();
    });

    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerEnd);
      window.removeEventListener('pointercancel', onPointerEnd);
      unsubscribe();
    };
  }, [S, gl, camera, busy, decideLayer, endDrag, pump, setLayerAngle]);

  return (
    <group ref={orientRef}>
      {built.cubies.map((cubie, i) => (
        <group key={i} ref={(g) => { cubieRefs.current[i] = g; }}>
          {/* Relleno negro macizo: cierra el hueco que dejan las láminas sueltas del modelo */}
          <mesh
            geometry={resources.fillGeometry}
            material={resources.fillMaterial}
            position={[cubie.home[0] * 2, cubie.home[1] * 2, cubie.home[2] * 2]}
            onPointerDown={(e) => onCubieDown(e, i)}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={resources.cubies[i]}
            material={material}
            onPointerDown={(e) => onCubieDown(e, i)}
          />
        </group>
      ))}
      {resources.core && <mesh castShadow receiveShadow geometry={resources.core} material={material} />}
    </group>
  );
};

export { RubikCubePieces };
export default RubikCubePieces;
