import { useEffect, useCallback } from 'react';
import { useThree } from '@react-three/fiber';

const CameraController = ({ scrollValue, cameraRef }) => {
  const { camera, gl } = useThree();

  // Adjust camera FOV and zoom based on window size
  const adjustCamera = useCallback(() => {
    camera.zoom = Math.max(1, window.innerWidth / window.innerHeight) / 1.6;
    camera.lookAt(0, 0, camera.position.z - 2 + Math.min(0.5, window.innerHeight / window.innerWidth));
    camera.updateProjectionMatrix();
    gl.setSize(window.innerWidth, window.innerHeight);
  }, [camera, gl]);

  // Set initial camera settings and handle resize
  useEffect(() => {
    cameraRef.current = camera;
    camera.near = 0.1;
    // camera.far = 8;
    camera.position.set(0, 5, 24);
    camera.lookAt(0, 0, 23);
    adjustCamera();

    window.addEventListener('resize', adjustCamera);
    return () => window.removeEventListener('resize', adjustCamera);
  }, [camera, cameraRef, adjustCamera]);

  // Map scrollValue to camera z position
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.z = scrollValue * 0.00461 + 24.5;
    }
  }, [scrollValue, cameraRef]);

  return null;
};

export default CameraController;
