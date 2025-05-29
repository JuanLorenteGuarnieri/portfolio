import React, { useRef, useState, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import emailjs from '@emailjs/browser';
import { Plane, Float, Grid, Bvh, useDetectGPU, Sphere, PerformanceMonitor, Html } from '@react-three/drei';
import fontTitle from '../assets/fonts/Encode_Sans_Semi_Expanded/Encode_Sans_Semi_Expanded_Bold.json';
import fontText from '../assets/fonts/Source_Code_Pro/static/Source_Code_Pro_Regular.json';

import { Logo } from '../../public/models/Logo';
import { LogoGema } from '../../public/models/LogoGema';
import { Linkedin } from '../../public/models/Linkedin';
import { Github } from '../../public/models/Github';
import { CV } from '../../public/models/Cv';
import { Iphone } from '../../public/models/Iphone';
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
import { Duolingo } from '../../public/models/Duolingo';
import { Box1 } from '../../public/models/Box1';
import { Box2 } from '../../public/models/Box2';
import { Send } from '../../public/models/Send';
import { Juan } from '../../public/models/Juan';


import TextAdvance from './TextAdvance';
import Loader from './Loader';
import Text3DForm from './Text3DForm';
import CameraController from './CameraController';
import Navigation, { Navigations } from './Navigation';

const Home = ({ scrollValue, maxY, changeScroll }) => {
  // CONFIGURATION
  const GPUTier = useDetectGPU()
  const cameraRef = React.useRef();
  const [dpr, setDpr] = useState(0.75);
  const [targetPos, setTargetPos] = useState(0);

  const lightRef = useRef(), lightRef2 = useRef(), lightRef3 = useRef();

  // SECTIONS
  const sectionTitle = '0', sectionAbout = '1500', sectionEducation = '2250', sectionProyects = '3300';
  const sectionSkills = '4200', sectionContact = '5500', sectionInterest = '8800';

  var whatSection = () => {  // returns the current section
    if (scrollValue < sectionAbout) {
      return 1; // Sección Título
    } else if (scrollValue < sectionEducation) {
      return 2; // Sección About
    } else if (scrollValue < sectionProyects) {
      return 3; // Sección Education
    } else if (scrollValue < sectionSkills) {
      return 4; // Sección Proyects
    } else if (scrollValue < sectionContact) {
      return 5; // Sección Skills
    } else if (scrollValue < sectionInterest) {
      return 6; // Sección Contact
    } else {
      return 7; // Sección Interest
    }
  };

  // TITLE
  const linkedinRef = useRef(), githubRef = useRef(), cvRef = useRef();


  //EDUCATION
  const unizarRef = useRef();

  // PROYECTS
  const rayTracerGitRef = useRef(), rayTracerDocRef = useRef();
  const spaceGitRef = useRef(), spaceDocRef = useRef(), spacePlayRef = useRef();

  // CONTACT
  const iphoneRef = useRef();
  const sendFormRef = useRef();
  //         FORMS
  const [typeForm, setTypeForm] = useState(0);

  const hiddenInputRef1 = useRef(), hiddenInputRef2 = useRef(), hiddenInputRef3 = useRef();
  const form1Ref = useRef(), form2Ref = useRef(), form3Ref = useRef();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');

  const [feedback, setFeedback] = useState('');
  const [colorFeedback, setcolorFeedback] = useState(0x5cae5e);

  // INTEREST
  const chessRef = useRef(), pianoRef = useRef(), rubikRef = useRef(), psychologyRef = useRef(), duolingoRef = useRef();

  //piano exp = año actual - 2015
  const pianoExp = new Date().getFullYear() - 2015;
  const [chessCount, setChessCount] = useState('');
  const [duoStreak, setDuoStreak] = useState('');

  async function updateCountFromChess() {
    try {
      // 1) Construimos la URL del endpoint de estadísticas
      const url = `https://api.chess.com/pub/player/qassiel/stats`;

      // 2) Realizamos la solicitud fetch
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error al obtener los datos: ${response.status}`);
      }

      // 3) Parseamos la respuesta JSON
      const data = await response.json();

      // 4) Inicializamos el contador total de partidas
      let totalGames = 0;

      // 5) Definimos las modalidades de juego que queremos considerar
      const gameModes = ['chess_bullet', 'chess_blitz', 'chess_rapid', 'chess_daily'];

      // 6) Iteramos sobre cada modalidad y sumamos las partidas jugadas
      for (const mode of gameModes) {
        if (data[mode] && data[mode].record) {
          const { win = 0, loss = 0, draw = 0 } = data[mode].record;
          totalGames += win + loss + draw;
        }
      }

      // 7) Redondeamos hacia abajo a la centena más cercana
      const roundedCount = Math.floor(totalGames / 10) * 10;

      // 8) Convertimos el número a string y lo asignamos a la variable correspondiente
      const resultString = roundedCount.toString();
      setChessCount(resultString);

      console.log('Valor actualizado:', resultString);
    } catch (err) {
      console.error('Error al actualizar el conteo de partidas:', err);
    }
  }

  async function updateDuolingoStreak() {
    try {
      // 1) Montamos la URL del proxy + la URL objetivo
      const targetUrl = encodeURIComponent('https://duome.eu/Qassiel');
      const proxyUrl = `https://api.allorigins.win/raw?url=${targetUrl}`;

      // 2) Hacemos el fetch a través del proxy (el proxy añade el header CORS)
      const response = await fetch(proxyUrl);
      const html = await response.text();

      // 3) Parseamos el HTML y extraemos el <span class="cc-header-count">
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      // Busca un <span> cuyo aria-label contenga 'days streak'
      const span = Array.from(doc.querySelectorAll('span')).find(
        el => el.getAttribute('aria-label') && el.getAttribute('aria-label').includes('days streak')
      );
      if (!span) throw new Error('No se encontró un span con aria-label que contenga "days streak"');

      // 4) 
      let text = span.textContent.trim();

      // 5) Asignas a tu variable
      setDuoStreak(text);
      console.log('Valor actualizado:', text);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    updateCountFromChess();
    updateDuolingoStreak();
    // eslint-disable-next-line
  }, []);

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

  const getDistance2Camera = (v1) => {
    if (!cameraRef.current) return 0;
    var position = cameraRef.current.position;
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

  var sendEmail = () => {
    // Crear un objeto de datos para el correo electrónico
    var templateParams = {
      user_name: userName,
      user_email: userEmail,
      message: message,
    };

    if (userName === '' || userEmail === '' || message === '') {
      setFeedback('Complete all the fields');
      setcolorFeedback(0xff4440);
      return;
    }
    if (emailIncorrecto(userEmail)) {
      setFeedback('The email is not valid');
      setcolorFeedback(0xff4440);
      return;
    }
    if (nombreUsuarioInvalido(userName)) {
      setFeedback('The username is not valid');
      setcolorFeedback(0xff4440);
      return;
    }

    emailjs.send('service_4bprkd7', 'template_ri6j7pk', templateParams, 'PIjQsVkt3UW5dD4Vy')
      .then((result) => {
        setFeedback('Email sent');
        setcolorFeedback(0x5cae5e);
        changeUserName('');
        changeUserEmail('');
        changeMessage('');
        setTimeout(() => {
          setFeedback('');
        }, 5000);
      }, (error) => {
        setFeedback(error.text);
        setcolorFeedback(0xff4440);
      });
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
      const normalizedSpeed = Math.min(speed / 800, 1); // Ajusta el divisor para cambiar la sensibilidad
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
    console.log("Type Form: " + n);
    setTypeForm(n);
  };

  const handleIntersection = (point) => {
    setTargetPos([point.x, point.y, point.z]);
  };

  const handleKeyDown = (event) => { // Prevent default action for 'Space' (scroll)
    // Comprueba si la tecla presionada es la tecla Espacio
    if (event.keyCode === 32) {
      event.preventDefault(); // Previene la acción predeterminada (scroll)
    }
  };

  useEffect(() => { // Listener for handleKeyDown
    // Agrega el manejador de eventos al montar el componente
    window.addEventListener('keydown', handleKeyDown);

    // Elimina el manejador de eventos al desmontar el componente
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // ANIMATIONS
  const [animationKey, setAnimationKey] = useState(0);
  const [animationClass, setAnimationClass] = useState('fadeIn1'); // Inicializa con la animación inicial

  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [isAnimationDone, setIsAnimationDone] = useState(false);


  const changeContentLoaded = () => {
    setIsContentLoaded(true);
  };
  const changeAnimationDone = () => {
    setIsAnimationDone(true);
  };

  useEffect(() => { //RESET ANIMATION (when all loaded and intro finished)
    if (isContentLoaded && isAnimationDone) {
      setAnimationClass('fadeOutIn');
      setAnimationKey(prevKey => prevKey + 1); // Incrementa la clave para reiniciar la animación
    }
  }, [isContentLoaded, isAnimationDone]);

  const onMouseClick = (event) => {  // Comprobar pulsar link
    if (isAnimationDone && !(window.screen.orientation.type == "portrait-primary" || window.screen.orientation.type == "portrait-secondary")) {
      // Calcula la posición del mouse en coordenadas normalizadas (-1 a +1) para ambos ejes
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Actualiza el rayo con la posición del mouse y la cámara
      raycaster.setFromCamera(mouse, cameraRef.current);

      let intersects = raycaster.intersectObject(githubRef.current);
      if (intersects.length > 0) {
        window.open('https://github.com/JuanLorenteGuarnieri', '_blank');
        changeTypeForm(0);
        return;
      }

      intersects = raycaster.intersectObject(linkedinRef.current);
      if (intersects.length > 0) {
        window.open('https://www.linkedin.com/in/juanlorenteguarnieri/en/', '_blank');
        changeTypeForm(0);
        return;
      }

      intersects = raycaster.intersectObject(cvRef.current);
      if (intersects.length > 0) {
        window.open('https://juanlorenteguarnieri.github.io/portfolio/CV.pdf', '_blank');
        changeTypeForm(0);
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
        changeTypeForm(0);
        sendEmail();
        return;
      }

      intersects = raycaster.intersectObject(iphoneRef.current);
      if (intersects.length > 0) {
        window.open('https://linktr.ee/JuanLorente', '_blank');
        changeTypeForm(0);
        return;
      }

      intersects = raycaster.intersectObject(unizarRef.current);
      if (intersects.length > 0) {
        window.open('https://estudios.unizar.es/estudio/asignaturas?anyo_academico=2024&estudio_id=20240148&centro_id=110&plan_id_nk=439&sort=curso', '_blank');
        changeTypeForm(0);
        return;
      }

      intersects = raycaster.intersectObject(rayTracerGitRef.current);
      if (intersects.length > 0) {
        window.open('https://github.com/JuanLorenteGuarnieri/RayTracer', '_blank');
        changeTypeForm(0);
        return;
      }

      intersects = raycaster.intersectObject(rayTracerDocRef.current);
      if (intersects.length > 0) {
        window.open('https://github.com/JuanLorenteGuarnieri/RayTracer/blob/main/RayTracer.pdf', '_blank');
        changeTypeForm(0);
        return;
      }

      intersects = raycaster.intersectObject(chessRef.current);
      if (intersects.length > 0) {
        window.open('https://www.chess.com/member/qassiel', '_blank');
        changeTypeForm(0);
        return;
      }

      intersects = raycaster.intersectObject(pianoRef.current);
      if (intersects.length > 0) {
        window.open('https://recursivearts.com/es/virtual-piano/', '_blank');
        changeTypeForm(0);
        return;
      }

      intersects = raycaster.intersectObject(rubikRef.current);
      if (intersects.length > 0) {
        window.open('https://rubikscu.be/', '_blank');
        changeTypeForm(0);
        return;
      }

      intersects = raycaster.intersectObject(psychologyRef.current);
      if (intersects.length > 0) {
        window.open('https://www.amazon.com/Laws-Human-Nature-Robert-Greene/dp/0525428143', '_blank');
        changeTypeForm(0);
        return;
      }

      intersects = raycaster.intersectObject(duolingoRef.current);
      if (intersects.length > 0) {
        window.open('https://duome.eu/Qassiel', '_blank');
        changeTypeForm(0);
        return;
      }
      changeTypeForm(0);
    } else {

      changeTypeForm(0);
    }
  }

  useEffect(() => { // DETECT CLICK
    window.addEventListener('click', onMouseClick, false);
    return () => {
      window.removeEventListener('click', onMouseClick, false);
    };
  }, [userName, userEmail, message, scroll, isAnimationDone, window]);

  const calculateIntersect = (x, y) => {
    const mouse = new THREE.Vector2();

    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = -(y / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, cameraRef.current);
    raycaster.ray.direction.normalize();

    const intersectPoint = raycaster.ray.origin.sub(raycaster.ray.direction.multiplyScalar(raycaster.ray.origin.y / raycaster.ray.direction.y));
    setTargetPos([intersectPoint.x, intersectPoint.y, intersectPoint.z]);


  };

  const handlePointerMove = (event) => { //RECHARGE LIGHT CURSOR WHEN MOVING
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

      if (x != x_old || y != y_old) {
        calculateIntersect(x, y);
        x = x_old;
        y = y_old;
      }
    }
  };

  const isMobileDevice = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };

  const [isPhoneVertical, setIsPhoneVertical] = useState(false);

  const enableShadows = !isMobileDevice();

  useEffect(() => { // detect if phone is in vertical mode
    if (isMobileDevice() && window.innerHeight / 1.3 > window.innerWidth) {
      setIsPhoneVertical(true);
    }
    else {
      setIsPhoneVertical(false);
    }
  }, [window.innerHeight, window.innerWidth, ondeviceorientation, isPhoneVertical]);

  const [key, setKey] = useState(0);

  useEffect(() => { //detect rotate screen orientation
    const handleOrientationChange = () => {
      if (window.screen.orientation.type == "portrait-primary" || window.screen.orientation.type == "portrait-secondary") {
        setIsPhoneVertical(true);
      }
      else {
        setIsPhoneVertical(false);
      }
      setAnimationClass('fadeOutIn');
      setAnimationKey(prevKey => prevKey + 1); // Incrementa la clave para reiniciar la animación

    };

    if (window.screen.orientation) {
      window.addEventListener('orientationchange', handleOrientationChange);
    }

    return () => {
      if (window.screen.orientation) {
        window.removeEventListener('orientationchange', handleOrientationChange);
      }
    };
  }, [isPhoneVertical]);

  useEffect(() => { //focus/blur inputs
    if (typeForm === 0) {
      hiddenInputRef1.current && hiddenInputRef1.current.blur();
      hiddenInputRef2.current && hiddenInputRef2.current.blur();
      hiddenInputRef3.current && hiddenInputRef3.current.blur();
    } else {
      switch (typeForm) {
        case 1:
          hiddenInputRef1.current && hiddenInputRef1.current.focus();
          break;
        case 2:
          hiddenInputRef2.current && hiddenInputRef2.current.focus();
          break;
        case 3:
          hiddenInputRef3.current && hiddenInputRef3.current.focus();
          break;
        // Añadir más casos si es necesario
      }
    }
  }, [typeForm]);



  return (
    <>
      <section className="w-full h-screen">
        <Canvas dpr={dpr} shadows={enableShadows} className={animationClass}
          gl={{
            antialias: true,  // mayor calidad
            stencil: false,
            alpha: false,
            depth: true,
            logarithmicDepthBuffer: false,
            preserveDrawingBuffer: false,
            premultipliedAlpha: false,
            precision: 'lowp',
            powerPreference: 'high-performance',
            failIfMajorPerformanceCaveat: false,
            physicallyCorrectLights: false
          }}
          key={animationKey}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 1 }}
          onPointerMove={handlePointerMove} onTouchMove={handlePointerMove}
          camera={({ isPerspectiveCamera: true, near: 0.1, far: 9, setFocalLength: 555, zoom: (window.innerWidth / window.innerHeight) / 1.6 })}>
          {isContentLoaded && isAnimationDone ?
            (!(window.screen.orientation.type == "portrait-primary" || window.screen.orientation.type == "portrait-secondary" || window.innerHeight > window.innerWidth) ? (
              <Suspense fallback={null} >
                <mesh className="CONFIG">
                  <PerformanceMonitor factor={0.6} ms={200} iterations={3} threshold={0.6} bounds={{ lower: 10, upper: 18 }}
                    onDecline={() => {
                      // Reducir la resolución (DPR) hasta un mínimo de 0.5
                      setDpr(prev => Math.max(0.3, prev - 0.1));
                    }}
                    // Se ejecuta cuando el rendimiento mejora por encima de `factor`
                    onIncline={() => {
                      // Restaurar la resolución completa
                      setDpr(prev => Math.min(0.8, prev + 0.1));
                    }}

                  // onChange={({ factor }) => setDpr(Math.max(0.8, Math.min(factor / 2, 1)), 1)} 
                  />
                  <CameraController scrollValue={scrollValue} cameraRef={cameraRef} maxY={maxY} />
                  <ambientLight intensity={0.5} />
                </mesh>

                {/* <mesh className="GRID" position={[0, 0.1, 0]}>
                  <Grid args={[20, 100, 20, 100]} />
                </mesh> */}

                <mesh className="POINTER">
                  <pointLight ref={lightRef} distance={2} castShadow={true} intensity={25} position={[targetPos[0], 0.4, targetPos[2]]}
                    shadow-bias={-0.01}
                    shadow-camera-near={0.01}
                    onUpdate={light => {
                      // Map mouseSpeed (0 = slow, 1+ = fast) to mapSize between 512 and 8
                      // Clamp mouseSpeed to [0, 1] for mapping
                      const minSize = 1;
                      const maxSize = 512;
                      // const speed = Math.min(Math.max(mouseSpeed, 0), 1);
                      // Inverse: faster = smaller mapSize
                      const mapSize = Math.round(maxSize - (maxSize - minSize) * mouseSpeed);
                      light.shadow.mapSize.width = mapSize;
                      light.shadow.mapSize.height = mapSize;
                      light.shadow.needsUpdate = true;
                    }}
                    color={new THREE.Color(0x223060)} />
                  {/* <pointLight ref={lightRef2} castShadow={true} intensity={25} position={[targetPos[0], 0.7, targetPos[2]]}
              color={new THREE.Color(0x223060)} /> */}
                </mesh>

                <mesh className="TITLE" position={[0, 0, 22]}>

                  <mesh className="LOGO" position={[0, 0, 0.5]}>
                    <pointLight intensity={200} position={[0, 1, 0.5]} distance={isVisibleLight(new THREE.Vector3(0, 5, 22.5), 8) ? 7 : 0.01} shadow-bias={-0.005}
                      color={new THREE.Color(0x223060)} />
                    {/* visible={isVisibleLight(new THREE.Vector3(0, 5, 22.5), 8)} /> */}
                    <pointLight intensity={200} position={[0, 1, 0]} distance={isVisibleLight(new THREE.Vector3(0, 5, 22.5), 8) ? 7 : 0.01} shadow-bias={-0.005}
                      color={new THREE.Color(0x223060)} />
                    {/* visible={isVisibleLight(new THREE.Vector3(0, 5, 22.5), 8)} /> */}
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
                    font={fontTitle} size={0.73} height={0.1} align='center'
                    colorPri={new THREE.Color(0xdddddd)} colorSec={new THREE.Color(0x333333)}
                  />
                  <TextAdvance position={[0, 0, 2.8]}
                    text={"Computer Vision & Graphics developer"}
                    font={fontText} size={0.16} height={0.03} align='center'
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

                <mesh className="ABOUT" position={[0, 0, 28]}>
                  <TextAdvance position={[0, 0, 0]}
                    text={"ABOUT"}
                    font={fontTitle} size={0.3} height={0.1}
                    colorPri={new THREE.Color(0xdddddd)} colorSec={new THREE.Color(0x333333)}
                  />
                  <Bvh firstHitOnly >
                    <Juan scale={0.6} position={[-3.2, 0.8, 1.8]} rotation={[-Math.PI / 6 + 0.2, Math.PI / 2 + 0.8, -0.08]} />
                  </Bvh>
                  <pointLight intensity={200} position={[0, 2, 1.5]} distance={isVisibleLight(new THREE.Vector3(0, 5, 29.5), 8) ? 8 : 0.01}
                    color={new THREE.Color(0x223060)} />
                  {/* visible={isVisibleLight(new THREE.Vector3(0, 5, 29.5), 8)} /> */}
                  <pointLight intensity={100} position={[-3.5, 3, 1.3]} distance={isVisibleLight(new THREE.Vector3(0, 5, 29.3), 8) ? 8 : 0.01}
                    color={new THREE.Color(0x223060)} />
                  {/* visible={isVisibleLight(new THREE.Vector3(0, 5, 29.3), 8)} /> */}
                  <TextAdvance position={[0.75, 0, 0.8]}
                    text={"I'm a 21-year-old programmer from Spain, \npassionate about computer graphics and \nvideogame development. \n\nI'm in my final year of Computer \nEngineering and always on the lookout for \nprojects that challenge my creativity and \ntechnical skills."}
                    font={fontText} size={0.16} height={0.05}
                    colorPri={"white"} colorSec={new THREE.Color(0x223060)}
                  />
                </mesh>

                <mesh className="EDUCATION" position={[0, 0, 32.8]}>
                  <TextAdvance position={[0, 0, 0]}
                    text={"EDUCATION"}
                    font={fontTitle} size={0.3} height={0.1}
                    colorPri={new THREE.Color(0xdddddd)} colorSec={new THREE.Color(0x333333)}
                  />
                  <pointLight intensity={150} position={[0.5, 2, 1]} distance={isVisibleLight(new THREE.Vector3(0, 5, 33.87), 7) ? 5 : 0.01}
                    color={new THREE.Color(0x223060)} />
                  {/* visible={isVisibleLight(new THREE.Vector3(0, 5, 33.8), 7)} /> */}
                  <pointLight intensity={20} position={[-1.85, 1, 1.07]} distance={isVisibleLight(new THREE.Vector3(0, 5, 33.87), 7) ? 2.5 : 0.01}
                    color={new THREE.Color(0x223060)} />
                  {/* visible={isVisibleLight(new THREE.Vector3(0, 5, 33.87), 7)} /> */}
                  <Bvh firstHitOnly >
                    <Unizar ref={unizarRef} scale={20} position={[-1.85, -0.09, 1.07]} rotation={[0, 0, 0]} />
                  </Bvh>
                  <TextAdvance position={[-0.8, 0, 0.7]} align="left"
                    text={"Computer Science \nUniversity of Zaragoza"}
                    font={fontText} size={0.16} height={0.05}
                    colorPri={"white"} colorSec={new THREE.Color(0x223060)}
                  />
                  <TextAdvance position={[-0.8, 0, 1.4]} align="left"
                    text={"2020 - 2024"}
                    font={fontText} size={0.16} height={0.05}
                    colorPri={new THREE.Color(0xaaaaaa)} colorSec={new THREE.Color(0x223060)}
                  />
                </mesh>

                <mesh className="PROJECTS" position={[0, 0, 35.9]}>
                  <TextAdvance position={[0, 0, 0]}
                    text={"PROJECTS"}
                    font={fontTitle} size={0.3} height={0.1}
                    colorPri={new THREE.Color(0xdddddd)} colorSec={new THREE.Color(0x333333)}
                  />
                  <pointLight intensity={100} position={[0, 2, 2.8]} distance={isVisibleLight(new THREE.Vector3(0, 5, 38.7), 8) ? 10 : 0.01}
                    color={new THREE.Color(0x223060)} />
                  {/* visible={isVisibleLight(new THREE.Vector3(0, 5, 38.7), 8)} /> */}
                  <mesh className="RAY TRACER" position={[0, 0, 0]}>

                    <mesh className="MODEL" position={[-3, 0.4, 2]} rotation={[-Math.PI / 6, Math.PI / 4, 0]}>
                      <pointLight castShadow={true} distance={isVisibleLight(new THREE.Vector3(0, 5, 37.9), 8) ? 1.5 : 0.01} intensity={2} position={[0.1, 0.5, 0.3]} power={55} shadow-camera-near={0.05}
                        shadow-bias={-0.005}
                        onUpdate={light => {
                          light.shadow.mapSize.width = 128
                          light.shadow.mapSize.height = 128
                          light.shadow.needsUpdate = true
                        }}
                        color={new THREE.Color(0x223060)} />
                      {/* visible={isVisibleLight(new THREE.Vector3(0, 5, 37.9), 8)} /> */}
                      <Bvh firstHitOnly >
                        <Plane args={[1, 1, 1, 1]} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow={true}
                          receiveShadow>
                          <meshPhysicalMaterial color={new THREE.Color(0xffffff)} side={THREE.DoubleSide} castShadow={true}
                          />
                        </Plane>
                        <Plane args={[1, 1, 1, 1]} position={[0, 1, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow={true}
                          receiveShadow>
                          <meshPhysicalMaterial color={new THREE.Color(0xffffff)} side={THREE.DoubleSide} castShadow={true} />
                        </Plane>
                        <Plane args={[1, 1, 1, 1]} position={[0, 0.5, -0.5]} rotation={[0, 0, 0]} castShadow={true}
                          receiveShadow>
                          <meshPhysicalMaterial color={new THREE.Color(0xffffff)} side={THREE.DoubleSide} castShadow={true}
                          />
                        </Plane>
                        <Plane args={[1, 1, 1, 1]} position={[-0.5, 0.5, 0]} rotation={[0, Math.PI / 2, 0]} castShadow={true}
                          receiveShadow>
                          <meshPhysicalMaterial color={new THREE.Color(0xff0000)} side={THREE.DoubleSide} castShadow={true}
                          />
                        </Plane>
                        <Plane args={[1, 1, 1, 1]} position={[0.5, 0.5, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow={true}
                          receiveShadow>
                          <meshPhysicalMaterial color={new THREE.Color(0x00ff00)} side={THREE.DoubleSide} castShadow={true}
                          />
                        </Plane>
                        <Sphere args={[0.15]} position={[0.2, 0.15, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow={true}
                          receiveShadow >
                          <meshPhysicalMaterial
                            color={new THREE.Color(0x444444)}
                            roughness={0}
                            metalness={0.1} side={THREE.DoubleSide}
                          />
                        </Sphere>
                        <Sphere args={[0.15]} position={[-0.2, 0.15, -0.2]} rotation={[0, -Math.PI / 2, 0]} castShadow={true}
                          receiveShadow >
                          <meshPhysicalMaterial
                            color={new THREE.Color(0x9db4ec)} side={THREE.DoubleSide}
                          />
                        </Sphere>
                      </Bvh>
                    </mesh>

                    <TextAdvance position={[0, 0, 0.9]}
                      text={"RAY TRACER"}
                      font={fontText} size={0.2} height={0.08}
                      colorPri={"white"} colorSec={new THREE.Color(0x223060)}
                    />
                    <TextAdvance position={[0, 0, 0.9]}
                      text={"__________"}
                      font={fontText} size={0.2} height={0.08}
                      colorPri={"white"} colorSec={new THREE.Color(0x223060)}
                    />
                    <TextAdvance position={[0, 0, 0.9]}
                      text={"_________"}
                      font={fontText} size={0.2} height={0.08}
                      colorPri={"white"} colorSec={new THREE.Color(0x223060)}
                    />

                    <TextAdvance position={[0, 0, 1.5]}
                      text={"Path tracer & Photon Mapping \nraytracer from scratch"}
                      font={fontText} size={0.16} height={0.05}
                      colorPri={"white"} colorSec={new THREE.Color(0x223060)}
                    />

                    <C scale={20} position={[3, -0.08, 1.6]} rotation={[0, 0, 0]} />
                    <pointLight intensity={15} position={[3, 1, 1.6]} distance={isVisibleLight(new THREE.Vector3(0, 5, 37.5), 6) ? 2 : 0.01}
                      color={new THREE.Color(0x223060)} />
                    {/* visible={isVisibleLight(new THREE.Vector3(0, 5, 37.5), 6)} /> */}

                    <mesh className="LINKS" position={[0, 0, 2.3]}>
                      <Bvh firstHitOnly >
                        <Doc ref={rayTracerDocRef} scale={12} position={[0.7, -0.08, 0]} rotation={[0, 0, 0]} />
                        <Github ref={rayTracerGitRef} scale={12} position={[0, -0.08, 0]} rotation={[0, 0, 0]} />
                      </Bvh>
                    </mesh>


                  </mesh>
                  <mesh className="VIDEOGAME" position={[0, 0, 2.7]}>

                    <mesh className="MODEL" >
                      <pointLight intensity={30} position={[-3.3, 1, 1.4]} distance={isVisibleLight(new THREE.Vector3(0, 5, 40), 7) ? 4 : 0.01}
                        color={new THREE.Color(0x223060)} />
                      {/* visible={isVisibleLight(new THREE.Vector3(0, 5, 40), 7)} /> */}
                      <Bvh firstHitOnly >
                        <Float
                          speed={4} // Animation speed, defaults to 1
                          rotationIntensity={0.3} // XYZ rotation intensity, defaults to 1
                          floatIntensity={0.01} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
                          floatingRange={[-0.2, 0.1]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
                        >
                          <RusticSpaceShip position={[-3.5, 0.45, 1.8]} />
                        </Float>
                      </Bvh>
                    </mesh>

                    <TextAdvance position={[0, 0, 0.9]}
                      text={"SPACESHIP CONTROLLER"}
                      font={fontText} size={0.2} height={0.08}
                      colorPri={"white"} colorSec={new THREE.Color(0x223060)}
                    />
                    <TextAdvance position={[0, 0, 0.9]}
                      text={"____________________"}
                      font={fontText} size={0.2} height={0.08}
                      colorPri={"white"} colorSec={new THREE.Color(0x223060)}
                    />
                    <TextAdvance position={[0, 0, 0.9]}
                      text={"___________________"}
                      font={fontText} size={0.2} height={0.08}
                      colorPri={"white"} colorSec={new THREE.Color(0x223060)}
                    />

                    <TextAdvance position={[0, 0, 1.5]}
                      text={"A mini-game where you control \na spaceship (WORK IN PROGRESS)"}
                      font={fontText} size={0.16} height={0.05}
                      colorPri={"white"} colorSec={new THREE.Color(0x223060)}
                    />

                    <Threejs scale={20} position={[3, -0.08, 1.58]} rotation={[0, 0, 0]} />
                    <pointLight intensity={15} position={[3, 1, 1.58]} distance={isVisibleLight(new THREE.Vector3(0, 5, 40.18), 6) ? 2 : 0.01}
                      color={new THREE.Color(0x223060)} />
                    {/* visible={isVisibleLight(new THREE.Vector3(0, 5, 40.18), 6)} /> */}

                    <Reacts scale={20} position={[4, -0.08, 1.58]} rotation={[0, 0, 0]} />
                    <pointLight intensity={15} position={[4, 1, 1.58]} distance={isVisibleLight(new THREE.Vector3(0, 5, 40.18), 6) ? 2 : 0.01}
                      color={new THREE.Color(0x223060)} />
                    {/* visible={isVisibleLight(new THREE.Vector3(0, 5, 40.18), 6)} /> */}

                    {/* <mesh className="LINKS" position={[0, 0, 2.3]}>
                      <Bvh firstHitOnly >
                        <Doc ref={null} scale={12} position={[0.7, -0.08, 0]} rotation={[0, 0, 0]} />
                        <Github ref={null} scale={12} position={[0, -0.08, 0]} rotation={[0, 0, 0]} />
                        <Play ref={null} scale={12} position={[-0.7, -0.08, 0]} rotation={[0, 0, 0]} />
                      </Bvh>
                    </mesh> */}
                  </mesh>

                </mesh>

                <mesh className="SKILLS & TOOLS" position={[0, 0, 42.9]}>
                  <TextAdvance position={[0, 0, 0]}
                    text={"SKILLS & TOOLS"}
                    font={fontTitle} size={0.3} height={0.1}
                    colorPri={new THREE.Color(0xdddddd)} colorSec={new THREE.Color(0x333333)}
                  />
                  <Bvh firstHitOnly >
                    <C scale={20} position={[-3.5, -0.08, 1.1]} rotation={[0, 0, 0]} />
                    <rectAreaLight intensity={15} position={[0, 1, 1.1]} rotation={[-Math.PI / 2, 0, 0]}
                      distance={isVisibleLight(new THREE.Vector3(0, 5, 44), 6) ? 10 : 0.01}
                      width={8} height={1} color={new THREE.Color(0x223060)} />
                    <Blender scale={20} position={[-2.5, -0.08, 1.1]} rotation={[0, 0, 0]} />
                    <Unreal scale={20} position={[-1.5, -0.08, 1.1]} rotation={[0, 0, 0]} />
                    <Vscode scale={20} position={[-0.5, -0.08, 1.1]} rotation={[0, 0, 0]} />
                    <Git scale={20} position={[0.5, -0.08, 1.1]} rotation={[0, 0, 0]} />
                    <Threejs scale={20} position={[1.5, -0.08, 1.1]} rotation={[0, 0, 0]} />
                    <Reacts scale={20} position={[2.5, -0.08, 1.1]} rotation={[0, 0, 0]} />
                    <Tailwind scale={20} position={[3.5, -0.08, 1.1]} rotation={[0, 0, 0]} />
                  </Bvh>
                </mesh>

                <mesh className="CONTACT ME" position={[0, 0, 45.9]}>

                  <rectAreaLight intensity={15} position={[0, 2, 3]} rotation={[-Math.PI / 2, 0, 0]}
                    distance={isVisibleLight(new THREE.Vector3(0, 5, 48.9), 10) ? 15 : 0.01}
                    width={8} height={5} color={new THREE.Color(0x223060)} />
                  {/* <pointLight intensity={400} position={[-2.5, 4, 3.5]} distance={isVisibleLight(new THREE.Vector3(0, 5, 49.4), 6) ? 8 : 0.01}
                    color={new THREE.Color(0x223060)} /> */}
                  {/* visible={isVisibleLight(new THREE.Vector3(0, 5, 49.4), 6)} /> */}
                  <TextAdvance position={[0, 0, 0]}
                    text={"CONTACT ME"}
                    font={fontTitle} size={0.3} height={0.1}
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
                      colorPri={new THREE.Color(0x424050)} isEditable={"true"}
                    />
                    <Box2 ref={form3Ref} position={[-2, -0.14, 1.2]} scale={[20, 20, 16]} />

                  </mesh>
                  <TextAdvance position={[-3.5, -0.03, 5.3]} align="left"
                    text={feedback}
                    font={fontText} size={0.16} height={0.05}
                    colorPri={new THREE.Color(colorFeedback)} colorSec={new THREE.Color(0x223060)}
                  />
                  <mesh className="Iphone" position={[0, 0, 0]}>
                    {/* <pointLight intensity={300} position={[2, 4, 3.5]} distance={isVisibleLight(new THREE.Vector3(0, 5, 49.4), 6) ? 8 : 0.01}
                      color={new THREE.Color(0x223060)} /> */}
                    {/* visible={isVisibleLight(new THREE.Vector3(0, 5, 49.4), 6)} /> */}
                    {/* <pointLight intensity={110} position={[2, 2, 3.5]} distance={isVisibleLight(new THREE.Vector3(0, 5, 49.4), 6) ? 8 : 0.01}
                      color={new THREE.Color(0x223060)} /> */}
                    {/* visible={isVisibleLight(new THREE.Vector3(0, 5, 49.4), 6)} /> */}

                    {/* <pointLight intensity={15} position={[-3.5, 1, 1.1]} distance={isVisibleLight(new THREE.Vector3(0, 5, 48.3), 6) ? 8 : 0.01}
                      color={new THREE.Color(0x223060)} /> */}
                    {/* visible={isVisibleLight(new THREE.Vector3(0, 5, 48.3), 6)} /> */}
                    <Bvh firstHitOnly >
                      <Send ref={sendFormRef} scale={20} position={[0.5, -0.08, 4.6]} rotation={[0, 0, 0]} />
                      <Iphone ref={iphoneRef} position={[2, 0.68, 3]} rotation={[0, 0, scrollValue * Math.PI / 1200 + 4.1]} scale={1.5} />

                    </Bvh>
                  </mesh>
                </mesh>

                <mesh className="INTEREST" position={[0, 0, 60.9]}>
                  <TextAdvance position={[0, 0, 0]}
                    text={"INTERESTS"}
                    font={fontTitle} size={0.3} height={0.1}
                    colorPri={new THREE.Color(0xdddddd)} colorSec={new THREE.Color(0x333333)}
                  />
                  <mesh className="LIGHTS">
                    {/* <pointLight intensity={100} position={[2.5, 2, 2.5]} distance={isVisibleLight(new THREE.Vector3(0, 5, 63.4), 10) ? 12 : 0.01}
                      color={new THREE.Color(0x223060)} />
                    <pointLight intensity={100} position={[2.5, 2, 4.8]} distance={isVisibleLight(new THREE.Vector3(0, 5, 65.7), 10) ? 12 : 0.01}
                      color={new THREE.Color(0x223060)} />
                    <pointLight intensity={100} position={[-2.5, 2, 2.5]} distance={isVisibleLight(new THREE.Vector3(0, 5, 63.4), 10) ? 12 : 0.01}
                      color={new THREE.Color(0x223060)} />
                    <pointLight intensity={100} position={[-2.5, 2, 4.8]} distance={isVisibleLight(new THREE.Vector3(0, 5, 65.7), 10) ? 12 : 0.01}
                      color={new THREE.Color(0x223060)} />
                    <pointLight intensity={100} position={[-2.5, 2, 6.8]} distance={isVisibleLight(new THREE.Vector3(0, 5, 65.7), 10) ? 12 : 0.01}
                      color={new THREE.Color(0x223060)} /> */}

                    <rectAreaLight intensity={15} position={[0, 2, 4.6]} rotation={[-Math.PI / 2, 0, 0]}
                      distance={isVisibleLight(new THREE.Vector3(0, 5, 65), 10) ? 15 : 0.01}
                      width={8} height={7} color={new THREE.Color(0x223060)} />
                  </mesh>
                  <mesh className="MODELS">
                    <Bvh firstHitOnly >
                      <Piano ref={pianoRef} position={[4.8, -0.19, 2.1]} rotation={[0, -Math.PI / 3, 0]} />
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

                      <Duolingo ref={duolingoRef} position={[-4.2, 0, 7]} rotation={[0, 0, 0]} />
                    </Bvh>
                  </mesh>

                  <mesh className="TEXT">
                    <TextAdvance position={[2.5, 0, 2.5]}
                      text={"PIANO"}
                      font={fontText} size={0.17} height={0.08}
                      colorPri={"white"} colorSec={new THREE.Color(0x223060)}
                    />
                    <TextAdvance position={[2.5, 0, 2.8]}
                      text={pianoExp + " years EXP"}
                      font={fontText} size={0.16} height={0.08}
                      colorPri={"white"} colorSec={new THREE.Color(0x223060)}
                    />
                    <TextAdvance position={[-2.5, 0, 2.66]}
                      text={"RUBIK's solver"}
                      font={fontText} size={0.16} height={0.08}
                      colorPri={"white"} colorSec={new THREE.Color(0x223060)}
                    />

                    <TextAdvance position={[-2.5, 0, 5]}
                      text={"CHESS +" + chessCount + " games"}
                      font={fontText} size={0.16} height={0.08}
                      colorPri={"white"} colorSec={new THREE.Color(0x223060)}
                    />

                    <TextAdvance position={[2.5, 0, 5]}
                      text={"PSYCHOLOGY reader"}
                      font={fontText} size={0.16} height={0.08}
                      colorPri={"white"} colorSec={new THREE.Color(0x223060)}
                    />

                    <TextAdvance position={[-2.4, 0, 6.95]}
                      text={"DUOLINGO"} align='center'
                      font={fontText} size={0.16} height={0.08}
                      colorPri={"white"} colorSec={new THREE.Color(0x223060)}
                    />

                    <TextAdvance position={[-2.4, 0, 7.25]}
                      text={duoStreak + " days streak"} align='center'
                      font={fontText} size={0.16} height={0.08}
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

              </Suspense>
            ) : (
              <Html center key={key}> {/* ROTATE SCREEN */}
                <div className="">
                  <div className="text-center">
                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900.000000 900.000000"
                      fill="white" className='h-55 animate-rotate logo2' >
                      <g transform="translate(-100,900) scale(0.12,-0.12)"
                        stroke="none">
                        <path d="M3514 7251 c-28 -16 -64 -46 -80 -66 -16 -20 -34 -42 -39 -48 -15
                          -17 -75 -116 -75 -123 0 -3 -6 -20 -14 -37 -8 -18 -31 -81 -51 -142 -20 -60
                          -40 -119 -45 -130 -5 -11 -21 -49 -36 -85 -28 -69 -77 -172 -97 -205 -69 -113
                          -221 -276 -309 -331 -51 -32 -190 -104 -233 -120 -101 -37 -237 -80 -285 -89
                          -19 -4 -55 -13 -80 -20 -25 -7 -72 -21 -105 -30 -135 -37 -172 -48 -215 -63
                          -25 -8 -49 -19 -55 -22 -5 -4 -21 -11 -34 -15 -34 -10 -161 -89 -194 -120 -35
                          -34 -68 -87 -91 -148 -21 -55 -18 -124 9 -242 15 -68 22 -108 45 -265 30 -194
                          23 -519 -15 -805 -33 -241 -37 -295 -32 -410 5 -114 19 -184 53 -262 8 -17 14
                          -34 14 -38 0 -39 259 -322 385 -421 28 -21 52 -42 55 -45 29 -34 179 -122 350
                          -205 63 -30 123 -60 132 -65 10 -5 23 -9 30 -9 7 0 26 -7 42 -15 42 -22 60
                          -13 52 28 -18 86 -18 111 0 145 30 56 78 72 215 72 65 0 120 -4 123 -9 4 -5
                          25 -12 49 -16 23 -4 47 -10 52 -14 6 -4 37 -18 70 -31 33 -13 78 -35 100 -49
                          22 -14 55 -34 74 -44 19 -10 41 -25 48 -33 8 -8 18 -14 23 -14 4 0 41 -33 82
                          -72 73 -73 148 -174 148 -200 0 -8 7 -23 15 -34 9 -12 14 -43 15 -86 l0 -67
                          -57 -12 c-32 -6 -92 -12 -133 -13 -68 -1 -75 -3 -78 -22 -6 -43 113 -126 283
                          -199 17 -7 41 -18 55 -24 14 -6 54 -20 90 -31 36 -11 79 -25 96 -30 63 -20
                          247 -56 359 -71 44 -5 122 -17 173 -25 81 -13 103 -13 185 0 50 8 128 20 172
                          25 202 26 408 77 555 138 19 8 44 18 55 23 153 63 279 153 273 194 -3 19 -10
                          21 -78 22 -41 1 -101 7 -132 13 l-58 12 0 67 c1 43 6 74 15 86 8 11 15 26 15
                          34 0 22 70 121 130 182 50 52 179 150 196 150 4 0 15 6 23 14 24 21 132 76
                          148 76 8 0 27 6 41 14 67 33 132 46 239 46 128 0 178 -17 207 -72 18 -34 18
                          -59 0 -145 -8 -41 10 -50 52 -28 16 8 35 15 42 15 7 0 20 4 30 9 9 5 69 35
                          132 65 257 125 354 193 564 396 222 215 283 335 293 575 5 117 1 166 -31 405
                          -28 207 -35 303 -35 460 0 239 25 460 75 662 8 32 14 79 14 105 0 77 -47 181
                          -107 238 -33 31 -160 110 -194 120 -13 4 -28 11 -34 15 -20 14 -106 42 -235
                          76 -30 8 -80 22 -110 30 -58 16 -134 35 -210 54 -25 5 -54 14 -65 19 -11 5
                          -47 19 -80 31 -88 33 -227 103 -282 142 -121 84 -264 248 -327 375 -48 96 -86
                          179 -86 187 0 5 -6 22 -14 39 -8 18 -31 82 -51 142 -20 61 -43 124 -51 142 -8
                          17 -14 34 -14 37 0 7 -60 106 -75 123 -5 6 -23 28 -39 48 -39 49 -121 95 -168
                          95 -108 0 -276 -121 -375 -268 -44 -67 -163 -298 -163 -318 0 -8 -4 -22 -9
                          -32 -15 -27 -51 -153 -51 -178 0 -12 -5 -35 -10 -50 -6 -15 -15 -63 -20 -108
                          -5 -45 -14 -103 -19 -131 -16 -84 -13 -422 4 -488 8 -32 15 -75 15 -95 1 -20
                          7 -48 15 -62 8 -14 15 -38 15 -55 0 -16 7 -41 15 -55 8 -14 14 -37 15 -51 0
                          -15 7 -32 15 -39 8 -7 15 -21 15 -32 0 -11 6 -32 13 -46 8 -15 21 -42 30 -60
                          9 -19 17 -39 17 -47 0 -7 7 -18 15 -25 8 -7 15 -23 15 -35 0 -12 7 -28 15 -35
                          8 -7 15 -21 15 -31 0 -11 4 -19 9 -19 5 0 14 -12 20 -27 6 -16 15 -35 20 -43
                          5 -8 12 -22 15 -30 4 -8 15 -28 26 -45 11 -16 24 -39 30 -50 6 -11 19 -33 30
                          -50 11 -16 23 -37 27 -45 12 -26 177 -242 229 -300 107 -118 223 -227 327
                          -304 l77 -58 0 -73 c0 -52 -4 -76 -15 -85 -8 -7 -15 -19 -15 -27 0 -8 -13 -34
                          -28 -57 -15 -22 -31 -48 -35 -56 -4 -8 -16 -28 -27 -45 -11 -16 -23 -38 -26
                          -47 -4 -10 -10 -18 -15 -18 -5 0 -14 -10 -19 -22 -11 -25 -30 -56 -45 -74 -5
                          -6 -17 -22 -25 -34 -8 -13 -23 -32 -32 -42 -10 -10 -18 -20 -18 -23 0 -18
                          -327 -345 -346 -345 -2 0 -10 -5 -17 -10 -29 -24 -143 -107 -157 -113 -8 -4
                          -28 -16 -45 -27 -16 -11 -37 -22 -45 -26 -8 -3 -22 -9 -30 -14 -44 -26 -158
                          -80 -170 -80 -7 0 -22 -7 -32 -16 -25 -24 -237 -23 -273 0 -13 9 -30 16 -37
                          16 -10 0 -127 55 -168 80 -8 5 -22 11 -30 14 -8 4 -28 15 -45 26 -16 11 -37
                          23 -45 27 -14 6 -128 89 -157 113 -7 5 -15 10 -17 10 -23 0 -346 328 -346 350
                          0 6 -4 10 -9 10 -5 0 -21 20 -35 45 -15 25 -31 45 -35 45 -5 0 -12 8 -15 18
                          -12 32 -37 72 -45 72 -5 0 -12 8 -15 18 -7 18 -12 27 -59 99 -15 24 -27 47
                          -27 52 0 5 -7 14 -15 21 -8 7 -15 19 -15 28 0 8 -6 23 -14 31 -12 13 -21 92
                          -17 147 1 6 43 43 94 81 132 100 308 280 429 440 58 76 108 145 111 153 4 8
                          16 29 27 45 11 17 24 39 30 50 6 11 19 34 29 50 31 49 121 229 121 241 0 6 7
                          17 15 24 8 7 15 20 15 30 0 10 7 23 15 30 8 7 15 22 15 34 0 11 7 30 15 40 8
                          11 15 28 15 37 0 10 6 30 14 46 20 41 37 93 45 138 4 22 13 50 19 62 7 12 12
                          38 12 57 0 19 7 61 15 93 17 66 20 404 4 488 -5 28 -14 87 -19 133 -5 46 -14
                          91 -19 100 -4 9 -11 41 -14 71 -4 29 -10 58 -16 65 -5 6 -12 30 -16 53 -4 24
                          -11 45 -16 49 -5 3 -9 12 -9 20 0 14 -29 87 -49 124 -4 8 -25 47 -46 85 -104
                          195 -221 313 -363 368 -62 25 -109 21 -168 -12z"/>
                        <path d="M4452 4628 c-14 -28 -35 -61 -42 -68 -3 -3 -30 -36 -60 -75 -30 -38
                          -61 -76 -68 -84 -7 -7 -41 -50 -74 -95 -34 -44 -68 -87 -75 -94 -18 -18 -16
                          -57 2 -72 8 -7 15 -18 15 -25 0 -7 7 -18 15 -25 8 -7 15 -21 15 -32 0 -10 7
                          -21 15 -24 8 -4 15 -14 15 -24 0 -11 5 -22 11 -25 5 -4 14 -17 20 -28 9 -22
                          14 -30 59 -102 14 -22 29 -47 33 -55 4 -8 16 -28 27 -45 11 -16 25 -42 31 -57
                          6 -16 15 -28 20 -28 5 0 9 -6 9 -13 0 -23 51 -87 69 -87 20 0 71 60 71 83 0 8
                          7 17 15 21 8 3 15 12 15 20 0 8 12 32 26 53 14 21 30 47 35 58 17 34 37 67 46
                          74 4 3 18 26 31 51 13 25 32 59 42 75 11 17 22 37 26 45 3 8 10 22 15 30 5 8
                          13 25 18 37 6 11 15 24 20 28 20 12 11 60 -17 90 -15 17 -50 59 -77 95 -27 36
                          -56 72 -65 81 -9 9 -39 47 -65 83 -27 36 -52 66 -57 66 -4 0 -8 4 -8 9 0 5
                          -10 25 -22 45 -28 43 -68 49 -86 14z"/>
                      </g>
                    </svg >
                    <p>Rotate the screen</p>
                  </div>
                </div>
              </Html>
            )
            ) : (
              <Loader action={changeAnimationDone} />
            )}
        </Canvas>
        <input ref={hiddenInputRef1}
          type="text"
          className="opacity-0"
          style={{ position: "absolute", top: scrollValue, left: "0px" }}

          onChange={(e) => {
            if (!isMobileDevice()) {
              e.preventDefault();
              e.stopPropagation();
            } else {
              setUserName(e.target.value);
            }
          }}
          aria-hidden="true" // Ocultar a lectores de pantalla
        />
        <input ref={hiddenInputRef2}
          type="text"
          className="opacity-0"
          style={{ position: "absolute", top: scrollValue, left: "0px" }}

          onChange={(e) => {
            if (!isMobileDevice()) {
              e.preventDefault();
              e.stopPropagation();
            } else {
              setUserEmail(e.target.value);
            }
          }}
          aria-hidden="true" // Ocultar a lectores de pantalla
        />
        <input ref={hiddenInputRef3}
          type="text"
          className="opacity-0"
          style={{ position: "absolute", top: scrollValue, left: "0px" }}

          onChange={(e) => {
            if (!isMobileDevice()) {
              e.preventDefault();
              e.stopPropagation();
            } else {
              setMessage(e.target.value);
            }
          }}
          aria-hidden="true" // Ocultar a lectores de pantalla
        />
        <Navigation cond={isAnimationDone && !((!isMobileDevice() && window.innerHeight > window.innerWidth) || (isMobileDevice() && (window.screen.orientation.type == "portrait-primary" || window.screen.orientation.type == "portrait-secondary")))} action={changeScroll} scrollValue={scrollValue} action2={changeContentLoaded} />
      </section >
    </>
  );
};

export default Home;
