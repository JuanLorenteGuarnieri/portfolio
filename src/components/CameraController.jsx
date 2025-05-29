import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';



const CameraController = ({ scrollValue, cameraRef, maxY }) => {
  let { camera, gl } = useThree();

  // Esta función ajusta el FOV de la cámara basado en el ancho de la ventana
  const adjustCameraFOV = () => {

    camera.zoom = Math.max(1, window.innerWidth / window.innerHeight) / 1.6;
    // camera.fov = (window.innerHeight / window.innerWidth) * 40;
    camera.lookAt(0, 0, camera.position.z - 2 + Math.min(0.5, window.innerHeight / window.innerWidth));

  };

  useEffect(() => {
    // Establece la cámara referenciada
    cameraRef.current = camera;
    gl.setSize(window.innerWidth, window.innerHeight);

    // Configura la posición inicial y la dirección de la mirada de la cámara
    camera.zoom = Math.max(1, window.innerWidth / window.innerHeight) / 1.6;
    camera.position.set(0, 5, 24);
    camera.lookAt(0, 0, 23);

    adjustCameraFOV();
    window.addEventListener('resize', adjustCameraFOV);

    // Limpieza al desmontar el componente
    return () => {
      window.removeEventListener('resize', adjustCameraFOV);
    };
  }, [camera, gl]);

  useEffect(() => {
    // Actualiza la posición en el eje X basándose en scrollValue
    if (cameraRef.current) {

      cameraRef.current.position.z = scrollValue * 0.00461 + 24.5;
    }
  }, [scrollValue, window]);

  return null; // Este componente no renderiza nada en sí mismo
};

export default CameraController;
