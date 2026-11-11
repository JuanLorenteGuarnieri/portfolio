import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

// -----------------------------------------------------------------------------------------
// PRECALENTAMIENTO DE LA ESCENA
//
// El "lagazo" al ver por primera vez un modelo no viene de React sino de la GPU: three.js hace
// el trabajo de forma perezosa, la primera vez que un objeto llega a dibujarse:
//   1. sube su geometría (buffers) a la GPU,
//   2. sube y genera los mipmaps de sus texturas,
//   3. compila y enlaza sus shaders. Además el programa depende del NÚMERO de luces visibles:
//      cada vez que entra una sección con luces nuevas, TODOS los materiales necesitan una
//      variante nueva del shader.
// Todo ocurre de golpe, en mitad del scroll. Aquí se hace antes, mientras suena la intro:
// se recorre el scroll parando en cada combinación distinta de objetos visibles y se dibuja
// un frame en cada parada (con el frustum culling desactivado para que se suban también los
// objetos que quedan fuera de plano). Cuando termina, el scroll ya no crea nada nuevo.
// -----------------------------------------------------------------------------------------

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => resolve()));

// Resume lo que hay visible: firma de luces (tipo + sombra) y si hay objetos aún no dibujados.
function inspectVisible(scene, seen) {
  const counts = {};
  let fresh = false;
  scene.traverseVisible((o) => {
    if (o.isLight) {
      const k = o.type + (o.castShadow ? '+shadow' : '');
      counts[k] = (counts[k] || 0) + 1;
    } else if ((o.isMesh || o.isPoints || o.isLine || o.isSprite) && !seen.has(o)) {
      seen.add(o);
      fresh = true;
    }
  });
  const sig = Object.keys(counts).sort().map((k) => `${k}:${counts[k]}`).join('|');
  return { sig, fresh };
}

async function runWarmUp({ gl, scene, camera, api, isCancelled }) {
  const t0 = performance.now();
  const stops = api.plan();
  if (!stops.length) return;

  api.begin();
  const startZ = camera.position.z;
  const unculled = [];
  const unculledSet = new WeakSet();
  const seenObjects = new WeakSet();
  const seenLightSigs = new Set();
  let renders = 0;

  try {
    for (const stop of stops) {
      if (isCancelled()) break;

      await api.moveCameraTo(stop.z);
      await nextFrame(); // deja que R3F aplique las propiedades `visible` ya actualizadas

      // Sin frustum culling: se suben también los objetos que quedan fuera de plano en esta parada
      // (se recorre en cada parada por si se han montado objetos nuevos entre tanto).
      scene.traverse((o) => {
        if (o.frustumCulled && !unculledSet.has(o)) {
          o.frustumCulled = false;
          unculledSet.add(o);
          unculled.push(o);
        }
      });

      const { sig, fresh } = inspectVisible(scene, seenObjects);
      // Solo se dibuja si aporta algo: objetos nuevos (geometría/texturas) o una combinación
      // de luces que todavía no se ha compilado.
      if (fresh || !seenLightSigs.has(sig)) {
        gl.render(scene, camera);
        seenLightSigs.add(sig);
        renders += 1;
      }
    }
  } finally {
    unculled.forEach((o) => { o.frustumCulled = true; });
    camera.position.z = startZ;
    api.end();
  }

  // const info = gl.info;
  // // eslint-disable-next-line no-console
  // console.info(
  //   `[warm-up] ${stops.length} paradas, ${renders} frames, ${info.programs ? info.programs.length : '?'} shaders, ` +
  //   `${info.memory.geometries} geometrías, ${info.memory.textures} texturas en ${Math.round(performance.now() - t0)} ms`
  // );
}

/**
 * Se monta dentro del <Canvas>. Al montarse todos los modelos ya han cargado (el Suspense del
 * Canvas no confirma el árbol hasta entonces), así que puede empezar de inmediato.
 */
export default function SceneWarmUp({ api, onDone }) {
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    // Para verificar en la consola del navegador: tras el calentamiento, hacer scroll por toda la
    // página no debe aumentar ninguno de estos números (si aumentan, aún se crea algo al vuelo).
    window.__sceneStats = () => ({
      shaders: gl.info.programs ? gl.info.programs.length : null,
      geometrias: gl.info.memory.geometries,
      texturas: gl.info.memory.textures,
    });
    let cancelled = false;
    runWarmUp({ gl, scene, camera, api, isCancelled: () => cancelled })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.warn('[warm-up] omitido por un error:', err);
      })
      .finally(() => {
        if (!cancelled) onDone();
      });
    return () => { cancelled = true; };
    // Una sola vez: gl, scene y camera son estables durante toda la vida del Canvas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
