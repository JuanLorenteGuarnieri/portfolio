import React, { useRef, useState, useEffect } from 'react';
import font from '../assets/fonts/BungeeSpice.json';
import * as THREE from 'three'
import { Vector3 } from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Plane, Box, MeshReflectorMaterial, SoftShadows, ScrollControls, useScroll, Text3D, SpotLight, Float, } from '@react-three/drei';
import CameraController from './CameraController';
import SpotLightAberration from './SpotLightAberration';
import { Logo } from '../assets/models/Logo';
import { LogoGema } from '../assets/models/LogoGema';


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
  const cameraRef = useRef();
  const box1Ref = useRef();
  const box2Ref = useRef();
  const [targetPos, setTargetPos] = useState(0);
  const [scrollValue, setScrollValue] = useState(0);

  const targetNameRef = useRef();
  const spotNameRef = useRef();


  const onMouseMove = (event) => {
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;

    // Convertir la posición del ratón en coordenadas normalizadas (-1 a 1)
    const x = (clientX / innerWidth) * 2 - 1;
    const y = -(clientY / innerHeight) * 2 + 1;

    // Actualizar la posición de la luz
    if (lightRef.current) {

      lightRef.current.position.x = x * 5 + ((y + 1) * 2) * (innerWidth / innerHeight) * x + cameraRef.current.position.x; // Multiplicar por un factor para ampliar el rango de movimiento
      lightRef.current.position.z = -y * 5 - 3.5 + cameraRef.current.position.z;
      setTargetPos([lightRef.current.position.x, 0, lightRef.current.position.z]);
    }
  };


  useEffect(() => {
    // Agregar el evento listener
    if (spotNameRef.current) {
      spotNameRef.current.target = targetNameRef.current;
    }
    window.addEventListener('mousemove', onMouseMove);

    // Limpiar el evento listener
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (

    <section className="w-full h-screen relative">
      <Canvas className="w-full h-screen bg-transparent" camera={({ far: 20 })}>
        <CameraController scrollValue={scrollValue} cameraRef={cameraRef} />
        <pointLight ref={lightRef} intensity={1} position={[0, 2, 0]}
          color={[1, 1, 1]} />
        <pointLight intensity={3} position={[2.2, 0.4, -2]}
          color={[0.3, 0.3, 2]} />
        <ScrollControls eps={0.00001} pages={3} distance={4} maxSpeed={3} >
          <ScrollContent setPercen={setScrollValue} />
        </ScrollControls>
        <Logo />
        <Float
          speed={6} // Animation speed, defaults to 1
          rotationIntensity={0.1} // XYZ rotation intensity, defaults to 1
          floatIntensity={0.5} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
          floatingRange={[-0.1, 0.0]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
        >
          <LogoGema />
        </Float>

        <SpotLightAberration target={targetPos} intensity={55} scaleAngle={0.8} scaleAberration={0.5} cameraRef={cameraRef} />

        <mesh ref={targetNameRef} position={[-6, 0, -2.6]} />
        <SpotLight position={[-9, 2, -2.6]}
          ref={spotNameRef}
          target={targetNameRef.current}
          distance={25}
          angle={0.5}
          intensity={9}
          attenuation={2}
          anglePower={5} // Diffuse-cone anglePower (default: 5)
        />

        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <Text3D position={[-6, 3, 0]}
            font={font}
            height={0.1}
            size={0.8}>
            {"Juan\nLorente"}
            <meshPhongMaterial emissive={[0, 0, 0.1]}
              emissiveIntensity={0.01} color={[0.2, 0.2, 1]} />
          </Text3D>
        </mesh>

        <Box ref={box1Ref} args={[1, 1, 1]} position={[0, 0.5, 5]}>
          <meshStandardMaterial attach="material" color="red" />
        </Box>
        <Box ref={box2Ref} args={[1, 1, 1]} position={[1, 0.5, 6]}>
          <meshStandardMaterial attach="material" color="red" />
        </Box>

        <Plane args={[25, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 35]}>
          <meshPhongMaterial reflectivity={55}
            refractionRatio={2}
          />
          {/* <MeshReflectorMaterial
            blur={[0, 0]} // Blur ground reflections (width, height), 0 skips blur
            mixBlur={0} // How much blur mixes with surface roughness (default = 1)
            mixStrength={2} // Strength of the reflections
            mixContrast={2} // Contrast of the reflections
            resolution={55} // Off-buffer resolution, lower=faster, higher=better quality, slower
            mirror={0} // Mirror environment, 0 = texture colors, 1 = pick up env colors
            depthScale={2} // Scale the depth factor (0 = no depth, default = 0)
            minDepthThreshold={0.1} // Lower edge for the depthTexture interpolation (default = 0)
            maxDepthThreshold={1} // Upper edge for the depthTexture interpolation (default = 0)
            depthToBlurRatioBias={0.5} // Adds a bias factor to the depthTexture before calculating the blur amount [blurFactor = blurTexture * (depthTexture + bias)]. It accepts values between 0 and 1, default is 0.25. An amount > 0 of bias makes sure that the blurTexture is not too sharp because of the multiplication with the depthTexture
            distortion={0} // Amount of distortion based on the distortionMap texture
            distortionMap={null} // The red channel of this texture is used as the distortion map. Default is null
            debug={0} /* Depending on the assigned value, one of the following channels is shown: 0 = no debug 1 = depth channel 2 = base channel 3 = distortion channel 4 = lod channel (based on the roughness)
            reflectorOffset={0} // Offsets the virtual camera that projects the reflection. Useful when the reflective surface is some distance from the object's origin (default = 0)
          /> */}
        </Plane>
      </Canvas>
    </section >
  );
};

export default Home;
