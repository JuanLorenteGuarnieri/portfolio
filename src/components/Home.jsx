import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three'
import { Vector3 } from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Plane, Box, MeshReflectorMaterial, SoftShadows, ScrollControls, useScroll, Text3D, } from '@react-three/drei';
import CameraController from './CameraController';
import SpotLightAberration from './SpotLightAberration';
import SpotLightAberration2 from './SpotLightAberration2';


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
        <pointLight intensity={4} position={[0, 2, 0]}
          color={[0.3, 0.3, 2]} />
        <ScrollControls eps={0.00001} pages={3} distance={4} maxSpeed={3} >
          <ScrollContent setPercen={setScrollValue} />
        </ScrollControls>

        {/*
        * Creates a new SpotLight.
        * @param color Hexadecimal color of the light. Default `0xffffff` _(white)_.
        * @param intensity Numeric value of the light's strength/intensity. Expects a `Float`. Default `1`.
        * @param distance Maximum range of the light. Default is 0 (no limit). Expects a `Float`.
        * @param angle Maximum angle of light dispersion from its direction whose upper bound is Math.PI/2.
        * @param penumbra Percent of the {@link SpotLight} cone that is attenuated due to penumbra. Takes values between zero and 1. Expects a `Float`. Default `0`.
        * @param decay The amount the light dims along the distance of the light. Expects a `Float`. Default `2`.
        */}
        {/* <SpotLightAberration position={[-15, 8, -10]} target={targetPos} intensity={88} maxDistance={30} scaleAberration={1} cameraRef={cameraRef} />
        <SpotLightAberration position={[15, 8, 5]} target={targetPos} intensity={88} maxDistance={30} scaleAberration={1} cameraRef={cameraRef} />
        <SpotLightAberration position={[-15, 8, 20]} target={targetPos} intensity={88} maxDistance={30} scaleAberration={1} cameraRef={cameraRef} />
        <SpotLightAberration position={[15, 8, 35]} target={targetPos} intensity={88} maxDistance={30} scaleAberration={1} cameraRef={cameraRef} /> */}

        <SpotLightAberration2 position={[0, 8, -10]} target={targetPos} intensity={55} maxDistance={30} scaleAngle={0.4} scaleAberration={2} cameraRef={cameraRef} />

        {/* <OrbitControls /> */}
        <SoftShadows samples={444} size={555} focus={3} />
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
            debug={0} /* Depending on the assigned value, one of the following channels is shown:
                      0 = no debug
                      1 = depth channel
                      2 = base channel
                      3 = distortion channel
                      4 = lod channel (based on the roughness)
                    
            reflectorOffset={0} // Offsets the virtual camera that projects the reflection. Useful when the reflective surface is some distance from the object's origin (default = 0)
          /> */}
        </Plane>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <Text3D position={[-5, 0, 0]}
            font={"src/assets/fonts/BungeeSpice.json"}>
            ???????????
            <meshLambertMaterial />
          </Text3D>
        </mesh>

        <Box ref={box1Ref} args={[1, 1, 1]} position={[0, 0.5, 0]}>
          <meshStandardMaterial attach="material" color="red" />
        </Box>
        <Box ref={box2Ref} args={[1, 1, 1]} position={[1, 0.5, 1]}>
          <meshStandardMaterial attach="material" color="red" />
        </Box>


      </Canvas>
    </section >
  );
};

export default Home;
