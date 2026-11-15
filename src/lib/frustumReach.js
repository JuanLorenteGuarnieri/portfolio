// -----------------------------------------------------------------------------------------
// ¿Hasta dónde llega lo que ve la cámara?
//
// La cámara está a una altura fija mirando hacia abajo y hacia -Z. Los valores `dist` con los que
// se decide qué secciones/proyectos se ocultan se ajustaron para una ventana 16:9. Pero la zona
// del suelo que entra en pantalla cambia con la proporción de la ventana: R3F fija el `fov` solo
// al montar el Canvas mientras que el `zoom` se recalcula en cada resize, así que, por ejemplo,
// pasar de 16:9 a una ventana cuadrada hace que se vea ~4 unidades más lejos y las secciones
// empiecen a desaparecer a la vista cerca del borde superior.
//
// Aquí se calcula, con la geometría real de la cámara, cuánto más lejos (delante) y cuánto más
// atrás (detrás) llega la pantalla respecto a la cámara de referencia con la que se afinaron los
// valores. Esa diferencia se suma a todas las distancias de ocultación, de modo que cada objeto
// conserva su margen original.
// -----------------------------------------------------------------------------------------

const DEG = Math.PI / 180;

/**
 * Alcance horizontal (sobre el plano y = planeY) de los rayos superior e inferior de la pantalla.
 *
 * @param originY  altura de la cámara
 * @param pitch    ángulo (rad) del eje de la cámara por debajo de la horizontal (positivo = mira hacia abajo)
 * @param vTan     tangente del semiángulo vertical EFECTIVO: tan(fov/2) / zoom
 * @param planeY   plano sobre el que se mide (0 = suelo: es el que más lejos llega)
 * @returns { ahead, behind, slant }  ahead: unidades hacia delante hasta donde llega el borde
 *          superior de la pantalla; behind: unidades hacia atrás del borde inferior (puede ser
 *          negativo si el borde inferior mira hacia delante); slant: distancia en línea recta
 *          cámara → punto del suelo del borde superior.
 */
export function frustumReach(originY, pitch, vTan, planeY = 0) {
  const half = Math.atan(vTan);
  const h = originY - planeY;
  const top = pitch - half;     // rayo del borde superior (el más lejano)
  const bottom = pitch + half;  // rayo del borde inferior

  const MAX = 1000;
  const ahead = top > 1e-3 ? Math.min(MAX, h / Math.tan(top)) : MAX;
  const behind = -h / Math.tan(bottom); // si bottom > 90°, tan < 0 => behind > 0
  const slant = top > 1e-3 ? Math.min(MAX, h / Math.sin(top)) : MAX;
  return { ahead, behind, slant, half };
}

// Cámara con la que se afinaron los valores: ventana 16:9 recién cargada.
const REF_RATIO = 16 / 9;
const REF_FOV = REF_RATIO * (180 / Math.PI / 1.6);
const REF_ZOOM = REF_RATIO / 1.6;
const REF_HEIGHT = 5;
const REF_PITCH = Math.atan2(REF_HEIGHT, 2 - Math.min(0.5, 1 / REF_RATIO));
const REF = frustumReach(REF_HEIGHT, REF_PITCH, Math.tan(REF_FOV * DEG / 2) / REF_ZOOM);

/**
 * Margen extra que hay que sumar a las distancias de ocultación para la cámara actual.
 * Nunca es negativo: si la pantalla ve menos que la de referencia se mantienen los valores originales.
 *
 * @param cam  { fov, zoom, position: {y}, forward: {y, horizontal} }  (forward = dirección de la cámara)
 * @returns { ahead, behind, farNeeded }
 */
export function viewMargins({ fov, zoom, height, pitch }) {
  const vTan = Math.tan(fov * DEG / 2) / zoom;
  const r = frustumReach(height, pitch, vTan);
  return {
    ahead: Math.max(0, r.ahead - REF.ahead),
    behind: Math.max(0, r.behind - REF.behind),
    // profundidad (a lo largo del eje de la cámara) a la que queda el suelo en el borde superior
    farNeeded: r.slant * Math.cos(r.half),
  };
}
