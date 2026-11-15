import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, Raycaster, Vector2, Vector3 } from 'three';
import { getCursorScreen, getLightFocus } from '../lib/lightFocus';

// -----------------------------------------------------------------------------------------
// Aplica la luz de foco a la luz del cursor (la pointLight llamada "cursor", ver HomeScene).
//
// Mientras no hay modo foco no hace nada: Home mueve la luz bajo el ratón como siempre. En modo
// piano / modo cubo mezcla, según el progreso del vuelo de cámara, entre
//   - la luz del cursor (posición sobre el suelo bajo el ratón, su color y su intensidad), y
//   - la luz de foco (quieta, sobre el objeto, con su color, intensidad y alcance).
// Con la mezcla completa la luz ya no depende del ratón (Home deja de moverla: lightFocus.js).
// Al salir se restauran los valores originales de la luz.
// -----------------------------------------------------------------------------------------

const CURSOR_LIGHT_Y = 0.4; // altura a la que Home pone la luz sobre el suelo
const MAX_RAY = 15; // límite para no lanzar la luz lejísimos si el rayo casi no toca el suelo

const raycaster = new Raycaster();
const ndc = new Vector2();
const cursorPos = new Vector3();
const focusPos = new Vector3();
const focusColor = new Color();

const lerp = (a, b, t) => a + (b - a) * t;

const FocusLight = () => {
  const lightRef = useRef(null);
  const base = useRef(null);
  const active = useRef(false);

  useFrame(({ scene, camera }) => {
    if (!lightRef.current) lightRef.current = scene.getObjectByName('cursor') ?? null;
    const light = lightRef.current;
    if (!light) return;
    if (!base.current) base.current = { intensity: light.intensity, distance: light.distance, color: light.color.clone() };

    const focus = getLightFocus();
    if (!focus) {
      if (active.current) {
        // Fin del modo: la luz recupera sus valores de siempre (la posición ya coincide con la del cursor)
        light.intensity = base.current.intensity;
        light.distance = base.current.distance;
        light.color.copy(base.current.color);
        active.current = false;
      }
      return;
    }
    if (!active.current) {
      cursorPos.copy(light.position); // punto de partida del primer frame
      active.current = true;
    }

    // Dónde estaría la luz si siguiera al cursor, con la cámara de ahora (el suelo bajo el ratón)
    const c = getCursorScreen();
    const sx = c.known ? c.x : window.innerWidth / 2;
    const sy = c.known ? c.y : window.innerHeight / 2;
    ndc.set((sx / window.innerWidth) * 2 - 1, -(sy / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const { origin, direction } = raycaster.ray;
    if (direction.y !== 0) {
      const t = -origin.y / direction.y;
      if (t >= 0) {
        cursorPos.copy(direction).multiplyScalar(Math.min(t, MAX_RAY)).add(origin);
        cursorPos.y = CURSOR_LIGHT_Y;
      }
    }

    const a = focus.amount;
    focusPos.fromArray(focus.position);
    light.position.lerpVectors(cursorPos, focusPos, a);
    light.intensity = lerp(base.current.intensity, focus.intensity, a);
    light.distance = lerp(base.current.distance, focus.distance, a);
    focusColor.setRGB(focus.color[0], focus.color[1], focus.color[2]);
    light.color.lerpColors(base.current.color, focusColor, a);
  });

  return null;
};

export default FocusLight;
