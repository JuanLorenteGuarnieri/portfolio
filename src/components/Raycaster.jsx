import { useFrame, useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';

const Raycaster = ({ externalCamera, onIntersect }) => {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();


  const calculateIntersect = (x, y) => {
    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = -(y / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, externalCamera.current);

    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersectPoint = new THREE.Vector3();

    if (raycaster.ray.intersectPlane(plane, intersectPoint)) {
      if (onIntersect) {
        onIntersect(intersectPoint);
      }
    }
  };

  const onMouseMove = (event) => {
    calculateIntersect(event.clientX, event.clientY);
  };

  const onTouchMove = (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    calculateIntersect(touch.clientX, touch.clientY);
  };


  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);
};

export default Raycaster;