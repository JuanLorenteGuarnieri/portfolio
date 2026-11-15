// -----------------------------------------------------------------------------------------
// Encuadre del cubo de Rubik: la cámara NO se mueve; solo gira para centrar el cubo y hace zoom
// (el cambio de posición queda para el scroll). Funciones puras, sin three.
//
// El zoom se calcula para que la esfera que envuelve al cubo ocupe siempre la misma fracción de
// la pantalla, esté la cámara más cerca o más lejos (según el punto de scroll en que se haga clic).
// Como la esfera cubre el cubo en cualquier giro, cabe aunque el usuario lo rote.
// -----------------------------------------------------------------------------------------

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/**
 * @param {object} p
 * @param {number[]} p.camera   posición de la cámara (mundo): no cambia
 * @param {number[]} p.center   centro del cubo (mundo)
 * @param {number}   p.radius   radio de la esfera que envuelve al cubo (mundo)
 * @param {number}   p.vTan     tan(fov/2) / zoom BASE de la cámara (sin el zoom del modo)
 * @param {number}   p.aspect   ancho / alto de la pantalla
 * @param {number}   [p.fill=0.42]  fracción de la mitad de pantalla (la más estrecha) que ocupa el radio del cubo
 * @param {number}   [p.minZoom=0.5]
 * @param {number}   [p.maxZoom=4]
 * @returns {{ zoom: number, distance: number, dir: number[] }}
 *   zoom: factor a multiplicar al zoom base; dir: dirección unitaria del cubo hacia la cámara
 */
export function computeCubeView({ camera, center, radius, vTan, aspect, fill = 0.42, minZoom = 0.5, maxZoom = 4 }) {
  const d = [camera[0] - center[0], camera[1] - center[1], camera[2] - center[2]];
  const distance = Math.hypot(d[0], d[1], d[2]);
  const t = Math.min(vTan, vTan * aspect); // mitad más estrecha de la pantalla
  // Tangente del semiángulo con que se ve una esfera de radio R desde la distancia d
  const sphereTan = radius / Math.sqrt(Math.max(1e-6, distance * distance - radius * radius));
  const zoom = clamp((t * fill) / sphereTan, minZoom, maxZoom);
  return { zoom, distance, dir: d.map((v) => v / (distance || 1)) };
}
