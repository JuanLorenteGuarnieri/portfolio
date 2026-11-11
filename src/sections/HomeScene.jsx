import React, { forwardRef, memo, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';

import CameraController from '../components/CameraController';
import SceneWarmUp from '../components/SceneWarmUp';
import Title from './Title';
import About from './About';
import Education from './Education';
import Projects from './Projects';
import Skills from './Skills';
import ContactMe from './ContactMe';
import Interests from './Interests';
import Experience from './Experience';

const FLOOR_COLOR = new THREE.Color(0x444444);
const LIGHT_COLOR = new THREE.Color(0x223060);

const Floor = memo(() => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 35]} receiveShadow={true}>
    <planeGeometry args={[500, 500]} />
    <meshPhysicalMaterial color={FLOOR_COLOR} />
  </mesh>
));

const AmbientLight = memo(() => <ambientLight intensity={0.4} />);

// La posición y el tamaño del mapa de sombras los actualiza Home de forma imperativa (ref):
// moverlos por props obligaba a re-renderizar la escena en cada movimiento del ratón.
// El tamaño inicial (400) es el máximo, igual que antes.
const CursorLight = memo(forwardRef(function CursorLight(_props, ref) {
  return (
    <pointLight
      ref={ref}
      name="cursor"
      distance={3}
      castShadow={true}
      intensity={25}
      position={[0, 0.4, 0]}
      shadow-bias={-0.01}
      shadow-camera-near={0.01}
      shadow-mapSize={[400, 400]}
      color={LIGHT_COLOR}
    />
  );
}));

const SceneRectLight = memo(({ aboutPos, interestPos }) => (
  <rectAreaLight
    intensity={11}
    position={[0, 1.5, aboutPos[2] + 4 + ((-aboutPos[2] + interestPos[2]) / 2)]}
    rotation={[-Math.PI / 2, 0, 0]}
    width={7}
    height={interestPos[2] - aboutPos[2] + 8}
    color={LIGHT_COLOR}
  />
));

// Las secciones solo se re-renderizan cuando cambia su visibilidad (isVisibleLight cambia de
// identidad) o sus props; escribir en el formulario o mover el ratón no las toca.
const TitleM = memo(Title);
const AboutM = memo(About);
const EducationM = memo(Education);
const ExperienceM = memo(Experience);
const ProjectsM = memo(Projects);
const SkillsM = memo(Skills);
const ContactMeM = memo(ContactMe);
const InterestsM = memo(Interests);

const HomeScene = ({
  cameraRef,
  lightRef,
  dpr,
  setDpr,
  enableShadows,
  isAnimationDone,
  sceneWarm,
  handlePointerMove,
  onCameraReady,
  warmApi,
  onWarmDone,
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
  userName,
  userEmail,
  message,
  feedback,
  colorFeedback,
  changeUserName,
  changeUserEmail,
  changeMessage,
}) => {
  // Se calcula una sola vez: cambiar `camera` en cada render no tiene efecto útil
  const cameraProps = useMemo(() => ({
    makeDefault: true,
    near: 0.1,
    far: window.innerWidth > window.innerHeight ? 9 : 13,
    fov: (window.innerWidth > window.innerHeight ? window.innerWidth / window.innerHeight : window.innerHeight / window.innerWidth) * (180 / Math.PI / 1.6),
  }), []);

  return (
    <Canvas
      dpr={dpr}
      shadows={enableShadows}
      gl={{
        antialias: true,
        stencil: false,
        alpha: true,
        depth: true,
        logarithmicDepthBuffer: false,
        preserveDrawingBuffer: false,
        premultipliedAlpha: false,
        precision: 'lowp',
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false,
        physicallyCorrectLights: false,
      }}
      style={{
        position: 'fixed', top: 0, left: 0, zIndex: 1,
        opacity: isAnimationDone ? 1 : 0,
        transition: isAnimationDone ? 'opacity 15s ease' : 'none',
      }}
      onPointerMove={handlePointerMove}
      onTouchMove={handlePointerMove}
      camera={cameraProps}
    >
      {/* El monitor de rendimiento se activa DESPUÉS del precalentamiento: los frames lentos del
          calentamiento no deben bajar la resolución (dpr) de la escena. */}
      {sceneWarm && (
        <PerformanceMonitor
          factor={0.6}
          ms={200}
          iterations={3}
          threshold={0.6}
          bounds={() => [30, 45]}
          onDecline={() => { setDpr(prev => Math.max(0.3, prev - 0.1)); }}
          onIncline={() => { setDpr(prev => Math.min(0.8, prev + 0.1)); }}
        />
      )}
      <CameraController cameraRef={cameraRef} onReady={onCameraReady} />
      {warmApi && <SceneWarmUp api={warmApi} onDone={onWarmDone} />}

      <AmbientLight />
      <CursorLight ref={lightRef} />
      <SceneRectLight aboutPos={aboutPos} interestPos={interestPos} />

      <TitleM isVisibleLight={isVisibleLight} pos={titlePos} />
      <AboutM isVisibleLight={isVisibleLight} pos={aboutPos} />
      <EducationM isVisibleLight={isVisibleLight} pos={educationPos} />
      <ExperienceM isVisibleLight={isVisibleLight} pos={experiencePos} />
      <ProjectsM isVisibleLight={isVisibleLight} pos={projectsPos} />
      <SkillsM isVisibleLight={isVisibleLight} pos={skillsPos} />
      <ContactMeM
        isVisibleLight={isVisibleLight}
        pos={contactPos}
        userName={userName}
        userEmail={userEmail}
        message={message}
        feedback={feedback}
        colorFeedback={colorFeedback}
        changeUserName={changeUserName}
        changeUserEmail={changeUserEmail}
        changeMessage={changeMessage}
        typeForm={typeForm}
        changeTypeForm={changeTypeForm}
        form1Ref={form1Ref}
        form2Ref={form2Ref}
        form3Ref={form3Ref}
        sendFormRef={sendFormRef}
      />
      <InterestsM isVisibleLight={isVisibleLight} pos={interestPos} />

      <Floor />
    </Canvas>
  );
};

export default HomeScene;
