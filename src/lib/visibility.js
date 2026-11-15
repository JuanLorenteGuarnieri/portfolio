// Fórmula única de "¿está esto cerca de la cámara y por delante de ella?".
// La usan Home (visibilidad de secciones/proyectos/luces) y el precalentamiento de la escena.
//
// `dist` es hasta dónde se ve hacia delante y `behind` el margen por detrás de la cámara.
// Ambos se amplían según la proporción de la ventana (ver lib/frustumReach.js).
export const isVisibleFrom = (cam, v1, dist, behind = 3) => {
  const dx = v1.x - cam.x;
  const dy = v1.y - cam.y;
  const dz = v1.z - cam.z;
  return cam.z + behind > v1.z && Math.sqrt(dx * dx + dy * dy + dz * dz) < dist;
};
