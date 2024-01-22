import React, { useRef, useState, useEffect } from 'react';
import font from '../assets/fonts/BungeeSpice.json';
import font2 from '../assets/fonts/Audiowide.json';
import fontUbuntuBold from '../assets/fonts/Ubuntu/Ubuntu_Bold.json';
import fontTitle from '../assets/fonts/Encode_Sans_Semi_Expanded/Encode_Sans_Semi_Expanded_Bold.json';
import fontText from '../assets/fonts/Source_Code_Pro/static/Source_Code_Pro_Regular.json';
import fontUbuntuMedium from '../assets/fonts/Ubuntu/Ubuntu_Medium_Regular.json';
import fontUbuntuMediumItalic from '../assets/fonts/Ubuntu/Ubuntu_Medium_Italic.json';
import fontEmoji from '../assets/fonts/Noto_Color_Emoji/Noto_Color_Emoji.json';
import * as THREE from 'three';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { Plane, Box, ScrollControls, useScroll, Text3D, SpotLight, Float, ContactShadows, Shadow, Svg, Gltf, useTexture, Grid, RoundedBox, } from '@react-three/drei';
import CameraController from './CameraController';
import SpotLightAberration from './SpotLightAberration';
import { Logo } from '../../public/models/Logo';
import { LogoGema } from '../../public/models/LogoGema';
import Raycaster from './Raycaster';
import { Linkedin } from '../../public/models/Linkedin';
import { Github } from '../../public/models/Github';
import { CV } from '../../public/models/Cv';
import TextAdvance from './TextAdvance';

import perfil from '../../public/perfil.png'
import eina from '../../public/eina_logo.png'
import { Iphone } from '../../public/models/Iphone';

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
    setPercen(scroll.offset);
  }, []);

};

function ScrollContent2({ setPercen }) {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const handleScrollChange = () => {
      if (scrollContainerRef.current) {
        const currentScroll = scrollContainerRef.current.scrollTop;
        const maxScroll = scrollContainerRef.current.scrollHeight - scrollContainerRef.current.clientHeight;
        const newPercentage = (currentScroll / maxScroll) * 100;

        setPercen(newPercentage);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScrollChange);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScrollChange);
      }
    };
  }, [setPercen]);

  return (
    <ScrollControls ref={scrollContainerRef} eps={0.00001} pages={3} distance={8} maxSpeed={15} >
    </ScrollControls>
  );
}

const CircularImage = ({ imageSrc, position, scale }) => {
  const texture = useTexture(imageSrc);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}
      position={position} scale={scale}>
      <circleGeometry args={[1, 32]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};

const Img = ({ imageSrc, position, scale }) => {
  const texture = useTexture(imageSrc);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}
      position={position} scale={scale}>
      <planeGeometry />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};



const Home = () => {
  const lightRef = useRef();
  const lightRef2 = useRef();
  const lightRef3 = useRef();
  const cameraRef = React.useRef();
  const linkedinRef = useRef();
  const githubRef = useRef();
  const cvRef = useRef();
  const iphoneRef = useRef();
  const [iphoneRotate, setIphoneRotate] = useState(0);

  const [dpr, setDpr] = useState([1, 2]); // Valores mínimos y máximos de dpr
  const [resolution, setResolution] = useState(1.2); // Valores mínimos y máximos de dpr

  const [targetPos, setTargetPos] = useState(0);
  const [scrollValue, setScrollValue] = useState(0);


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
      window.open('https://juanlorenteguarnieri.github.io/portfolio/CV.pdf', '_blank');
      return;
    }

  }



  useEffect(() => {
    // Ajusta el dpr basado en el ancho de la ventana, pero con límites
    const width = window.innerWidth;
    const newDpr = resolution * Math.min(Math.max(width / 1600, 0.5), 1); // Límites entre 1 y 2
    setDpr([newDpr, newDpr]);
  }, []);

  // *Mover IPHONE
  // useEffect(() => {
  //   // Configurar un intervalo
  //   const interval = setInterval(() => {
  //     setIphoneRotate(v => (v + 0.02) % (2 * Math.PI)); // Ajusta este valor según sea necesario
  //   }, 50); // Ajusta el intervalo de tiempo según sea necesario

  //   // Limpiar el intervalo cuando el componente se desmonte
  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    window.addEventListener('click', onMouseClick, false);

    return () => {
      window.removeEventListener('click', onMouseClick, false);
    };
  }, []);


  const calculateIntersect2 = (x, y) => {
    const mouse = new THREE.Vector2();

    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = -(y / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, cameraRef.current);

    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersectPoint = new THREE.Vector3();

    if (raycaster.ray.intersectPlane(plane, intersectPoint)) {
      if (handleIntersection) {
        handleIntersection(intersectPoint);
      }
    }
  };

  const calculateIntersect = (x, y) => {
    const mouse = new THREE.Vector2();

    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = -(y / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, cameraRef.current);
    raycaster.ray.direction.normalize();

    const intersectPoint = raycaster.ray.origin.sub(raycaster.ray.direction.multiplyScalar(raycaster.ray.origin.y / raycaster.ray.direction.y));
    setTargetPos([intersectPoint.x, intersectPoint.y, intersectPoint.z]);


  };

  const handlePointerMove = (event) => {
    if (cameraRef.current) {
      // Obtiene las coordenadas del cursor
      let x;
      let y;
      const { clientX, clientY } = event;
      if (event.touches) {
        // Manejo del evento táctil
        const touch = event.touches[0];
        x = touch.clientX;
        y = touch.clientY;
      } else {
        x = event.clientX;
        y = event.clientY;
      }

      // Llama a tu función de cálculo o lógica con estas coordenadas
      calculateIntersect(x, y);
    }
  };

  return (

    <section className="w-full h-screen">
      <Canvas dpr={dpr} shadows={true} className="w-full h-screen bg-black"
        onPointerMove={handlePointerMove} onTouchMove={handlePointerMove}

        camera={({ isPerspectiveCamera: true, far: 90, setFocalLength: 555, zoom: (window.innerWidth / window.innerHeight) / 1.6 })}>

        {/* <Raycaster externalCamera={cameraRef} onIntersect={handleIntersection} /> */}

        <CameraController scrollValue={scrollValue} cameraRef={cameraRef} />
        <ScrollControls eps={0.00001} pages={3} distance={8} maxSpeed={15} >
          <ScrollContent setPercen={setScrollValue} />
        </ScrollControls>

        <ambientLight intensity={0.5} />

        {/* <mesh className="GRID" position={[0, 0.1, 0]}>
          <Grid args={[20, 100, 20, 100]} />
        </mesh> */}

        <mesh className="PUNTERO">
          <pointLight ref={lightRef} castShadow={true} intensity={5} position={[targetPos[0], 0.1, targetPos[2]]}
            color={new THREE.Color(0x223060)} />
          <pointLight ref={lightRef2} castShadow={true} intensity={25} position={[targetPos[0], 0.7, targetPos[2]]}
            color={new THREE.Color(0x223060)} />
        </mesh>

        <mesh className="TITLE" position={[0, 0, -3]}>
          <mesh className="LOGO" position={[0, 0, 0.5]}>
            <pointLight intensity={200} position={[0, 1, 0.5]}
              color={new THREE.Color(0x223060)} />
            <pointLight intensity={200} position={[0, 1, 0]}
              color={new THREE.Color(0x223060)} />
            <mesh position={[0, 0.2, 1]} scale={0.65} rotation={[-Math.PI / 3, 0, 0]}>
              <Logo scale={[1, 1., 0.5]} />
              <Float
                speed={6} // Animation speed, defaults to 1
                rotationIntensity={0.3} // XYZ rotation intensity, defaults to 1
                floatIntensity={0.01} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
                floatingRange={[-0.2, 0.1]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
              >
                <LogoGema />
              </Float>
            </mesh>
          </mesh>

          <TextAdvance position={[-3.05, 0, 2.3]}
            text={"Juan Lorente"}
            font={fontTitle} size={0.73} height={0.1}
            colorPri={new THREE.Color(0xdddddd)} colorSec={new THREE.Color(0x333333)}
          />
          <TextAdvance position={[-2.7, 0, 2.8]}
            text={"Computer Ghraphics & Videogames developer"}
            font={fontText} size={0.16} height={0.05}
            colorPri={"white"} colorSec={new THREE.Color(0x223060)}
          />
          <mesh position={[0.37, -0.01, 3.3]} scale={[0.4, 0.4, 2]} rotation={[-Math.PI / 2, 0, 0]}>
            <Linkedin ref={linkedinRef} />
            <Github ref={githubRef} />
            <CV ref={cvRef} position={[-11.1, -0.85, 0]} scale={[5, 5, 1]} />
          </mesh>
        </mesh>

        <mesh className="ABOUT" position={[0, 0, 3]}>
          <TextAdvance position={[-0.83, 0, 0]}
            text={"ABOUT"}
            font={fontTitle} size={0.3} height={0.05}
            colorPri={new THREE.Color(0xdddddd)} colorSec={new THREE.Color(0x333333)}
          />
          <CircularImage receiveShadow={true} castShadow={true}
            imageSrc={perfil}
            position={[-3.2, 0.001, 1]} scale={0.8} />

          <pointLight intensity={200} position={[-3, 2, 1]}
            color={new THREE.Color(0x223060)} />
          <TextAdvance position={[-2, 0, 0.8]}
            text={"I'm a 21-year-old programmer from Spain, \npassionate about computer graphics and \nvideogame development. \n\nI'm in my final year of Computer \nEngineering and always on the lookout for \nprojects that challenge my creativity and \ntechnical skills."}
            font={fontText} size={0.16} height={0.05}
            colorPri={"white"} colorSec={new THREE.Color(0x223060)}
          />
        </mesh>

        <mesh className="EDUCATION" position={[0, 0, 9]}>
          <TextAdvance position={[-1.3, 0, 0]}
            text={"EDUCATION"}
            font={fontTitle} size={0.3} height={0.05}
            colorPri={new THREE.Color(0xdddddd)} colorSec={new THREE.Color(0x333333)}
          />
          <Img receiveShadow={true} castShadow={true}
            imageSrc={eina}
            position={[-3, 0.1, 1]} scale={1} />
          <TextAdvance position={[-2, 0, 0.8]}
            text={"Computer Engineering - University of Zaragoza"}
            font={fontText} size={0.16} height={0.05}
            colorPri={"white"} colorSec={new THREE.Color(0x223060)}
          />
          <TextAdvance position={[-0.41, 0, 1.3]}
            text={"Sep 2020 - present"}
            font={fontText} size={0.16} height={0.05}
            colorPri={new THREE.Color(0xcccccc)} colorSec={new THREE.Color(0x223060)}
          />
        </mesh>

        <mesh className="CERTIFICATES" position={[0, 0, 13]}>
          <TextAdvance position={[-1.3, 0, 0]}
            text={"CERTIFICATES"}
            font={fontTitle} size={0.3} height={0.05}
            colorPri={new THREE.Color(0xdddddd)} colorSec={new THREE.Color(0x333333)}
          />

        </mesh>

        <mesh className="PROJECTS" position={[0, 0, 16]}>
          <TextAdvance position={[-1.3, 0, 0]}
            text={"PROJECTS"}
            font={fontTitle} size={0.3} height={0.05}
            colorPri={new THREE.Color(0xdddddd)} colorSec={new THREE.Color(0x333333)}
          />

        </mesh>

        <mesh className="SKILLS & TOOLS" position={[0, 0, 20]}>
          <TextAdvance position={[-1.3, 0, 0]}
            text={"SKILLS & TOOLS"}
            font={fontTitle} size={0.3} height={0.05}
            colorPri={new THREE.Color(0xdddddd)} colorSec={new THREE.Color(0x333333)}
          />

        </mesh>

        <mesh className="CONTACT ME" position={[0, 0, 25]}>

          <TextAdvance position={[-1.475, 0, 0]}
            text={"CONTACT ME"}
            font={fontTitle} size={0.3} height={0.05}
            colorPri={new THREE.Color(0xdddddd)} colorSec={new THREE.Color(0x333333)}
          />
          <mesh className="Name" position={[-3.5, 0, 0.8]}>

            <TextAdvance position={[0, 0, 0]}
              text={"Name"}
              font={fontText} size={0.16} height={0.05}
              colorPri={"white"} colorSec={new THREE.Color(0x223060)}
            />
            <RoundedBox position={[1.5, -2.4, 0.35]} rotation={[Math.PI / 2, 0, 0]}
              args={[4.3, 1, 5]} radius={0.5}>
              <meshPhongMaterial color={"white"} />
            </RoundedBox>
          </mesh>
          <mesh className="E-mail" position={[-3.5, 0, 1.9]}>
            <TextAdvance position={[0, 0, 0]}
              text={"E-mail"}
              font={fontText} size={0.16} height={0.05}
              colorPri={"white"} colorSec={new THREE.Color(0x223060)}
            />
            <RoundedBox position={[1.5, -2.4, 0.4]} rotation={[Math.PI / 2, 0, 0]}
              args={[4.3, 1, 5]} radius={0.5}>
              <meshPhongMaterial color={"white"} />
            </RoundedBox>
          </mesh>
          <mesh className="Message" position={[0, 0, 0]}>
            <TextAdvance position={[-3.5, 0, 3]}
              text={"Message"}
              font={fontText} size={0.16} height={0.05}
              colorPri={"white"} colorSec={new THREE.Color(0x223060)}
            />
            <RoundedBox position={[-2, -2.4, 4]} rotation={[Math.PI / 2, 0, 0]}
              args={[5, 3, 5]} radius={1}>
              <meshStandardMaterial color={"white"} />
            </RoundedBox>
          </mesh>
          <mesh className="Iphone" position={[0, 0, 0]}>
            <pointLight intensity={400} position={[2, 4, 3.5]}
              color={new THREE.Color(0x223060)} />
            <pointLight intensity={110} position={[2, 2, 3.5]}
              color={new THREE.Color(0x223060)} />

            <Iphone ref={iphoneRef} position={[2, 0.68, 3]} rotation={[0, 0, scrollValue * 100 * Math.PI / 4 + 22 + iphoneRotate]} scale={1.5} />
          </mesh>
        </mesh>

        {/* <Planee ref={planoRef}></Planee> */}

        <mesh className="Floor" receiveShadow={true} castShadow={true}>
          <Plane args={[500, 500]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 35]}>
            <meshStandardMaterial attach="material" color={new THREE.Color(0x444444)}
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
