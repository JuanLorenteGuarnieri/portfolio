// -----------------------------------------------------------------------------------------
// Caminata del lemming: qué fotograma se ve y cuántos píxeles se ha desplazado en cada "tick".
// Un tick = un fotograma de la animación = UN píxel de avance (es pixel art: el lemming se mueve
// de píxel en píxel, nunca entre píxeles). Funciones puras para poder probarlas fuera del navegador.
//
// El desplazamiento `offset` es en píxeles respecto al punto donde está colocado el lemming:
// positivo = a la derecha, negativo = a la izquierda.
// -----------------------------------------------------------------------------------------

/**
 * @param {number} tick  número de fotogramas transcurridos desde el inicio (entero >= 0)
 * @param {object} [o]
 * @param {number} [o.frames=8]  fotogramas del ciclo de animación
 * @param {number} [o.range=10]  píxeles que puede alejarse del punto de partida a cada lado
 * @param {boolean} [o.bounce=false]  false: sale del origen (0), camina hacia la izquierda hasta
 *                                    el extremo izquierdo (-range), da la vuelta y vuelve al
 *                                    origen, en bucle. true: va y vuelve entre los dos extremos
 *                                    (derecha +range ↔ izquierda -range).
 * @returns {{ frame: number, offset: number, facingLeft: boolean }}
 */
export function lemmingPose(tick, { frames = 8, range = 10, bounce = false } = {}) {
  const frame = ((tick % frames) + frames) % frames;

  if (!bounce) {
    // Origen → extremo izquierdo → origen, en bucle. Un tick = 1 píxel, periodo 2·range ticks.
    const period = 2 * range;
    const k = range <= 0 ? 0 : ((tick % period) + period) % period;
    const offset = k <= range ? -k : k - 2 * range;
    return { frame, offset: offset || 0, facingLeft: k < range }; // || 0 normaliza -0 a 0
  }

  // Ida (hacia la izquierda) y vuelta (hacia la derecha) entre los dos extremos.
  // Periodo de 2·span ticks donde span = 2·range (píxeles de un extremo al otro).
  const span = 2 * range;
  const period = 2 * span;
  const k = ((tick % period) + period) % period;
  if (k < span) return { frame, offset: range - k, facingLeft: true };
  return { frame, offset: k - span - range, facingLeft: false };
}
