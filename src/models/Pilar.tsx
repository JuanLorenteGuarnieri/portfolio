import * as THREE from 'three'
import { forwardRef, useEffect, useRef, useState, useMemo } from 'react'
import { Group, InstancedMesh, Object3D } from 'three'
import { Bvh } from '@react-three/drei'

type Props = JSX.IntrinsicElements['group'] & {}

type PointData = {
  id: number
  x: number
  y: number
  z: number
  scale: number
}

export const Pilar = forwardRef<Group, Props>(({ ...props }, ref) => {
  const [points, setPoints] = useState<PointData[]>([])
  const meshRef = useRef<InstancedMesh>(null)
  const dummy = useRef(new Object3D())

  useEffect(() => {
    fetch('https://JuanLorenteGuarnieri.github.io/portfolio/points3D.txt')
      .then(res => res.text())
      .then(text => {
        const lines = text.split('\n').filter(Boolean)
        const parsed = lines.map(line => {
          let [id, x, y, z, scale] = line.trim().split(/\s+/).map(Number)
          x = -x + 2
          y = y - 0.2
          z = (z - 7) * 1.3
          return { id, x, y, z, scale }
        })
        setPoints(parsed)
      })
      .catch(() => setPoints([]))
  }, [])

  useEffect(() => {
    if (!meshRef.current) return
    points.forEach((point, i) => {
      dummy.current.position.set(point.x, point.z, point.y)
      dummy.current.scale.set(point.scale / 20, point.scale / 20, point.scale / 20)
      dummy.current.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.current.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [points])

  // Memoized geometry and material
  const sphereGeometry = useMemo(
    () => <sphereGeometry args={[1, 1, 1]} />,
    []
  )
  const meshMaterial = useMemo(
    () => <meshStandardMaterial color="red" />,
    []
  )

  return (
    <group ref={ref} {...props}>
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
