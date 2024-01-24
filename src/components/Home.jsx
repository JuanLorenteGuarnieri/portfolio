import React, { useRef, useState, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import emailjs from '@emailjs/browser';
import { Plane, ScrollControls, useScroll, Float, Grid, Bvh, useDetectGPU, Sphere, Preload, PerformanceMonitor } from '@react-three/drei';
import fontTitle from '../assets/fonts/Encode_Sans_Semi_Expanded/Encode_Sans_Semi_Expanded_Bold.json';
import fontText from '../assets/fonts/Source_Code_Pro/static/Source_Code_Pro_Regular.json';

import { Logo } from '../../public/models/Logo';
import { LogoGema } from '../../public/models/LogoGema';
import { Linkedin } from '../../public/models/Linkedin';
import { Github } from '../../public/models/Github';
import { CV } from '../../public/models/Cv';
import { Iphone } from '../../public/models/Iphone';
import { Profile } from '../../public/models/Profile';
import { Unizar } from '../../public/models/Unizar';
import { Vscode } from '../../public/models/Vscode';
import { Blender } from '../../public/models/Blender';
import { Unreal } from '../../public/models/Unreal';
import { C } from '../../public/models/C';
import { Git } from '../../public/models/Git';
import { Tailwind } from '../../public/models/Tailwind';
import { Threejs } from '../../public/models/Threejs';
import { Reacts } from '../../public/models/React';
import { Doc } from '../../public/models/Doc';
import { Play } from '../../public/models/Play';
import { RusticSpaceShip } from '../../public/models/RusticSpaceShip';
import { Piano } from '../../public/models/Piano';
import { Chess } from '../../public/models/Chess';
import { RubikCube } from '../../public/models/Rubiks_cube';
import { Book } from '../../public/models/Book';
import { Box1 } from '../../public/models/Box1';
import { Box2 } from '../../public/models/Box2';

import TextAdvance from './TextAdvance';
import Loader from './Loader';
import Text3DForm from './Text3DForm';
import CameraController from './CameraController';
import { Send } from '../../public/models/Send';

/*
    TODO añadir animacion introduccion para evitar problemas de carga
        cambiar loading inicial
        cambiar navbar a uno lateral
        cambiar icono real por busto
        controlador form (donde pulsas empiezas a borrar, <- y -> para moverse )
        zoom/camara para que sea responsive
        optimizar codigo
        optimizar modelos 3d
*/

function ScrollContent({ setPercen }) {
  const scroll = useScroll();
  useFrame(() => {
    setPercen(scroll.offset);
  }, [setPercen]);

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


const Home = () => {
  const GPUTier = useDetectGPU()

  const lightRef = useRef();
  const lightRef2 = useRef();
  const lightRef3 = useRef();
  const cameraRef = React.useRef();
  const linkedinRef = useRef();
  const githubRef = useRef();
  const cvRef = useRef();
  const iphoneRef = useRef();
  const sendFormRef = useRef();
  const unizarRef = useRef();
  const rayTracerGitRef = useRef();
  const rayTracerDocRef = useRef();
  const spaceGitRef = useRef();
  const spaceDocRef = useRef();
  const spacePlayRef = useRef();
  const chessRef = useRef();
  const pianoRef = useRef();
  const rubikRef = useRef();
  const psychologyRef = useRef();

  const form1Ref = useRef();
  const form2Ref = useRef();
  const form3Ref = useRef();

  const [dpr, setDpr] = useState(1);
  const [typeForm, setTypeForm] = useState(0);

  const [targetPos, setTargetPos] = useState(0);
  const [scrollValue, setScrollValue] = useState(0);


  // Estados para almacenar los valores de los inputs
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');

  const changeUserName = (n) => {
    setUserName(n);
  };

  const changeUserEmail = (n) => {
    setUserEmail(n);
  };

  const changeMessage = (n) => {
    setMessage(n);
  };

  // Función para comprobar si el email es válido
  const emailIncorrecto = (email) => {
    // Expresión regular para validar el formato del email
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return !regex.test(email);
  };

  // Función para comprobar si el nombre de usuario es válido (letras, números y espacios permitidos)
  const nombreUsuarioInvalido = (nombre) => {
    const regex = /^[a-zA-Z0-9 ]+$/;
    return !regex.test(nombre);
  };

  var sendEmail = () => {
    // Crear un objeto de datos para el correo electrónico
    var templateParams = {
      user_name: userName,
      user_email: userEmail,
      message: message,
    };

    if (userName === '' || userEmail === '' || message === '') {
      console.log('Por favor, rellene todos los campos.');
      return;
    }
    if (emailIncorrecto(userEmail)) {
      console.log('El email proporcionado no es válido.');
      return;
    }
    if (nombreUsuarioInvalido(userName)) {
      console.log('El nombre de usuario no es válido.');
      return;
    }

    emailjs.send('service_4bprkd7', 'template_ri6j7pk', templateParams, 'PIjQsVkt3UW5dD4Vy')
      .then((result) => {
        console.log(result.text);
        changeUserName('');
        changeUserEmail('');
        changeMessage('');
      }, (error) => {
        console.log(error.text);
      });
  };

  // Configura el raycaster
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const changeTypeForm = (n) => {
    setTypeForm(n);
  };

  const handleIntersection = (point) => {
    setTargetPos([point.x, point.y, point.z]);
  };

  const handleKeyDown = (event) => { // Previene la acción predeterminada (scroll)
    // Comprueba si la tecla presionada es la tecla Espacio
    if (event.keyCode === 32) {
      event.preventDefault(); // Previene la acción predeterminada (scroll)
    }
  };

  useEffect(() => {
    // Agrega el manejador de eventos al montar el componente
    window.addEventListener('keydown', handleKeyDown);

    // Elimina el manejador de eventos al desmontar el componente
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const onMouseClick = (event) => {  // Comprobar pulsar link
    // Calcula la posición del mouse en coordenadas normalizadas (-1 a +1) para ambos ejes
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Actualiza el rayo con la posición del mouse y la cámara
    raycaster.setFromCamera(mouse, cameraRef.current);

    let intersects = raycaster.intersectObject(githubRef.current);
    if (intersects.length > 0) {
      window.open('https://github.com/JuanLorenteGuarnieri', '_blank');
      return;
    }

    intersects = raycaster.intersectObject(linkedinRef.current);
    if (intersects.length > 0) {
      window.open('https://www.linkedin.com/in/juanlorenteguarnieri/', '_blank');
      return;
    }

    intersects = raycaster.intersectObject(cvRef.current);
    if (intersects.length > 0) {
      window.open('https://juanlorenteguarnieri.github.io/portfolio/CV.pdf', '_blank');
      return;
    }

    intersects = raycaster.intersectObject(form1Ref.current);
    if (intersects.length > 0) {
      changeTypeForm(1);
      return;
    }

    intersects = raycaster.intersectObject(form2Ref.current);
    if (intersects.length > 0) {
      changeTypeForm(2);
      return;
    }

    intersects = raycaster.intersectObject(form3Ref.current);
    if (intersects.length > 0) {
      changeTypeForm(3);
      return;
    }

    intersects = raycaster.intersectObject(sendFormRef.current);
    if (intersects.length > 0) {
      sendEmail();
      return;
    }

    intersects = raycaster.intersectObject(iphoneRef.current);
    if (intersects.length > 0) {
      window.open('https://unizar.es/', '_blank');
      return;
    }

    intersects = raycaster.intersectObject(unizarRef.current);
    if (intersects.length > 0) {
      window.open('https://unizar.es/', '_blank');
      return;
    }

    intersects = raycaster.intersectObject(rayTracerGitRef.current);
    if (intersects.length > 0) {
      window.open('https://github.com/JuanLorenteGuarnieri', '_blank');
      return;
    }

    intersects = raycaster.intersectObject(rayTracerDocRef.current);
    if (intersects.length > 0) {
      window.open('https://github.com/JuanLorenteGuarnieri', '_blank');
      return;
    }

    intersects = raycaster.intersectObject(chessRef.current);
    if (intersects.length > 0) {
      window.open('https://www.chess.com/member/qassiel', '_blank');
      return;
    }

    intersects = raycaster.intersectObject(pianoRef.current);
    if (intersects.length > 0) {
      window.open('https://recursivearts.com/es/virtual-piano/', '_blank');
      return;
    }

    intersects = raycaster.intersectObject(rubikRef.current);
    if (intersects.length > 0) {
      window.open('https://rubikscu.be/', '_blank');
      return;
    }

    intersects = raycaster.intersectObject(psychologyRef.current);
    if (intersects.length > 0) {
      window.open('https://www.amazon.com/Laws-Human-Nature-Robert-Greene/dp/0525428143', '_blank');
      return;
    }
  }

  useEffect(() => {
    window.addEventListener('click', onMouseClick, false);
    return () => {
      window.removeEventListener('click', onMouseClick, false);
    };
  }, [userName, userEmail, message]);



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
      let x, x_old, y, y_old;
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
      if (x != x_old || y != y_old) {
        calculateIntersect(x, y);
        x = x_old;
        y = y_old;
      }
    }
  };

  return (
    <section className="w-full h-screen">
      <Canvas dpr={dpr} shadows={true} className="w-full h-screen bg-black"
        onPointerMove={handlePointerMove} onTouchMove={handlePointerMove}
        camera={({ isPerspectiveCamera: true, near: 0.1, far: 8, setFocalLength: 555, zoom: (window.innerWidth / window.innerHeight) / 1.6 })}>

        <Suspense fallback={<Loader />}>

          <mesh className="CONFIG">
            <PerformanceMonitor factor={0.5} onChange={({ factor }) => setDpr(Math.max(0.5, Math.min(0.5 + 1.1 * factor, 1.2)), 1)} />

            <CameraController scrollValue={scrollValue} cameraRef={cameraRef} />
            <ScrollControls eps={0.00001} pages={3} distance={3} maxSpeed={15} >
              <ScrollContent setPercen={setScrollValue} />
            </ScrollControls>
            <ambientLight intensity={0.5} />
          </mesh>

          <mesh className="GRID" position={[0, 0.1, 0]}>
            <Grid args={[20, 100, 20, 100]} />
          </mesh>

          <mesh className="POINTER">
            <pointLight ref={lightRef} castShadow={true} intensity={25} position={[targetPos[0], 0.4, targetPos[2]]}
              color={new THREE.Color(0x223060)} />
            {/* <pointLight ref={lightRef2} castShadow={true} intensity={25} position={[targetPos[0], 0.7, targetPos[2]]}
              color={new THREE.Color(0x223060)} /> */}
          </mesh>

          <mesh className="TITLE" position={[0, 0, -3]}>

            <mesh className="LOGO" position={[0, 0, 0.5]}>
              <pointLight intensity={200} position={[0, 1, 0.5]}
                color={new THREE.Color(0x223060)} />
              <pointLight intensity={200} position={[0, 1, 0]}
                color={new THREE.Color(0x223060)} />
              <mesh position={[0, 0.2, 1]} scale={0.65} rotation={[-Math.PI / 3, 0, 0]}>
                <Bvh firstHitOnly >
                  <Logo scale={[1, 1., 0.5]} />
                  <Float
                    speed={6} // Animation speed, defaults to 1
                    rotationIntensity={0.3} // XYZ rotation intensity, defaults to 1
                    floatIntensity={0.01} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
                    floatingRange={[-0.2, 0.1]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
                  >
                    <LogoGema />
                  </Float>
                </Bvh>
              </mesh>
            </mesh>

            <TextAdvance position={[0, 0, 2.4]}
              text={"Juan Lorente"}
              font={fontTitle} size={0.73} height={0.1}
              colorPri={new THREE.Color(0xdddddd)} colorSec={new THREE.Color(0x333333)}
            />
            <TextAdvance position={[0, 0, 2.8]}
              text={"Computer Ghraphics & Videogames developer"}
              font={fontText} size={0.16} height={0.05}
              colorPri={"white"} colorSec={new THREE.Color(0x223060)}
            />

            <mesh className="LINKS" position={[0, 0, 3.15]} scale={1} rotation={[0, 0, 0]}>
              <Bvh firstHitOnly >
                <Linkedin ref={linkedinRef} scale={12} position={[0.7, -0.08, 0]} rotation={[0, 0, 0]} />
                <Github ref={githubRef} scale={12} position={[0, -0.08, 0]} rotation={[0, 0, 0]} />
                <CV ref={cvRef} scale={12} position={[-0.7, -0.08, 0]} rotation={[0, 0, 0]} />
              </Bvh>
            </mesh>
          </mesh>

          <mesh className="ABOUT" position={[0, 0, 3]}>
            <TextAdvance position={[0, 0, 0]}
              text={"ABOUT"}
              font={fontTitle} size={0.3} height={0.05}
              colorPri={new THREE.Color(0xdddddd)} colorSec={new THREE.Color(0x333333)}
            />
            <Bvh firstHitOnly >
              <Profile scale={9} position={[-3.2, 0.001, 2.2]} rotation={[-Math.PI / 2, 0, 0]} />
            </Bvh>
            <pointLight intensity={200} position={[0, 2, 1.5]}
              color={new THREE.Color(0x223060)} />
            <pointLight intensity={30} position={[-3.5, 1, 1.3]}
              color={new THREE.Color(0x223060)} />
            <TextAdvance position={[0.75, 0, 0.8]}
              text={"I'm a 21-year-old programmer from Spain, \npassionate about computer graphics and \nvideogame development. \n\nI'm in my final year of Computer \nEngineering and always on the lookout for \nprojects that challenge my creativity and \ntechnical skills."}
              font={fontText} size={0.16} height={0.05}
              colorPri={"white"} colorSec={new THREE.Color(0x223060)}
            />
          </mesh>

          <mesh className="EDUCATION" position={[0, 0, 7.8]}>
            <TextAdvance position={[0, 0, 0]}
              text={"EDUCATION"}
              font={fontTitle} size={0.3} height={0.05}
              colorPri={new THREE.Color(0xdddddd)} colorSec={new THREE.Color(0x333333)}
            />
            <pointLight intensity={150} position={[0.5, 2, 1]}
              color={new THREE.Color(0x223060)} />
            <pointLight intensity={20} position={[-1.85, 1, 1.07]}
              color={new THREE.Color(0x223060)} />
            <Bvh firstHitOnly >
              <Unizar ref={unizarRef} scale={20} position={[-1.85, -0.09, 1.07]} rotation={[0, 0, 0]} />
            </Bvh>
            <TextAdvance position={[-0.8, 0, 0.7]} align="left"
              text={"Computer Engineering \nUniversity of Zaragoza"}
              font={fontText} size={0.16} height={0.05}
              colorPri={"white"} colorSec={new THREE.Color(0x223060)}
            />
            <TextAdvance position={[-0.8, 0, 1.4]} align="left"
              text={"2020 - 2024"}
              font={fontText} size={0.16} height={0.05}
              colorPri={new THREE.Color(0xaaaaaa)} colorSec={new THREE.Color(0x223060)}
            />
          </mesh>

          <mesh className="PROJECTS" position={[0, 0, 10.9]}>
            <TextAdvance position={[0, 0, 0]}
              text={"PROJECTS"}
              font={fontTitle} size={0.3} height={0.05}
              colorPri={new THREE.Color(0xdddddd)} colorSec={new THREE.Color(0x333333)}
            />
            <pointLight intensity={100} position={[0, 2, 2.8]}
              color={new THREE.Color(0x223060)} />
            <mesh className="RAY TRACER" position={[0, 0, 0]}>

              <mesh className="MODEL" position={[-3, 0.4, 2]} rotation={[-Math.PI / 6, Math.PI / 4, 0]}>
                <pointLight castShadow={true} intensity={1} position={[0, 0.4, 0]} power={55}
                  color={new THREE.Color(0x223060)} />
                <Bvh firstHitOnly >
                  <Plane args={[1, 1, 1, 1]} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}
                    receiveShadow>
                    <meshPhysicalMaterial color={new THREE.Color(0xffffff)}
                    />
                  </Plane>
                  <Plane args={[1, 1, 1, 1]} position={[0, 1, 0]} rotation={[Math.PI / 2, 0, 0]}
                    receiveShadow>
                    <meshPhysicalMaterial color={new THREE.Color(0xffffff)} />
                  </Plane>
                  <Plane args={[1, 1, 1, 1]} position={[0, 0.5, -0.5]} rotation={[0, 0, 0]}
                    receiveShadow>
                    <meshPhysicalMaterial color={new THREE.Color(0xffffff)}
                    />
                  </Plane>
                  <Plane args={[1, 1, 1, 1]} position={[-0.5, 0.5, 0]} rotation={[0, Math.PI / 2, 0]}
                    castShadow={false} receiveShadow>
                    <meshPhysicalMaterial color={new THREE.Color(0xff0000)} side={THREE.DoubleSide}
                    />
                  </Plane>
                  <Plane args={[1, 1, 1, 1]} position={[0.5, 0.5, 0]} rotation={[0, -Math.PI / 2, 0]}
                    receiveShadow>
                    <meshPhysicalMaterial color={new THREE.Color(0x00ff00)} side={THREE.DoubleSide}
                    />
                  </Plane>
                  <Sphere args={[0.15]} position={[0.2, 0.15, 0]} rotation={[0, -Math.PI / 2, 0]}
                    castShadow >
                    <meshPhysicalMaterial
                      color={new THREE.Color(0x444444)}
                      roughness={0}
                      metalness={0.1}
                    />
                  </Sphere>
                  <Sphere args={[0.15]} position={[-0.2, 0.15, -0.2]} rotation={[0, -Math.PI / 2, 0]}
                    castShadow >
                    <meshPhysicalMaterial
                      color={new THREE.Color(0x9db4ec)}
                    />
                  </Sphere>
                </Bvh>
              </mesh>

              <TextAdvance position={[0, 0, 0.9]}
                text={"RAY TRACER"}
                font={fontText} size={0.2} height={0.05}
                colorPri={"white"} colorSec={new THREE.Color(0x223060)}
              />

              <TextAdvance position={[0, 0, 1.5]}
                text={"Path tracer & Photon Mapping \nraytracer from scratch"}
                font={fontText} size={0.16} height={0.05}
                colorPri={"white"} colorSec={new THREE.Color(0x223060)}
              />

              <C scale={20} position={[3, -0.08, 1.6]} rotation={[0, 0, 0]} />
              <pointLight intensity={15} position={[3, 1, 1.6]}
                color={new THREE.Color(0x223060)} />

              <mesh className="LINKS" position={[0, 0, 2.3]}>
                <Bvh firstHitOnly >
                  <Doc ref={rayTracerDocRef} scale={12} position={[0.7, -0.08, 0]} rotation={[0, 0, 0]} />
                  <Github ref={rayTracerGitRef} scale={12} position={[0, -0.08, 0]} rotation={[0, 0, 0]} />
                </Bvh>
              </mesh>


            </mesh>
            <mesh className="VIDEOGAME" position={[0, 0, 2.7]}>

              <mesh className="MODEL" >

                <pointLight intensity={20} position={[2.8, 1, 1.3]}
                  color={new THREE.Color(0x223060)} />
                <Bvh firstHitOnly >
                  <Float
                    speed={4} // Animation speed, defaults to 1
                    rotationIntensity={0.3} // XYZ rotation intensity, defaults to 1
                    floatIntensity={0.01} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
                    floatingRange={[-0.2, 0.1]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
                  >
                    <RusticSpaceShip position={[2.5, 0.45, 1.8]} />
                  </Float>
                </Bvh>
              </mesh>

              <TextAdvance position={[0, 0, 0.9]}
                text={"SPACESHIP CONTROLLER"}
                font={fontText} size={0.2} height={0.05}
                colorPri={"white"} colorSec={new THREE.Color(0x223060)}
              />

              <TextAdvance position={[0, 0, 1.5]}
                text={"A mini-game where you control \na spaceship (WORK IN PROGRESS)"}
                font={fontText} size={0.16} height={0.05}
                colorPri={"white"} colorSec={new THREE.Color(0x223060)}
              />

              <Threejs scale={20} position={[-3, -0.08, 1.58]} rotation={[0, 0, 0]} />
              <pointLight intensity={15} position={[-3, 1, 1.58]}
                color={new THREE.Color(0x223060)} />

              <Reacts scale={20} position={[-4, -0.08, 1.58]} rotation={[0, 0, 0]} />
              <pointLight intensity={15} position={[-4, 1, 1.58]}
                color={new THREE.Color(0x223060)} />

              {/* <mesh className="LINKS" position={[0, 0, 2.3]}>
                <Bvh firstHitOnly >
                  <Doc ref={null} scale={12} position={[0.7, -0.08, 0]} rotation={[0, 0, 0]} />
                  <Github ref={null} scale={12} position={[0, -0.08, 0]} rotation={[0, 0, 0]} />
                  <Play ref={null} scale={12} position={[-0.7, -0.08, 0]} rotation={[0, 0, 0]} />
                </Bvh>
              </mesh> */}
            </mesh>

          </mesh>

          <mesh className="SKILLS & TOOLS" position={[0, 0, 17.9]}>
            <TextAdvance position={[0, 0, 0]}
              text={"SKILLS & TOOLS"}
              font={fontTitle} size={0.3} height={0.05}
              colorPri={new THREE.Color(0xdddddd)} colorSec={new THREE.Color(0x333333)}
            />
            <Bvh firstHitOnly >
              <C scale={20} position={[-3.5, -0.08, 1.1]} rotation={[0, 0, 0]} />
              <pointLight intensity={15} position={[-3.5, 1, 1.1]}
                color={new THREE.Color(0x223060)} />

              <Blender scale={20} position={[-2.5, -0.08, 1.1]} rotation={[0, 0, 0]} />
              <pointLight intensity={15} position={[-2.5, 1, 1.1]}
                color={new THREE.Color(0x223060)} />

              <Unreal scale={20} position={[-1.5, -0.08, 1.1]} rotation={[0, 0, 0]} />
              <pointLight intensity={15} position={[-1.5, 1, 1.1]}
                color={new THREE.Color(0x223060)} />

              <Vscode scale={20} position={[-0.5, -0.08, 1.1]} rotation={[0, 0, 0]} />
              <pointLight intensity={15} position={[-0.5, 1, 1.1]}
                color={new THREE.Color(0x223060)} />

              <Git scale={20} position={[0.5, -0.08, 1.1]} rotation={[0, 0, 0]} />
              <pointLight intensity={15} position={[0.5, 1, 1.1]}
                color={new THREE.Color(0x223060)} />

              <Threejs scale={20} position={[1.5, -0.08, 1.1]} rotation={[0, 0, 0]} />
              <pointLight intensity={15} position={[1.5, 1, 1.1]}
                color={new THREE.Color(0x223060)} />

              <Reacts scale={20} position={[2.5, -0.08, 1.1]} rotation={[0, 0, 0]} />
              <pointLight intensity={15} position={[2.5, 1, 1.1]}
                color={new THREE.Color(0x223060)} />

              <Tailwind scale={20} position={[3.5, -0.08, 1.1]} rotation={[0, 0, 0]} />
              <pointLight intensity={15} position={[3.5, 1, 1.1]}
                color={new THREE.Color(0x223060)} />

            </Bvh>
          </mesh>

          <mesh className="CONTACT ME" position={[0, 0, 20.9]}>

            <pointLight intensity={400} position={[-2.5, 4, 3.5]}
              color={new THREE.Color(0x223060)} />
            <TextAdvance position={[0, 0, 0]}
              text={"CONTACT ME"}
              font={fontTitle} size={0.3} height={0.05}
              colorPri={new THREE.Color(0xdddddd)} colorSec={new THREE.Color(0x333333)}
            />
            <mesh className="Name" position={[-3.5, 0, 0.8]}>
              <TextAdvance position={[0, -0.03, 0.15]} align="left"
                text={"Name"}
                font={fontText} size={0.16} height={0.05}
                colorPri={"white"} colorSec={new THREE.Color(0x223060)}
              />
              <Text3DForm position={[-0.2, 0, 0.6]} align="left"
                id={1} typeForm={typeForm} change={changeTypeForm}
                font={fontText} size={0.14} height={0.05} text={userName} setText={changeUserName}
                colorPri={new THREE.Color(0x424050)} isEditable={"true"} //
              />
              <Box1 ref={form1Ref} position={[-2, -0.14, 1.13]} scale={[20, 20, 15]} />
            </mesh>
            <mesh className="E-mail" position={[-3.5, 0, 1.9]}>
              <TextAdvance position={[0, -0.03, 0.15]} align="left"
                text={"E-mail"}
                font={fontText} size={0.16} height={0.05}
                colorPri={"white"} colorSec={new THREE.Color(0x223060)}
              />
              <Text3DForm position={[-0.2, 0, 0.6]} align="left"
                id={2} typeForm={typeForm} change={changeTypeForm}
                font={fontText} size={0.14} height={0.05} text={userEmail} setText={changeUserEmail}
                colorPri={new THREE.Color(0x424050)} isEditable={"true"} //
              />
              <Box1 ref={form2Ref} position={[-2, -0.14, 1.13]} scale={[20, 20, 15]} />

            </mesh>
            <mesh className="Message" position={[-3.5, 0, 3]}>
              <TextAdvance position={[0, -0.03, 0.15]} align="left"
                text={"Message"}
                font={fontText} size={0.16} height={0.05}
                colorPri={"white"} colorSec={new THREE.Color(0x223060)}
              />
              <Text3DForm position={[-0.15, 0, 0.6]} align="left"
                id={3} typeForm={typeForm} change={changeTypeForm} text={message} setText={changeMessage}
                font={fontText} size={0.14} height={0.05} textParagraph={true} maxLengthCharacters={140}
                colorPri={new THREE.Color(0x424050)} isEditable={"true"} //
              />
              <Box2 ref={form3Ref} position={[-2, -0.14, 1.2]} scale={[20, 20, 16]} />

            </mesh>
            <mesh className="Iphone" position={[0, 0, 0]}>
              <pointLight intensity={300} position={[2, 4, 3.5]}
                color={new THREE.Color(0x223060)} />
              <pointLight intensity={110} position={[2, 2, 3.5]}
                color={new THREE.Color(0x223060)} />

              <pointLight intensity={15} position={[-3.5, 1, 1.1]}
                color={new THREE.Color(0x223060)} />
              <Bvh firstHitOnly >
                <Send ref={sendFormRef} scale={20} position={[0.5, -0.08, 4.6]} rotation={[0, 0, 0]} />
                <Iphone ref={iphoneRef} position={[2, 0.68, 3]} rotation={[0, 0, scrollValue * 30 * Math.PI / 4 + 4.1]} scale={1.5} />

              </Bvh>
            </mesh>
          </mesh>

          <TextAdvance position={[0, 0, 30.9]}
            text={"???"}
            font={fontTitle} size={0.3} height={0.05}
            colorPri={new THREE.Color(0xdddddd)} colorSec={new THREE.Color(0x333333)}
          />

          <mesh className="INTEREST" position={[0, 0, 35.9]}>
            <TextAdvance position={[0, 0, 0]}
              text={"INTERESTS"}
              font={fontTitle} size={0.3} height={0.05}
              colorPri={new THREE.Color(0xdddddd)} colorSec={new THREE.Color(0x333333)}
            />
            <mesh className="LIGHTS">
              <pointLight intensity={100} position={[2.5, 2, 2.5]}
                color={new THREE.Color(0x223060)} />
              <pointLight intensity={100} position={[2.5, 2, 4.8]}
                color={new THREE.Color(0x223060)} />
              <pointLight intensity={100} position={[-2.5, 2, 2.5]}
                color={new THREE.Color(0x223060)} />
              <pointLight intensity={100} position={[-2.5, 2, 4.8]}
                color={new THREE.Color(0x223060)} />
            </mesh>
            <mesh className="MODELS">
              <Bvh firstHitOnly >
                <Piano ref={pianoRef} scale={1.3} position={[4.8, -0.19, 2.1]} rotation={[0, -Math.PI / 3, 0]} />
                <Chess ref={chessRef} scale={2.4} position={[-4.5, 0, 5]} rotation={[0, 0, 0]} />
                <Float
                  speed={4} // Animation speed, defaults to 1
                  rotationIntensity={0.3} // XYZ rotation intensity, defaults to 1
                  floatIntensity={0.4} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
                  floatingRange={[0, 1]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
                >
                  <RubikCube ref={rubikRef} scale={0.15} position={[-4.8, 0, 2.3]} rotation={[0, Math.PI / 6, 0]} />
                </Float>
                <Book ref={psychologyRef} scale={0.065} position={[4.7, 0, 5]} rotation={[0, -1.7, 0]} />
              </Bvh>
            </mesh>

            <mesh className="TEXT">
              <TextAdvance position={[2.5, 0, 2.5]}
                text={"PIANO"}
                font={fontText} size={0.17} height={0.05}
                colorPri={"white"} colorSec={new THREE.Color(0x223060)}
              />
              <TextAdvance position={[2.5, 0, 2.8]}
                text={"10 years EXP"}
                font={fontText} size={0.16} height={0.05}
                colorPri={"white"} colorSec={new THREE.Color(0x223060)}
              />
              <TextAdvance position={[-2.5, 0, 2.66]}
                text={"RUBIK's solver"}
                font={fontText} size={0.16} height={0.05}
                colorPri={"white"} colorSec={new THREE.Color(0x223060)}
              />

              <TextAdvance position={[-2.5, 0, 5]}
                text={"CHESS +833 games"}
                font={fontText} size={0.16} height={0.05}
                colorPri={"white"} colorSec={new THREE.Color(0x223060)}
              />

              <TextAdvance position={[2.5, 0, 5]}
                text={"PSYCHOLOGY reader"}
                font={fontText} size={0.16} height={0.05}
                colorPri={"white"} colorSec={new THREE.Color(0x223060)}
              />
            </mesh>
          </mesh>

          <mesh className="FLOOR" >
            <Plane args={[500, 500]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 35]}
              receiveShadow>
              <meshPhysicalMaterial color={new THREE.Color(0x444444)} />
            </Plane>
          </mesh>

          <Preload all />
        </Suspense>
      </Canvas>
    </section >
  );
};

export default Home;
