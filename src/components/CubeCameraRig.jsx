import { Quaternion, Vector3 } from 'three';
import FocusCameraRig from './FocusCameraRig';
import { cubeFocus } from '../lib/cubeStore';
import { computeCubeView } from '../lib/cubePose';

// Cámara del modo cubo: NO se mueve (sigue a la misma altura y en el mismo sitio); solo gira para
// centrar el cubo y hace zoom hasta que el cubo ocupe una parte cómoda de la pantalla (ver
// lib/cubePose.js). La luz del cursor se queda quieta delante y encima del cubo, en la dirección
// de la cámara.

const FILL = 0.42; // fracción de la mitad de pantalla que ocupa el radio del cubo (más = más zoom)
const MAX_ZOOM = 4;
const FAR_MULTIPLIER = 3; // el plano lejano de la cámara (`far`) se triplica al clicar el cubo y se restaura al salir

// Luz de foco (RGB en espacio lineal): casi blanca, para que se vean bien los colores de las pegatinas
const LIGHT_TOWARD_CAMERA = 1.5; // m desde el centro del cubo hacia la cámara
const LIGHT_UP = 0.25; // m extra hacia arriba
const LIGHT_COLOR = [0.133, 0.188, 0.376];
const LIGHT_INTENSITY = 9;
const LIGHT_DISTANCE = 8;

const aPos = new Vector3();
const aQuat = new Quaternion();
const aScale = new Vector3();

function getPose(cam, info, { home, baseZoom }) {
  info.anchor.updateWorldMatrix(true, false);
  info.anchor.matrixWorld.decompose(aPos, aQuat, aScale);
  const center = [aPos.x, aPos.y, aPos.z];
  const radius = info.radius * aScale.x;
  const camera = [home.position.x, home.position.y, home.position.z];

  const view = computeCubeView({
    camera,
    center,
    radius,
    vTan: Math.tan((cam.fov * Math.PI) / 360) / baseZoom,
    aspect: cam.aspect,
    fill: FILL,
    maxZoom: MAX_ZOOM,
  });

  return {
    position: camera, // la cámara no se mueve
    target: center,
    zoom: view.zoom,
    light: {
      position: [
        center[0] + view.dir[0] * LIGHT_TOWARD_CAMERA,
        center[1] + view.dir[1] * LIGHT_TOWARD_CAMERA + LIGHT_UP,
        center[2] + view.dir[2] * LIGHT_TOWARD_CAMERA,
      ],
      color: LIGHT_COLOR,
      intensity: LIGHT_INTENSITY,
      distance: LIGHT_DISTANCE,
    },
  };
}

const CubeCameraRig = () => (
  <FocusCameraRig id="cube" store={cubeFocus} getPose={getPose} farMultiplier={FAR_MULTIPLIER} />
);

export default CubeCameraRig;
