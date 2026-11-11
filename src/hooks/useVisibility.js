import { useState, useRef, useCallback } from 'react';
import { isVisibleFrom } from '../lib/visibility';

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => resolve()));

/**
 * Visibilidad por proximidad a la cámara, sin re-renderizar en cada evento de scroll.
 *
 * Cada sección/proyecto decide su `visible` llamando a `isVisibleLight(v1, dist)` mientras se
 * renderiza. Antes eso obligaba a re-renderizar TODO el árbol 3D en cada evento de scroll.
 * Ahora la cámara se mueve de forma imperativa y las llamadas se registran en un mapa; cuando
 * la cámara se mueve se re-evalúan todas (`syncVisibility`) y solo si alguna cambia de resultado
 * se incrementa `visVersion` (lo que re-renderiza las secciones UNA vez, ya con la visibilidad
 * actualizada).
 *
 * @param cameraRef ref a la cámara de three (solo se lee `position`)
 */
export function useVisibility(cameraRef) {
  const [visVersion, setVisVersion] = useState(0);
  const visVersionRef = useRef(0);       // versión pedida (la última que se ha solicitado renderizar)
  const renderedVersionRef = useRef(0);  // versión con la que se ha renderizado el árbol por última vez
  renderedVersionRef.current = visVersion;
  const registry = useRef(new Map());

  const bumpVisibility = useCallback(() => {
    visVersionRef.current += 1;
    setVisVersion(visVersionRef.current);
  }, []);

  const computeVisible = useCallback((v1, dist) => {
    const cam = cameraRef.current;
    return cam ? isVisibleFrom(cam.position, v1, dist) : false;
  }, [cameraRef]);

  // Su identidad cambia con visVersion a propósito: los useMemo de las secciones que la
  // reciben por props recalculan su visibilidad cuando cambia.
  const isVisibleLight = useCallback((v1, dist) => {
    const visible = computeVisible(v1, dist);
    const key = `${v1.x},${v1.y},${v1.z},${dist}`;
    const entry = registry.current.get(key);
    if (entry) {
      entry.visible = visible;
      entry.rendered = renderedVersionRef.current;
    } else {
      registry.current.set(key, { v1, dist, visible, rendered: renderedVersionRef.current });
    }
    return visible;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [computeVisible, visVersion]);

  // Re-evalúa todas las comprobaciones registradas; devuelve las que han cambiado.
  const syncVisibility = useCallback(() => {
    const changed = [];
    registry.current.forEach((entry) => {
      const v = computeVisible(entry.v1, entry.dist);
      if (v !== entry.visible) {
        entry.visible = v;
        changed.push(entry);
      }
    });
    if (changed.length) bumpVisibility();
    return changed;
  }, [computeVisible, bumpVisibility]);

  // Espera (máx. ≈ 0,7 s) a que React haya re-renderizado las comprobaciones que cambiaron.
  const waitUntilRendered = useCallback(async (changed) => {
    const target = visVersionRef.current;
    for (let i = 0; i < 40; i++) {
      if (changed.every((entry) => entry.rendered >= target)) return true;
      await nextFrame();
    }
    return false;
  }, []);

  return { isVisibleLight, syncVisibility, bumpVisibility, waitUntilRendered, registry };
}
