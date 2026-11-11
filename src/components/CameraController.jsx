import { useEffect, useCallback, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { getScrollY, scrollToCameraZ } from '../scrollStore';

const CameraController = ({ cameraRef, onReady }) => {
  const { camera, gl } = useThree();
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  // Adjust camera FOV and zoom based on window size
  const adjustCamera = useCallback(() => {
    if (window.innerWidth > window.innerHeight) {
      camera.zoom = Math.max(1, window.innerWidth / window.innerHeight) / 1.6;
    } else {
      camera.zoom = Math.max(1, window.innerHeight / window.innerWidth) / 1.6;
    }
    camera.lookAt(0, 0, camera.position.z - 2 + Math.min(0.5, window.innerHeight / window.innerWidth));
    camera.updateProjectionMatrix();
    gl.setSize(window.innerWidth, window.innerHeight);
  }, [camera, gl]);

  // Set initial camera settings and handle resize
  useEffect(() => {
    camera.near = 0.1;
    camera.position.set(0, 5, 24);
    camera.lookAt(0, 0, 23);
    adjustCamera();
    // Posición inicial según el scroll actual. Después, Home mueve la cámara en cada
    // frame de scroll de forma imperativa (sin pasar por el estado de React).
    camera.position.z = scrollToCameraZ(getScrollY());
    cameraRef.current = camera;
    // Avisa a Home: las secciones calculan su visibilidad leyendo la posición de la cámara.
    if (onReadyRef.current) onReadyRef.current();

    window.addEventListener('resize', adjustCamera);
    return () => window.removeEventListener('resize', adjustCamera);
  }, [camera, cameraRef, adjustCamera]);

  return null;
};

export default CameraController;
