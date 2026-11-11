// Fórmula única de "¿está esto cerca de la cámara y por delante de ella?".
// La usan Home (visibilidad de secciones/proyectos/luces) y el precalentamiento de la escena.
export const isVisibleFrom = (cam, v1, dist) => {
  const dx = v1.x - cam.x;
  const dy = v1.y - cam.y;
  const dz = v1.z - cam.z;
  // Delante de la cámara (con 3 unidades de margen) y a menos de `dist` unidades
  return cam.z + 3 > v1.z && Math.sqrt(dx * dx + dy * dy + dz * dz) < dist;
};
