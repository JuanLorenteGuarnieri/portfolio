import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import * as THREE from 'three';

import Navigation from '../components/Navigation';
import MobileCaption from '../components/MobileCaption';
import VideoPlayer from '../components/VideoPlayer';
import HomeScene from './HomeScene';
import CustomCursor from '../components/CustomCursor';
import { useMouseSpeed } from '../hooks/useMouseSpeed';
import { useViewportOrientation } from '../hooks/useViewportOrientation';
import { useContactForm } from '../hooks/useContactForm';
import { subscribeScroll, getScrollY, scrollToCameraZ } from '../scrollStore';
import { useVisibility } from '../hooks/useVisibility';
import { planWarmupStops } from '../lib/warmup';

// El vídeo vive en /public: se referencia por URL (no se importa) para que Vite no lo duplique en el bundle.
const video = `${import.meta.env.BASE_URL}Intro.mp4`;

const CURSOR_COLOR = 'white';

// Para comparar: abre la web con ?nowarmup para desactivar el precalentamiento de la escena.
const WARMUP_ENABLED = !new URLSearchParams(window.location.search).has('nowarmup');

// Si el precalentamiento no termina (red muy lenta, error...), se muestra la escena igualmente
// pasado este tiempo desde que acaba la intro.
const WARMUP_TIMEOUT_MS = 20000;

// ---------------------------------------------------------------------------
// CONSTANTES DE MÓDULO (referencias estables => React.memo y useMemo funcionan)
// ---------------------------------------------------------------------------
// SECTIONS POSITIONS
const titlePos = [0, 0, 22];
const aboutPos = [0, 0, 28];
const educationPos = [0, 0, 32.8];
const experiencePos = [0, 0, 37.9];
const projectsPos = [0, 0, 41.5];
const skillsPos = [0, 0, 72];
const contactPos = [0, 0, 75];
const interestPos = [0, 0, 82.5];

const SEC_POS = [
  { key: 'sectionTitle', value: titlePos[2], label: 'Title' },
  { key: 'sectionAbout', value: aboutPos[2], label: 'About' },
  { key: 'sectionEducation', value: educationPos[2], label: 'Education' },
  { key: 'sectionExperience', value: experiencePos[2], label: 'Experience' },
  { key: 'sectionProyects', value: projectsPos[2], label: 'Projects' },
  { key: 'sectionSkills', value: skillsPos[2], label: 'Skills' },
  { key: 'sectionContact', value: contactPos[2], label: 'Contact' },
  { key: 'sectionInterest', value: interestPos[2], label: 'Interests' }
];

// Scroll (px) al que empieza cada sección (inversa de scrollToCameraZ)
const SEC_SCROLL = SEC_POS.map(({ value }) => (value - 24.5) / 0.00461);
const sectionIndexAt = (y) => {
  let idx = -1;
  for (let i = 0; i < SEC_SCROLL.length; i++) if (y >= SEC_SCROLL[i]) idx = i;
  return idx;
};

// Objetos reutilizados (antes se creaban de nuevo en cada render)
const raycaster = new THREE.Raycaster();
const mouseNDC = new THREE.Vector2();
const hitPoint = new THREE.Vector3();

const Home = ({ maxY, changeScroll }) => {
  // CONFIGURATION
  const cameraRef = useRef();
  const lightRef = useRef();
  const [dpr, setDpr] = useState(0.75);

  // CONTACT
  const sendFormRef = useRef();
  // FORMS
  const [typeForm, setTypeForm] = useState(0);
  const changeTypeForm = useCallback((n) => { setTypeForm(n); }, []);

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

  // Visibilidad por proximidad a la cámara (ver hooks/useVisibility.js)
  const { isVisibleLight, syncVisibility, bumpVisibility, waitUntilRendered, registry: visRegistry } = useVisibility(cameraRef);
  const warmingRef = useRef(false);

  const handleCameraReady = useCallback(() => { bumpVisibility(); }, [bumpVisibility]);

  // ---------------------------------------------------------------------------
  // LUZ DEL CURSOR (imperativa: sin estado de React => sin re-renders por movimiento)
  // ---------------------------------------------------------------------------
  const calculateIntersect = useCallback((x, y) => {
    const cam = cameraRef.current;
    if (!cam) return;

    mouseNDC.x = (x / window.innerWidth) * 2 - 1;
    mouseNDC.y = -(y / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouseNDC, cam);

    // Calcula el punto de intersección con el plano y=0 (suelo)
    const { origin, direction } = raycaster.ray;
    if (direction.y === 0) return; // Evita división por cero

    const t = -origin.y / direction.y;
    if (t < 0) return; // Solo intersecciones delante de la cámara

    hitPoint.copy(direction).multiplyScalar(t).add(origin);
    if (lightRef.current) lightRef.current.position.set(hitPoint.x, 0.4, hitPoint.z);
  }, []);

  // La resolución del mapa de sombras baja cuando el ratón se mueve rápido
  const applyShadowSize = useCallback((speed) => {
    const light = lightRef.current;
    if (!light || !Number.isFinite(speed)) return;
    const minSize = 1;
    const maxSize = 400;
    const mapSize = Math.round(maxSize - (maxSize - minSize) * speed);
    light.shadow.mapSize.width = mapSize;
    light.shadow.mapSize.height = mapSize;
    light.shadow.needsUpdate = true;
  }, []);

  const { updateMouseSpeed, lastMousePos } = useMouseSpeed(applyShadowSize);

  const handlePointerMove = useCallback((event) => { //RECHARGE LIGHT CURSOR WHEN MOVING
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
  }, [calculateIntersect, updateMouseSpeed]);

  // ---------------------------------------------------------------------------
  // SCROLL: mueve la cámara, la luz del cursor y detecta cambios de visibilidad
  // ---------------------------------------------------------------------------
  const [navIdx, setNavIdx] = useState(-1);

  const applyScroll = useCallback((y) => {
    const cam = cameraRef.current;
    if (!cam || warmingRef.current) return;

    // 1) Cámara (antes: setState en App + useEffect en CameraController)
    cam.position.z = scrollToCameraZ(y);
    cam.updateMatrixWorld();

    // 2) Luz del cursor: usa la última posición conocida del ratón (o el centro de la pantalla)
    const { x, y: my } = lastMousePos.current;
    calculateIntersect(x || window.innerWidth / 2, my || window.innerHeight / 2);

    // 3) ¿Ha cambiado la visibilidad de alguna sección/proyecto/luz registrada?
    syncVisibility();

    // 4) Sección activa en la navegación (solo re-renderiza si cambia de sección)
    setNavIdx(sectionIndexAt(y));
  }, [calculateIntersect, syncVisibility, lastMousePos]);

  useEffect(() => subscribeScroll(applyScroll), [applyScroll]);

  // ---------------------------------------------------------------------------
  // PRECALENTAMIENTO (ver components/SceneWarmUp.jsx)
  // ---------------------------------------------------------------------------
  const warmApi = useMemo(() => ({
    plan() {
      const cam = cameraRef.current;
      if (!cam) return [];
      const entries = Array.from(visRegistry.current.values());
      return planWarmupStops(entries, cam.position, scrollToCameraZ(0), scrollToCameraZ(maxY));
    },
    begin() {
      warmingRef.current = true;
    },
    // Mueve la cámara y espera a que React haya aplicado la visibilidad nueva a la escena.
    async moveCameraTo(z) {
      const cam = cameraRef.current;
      cam.position.z = z;
      cam.updateMatrixWorld();
      const changed = syncVisibility();
      if (changed.length) await waitUntilRendered(changed);
    },
    end() {
      warmingRef.current = false;
      applyScroll(getScrollY()); // vuelve a la posición real del scroll
    },
  }), [maxY, syncVisibility, waitUntilRendered, applyScroll, visRegistry]);

  // ---------------------------------------------------------------------------
  // INTRO: la escena se muestra cuando ha terminado el vídeo Y el precalentamiento
  // ---------------------------------------------------------------------------
  const [videoEnded, setVideoEnded] = useState(false);
  const [sceneWarm, setSceneWarm] = useState(false);
  const isAnimationDone = videoEnded && sceneWarm;

  const handleVideoEnded = useCallback(() => { setVideoEnded(true); }, []);
  const handleWarmDone = useCallback(() => { setSceneWarm(true); }, []);

  useEffect(() => {
    if (!WARMUP_ENABLED) setSceneWarm(true);
  }, []);

  useEffect(() => {
    if (videoEnded && !sceneWarm) {
      const t = setTimeout(() => setSceneWarm(true), WARMUP_TIMEOUT_MS);
      return () => clearTimeout(t);
    }
  }, [videoEnded, sceneWarm]);

  const [, setIsContentLoaded] = useState(false);
  const changeContentLoaded = useCallback(() => { setIsContentLoaded(true); }, []);

  // ---------------------------------------------------------------------------
  // EVENTOS
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (event) => { // Prevent default action for 'Space' (scroll)
      if (event.keyCode === 32) {
        event.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const onMouseClick = (event) => {
    if (
      !isAnimationDone ||
      (window.screen.orientation.type === "portrait-primary" ||
        window.screen.orientation.type === "portrait-secondary")
    ) {
      return;
    }

    // Calcula la posición del mouse en coordenadas normalizadas (-1 a +1)
    mouseNDC.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouseNDC.y = -(event.clientY / window.innerHeight) * 2 + 1;

    changeTypeForm(0);

    raycaster.setFromCamera(mouseNDC, cameraRef.current);

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

  return (
    <>
      <section >
        {isAnimationDone ? null : (
          // Mientras dura el precalentamiento el vídeo se queda en su último fotograma
          <VideoPlayer src={video} onVideoComplete={handleVideoEnded} />
        )}
        {(
          isPhoneVertical && isAnimationDone ? (<MobileCaption />) : null
        )}
        {showCursor && isAnimationDone && <CustomCursor color={CURSOR_COLOR} size={5} />}

        <HomeScene
          cameraRef={cameraRef}
          lightRef={lightRef}
          dpr={dpr}
          setDpr={setDpr}
          enableShadows={enableShadows}
          isAnimationDone={isAnimationDone}
          sceneWarm={sceneWarm}
          handlePointerMove={handlePointerMove}
          onCameraReady={handleCameraReady}
          warmApi={WARMUP_ENABLED ? warmApi : null}
          onWarmDone={handleWarmDone}
          titlePos={titlePos}
          aboutPos={aboutPos}
          educationPos={educationPos}
          experiencePos={experiencePos}
          projectsPos={projectsPos}
          skillsPos={skillsPos}
          contactPos={contactPos}
          interestPos={interestPos}
          isVisibleLight={isVisibleLight}
          typeForm={typeForm}
          changeTypeForm={changeTypeForm}
          form1Ref={form1Ref}
          form2Ref={form2Ref}
          form3Ref={form3Ref}
          sendFormRef={sendFormRef}
          userName={userName}
          userEmail={userEmail}
          message={message}
          feedback={feedback}
          colorFeedback={colorFeedback}
          changeUserName={changeUserName}
          changeUserEmail={changeUserEmail}
          changeMessage={changeMessage}
        />
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
        <Navigation secPos={SEC_POS} action={changeScroll}
          scrollValue={navIdx >= 0 ? SEC_SCROLL[navIdx] : Number.NEGATIVE_INFINITY}
          action2={changeContentLoaded}
          cond={!isPhoneVertical && isAnimationDone} />
      </section >
    </>
  );
};

export default Home;
