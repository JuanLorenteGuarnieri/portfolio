import * as THREE from 'three'
import { forwardRef, useEffect, useRef, useState, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { Drone } from './Drone'
import type { SlamMapHandle } from './Slammap'

type Pose = {
  // timestamp normalizado en segundos (comienza en 0)
  timestamp: number
  position: THREE.Vector3
  quaternion: THREE.Quaternion
}

type Props = JSX.IntrinsicElements['group'] & {
  /** Ref del Slammap para activar/desactivar instancias de puntos. */
  mapRef?: React.RefObject<SlamMapHandle | null>
}

// Máximo de puntos nuevos que se revelan por cada timestamp de la cámara.
const MAX_NEW_POINTS_PER_TIMESTAMP = 3

export const Slamcamera = forwardRef<Group, Props>(({ mapRef, ...props }, ref) => {
  const [poses, setPoses] = useState<Pose[]>([])
  const meshRef = useRef<THREE.Mesh>(null!)
  const clockRef = useRef(new THREE.Clock(false)) // arranca detenido
  // Último timestamp de cámara procesado, para revelar solo al avanzar a un nuevo timestamp.
  const lastTimestampRef = useRef<number | null>(null)
  // Índices de puntos del mapa ya revelados (permanecen visibles de forma acumulativa).
  const revealedIndicesRef = useRef<Set<number>>(new Set())
  // Cámara auxiliar para construir el frustum a partir de la pose actual.
  const camRef = useRef(new THREE.PerspectiveCamera(60, 1, 0.01, 60))
  const frustumRef = useRef(new THREE.Frustum())
  const pointRef = useRef(new THREE.Vector3())

  // Carga y normaliza
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}euroc_camera.txt`)
      .then(res => res.text())
      .then(text => {
        const lines = text.split('\n').filter(Boolean)
        const raw = lines.map(line => {
          const [ts, tx, ty, tz, qx, qy, qz, qw] = line
            .trim()
            .split(/[,\s]+/)
            .map(Number)
          return { ts, tx, ty, tz, qx, qy, qz, qw }
        })
        if (raw.length === 0) return

        // Normalizar timestamps para que empiecen en 0
        const t0 = raw[0].ts
        const parsed: Pose[] = raw.map(r => ({
          timestamp: (r.ts - t0) / 1e8,                // ahora en segundos (o fracción)
          position: new THREE.Vector3(r.tx, r.ty, r.tz),
          quaternion: new THREE.Quaternion(r.qx, r.qy, r.qz, r.qw),
        }))

        console.log('[Slamcamera] poses cargadas:', parsed.length, 'rango ts:', parsed[0].timestamp, '→', parsed[parsed.length - 1].timestamp)
        setPoses(parsed)
        clockRef.current.start() // arrancamos la animación
      })
      .catch(err => {
        console.error('Error cargando la trayectoria:', err)
        setPoses([])
      })
  }, [])

  // Cuando el mapa o las poses se recargan, reiniciamos el estado de revelado.
  useEffect(() => {
    lastTimestampRef.current = null
    revealedIndicesRef.current.clear()
  }, [poses.length])

  /**
   * Revela como máximo MAX_NEW_POINTS_PER_TIMESTAMP puntos del slammap que:
   * 1. Estén dentro del frustum de la cámara en esta pose.
   * 2. Aún no hayan sido revelados.
   * Los puntos se eligen de cerca a lejos y se marcan como visibles de forma persistente.
   */
  const revealPointsInFrustum = useCallback((pose: Pose) => {
    const map = mapRef?.current
    if (!map) return

    const points = map.getPoints()
    if (points.length === 0) {
      console.log('[Slamcamera] reveal: no hay puntos aún')
      return
    }

    console.log('[Slamcamera] reveal en ts=', pose.timestamp, 'pos=', pose.position.toArray().map(v => v.toFixed(2)), 'total puntos=', points.length, 'ya revelados=', revealedIndicesRef.current.size)

    const cam = camRef.current
    cam.position.copy(pose.position)
    cam.quaternion.copy(pose.quaternion)
    cam.updateMatrixWorld()
    frustumRef.current.setFromProjectionMatrix(
      new THREE.Matrix4().multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse)
    )

    // Candidatos: dentro del frustum y aún no revelados, ordenados de cerca a lejos.
    const candidates: { index: number; dist2: number }[] = []
    let dentro = 0
    for (let i = 0; i < points.length; i++) {
      if (revealedIndicesRef.current.has(i)) continue
      const p = points[i]
      pointRef.current.set(p.x, p.y, p.z)
      if (!frustumRef.current.containsPoint(pointRef.current)) continue
      dentro++
      candidates.push({ index: i, dist2: pointRef.current.distanceToSquared(pose.position) })
    }
    // Mezcla aleatoria (Fisher-Yates) para que aparezcan en orden aleatorio, no de cerca a lejos.
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    const toReveal = candidates.slice(0, MAX_NEW_POINTS_PER_TIMESTAMP)
    console.log('[Slamcamera] candidats dentro del frustum=', dentro, 'se revelan=', toReveal.length, 'índices=', toReveal.map(c => c.index))
    for (const { index } of toReveal) {
      revealedIndicesRef.current.add(index)
      map.setInstanceVisible(index, true)
    }
    if (toReveal.length > 0) {
      map.updateMatrices()
      console.log('[Slamcamera] matrices actualizadas, total revelado=', revealedIndicesRef.current.size)
    }
  }, [])

  useFrame(() => {
    const mesh = meshRef.current
    if (!mesh || poses.length === 0) return

    const elapsed = clockRef.current.getElapsedTime() * 9 // en segundos
    // Buscar el índice que coincide o avanza
    // Primera pose con timestamp >= elapsed (búsqueda binaria: las poses vienen ordenadas por tiempo)
    let lo = 0, hi = poses.length
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (poses[mid].timestamp >= elapsed) hi = mid
      else lo = mid + 1
    }
    let idx = lo === poses.length ? -1 : lo
    if (idx === -1) {
      // Si sobrepasamos la última pose, reiniciamos el reloj y ocultamos todo el mapa
      clockRef.current.stop()
      clockRef.current.start()
      idx = 0
      const map = mapRef?.current
      if (map) {
        map.hideAll()
        revealedIndicesRef.current.clear()
        lastTimestampRef.current = null
      }
    }
    const pose = poses[idx]
    // Aplicar
    mesh.position.copy(pose.position)
    mesh.quaternion.copy(pose.quaternion)

    // Al llegar a un nuevo timestamp de cámara, revelamos puntos del slammap dentro del frustum.
    if (lastTimestampRef.current !== pose.timestamp) {
      console.log('[Slamcamera] useFrame idx=', idx, 'ts=', pose.timestamp.toFixed(3), 'mapRef disponible?', !!mapRef?.current)
      lastTimestampRef.current = pose.timestamp
      revealPointsInFrustum(pose)
    }
  })

  return (
    <group ref={ref} {...props}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <Drone position={[0, 0, 0]} scale={0.2} rotation={[Math.PI, Math.PI, 0]} parentPos={[0, 0, 0]} />
      </mesh>
    </group>
  )
})
