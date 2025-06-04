import * as THREE from 'three'
import { forwardRef, useEffect, useRef, useState } from 'react'
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
    fetch('/points3D.txt')
      .then(res => res.text())
      .then(text => {
        const lines = text.split('\n').filter(Boolean)
        const parsed = lines.map(line => {
          const [id, x, y, z, scale] = line.trim().split(/\s+/).map(Number)
          return { id, x, y, z, scale }
        })
        setPoints(parsed)
      })
      .catch(() => setPoints([]))
  }, [])

  useEffect(() => {
    if (!meshRef.current) return
    points.forEach((point, i) => {
      dummy.current.position.set(point.x, point.y, point.z)
      dummy.current.scale.set(point.scale, point.scale, point.scale)
      dummy.current.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.current.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [points])

  return (
    <group ref={ref} {...props}>
      <Bvh firstHitOnly>
        {points.length > 0 && (
          <instancedMesh
            ref={meshRef}
            args={[undefined, undefined, points.length]}
          >
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="red" />
          </instancedMesh>
        )}
      </Bvh>
    </group>
  )
})
