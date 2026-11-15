import { useEffect, useCallback, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { getScrollY, scrollToCameraZ } from '../scrollStore';
import { viewMargins } from '../lib/frustumReach';
import { isFocusBusy, subscribeFocus } from '../lib/focusModes';
import { baseZoom } from '../lib/cameraZoom';

const forward = new Vector3();

const CameraController = ({ cameraRef, onReady, onViewChange }) => {
  const { camera, gl } = useThree();
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  const onViewChangeRef = useRef(onViewChange);
  onViewChangeRef.current = onViewChange;
  const baseFar = useRef(null);

  // Adjust camera FOV and zoom based on window size
  const adjustCamera = useCallback(() => {
    camera.zoom = baseZoom(window.innerWidth, window.innerHeight);
    // En modo piano / cubo la cámara está pegada al objeto (la mueve FocusCameraRig): aquí solo se
    // actualizan el zoom y el tamaño; ni la orientación ni los márgenes de visibilidad, que
    // dependen de la pose "normal" de la cámara. Se recalculan al salir (ver el efecto de abajo).
    const pianoOn = isFocusBusy();
    if (!pianoOn) camera.lookAt(0, 0, camera.position.z - 2 + Math.min(0.5, window.innerHeight / window.innerWidth));
    camera.updateProjectionMatrix();
    gl.setSize(window.innerWidth, window.innerHeight);
    if (pianoOn) return;

    // Cuánto ve ahora la cámara respecto a la de referencia (ventana 16:9): Home lo usa para
    // ampliar las distancias a las que se ocultan secciones y proyectos.
    camera.getWorldDirection(forward);
    const m = viewMargins({
      fov: camera.fov,
      zoom: camera.zoom,
      height: camera.position.y,
      pitch: Math.atan2(-forward.y, Math.hypot(forward.x, forward.z)),
    });
    // El plano lejano nunca baja del valor inicial, pero crece si la pantalla ve más lejos
    if (baseFar.current === null) baseFar.current = camera.far;
    const far = Math.max(baseFar.current, m.farNeeded * 1.15);
    if (Math.abs(far - camera.far) > 1e-3) {
      camera.far = far;
      camera.updateProjectionMatrix();
    }
    if (onViewChangeRef.current) onViewChangeRef.current(m);
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

  // Al terminar de salir de un modo foco la cámara vuelve a su sitio: se restablecen la
  // orientación y los márgenes por si la ventana cambió de tamaño mientras tanto.
  useEffect(() => subscribeFocus(() => { if (!isFocusBusy()) adjustCamera(); }), [adjustCamera]);

  return null;
};

export default CameraController;
