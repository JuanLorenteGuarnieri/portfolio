import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';

const CameraController = ({ scrollValue, cameraRef }) => {
  let { camera, gl } = useThree();

  useEffect(() => {
    // Establece la cámara referenciada
    cameraRef.current = camera;
    gl.setSize(window.innerWidth, window.innerHeight);

    // Configura la posición inicial y la dirección de la mirada de la cámara
    camera.position
    camera.position.set(0, 5, 0);
    camera.lookAt(0, 0, -2);
  }, [camera, gl]);

  useEffect(() => {
    // Actualiza la posición en el eje X basándose en scrollValue
    if (cameraRef.current) {

      cameraRef.current.position.z = scrollValue / 2;
    }
  }, [scrollValue]);

  return null; // Este componente no renderiza nada en sí mismo
};

export default CameraController;
