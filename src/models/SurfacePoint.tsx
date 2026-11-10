import * as THREE from 'three'
import { forwardRef, useMemo, useState, useEffect } from 'react'
import { Group } from 'three'

type Props = JSX.IntrinsicElements['group'] & {
  centerLatLon: [number, number]
  distance: number
  sphereRadius?: number
  sphereColor?: string
}

export const SurfacePoint = forwardRef<Group, Props>(
  (
    {
      centerLatLon,
      distance,
      sphereRadius = 0.05,
      sphereColor = 'hotpink',
      ...props
    },
    ref
  ) => {
    const [mouseXY, setMouseXY] = useState<[number, number]>([0.5, 0.5])

    useEffect(() => {
      function handlePointerMove(e: MouseEvent) {
        const x = e.clientX / window.innerWidth
        const y = e.clientY / window.innerHeight
        setMouseXY([x, y])
      }
      window.addEventListener('pointermove', handlePointerMove)
      return () => {
        window.removeEventListener('pointermove', handlePointerMove)
      }
    }, [])

    const [longitude, latitude] = useMemo(() => {
      const [x, y] = mouseXY
      const width = 1
      const height = 1
      const longitude = (x / width) * Math.PI - Math.PI / 2
      const latitude = (y / height) * Math.PI - (Math.PI / 2)
      return [longitude, latitude]
    }, [mouseXY])

    const dx = Math.cos(latitude) * Math.cos(longitude)
    const dy = Math.sin(latitude)
    const dz = Math.cos(latitude) * Math.sin(longitude)

    const spherePos: [number, number, number] = [
      dx * distance,
      dy * distance,
      dz * distance,
    ]

    // Memoizar geometría y material
    const sphereGeometry = useMemo(
      () => <sphereGeometry args={[sphereRadius, 32, 32]} />,
      [sphereRadius]
    )
    const sphereMaterial = useMemo(
      () => <meshStandardMaterial color={sphereColor} />,
      [sphereColor]
    )

    return (
      <group ref={ref} {...props}>
        <mesh position={spherePos}>
          {sphereGeometry}
          {sphereMaterial}
        </mesh>
      </group>
    )
  }
)
