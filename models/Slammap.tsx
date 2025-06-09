import * as THREE from 'three'
import { forwardRef, useEffect, useRef, useState, useMemo } from 'react'
import { Group, InstancedMesh, Object3D } from 'three'
import { Bvh } from '@react-three/drei'

type Props = JSX.IntrinsicElements['group'] & {}

type PointData = {
  x: number
  y: number
  z: number
  scale: number
}

export const Slammap = forwardRef<Group, Props>(({ ...props }, ref) => {
  const [points, setPoints] = useState<PointData[]>([])
  const meshRef = useRef<InstancedMesh>(null)
  const dummy = useRef(new Object3D())
  // let count = -1

  useEffect(() => {
    fetch('https://JuanLorenteGuarnieri.github.io/portfolio/euroc.txt')
      .then(res => res.text())
      .then(text => {
        const lines = text.split('\n').filter(Boolean)
        const parsed = lines.map(line => {
          let [x, y, z, scale] = line.trim().split(/\s+/).map(Number)
          return { x, y, z, scale }
        })
        const reduced = parsed.filter((_, index) => index % 3 === 0)

        setPoints(reduced)
      })
      .catch(() => setPoints([]))
  }, [])

  useEffect(() => {
    if (!meshRef.current) return
    points.forEach((point, i) => {
      dummy.current.position.set(point.x, point.y, point.z)
      dummy.current.scale.set(point.scale / 1, point.scale / 1, point.scale / 1)
      dummy.current.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.current.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [points])

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
