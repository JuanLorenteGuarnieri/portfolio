// -----------------------------------------------------------------------------------------
// Pose de la cámara que encuadra el teclado del piano.
//
// Funciones puras con arrays [x, y, z] (sin three) para poder probarlas fuera del navegador.
// La cámara se coloca delante del teclado (del lado del pianista), por encima y mirándolo hacia
// abajo con una inclinación `pitchDeg`, a la distancia justa para que todo el ancho del teclado
// ocupe el ancho de la pantalla (menos un pequeño margen).
// -----------------------------------------------------------------------------------------

const DEG = Math.PI / 180;
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
const norm = (a) => mul(a, 1 / (len(a) || 1));

/**
 * @param {object} p
 * @param {number[]} p.center    centro de la superficie del teclado (mundo)
 * @param {number[]} p.up        eje vertical del piano (mundo, unitario)
 * @param {number[]} p.forward   hacia donde mira el pianista, es decir, del teclado hacia fuera (mundo, unitario)
 * @param {number}   p.width     ancho del teclado (mundo)
 * @param {number}   p.depth     largo de las teclas (mundo)
 * @param {number}   p.vTan      tan(fov/2) / zoom de la cámara (mitad vertical)
 * @param {number}   p.aspect    ancho / alto de la pantalla
 * @param {number}   [p.pitchDeg=62]  inclinación de la cámara respecto a la horizontal (90 = cenital)
 * @param {number}   [p.margin=1.05]  >1 deja aire a los lados
 * @returns {{ position: number[], target: number[], distance: number }}
 */
export function computeKeyboardPose({ center, up, forward, width, depth, vTan, aspect, pitchDeg = 62, margin = 1.05 }) {
  const a = pitchDeg * DEG;
  const hTan = vTan * aspect;
  // Dirección de la mirada: hacia el piano (-forward) y hacia abajo (-up)
  const dir = norm(add(mul(forward, -Math.cos(a)), mul(up, -Math.sin(a))));
  // El borde delantero de las teclas está más cerca de la cámara que el centro, y es el que
  // más "se ensancha" en pantalla: se encuadra ese borde.
  const distance = (margin * width) / (2 * hTan) + (depth / 2) * Math.cos(a);
  const position = add(center, mul(dir, -distance));
  return { position, target: center, distance };
}
