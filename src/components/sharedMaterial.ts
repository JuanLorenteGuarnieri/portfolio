import * as THREE from 'three';

// Un único material para todos los textos 3D y los iconos/modelos que lo usan.
// Antes `useSharedMat()` creaba un MeshStandardMaterial NUEVO por cada componente
// (decenas de instancias idénticas a pesar del nombre). Nadie muta este material (Python.tsx
// lo clona antes de modificarlo), así que compartir la misma instancia es seguro y
// reduce cambios de estado y subidas de uniforms en la GPU.
const sharedMaterial = new THREE.MeshStandardMaterial({
  color: "white",
  emissive: "white",
  emissiveIntensity: 0,
  roughness: 0.0,
  metalness: 0.3,
  precision: "lowp",
});

export function useSharedMat() {
  return sharedMaterial;
}
