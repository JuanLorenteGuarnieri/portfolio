import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Bvh, Text3D } from '@react-three/drei';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei'

export function useSharedMat() {
  // Carga el modelo GLB solo una vez
  // const { materials } = useGLTF('models/unity.glb') as any

  // Memoiza el material para evitar crear nuevas referencias
  // const sharedMat = useMemo(() => materials['Mat'], [materials])


  const sharedMat = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      color: "white",
      emissive: "white",
      emissiveIntensity: 0,
      roughness: 0.0,
      metalness: 0.3,
      precision: "lowp"
    });
    return material;
  }, []);

  return sharedMat
}
