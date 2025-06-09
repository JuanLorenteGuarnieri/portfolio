import * as THREE from 'three'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { Drone } from './Drone'

type Pose = {
  // timestamp normalizado en segundos (comienza en 0)
  timestamp: number
  position: THREE.Vector3
  quaternion: THREE.Quaternion
}

type Props = JSX.IntrinsicElements['group']

export const Slamcamera = forwardRef<Group, Props>(({ ...props }, ref) => {
  const [poses, setPoses] = useState<Pose[]>([])
  const meshRef = useRef<THREE.Mesh>(null!)
  const clockRef = useRef(new THREE.Clock(false)) // arranca detenido

  // Carga y normaliza
  useEffect(() => {
    fetch('https://JuanLorenteGuarnieri.github.io/portfolio/euroc_camera.txt')
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

        setPoses(parsed)
        clockRef.current.start() // arrancamos la animación
      })
      .catch(err => {
        console.error('Error cargando la trayectoria:', err)
        setPoses([])
      })
  }, [])

  useFrame(() => {
    const mesh = meshRef.current
    if (!mesh || poses.length === 0) return

    const elapsed = clockRef.current.getElapsedTime() * 9 // en segundos
    // Buscar el índice que coincide o avanza
    let idx = poses.findIndex(p => p.timestamp >= elapsed)
    if (idx === -1) {
      // Si sobrepasamos la última pose, reiniciamos el reloj
      clockRef.current.stop()
      clockRef.current.start()
      idx = 0
    }
    const pose = poses[idx]
    // Aplicar
    mesh.position.copy(pose.position)
    mesh.quaternion.copy(pose.quaternion)
  })

  return (
    <group ref={ref} {...props}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <Drone position={[0, 0, 0]} scale={0.2} rotation={[Math.PI, Math.PI, 0]} parentPos={[0, 0, 0]} />
      </mesh>
    </group>
  )
})
