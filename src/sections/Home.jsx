import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

import video from '/public/Intro.mp4';
import Navigation from '../components/Navigation';
import MobileCaption from '../components/MobileCaption';
import VideoPlayer from '../components/VideoPlayer';
import HomeScene from './HomeScene';
import CustomCursor from '../components/CustomCursor';
import { useMouseSpeed } from '../hooks/useMouseSpeed';
import { useViewportOrientation } from '../hooks/useViewportOrientation';
import { useContactForm } from '../hooks/useContactForm';

const CURSOR_COLOR = 'white';
const isMobileDevice = () => /Mobi|Android/i.test(navigator.userAgent);

const Home = ({ scrollValue, maxY, changeScroll }) => {
  // CONFIGURATION
  const cameraRef = useRef();
  const [dpr, setDpr] = useState(0.75);
  const [targetPos, setTargetPos] = useState(0);

  // SECTIONS POSITIONS
  const titlePos = [0, 0, 22];
  const aboutPos = [0, 0, 28];
  const educationPos = [0, 0, 32.8];
  const experiencePos = [0, 0, 37.9];
  const projectsPos = [0, 0, 41.5];
  const skillsPos = [0, 0, 72];
  const contactPos = [0, 0, 75];
  const interestPos = [0, 0, 82.5];


  const secPos = [
    { key: 'sectionTitle', value: titlePos[2], label: 'Title' },
    { key: 'sectionAbout', value: aboutPos[2], label: 'About' },
    { key: 'sectionEducation', value: educationPos[2], label: 'Education' },
    { key: 'sectionExperience', value: experiencePos[2], label: 'Experience' },
    { key: 'sectionProyects', value: projectsPos[2], label: 'Projects' },
    { key: 'sectionSkills', value: skillsPos[2], label: 'Skills' },
    { key: 'sectionContact', value: contactPos[2], label: 'Contact' },
    { key: 'sectionInterest', value: interestPos[2], label: 'Interests' }
  ];

  // CONTACT
  const sendFormRef = useRef();
  // FORMS
  const [typeForm, setTypeForm] = useState(0);

  const hiddenInputRef1 = useRef(), hiddenInputRef2 = useRef(), hiddenInputRef3 = useRef();
  const form1Ref = useRef(), form2Ref = useRef(), form3Ref = useRef();

  const {
    userName,
    userEmail,
    message,
    feedback,
    colorFeedback,
    changeUserName,
    changeUserEmail,
    changeMessage,
    sendEmail,
  } = useContactForm();

  const getDistance2Camera = (v1) => {
    if (!cameraRef.current) return 0;
    const position = cameraRef.current.position;
    return Math.sqrt(
      Math.pow(v1.x - position.x, 2) +
      Math.pow(v1.y - position.y, 2) +
      Math.pow(v1.z - position.z, 2)
    );
  };

  const isBeforeCamera = (v1) => {
    if (!cameraRef.current) return 0;
    var position = cameraRef.current.position;
    return position.z + 3 > v1.z;
  };

  const isVisibleLight = (v1, dist) => {
    return isBeforeCamera(v1) && getDistance2Camera(v1) < dist;
  };

  // Configura el raycaster
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const [mouseSpeed, setMouseSpeed] = useState(0);
  const lastMousePos = useRef({ x: 0, y: 0, t: Date.now() });

  const updateMouseSpeed = (x, y) => {
    const now = Date.now();
    const { x: lastX, y: lastY, t: lastT } = lastMousePos.current;
    const dt = now - lastT;
    if (dt > 0) {
      const dx = x - lastX;
      const dy = y - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = dist / dt; // px/ms
      // Normaliza la velocidad a un rango de 0 a 1
      const normalizedSpeed = Math.min(speed / 800, 1);
      setMouseSpeed(normalizedSpeed);
    }
    lastMousePos.current = { x, y, t: now };
  };

  useEffect(() => {
    const handleMouseMove = (event) => {
      updateMouseSpeed(event.clientX, event.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const changeTypeForm = (n) => {
    setTypeForm(n);
  };

  const handleKeyDown = (event) => { // Prevent default action for 'Space' (scroll)
    if (event.keyCode === 32) {
      event.preventDefault();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // ANIMATIONS
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [isAnimationDone, setIsAnimationDone] = useState(false);

  const changeContentLoaded = () => {
    setIsContentLoaded(true);
  };
  const changeAnimationDone = () => {
    // console.log("Animation done");
    setIsAnimationDone(true);
  };

  const onMouseClick = (event) => {
    if (
      !isAnimationDone ||
      (window.screen.orientation.type === "portrait-primary" ||
        window.screen.orientation.type === "portrait-secondary")
    ) {
      return;
    }

    // Calcula la posición del mouse en coordenadas normalizadas (-1 a +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    changeTypeForm(0);

    raycaster.setFromCamera(mouse, cameraRef.current);

    const refs = [
      { ref: form1Ref, type: 1 },
      { ref: form2Ref, type: 2 },
      { ref: form3Ref, type: 3 },
      { ref: sendFormRef, type: "send" },
    ];

    for (const { ref, type } of refs) {
      if (ref.current) {
        const intersects = raycaster.intersectObject(ref.current);
        if (intersects.length > 0) {
          if (type === "send") {
            sendEmail();
          } else {
            changeTypeForm(type);
          }
          return;
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("click", onMouseClick, false);
    return () => {
      window.removeEventListener("click", onMouseClick, false);
    };
    // Only depend on variables that affect the click logic
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName, userEmail, message, isAnimationDone]);


  const calculateIntersect = (x, y) => {
    if (!cameraRef.current) return;

    // Reutiliza mouse y raycaster ya definidos fuera
    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = -(y / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, cameraRef.current);

    // Calcula el punto de intersección con el plano y=0 (suelo)
    const { origin, direction } = raycaster.ray;
    if (direction.y === 0) return; // Evita división por cero

    const t = -origin.y / direction.y;
    if (t < 0) return; // Solo intersecciones delante de la cámara

    const intersectPoint = new THREE.Vector3().copy(direction).multiplyScalar(t).add(origin);
    setTargetPos([intersectPoint.x, 0, intersectPoint.z]);
  };

  const handlePointerMove = (event) => { //RECHARGE LIGHT CURSOR WHEN MOVING
    if (cameraRef.current) {
      // Obtiene las coordenadas del cursor
      let x, y;
      if (event.touches) {
        // Manejo del evento táctil
        const touch = event.touches[0];
        x = touch.clientX;
        y = touch.clientY;
      } else {
        x = event.clientX;
        y = event.clientY;
      }

      calculateIntersect(x, y);
      updateMouseSpeed(x, y);
    }
  };

  useEffect(() => {
    const { x, y } = lastMousePos.current;
    const mouseX = x || window.innerWidth / 2;
    const mouseY = y || window.innerHeight / 2;
    calculateIntersect(mouseX, mouseY);
  }, [scrollValue]);

  const { isPhoneVertical, isMobileDevice } = useViewportOrientation();
  const showCursor = !isMobileDevice();

  const enableShadows = !isMobileDevice();

  useEffect(() => {
    const disableZoom = (e) => {
      // Previene zoom con Ctrl/Cmd + rueda del ratón o pinch-zoom en móviles
      if (
        e.ctrlKey || e.metaKey ||
        (e.touches && e.touches.length > 1) // Pinch zoom en mobile
      ) {
        e.preventDefault();
      }
    };
    const preventGesture = (e) => {
      e.preventDefault();
    };
    window.addEventListener('wheel', disableZoom, { passive: false });
    window.addEventListener('gesturestart', preventGesture, { passive: false });
    window.addEventListener('gesturechange', preventGesture, { passive: false });
    window.addEventListener('gestureend', preventGesture, { passive: false });

    // Previene zoom con doble toque y pinch en móviles
    let lastTouchEnd = 0;
    const onTouchEnd = (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };
    const onTouchMove = (e) => {
      if (e.touches && e.touches.length > 1) {
        e.preventDefault();
      }
    };
    document.addEventListener('touchend', onTouchEnd, false);
    document.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', disableZoom, { passive: false });
      window.removeEventListener('gesturestart', preventGesture, { passive: false });
      window.removeEventListener('gesturechange', preventGesture, { passive: false });
      window.removeEventListener('gestureend', preventGesture, { passive: false });
      document.removeEventListener('touchend', onTouchEnd, false);
      document.removeEventListener('touchmove', onTouchMove, { passive: false });
    };
  }, []);

  useEffect(() => { //focus/blur inputs
    if (typeForm === 0) {
      hiddenInputRef1.current && hiddenInputRef1.current.blur();
      hiddenInputRef2.current && hiddenInputRef2.current.blur();
      hiddenInputRef3.current && hiddenInputRef3.current.blur();
    } else {
      switch (typeForm) {
        case 1:
          hiddenInputRef1.current && hiddenInputRef1.current?.focus({ preventScroll: true });
          break;
        case 2:
          hiddenInputRef2.current && hiddenInputRef2.current?.focus({ preventScroll: true });
          break;
        case 3:
          hiddenInputRef3.current && hiddenInputRef3.current?.focus({ preventScroll: true });
          break;
      }
    }
  }, [typeForm]);

  useEffect(() => {
    if (!isAnimationDone) {
      const preventScroll = (e) => {
        window.scrollTo(0, 0);
        e.preventDefault();
      };
      window.addEventListener('scroll', preventScroll, { passive: false });
      document.body.style.overflow = 'hidden';
      return () => {
        window.removeEventListener('scroll', preventScroll, { passive: false });
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isAnimationDone]);

  const sceneProps = {
    cameraRef,
    dpr,
    setDpr,
    enableShadows,
    isAnimationDone,
    handlePointerMove,
    scrollValue,
    maxY,
    targetPos,
    mouseSpeed,
    titlePos,
    aboutPos,
    educationPos,
    experiencePos,
    projectsPos,
    skillsPos,
    contactPos,
    interestPos,
    isVisibleLight,
    typeForm,
    changeTypeForm,
    form1Ref,
    form2Ref,
    form3Ref,
    sendFormRef,
    changeContentLoaded,
    changeAnimationDone,
    userName,
    userEmail,
    message,
    feedback,
    colorFeedback,
    changeUserName,
    changeUserEmail,
    changeMessage,
    sendEmail,
  };

  return (
    <>
      <section >
        {isAnimationDone ? null : (
          // <Loader action={changeAnimationDone} />
          <VideoPlayer src={video} onVideoComplete={setIsAnimationDone} />
        )}
        {(
          isPhoneVertical && isAnimationDone ? (<MobileCaption />) : null
        )}
        {showCursor && isAnimationDone && <CustomCursor color={CURSOR_COLOR} size={5} />}

        <HomeScene {...sceneProps} />
        <input ref={hiddenInputRef1}
          type="text"
          className="opacity-0"
          style={{ position: "fixed", top: "0px", left: "0px" }}

          onChange={(e) => {
            if (!isMobileDevice()) {
              e.preventDefault();
              e.stopPropagation();
            } else {
              changeUserName(e.target.value);
            }
          }}
          aria-hidden="true" // Ocultar a lectores de pantalla
        />
        <input ref={hiddenInputRef2}
          type="text"
          className="opacity-0"
          style={{ position: "fixed", top: "0px", left: "0px" }}

          onChange={(e) => {
            if (!isMobileDevice()) {
              e.preventDefault();
              e.stopPropagation();
            } else {
              changeUserEmail(e.target.value);
            }
          }}
          aria-hidden="true" // Ocultar a lectores de pantalla
        />
        <input ref={hiddenInputRef3}
          type="text"
          className="opacity-0"
          style={{ position: "fixed", top: "0px", left: "0px" }}

          onChange={(e) => {
            if (!isMobileDevice()) {
              e.preventDefault();
              e.stopPropagation();
            } else {
              changeMessage(e.target.value);
            }
          }}
          aria-hidden="true" // Ocultar a lectores de pantalla
        />
        <Navigation secPos={secPos} action={changeScroll} scrollValue={scrollValue} action2={changeContentLoaded}
          cond={!isPhoneVertical && isAnimationDone} />
      </section >
    </>
  );
};

export default Home;
