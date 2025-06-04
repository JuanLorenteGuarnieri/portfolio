// bvh-setup.tsx
import * as THREE from 'three'
import {
  computeBoundsTree,
  disposeBoundsTree,
  acceleratedRaycast,
} from 'three-mesh-bvh'

// 1) Extiende BufferGeometry para poder llamar computeBoundsTree() y disposeBoundsTree()
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree

// 2) Sustituye el raycast de Mesh por la versión acelerada
THREE.Mesh.prototype.raycast = acceleratedRaycast
