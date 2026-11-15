import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Matrix4, Quaternion, Vector3 } from 'three';
import { lightFocusSlot, releaseLightFocus } from '../lib/lightFocus';
import { baseZoom } from '../lib/cameraZoom';

// -----------------------------------------------------------------------------------------
// Lleva la cámara desde su posición de scroll hasta un objeto (piano, cubo de Rubik...) y de
// vuelta, y coloca la luz de foco mientras tanto.
//
// Durante el vuelo se interpola entre dos poses:
//   - "casa":   la que tenía la cámara al hacer clic (se guarda al empezar),
//   - "objeto": la que devuelve `getPose(cámara, info)`. Se recalcula en cada frame a partir de la
//               cámara actual, así que se adapta sola si se cambia el tamaño de la ventana o si
//               el objeto se mueve.
// Opcionalmente cambia el plano lejano (`far`) de la cámara mientras dura el modo: al empezar a
// entrar se multiplica por `farMultiplier` y al terminar de salir se devuelve el valor que tenía.
//
// El progreso (0..1) avanza hacia su objetivo con velocidad constante, de modo que si se sale a
// mitad de vuelo la cámara da la vuelta suavemente desde donde esté.
//
// getPose(cámara, info, { home, baseZoom }) devuelve { position, target, zoom?, light } con arrays
// [x, y, z]. `home.position` es donde estaba la cámara al empezar (un modo que no quiera mover la
// cámara devuelve esa misma posición: solo gira). `zoom` (por defecto 1) multiplica el zoom base de
// la cámara al llegar. `light` describe la luz de foco: { position, color (RGB lineal), intensity,
// distance }.
// -----------------------------------------------------------------------------------------

const UP = new Vector3(0, 1, 0);
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * @param {object} props
 * @param {string} props.id        nombre del modo ('piano', 'cube'): identifica su ranura de luz
 * @param {object} props.store     createFocusStore()
 * @param {(cam: object, info: object, ctx: { home: { position: Vector3 }, baseZoom: number }) => { position: number[], target: number[], zoom?: number, light: object }} props.getPose
 * @param {number} [props.duration] segundos de ida (y de vuelta)
 * @param {number} [props.farMultiplier] factor del plano lejano de la cámara durante el modo (1 = no se toca)
 */
const FocusCameraRig = ({ id, store, getPose, duration = 1.5, farMultiplier = 1 }) => {
  const progress = useRef(0);
  const captured = useRef(false);
  const t = useMemo(
    () => ({
      homePos: new Vector3(),
      homeQuat: new Quaternion(),
      homeFar: 0,
      home: { position: new Vector3() },
      pos: new Vector3(),
      tgt: new Vector3(),
      quat: new Quaternion(),
      matrix: new Matrix4(),
    }),
    [],
  );

  // Devuelve a la cámara el plano lejano que tenía antes del modo (no actualiza la matriz de proyección)
  const restoreFar = (cam) => {
    if (farMultiplier !== 1 && t.homeFar) cam.far = t.homeFar;
  };

  useFrame((state, delta) => {
    const mode = store.getMode();
    if (mode === 'idle') {
      captured.current = false;
      progress.current = 0;
      releaseLightFocus(id);
      return;
    }

    const info = store.getInfo();
    const cam = state.camera;
    if (!info || !info.anchor) {
      if (captured.current) {
        restoreFar(cam);
        cam.updateProjectionMatrix();
      }
      store.setMode('idle'); // sin objeto registrado no hay nada que encuadrar
      releaseLightFocus(id);
      return;
    }

    if (!captured.current) {
      t.homePos.copy(cam.position);
      t.homeQuat.copy(cam.quaternion);
      captured.current = true;
      progress.current = 0;
      // Plano lejano del modo: se cambia al empezar (en el clic), no poco a poco
      t.homeFar = cam.far;
      if (farMultiplier !== 1) {
        cam.far = t.homeFar * farMultiplier;
        cam.updateProjectionMatrix();
      }
    }

    // Progreso hacia el objetivo (1 = en el objeto, 0 = en su sitio)
    const goal = mode === 'entering' || mode === 'active' ? 1 : 0;
    const step = Math.min(delta, 0.05) / duration;
    const p = goal > progress.current
      ? Math.min(goal, progress.current + step)
      : Math.max(goal, progress.current - step);
    progress.current = p;
    store.setProgress(p);

    // Pose "objeto" y mezcla con la de "casa"
    t.home.position.copy(t.homePos);
    const zoom0 = baseZoom(window.innerWidth, window.innerHeight);
    const pose = getPose(cam, info, { home: t.home, baseZoom: zoom0 });
    t.pos.fromArray(pose.position);
    t.tgt.fromArray(pose.target);
    t.matrix.lookAt(t.pos, t.tgt, UP);
    t.quat.setFromRotationMatrix(t.matrix);

    const e = easeInOutCubic(p);
    cam.position.lerpVectors(t.homePos, t.pos, e);
    cam.quaternion.copy(t.homeQuat).slerp(t.quat, e);
    cam.updateMatrixWorld();
    // Zoom: se parte siempre del zoom base de la ventana (así sigue bien si se redimensiona)
    const zoom = zoom0 * (1 + ((pose.zoom ?? 1) - 1) * e);
    if (Math.abs(cam.zoom - zoom) > 1e-6) {
      cam.zoom = zoom;
      cam.updateProjectionMatrix();
    }

    // Luz de foco: se mezcla con la luz del cursor según el progreso del vuelo
    const slot = lightFocusSlot(id);
    const l = pose.light;
    slot.amount = e;
    slot.position[0] = l.position[0]; slot.position[1] = l.position[1]; slot.position[2] = l.position[2];
    slot.color[0] = l.color[0]; slot.color[1] = l.color[1]; slot.color[2] = l.color[2];
    slot.intensity = l.intensity;
    slot.distance = l.distance;

    if (p >= 1 && mode === 'entering') store.setMode('active');
    if (p <= 0 && mode === 'leaving') {
      cam.position.copy(t.homePos);
      cam.quaternion.copy(t.homeQuat);
      cam.zoom = zoom0;
      restoreFar(cam);
      cam.updateProjectionMatrix();
      cam.updateMatrixWorld();
      releaseLightFocus(id);
      store.setMode('idle'); // CameraController recalcula entonces la orientación y los márgenes
    }
  });

  return null;
};

export default FocusCameraRig;
