import * as THREE from 'three'
import { forwardRef, useMemo, useState, useCallback, useEffect } from 'react'
import { Group } from 'three'

type Props = JSX.IntrinsicElements['group'] & {
  centerLatLon: [number, number] // [lat, lon] en grados
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
    // Estado local para mouseXY
    const [mouseXY, setMouseXY] = useState<[number, number]>([0.5, 0.5])

    // Actualiza mouseXY globalmente con useEffect
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

    // Calcular dirección a partir del ratón usando la nueva fórmula
    const [longitude, latitude] = useMemo(() => {
      const [x, y] = mouseXY
      const width = 1 // mouseXY ya está normalizado [0,1]
      const height = 1
      const longitude = (x / width) * Math.PI - Math.PI / 2 // -pi a pi
      const latitude = (y / height) * Math.PI - (Math.PI / 2) // -pi/2 a pi/2
      return [longitude, latitude]
    }, [mouseXY])



    // Calcular vector de dirección (esféricas a cartesianas)
    const dx = Math.cos(latitude) * Math.cos(longitude)
    const dy = Math.sin(latitude)
    const dz = Math.cos(latitude) * Math.sin(longitude)

    // Calcular posición final
    const spherePos: [number, number, number] = [
      dx * distance,
      dy * distance,
      dz * distance,
    ]

    return (
      <group ref={ref} {...props}>
        <mesh position={spherePos}>
          <sphereGeometry args={[sphereRadius, 32, 32]} />
          <meshStandardMaterial color={sphereColor} />
        </mesh>
      </group>
    )
  }
)
