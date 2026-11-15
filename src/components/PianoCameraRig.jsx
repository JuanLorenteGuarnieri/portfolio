import { Quaternion, Vector3 } from 'three';
import FocusCameraRig from './FocusCameraRig';
import { pianoFocus } from '../lib/pianoStore';
import { computeKeyboardPose } from '../lib/pianoPose';

// Cámara del modo piano: encuadra todo el teclado a lo ancho de la pantalla (ver lib/pianoPose.js)
// y pone la luz del cursor, quieta, sobre las teclas.

const PITCH_DEG = 62; // inclinación de la cámara sobre el teclado (90 = vista cenital)
const MARGIN = 1.05; // aire a los lados del teclado
const DEG = Math.PI / 180;

// Luz de foco sobre el teclado (RGB en espacio lineal). Más alta = más uniforme a lo largo del
// teclado pero menos brillante; más baja = un "charco" de luz en el centro.
const LIGHT_UP = 1.45; // m sobre la superficie de las teclas
const LIGHT_FORWARD = 0.1; // m hacia el pianista
const LIGHT_COLOR = [0.133, 0.188, 0.376];
const LIGHT_INTENSITY = 10;
const LIGHT_DISTANCE = 8;

const aPos = new Vector3();
const aQuat = new Quaternion();
const aScale = new Vector3();
const up = new Vector3();
const forward = new Vector3();

function getPose(cam, info) {
  // Se mide el teclado en el mundo (posición, ejes y tamaño reales)
  info.anchor.updateWorldMatrix(true, false);
  info.anchor.matrixWorld.decompose(aPos, aQuat, aScale);
  up.set(0, 1, 0).applyQuaternion(aQuat);
  forward.set(0, 0, 1).applyQuaternion(aQuat); // hacia donde se sienta el pianista

  const width = info.width * aScale.x;
  const depth = info.depth * aScale.z;
  // Las teclas se alargan hacia delante (ver PianoKeys): el centro del teclado se desplaza con ellas
  const shift = ((info.stretch - 1) * depth) / 2;
  const center = [aPos.x + forward.x * shift, aPos.y + forward.y * shift, aPos.z + forward.z * shift];

  const pose = computeKeyboardPose({
    center,
    up: [up.x, up.y, up.z],
    forward: [forward.x, forward.y, forward.z],
    width,
    depth: depth * info.stretch,
    vTan: Math.tan((cam.fov * DEG) / 2) / cam.zoom,
    aspect: cam.aspect,
    pitchDeg: PITCH_DEG,
    margin: MARGIN,
  });

  return {
    position: pose.position,
    target: pose.target,
    light: {
      position: [
        center[0] + up.x * LIGHT_UP + forward.x * LIGHT_FORWARD,
        center[1] + up.y * LIGHT_UP + forward.y * LIGHT_FORWARD,
        center[2] + up.z * LIGHT_UP + forward.z * LIGHT_FORWARD,
      ],
      color: LIGHT_COLOR,
      intensity: LIGHT_INTENSITY,
      distance: LIGHT_DISTANCE,
    },
  };
}

const PianoCameraRig = () => <FocusCameraRig id="piano" store={pianoFocus} getPose={getPose} />;

export default PianoCameraRig;
