import { isVisibleFrom } from './visibility';

/**
 * Calcula en qué posiciones Z de la cámara hay que "parar" para ver, al menos una vez, cada
 * combinación distinta de objetos visibles mientras se recorre todo el scroll.
 *
 * @param entries  comprobaciones registradas: [{ v1: {x,y,z}, dist }]
 * @param camPos   posición actual de la cámara (solo se usan x e y; z recorre el rango)
 * @param zStart   z de la cámara con scroll = 0
 * @param zEnd     z de la cámara con scroll máximo
 * @param step     resolución del barrido (unidades de escena)
 * @returns        [{ z, sig }] un punto (el centro del tramo) por cada combinación distinta
 */
export function planWarmupStops(entries, camPos, zStart, zEnd, step = 0.05) {
  const runs = [];
  let prevSig = null;
  const cam = { x: camPos.x, y: camPos.y, z: zStart };

  for (let z = zStart; z <= zEnd + 1e-9; z += step) {
    cam.z = z;
    let sig = '';
    for (let i = 0; i < entries.length; i++) {
      sig += isVisibleFrom(cam, entries[i].v1, entries[i].dist) ? '1' : '0';
    }
    if (sig !== prevSig) {
      runs.push({ sig, from: z, to: z });
      prevSig = sig;
    } else {
      runs[runs.length - 1].to = z;
    }
  }

  // Una parada por combinación distinta (la misma combinación puede repetirse en tramos separados)
  const seen = new Set();
  const stops = [];
  for (const run of runs) {
    if (seen.has(run.sig)) continue;
    seen.add(run.sig);
    stops.push({ z: (run.from + run.to) / 2, sig: run.sig });
  }
  return stops;
}
