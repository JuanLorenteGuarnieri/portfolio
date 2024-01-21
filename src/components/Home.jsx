import React, { useRef, useState, useEffect } from 'react';
import font from '../assets/fonts/BungeeSpice.json';
import font2 from '../assets/fonts/Audiowide.json';
import fontUbuntuBold from '../assets/fonts/Ubuntu/Ubuntu_Bold.json';
import fontUbuntuMedium from '../assets/fonts/Ubuntu/Ubuntu_Medium_Regular.json';
import fontUbuntuMediumItalic from '../assets/fonts/Ubuntu/Ubuntu_Medium_Italic.json';
import * as THREE from 'three';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { Plane, Box, ScrollControls, useScroll, Text3D, SpotLight, Float, ContactShadows, Shadow, Svg, Gltf, } from '@react-three/drei';
import CameraController from './CameraController';
import SpotLightAberration from './SpotLightAberration';
import { Logo } from '../../public/models/Logo';
import { LogoGema } from '../../public/models/LogoGema';
import Raycaster from './Raycaster';
import { Linkedin } from '../../public/models/Linkedin';
import { Github } from '../../public/models/Github';
import { CV } from '../../public/models/Cv';

const Planee = () => {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 2, 0]}>
      <planeGeometry />

    </mesh>
  );
};


function ScrollContent({ setPercen }) {
  const scroll = useScroll();
  useFrame(() => {
    setPercen(scroll.offset * 100);
  }, []);

};


function ScrollContent2({ setPercen }) {
  const scroll = useScroll();
  const lastScroll = useRef(scroll.offset);

  useEffect(() => {
    // Esta función se ejecutará en cada renderización
    const handleScrollChange = () => {
      if (scroll.offset !== lastScroll.current) {
        const newPercentage = scroll.offset * 100;
        setPercen(newPercentage);
        lastScroll.current = scroll.offset; // Actualizar el ref con el nuevo desplazamiento
      }
    };

    handleScrollChange(); // Llamar a la función en cada renderización
  });

}



const Home = () => {
  const lightRef = useRef();
  const cameraRef = React.useRef();
  const box1Ref = useRef();
  const box2Ref = useRef();
  const planoRef = useRef();
  const linkedinRef = useRef();
  const githubRef = useRef();
  const cvRef = useRef();

  linkedinRef

  const [targetPos, setTargetPos] = useState(0);
  const [cameraPos, setCameraPos] = useState(0);


  const [scrollValue, setScrollValue] = useState(0);

  const targetNameRef = useRef();
  const spotNameRef = useRef();

  const handleIntersection = (point) => {
    setTargetPos([point.x, point.y, point.z]);
  };


  // Configura el raycaster
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function onMouseClick(event) {
    // Calcula la posición del mouse en coordenadas normalizadas (-1 a +1) para ambos ejes
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Actualiza el rayo con la posición del mouse y la cámara
    raycaster.setFromCamera(mouse, cameraRef.current);

    // Realiza la intersección
    const intersectsGithub = raycaster.intersectObject(githubRef.current);

    // Comprueba si hay intersecciones
    if (intersectsGithub.length > 0) {
      window.open('https://github.com/JuanLorenteGuarnieri', '_blank');
      return;
    }

    const intersectsLinkedin = raycaster.intersectObject(linkedinRef.current);
    // Comprueba si hay intersecciones
    if (intersectsLinkedin.length > 0) {
      window.open('https://www.linkedin.com/in/juanlorenteguarnieri/', '_blank');
      return;
    }
    const intersectsCV = raycaster.intersectObject(cvRef.current);

    // Comprueba si hay intersecciones
    if (intersectsCV.length > 0) {
      window.open('https://github.com/JuanLorenteGuarnieri/portfolio/CV.pdf', '_blank');
      return;
    }

  }


  useEffect(() => {
    if (spotNameRef.current) {
      spotNameRef.current.target = targetNameRef.current;
    }
    if (targetNameRef.current) {
      // Establecer el target del SpotLight una vez que las referencias estén listas
      spotNameRef.current.target = targetNameRef.current;
      // Es necesario actualizar la matriz del target para aplicar el cambio
      targetNameRef.current.updateMatrixWorld();
    }
    window.addEventListener('click', onMouseClick, false);

    return () => {
      window.removeEventListener('click', onMouseClick, false);
    };
  }, []);

  return (

    <section className="w-full h-screen">
      <Canvas dpr={1} shadows={true} className="w-full h-screen bg-black" camera={({ far: 40, setFocalLength: 555, zoom: (window.innerWidth / window.innerHeight) / 1.6 })}>
        <SpotLightAberration position={scrollValue} target={targetPos} intensity={55} scaleAngle={0.6} scaleAberration={0.3} cameraRef={cameraRef} />
        <Raycaster externalCamera={cameraRef} onIntersect={handleIntersection} />
        <CameraController scrollValue={scrollValue} cameraRef={cameraRef} />
        <pointLight ref={lightRef} castShadow={true} intensity={5} position={[targetPos[0], 2, targetPos[2]]}
          color={[1, 1, 1]} />
        <ScrollControls eps={0.00001} pages={3} distance={4} maxSpeed={5} >
          <ScrollContent setPercen={setScrollValue} />
        </ScrollControls>
        <mesh className="LOGO" position={[1, 0, 0]}>
          <pointLight intensity={22} position={[2.2, 1, -2]}
            color={new THREE.Color(0x223060)} />
          <pointLight intensity={55} position={[1.8, 1.5, -1.2]}
            color={new THREE.Color(0x223060)} />
          <mesh position={[2, 0.2, -1]} scale={0.6} rotation={[-Math.PI / 3, -Math.PI / 14, 0]}>
            <Logo scale={[1, 1, 0.5]} />
            <Float
              speed={6} // Animation speed, defaults to 1
              rotationIntensity={0.2} // XYZ rotation intensity, defaults to 1
              floatIntensity={0.5} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
              floatingRange={[-0.1, 0.0]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
            >
              <LogoGema />
            </Float>
          </mesh>
        </mesh>

        <mesh ref={targetNameRef} position={[-5, 0, -2.8]} />
        <SpotLight position={[-9, 3, -2.8]}
          castShadow={true}
          ref={spotNameRef}
          target={targetNameRef.current}
          distance={25}
          angle={0.5}
          intensity={25}
          attenuation={2}
          anglePower={5} // Diffuse-cone anglePower (default: 5)
        />

        <mesh receiveShadow={true} castShadow={true} rotation={[-Math.PI / 2, 0, 0]}>
          <Text3D position={[-5, 3, 0]}
            font={font2}
            bevelEnabled={true}
            bevelSize={0.05}
            bevelSegments={1}
            bevelThickness={0.025}
            height={0.175}
            size={0.8}>
            {"Juan\nLorente"}
            <meshStandardMaterial attach="material" color={[0.15, 0.15, 1]} />
          </Text3D>
          <Text3D position={[-5, 3, 0]}
            font={font2}
            height={0.2}
            size={0.8}>
            {"Juan\nLorente"}
            <meshStandardMaterial attach="material" color={[1, 1, 1]} />
          </Text3D>
        </mesh>
        <mesh position={[-2, 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <Linkedin ref={linkedinRef} />
          <Github ref={githubRef} />
          <CV ref={cvRef} />
        </mesh>

        <Box ref={box1Ref} args={[1, 1, 1]} position={[0, 0.5, 5]}>
          <meshStandardMaterial attach="material" color="red" />
        </Box>
        <Box ref={box2Ref} args={[1, 1, 1]} position={[1, 0.5, 6]}>
          <meshStandardMaterial attach="material" color="red" />
        </Box>
        {/* <Planee ref={planoRef}></Planee> */}

        <mesh receiveShadow={true} castShadow={true}>
          <Plane args={[100, 200]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 35]}>
            <meshStandardMaterial attach="material"
            />
            {/* <MeshReflectorMaterial
              blur={[0, 0]} // Blur ground reflections (width, height), 0 skips blur
              mixBlur={0} // How much blur mixes with surface roughness (default = 1)
              mixStrength={1} // Strength of the reflections
              mixContrast={1} // Contrast of the reflections
              resolution={1080} // Off-buffer resolution, lower=faster, higher=better quality, slower
              mirror={0} // Mirror environment, 0 = texture colors, 1 = pick up env colors
              depthScale={3} // Scale the depth factor (0 = no depth, default = 0)
              minDepthThreshold={0} // Lower edge for the depthTexture interpolation (default = 0)
              maxDepthThreshold={5} // Upper edge for the depthTexture interpolation (default = 0)
              depthToBlurRatioBias={1} // Adds a bias factor to the depthTexture before calculating the blur amount [blurFactor = blurTexture * (depthTexture + bias)]. It accepts values between 0 and 1, default is 0.25. An amount > 0 of bias makes sure that the blurTexture is not too sharp because of the multiplication with the depthTexture
              distortion={0} // Amount of distortion based on the distortionMap texture
              distortionMap={null} // The red channel of this texture is used as the distortion map. Default is null
              debug={0} // Depending on the assigned value, one of the following channels is shown: 0 = no debug 1 = depth channel 2 = base channel 3 = distortion channel 4 = lod channel (based on the roughness)
              reflectorOffset={0} // Offsets the virtual camera that projects the reflection. Useful when the reflective surface is some distance from the object's origin (default = 0)
            /> */}
          </Plane>
        </mesh>

      </Canvas>
    </section >
  );
};

export default Home;
