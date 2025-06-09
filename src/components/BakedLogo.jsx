// File: BakedLogo.jsx
import React, { useRef, useEffect, useState, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * BakedLogo: envuelve a tu <Logo/> (o cualquier grupo de mallas) y prebakea
 * la iluminación de dos PointLight estáticas en un lightMap.
 *
 * Uso:
 * <Canvas>
 *   <Suspense fallback={null}>
 *     <BakedLogo bakeResolution={1024}>
 *       <Logo />
 *     </BakedLogo>
 *   </Suspense>
 * </Canvas>
 *
 * Requisitos:
 * - Cada mesh de <Logo/> debería tener UV2 (canal de lightmap). Si no lo tiene,
 *   se copia UV→UV2 dentro del bake (menos preciso, pero funciona para comprobar).
 */
export function BakedLogo({ children, bakeResolution = 1024 }) {
  const groupRef = useRef()                           // Referencia al grupo donde se monta <Logo/>
  const { gl, camera: mainCamera, scene: mainScene } = useThree()

  // Creamos un RenderTarget “offline” con el tamaño deseado
  const renderTarget = useMemo(
    () =>
      new THREE.WebGLRenderTarget(bakeResolution, bakeResolution, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
      }),
    [bakeResolution]
  )

  // Estado para guardar la textura baked
  const [bakedMap, setBakedMap] = useState(null)
  // Flag para que ejecutes el bake solo una vez
  const [hasBaked, setHasBaked] = useState(false)

  useEffect(() => {
    // Esperamos a un requestAnimationFrame para asegurarnos de que <Logo/> ya está montado
    let raf = requestAnimationFrame(() => {
      if (!hasBaked && groupRef.current && gl && mainCamera) {
        doBake()
        setHasBaked(true)
      }
    })

    return () => cancelAnimationFrame(raf)
  }, [hasBaked, gl, mainCamera, renderTarget])

  // Función que ejecuta el baking
  const doBake = () => {
    const logoGroup = groupRef.current
    if (!logoGroup) return

    // 1) Calculamos el bounding box del logo para encuadrarlo en la cámara de bake
    const bbox = new THREE.Box3().setFromObject(logoGroup)
    const center = bbox.getCenter(new THREE.Vector3())
    const radius = bbox.getBoundingSphere(new THREE.Sphere()).radius

    // 2) Creamos una cámara NUEVA solo para el bake. No tocamos mainCamera en ningún caso.
    const bakeCamera = new THREE.PerspectiveCamera(
      mainCamera.fov,
      1,                // aspect = 1 porque renderTarget es cuadrado
      mainCamera.near,
      mainCamera.far
    )
    bakeCamera.position.copy(mainCamera.position)       // base para calcular dirección
    // Calculamos la dirección hacia la que mira mainCamera:
    const forward = new THREE.Vector3()
    mainCamera.getWorldDirection(forward)                // forward apunta hacia donde “cara” de la cámara
    // Queremos que bakeCamera quede detrás de la esfera del logo, en esa misma dirección:
    const dist = radius / Math.sin(THREE.MathUtils.degToRad(bakeCamera.fov / 2))
    // Colocamos bakeCamera a “dist” unidades detrás del centro, en dirección inversa a forward
    bakeCamera.position.copy(center).addScaledVector(forward, -dist * 1.1)
    bakeCamera.lookAt(center)
    bakeCamera.updateMatrixWorld()
    bakeCamera.aspect = 1
    bakeCamera.updateProjectionMatrix()

    // 3) Clonamos el grupo del logo para baking: clonamos jerarquía + creamos materiales nuevos
    const bakeGroup = logoGroup.clone(true)
    bakeGroup.traverse((node) => {
      if (node.isMesh) {
        // Si no hay UV2, la copiamos desde UV1 (para que Three.js pueda pintar el lightMap)
        const geo = node.geometry
        if (!geo.attributes.uv2 && geo.attributes.uv) {
          geo.setAttribute(
            'uv2',
            new THREE.BufferAttribute(geo.attributes.uv.array.slice(), 2)
          )
        }
        // Clonamos el material para que no modifique el original
        node.material = node.material.clone()
        node.material.lightMap = null
        node.material.needsUpdate = true
      }
    })

    // 4) Montamos temporalmente una escena “de baking” que NO sea la escena principal
    const bakeScene = new THREE.Scene()
    bakeScene.add(bakeGroup)

    // 5) Añadimos las dos PointLight fijas (sin sombras) que queremos bakear
    const COLOR_POINTLIGHT = 0xffffff
    const light1 = new THREE.PointLight(COLOR_POINTLIGHT, 200)
    light1.position.set(0, 1, 22.5)
    light1.castShadow = false
    const light2 = new THREE.PointLight(COLOR_POINTLIGHT, 200)
    light2.position.set(0, 1, 22)
    light2.castShadow = false
    bakeScene.add(light1, light2)

    // (Opcional) Una luz ambiente muy suave para evitar áreas negras:
    // const ambient = new THREE.AmbientLight(0xffffff, 0.05)
    // bakeScene.add(ambient)

    // 6) Guardamos el background/fog original (por si los hubiera)
    const prevBackground = bakeScene.background
    const prevFog = bakeScene.fog
    // Dejar todo transparente para que solo se vea el logo iluminado
    bakeScene.background = null
    bakeScene.fog = null

    // 7) Render “offline” a renderTarget
    const prevRT = gl.getRenderTarget()
    gl.setRenderTarget(renderTarget)
    gl.clear(true, true, true)
    gl.render(bakeScene, bakeCamera)
    gl.setRenderTarget(prevRT)

    // Restauramos background/fog en la escena de baking
    bakeScene.background = prevBackground
    bakeScene.fog = prevFog

    // 8) Guardamos la textura resultante en el estado
    setBakedMap(renderTarget.texture)

    // 9) Limpiamos el grupo de baking para no filtrar memoria (geom, material, etc.)
    bakeGroup.traverse((node) => {
      if (node.isMesh) {
        node.geometry.dispose()
        node.material.dispose()
      }
    })
    bakeScene.remove(bakeGroup, light1, light2)
  }

  // Una vez tenemos la textura bakedMap, la asignamos a los materiales originales
  useEffect(() => {
    if (!bakedMap || !groupRef.current) return

    groupRef.current.traverse((node) => {
      if (node.isMesh) {
        // Si al logo original no le llegaba UV2, la copiamos ahora:
        const geo = node.geometry
        if (!geo.attributes.uv2 && geo.attributes.uv) {
          geo.setAttribute(
            'uv2',
            new THREE.BufferAttribute(geo.attributes.uv.array.slice(), 2)
          )
        }
        // Asignamos el lightMap
        node.material.lightMap = bakedMap
        node.material.lightMapIntensity = 1.0
        node.material.needsUpdate = true
      }
    })
  }, [bakedMap])

  return (
    <group ref={groupRef}>
      {children}
    </group>
  )
}
