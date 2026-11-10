import React, { useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';

import CameraController from '../components/CameraController';
import Title from './Title';
import About from './About';
import Education from './Education';
import Projects from './Projects';
import Skills from './Skills';
import ContactMe from './ContactMe';
import Interests from './Interests';
import Experience from './Experience';

const SECTION_RENDER_DISTANCE = 10;

const Floor = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 35]} receiveShadow={true}>
    <planeGeometry args={[500, 500]}  />
    <meshPhysicalMaterial color={new THREE.Color(0x444444)} />
  </mesh>
);

const AmbientLight = () => <ambientLight intensity={0.4} />;

const CursorLight = ({ targetPos, mouseSpeed }) => (
  <pointLight
      name="cursor"
      distance={3}
      castShadow={true}
      intensity={25}
      position={[targetPos[0], 0.4, targetPos[2]]}
      shadow-bias={-0.01}
      shadow-camera-near={0.01}
      onUpdate={(light) => {
        const minSize = 1;
        const maxSize = 400;
        const mapSize = Math.round(maxSize - (maxSize - minSize) * mouseSpeed);
        light.shadow.mapSize.width = mapSize;
        light.shadow.mapSize.height = mapSize;
        light.shadow.needsUpdate = true;
      }}
      color={new THREE.Color(0x223060)}
    />
);

const SceneRectLight = ({ aboutPos, interestPos }) => (
  <rectAreaLight
    intensity={11}
    position={[0, 1.5, aboutPos[2]+4+((-aboutPos[2] + interestPos[2]) / 2)]}
    // position={[0, 1.5, aboutPos[2]]}
    rotation={[-Math.PI / 2, 0, 0]}
    width={7}
    height={interestPos[2] - aboutPos[2] + 8}
    color={new THREE.Color(0x223060)}
  />
);

const PrecompileScene = ({ children }) => {
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    const originalRender = gl.render;

    const precompile = () => {
      gl.render(scene, camera);
    };

    // Render previo ligero para compilar shaders y materiales
    precompile();

    return () => {
      gl.render = originalRender;
    };
  }, [gl, scene, camera]);

  return <>{children}</>;
};

const HomeScene = ({
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
}) => {
  const cameraZ = scrollValue * 0.00461 + 24.5;

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
      camera={{
        makeDefault: true,
        near: 0.1,
        far: window.innerWidth > window.innerHeight ? 9 : 13,
        fov: (window.innerWidth > window.innerHeight ? window.innerWidth / window.innerHeight : window.innerHeight / window.innerWidth) * (180 / Math.PI / 1.6),
      }}
    >
      <PerformanceMonitor
        factor={0.6}
        ms={200}
        iterations={3}
        threshold={0.6}
        bounds={() => [30, 45]}
        onDecline={() => { setDpr(prev => Math.max(0.3, prev - 0.1)); }}
        onIncline={() => { setDpr(prev => Math.min(0.8, prev + 0.1)); }}
      />
      <CameraController scrollValue={scrollValue} cameraRef={cameraRef} maxY={maxY} />
      <PrecompileScene>
        <AmbientLight />
        <CursorLight targetPos={targetPos} mouseSpeed={mouseSpeed} />
        <SceneRectLight aboutPos={aboutPos} interestPos={interestPos} />

        <Title isVisibleLight={isVisibleLight} pos={titlePos} />
        <About isVisibleLight={isVisibleLight} pos={aboutPos} />
        <Education isVisibleLight={isVisibleLight} pos={educationPos} />
        <Experience isVisibleLight={isVisibleLight} pos={experiencePos} />
        <Projects isVisibleLight={isVisibleLight} pos={projectsPos} />
        <Skills isVisibleLight={isVisibleLight} pos={skillsPos} />
        <ContactMe
          isVisibleLight={isVisibleLight}
          pos={contactPos}
          scrollValue={scrollValue}
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
          changeContentLoaded={changeContentLoaded}
          changeAnimationDone={changeAnimationDone}
        />
        <Interests isVisibleLight={isVisibleLight} pos={interestPos} />

        <Floor />
      </PrecompileScene>
    </Canvas>
  );
};

export default HomeScene;
