import * as THREE from 'three'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState, useMemo, useCallback } from 'react'
import { Group, InstancedMesh, Object3D } from 'three'
import { Bvh } from '@react-three/drei'

type Props = JSX.IntrinsicElements['group'] & {}

type PointData = {
  x: number
  y: number
  z: number
  scale: number
}

// Handle imperativo expuesto por el componente para controlar qué instancias están visibles.
type SlamMapHandle = {
  /** Número total de puntos cargados. */
  pointCount: number
  /** Establece la visibilidad de una instancia por índice. */
  setInstanceVisible: (index: number, visible: boolean) => void
  /** Oculta todas las instancias (escala 0) y actualiza las matrices en la GPU. */
  hideAll: () => void
  /** Actualiza las matrices de todas las instancias en la GPU. */
  updateMatrices: () => void
  /** Obtiene las posiciones de los puntos cargados. */
  getPoints: () => PointData[]
}

export const Slammap = forwardRef<SlamMapHandle, Props>(({ ...props }, ref) => {
  const [points, setPoints] = useState<PointData[]>([])
  const pointsRef = useRef<PointData[]>([])
  const meshRef = useRef<InstancedMesh>(null)
  const dummy = useRef(new Object3D())

  pointsRef.current = points

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}euroc.txt`)
      .then(res => res.text())
      .then(text => {
        const lines = text.split('\n').filter(Boolean)
        const parsed = lines.map(line => {
          let [x, y, z, scale] = line.trim().split(/\s+/).map(Number)
          return { x, y, z, scale }
        })
        const reduced = parsed.filter((_, index) => index % 3 === 0)

        console.log('[Slammap] puntos cargados:', reduced.length)
        setPoints(reduced)
      })
      .catch(() => setPoints([]))
  }, [])

  useEffect(() => {
    if (!meshRef.current) return
    points.forEach((point, i) => {
      dummy.current.position.set(point.x, point.y, point.z)
      // Empiezan ocultos (escala 0); Slamcamera los revela al entrarle el frustum.
      dummy.current.scale.set(0, 0, 0)
      dummy.current.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.current.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [points])

  const setInstanceVisible = useCallback((index: number, visible: boolean) => {
    const mesh = meshRef.current
    if (!mesh || index < 0 || index >= mesh.count) return
    const p = pointsRef.current[index]
    if (!p) return
    const s = visible ? p.scale : 0 // 1 == visible, 0 == oculta
    // Es CRÍTICO reasignar la posición de este índice: dummy es compartido y,
    // si no se resetea, la matriz quedaría con la posición de la última instancia inicializada.
    dummy.current.position.set(p.x, p.y, p.z)
    dummy.current.scale.set(s, s, s)
    dummy.current.updateMatrix()
    mesh.setMatrixAt(index, dummy.current.matrix)
    mesh.instanceMatrix.needsUpdate = true
  }, [])

  const hideAll = useCallback(() => {
    const mesh = meshRef.current
    if (!mesh) return
    for (let i = 0; i < mesh.count; i++) {
      dummy.current.position.set(0, 0, 0)
      dummy.current.scale.set(0, 0, 0)
      dummy.current.updateMatrix()
      mesh.setMatrixAt(i, dummy.current.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  }, [])

  const updateMatrices = useCallback(() => {
    const mesh = meshRef.current
    if (!mesh) return
    mesh.instanceMatrix.needsUpdate = true
  }, [])

  const getPoints = useCallback((): PointData[] => pointsRef.current, [])

  // Expone el handle imperativo por el ref del componente.
  useImperativeHandle(ref, () => ({
    pointCount: points.length,
    setInstanceVisible,
    hideAll,
    updateMatrices,
    getPoints,
  }), [points.length, setInstanceVisible, hideAll, updateMatrices, getPoints])

  // Memoized geometry and material
  const sphereGeometry = useMemo(
    () => <sphereGeometry args={[0.01, 0.1, 0.1]} />,
    []
  )
  const meshMaterial = useMemo(
    () => <meshStandardMaterial color="red" />,
    []
  )

  return (
    <group {...props}>
      <Bvh>
        {points.length > 0 && (
          <instancedMesh castShadow receiveShadow
            ref={meshRef}
            args={[undefined, undefined, points.length]}
          >
            {sphereGeometry}
            {meshMaterial}
          </instancedMesh>
        )}
      </Bvh>
    </group>
  )
})

export type { SlamMapHandle }

