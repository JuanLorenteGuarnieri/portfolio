import React, { useRef, useState, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import emailjs from '@emailjs/browser';
import { Plane, Grid, useDetectGPU, PerformanceMonitor, Bvh, Stats } from '@react-three/drei';

import Loader from '../components/Loader';
import CameraController from '../components/CameraController';
import Navigation from '../components/Navigation';
import Title from './Title';
import About from './About';
import Education from './Education';
import Projects from './Projects';
import Skills from './Skills';
import ContactMe from './ContactMe';
import MobileCaption from '../components/MobileCaption';
import Interests from './Interests';
import Experience from './Experience';

const Home = ({ scrollValue, maxY, changeScroll }) => {
  // CONFIGURATION
  const GPUTier = useDetectGPU()
  const cameraRef = React.useRef();
  const [dpr, setDpr] = useState(0.75);
  const [targetPos, setTargetPos] = useState(0);

  const lightRef = useRef();

  // SECTIONS POSITIONS
  const titlePos = [0, 0, 22];
  const aboutPos = [0, 0, 28];
  const educationPos = [0, 0, 32.8];
  const experiencePos = [0, 0, 37.9];
  const projectsPos = [0, 0, 41.5];
  const skillsPos = [0, 0, 70];
  const contactPos = [0, 0, 73];
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
  //         FORMS
  const [typeForm, setTypeForm] = useState(0);

  const hiddenInputRef1 = useRef(), hiddenInputRef2 = useRef(), hiddenInputRef3 = useRef();
  const form1Ref = useRef(), form2Ref = useRef(), form3Ref = useRef();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');

  const [feedback, setFeedback] = useState('');
  const [colorFeedback, setcolorFeedback] = useState(0x5cae5e);

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

  const onMouseClick = (event) => {
    if (isAnimationDone && !(window.screen.orientation.type == "portrait-primary" || window.screen.orientation.type == "portrait-secondary")) {
      // Calcula la posición del mouse en coordenadas normalizadas (-1 a +1) para ambos ejes
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      changeTypeForm(0);

      // Actualiza el rayo con la posición del mouse y la cámara
      raycaster.setFromCamera(mouse, cameraRef.current);

      let intersects = raycaster.intersectObject(form1Ref.current);
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
                <PerformanceMonitor factor={0.6} ms={200} iterations={3} threshold={0.6} bounds={() => [30, 45]}
                  onDecline={() => { setDpr(prev => Math.max(0.3, prev - 0.1)); }}
                  onIncline={() => { setDpr(prev => Math.min(0.8, prev + 0.1)); }}
                />
                <CameraController scrollValue={scrollValue} cameraRef={cameraRef} maxY={maxY} />
                <ambientLight intensity={0.5} />

                {/* <mesh className="GRID" position={[0, 0.1, 0]}>
                  <Grid args={[20, 100, 20, 100]} />
                </mesh> */}
                {/* <Stats className="stats" /> */}

                {/* POINTER */}
                <pointLight ref={lightRef} distance={2} castShadow={true} intensity={25} position={[targetPos[0], 0.4, targetPos[2]]}
                  shadow-bias={-0.01}
                  shadow-camera-near={0.01}
                  onUpdate={light => {
                    const minSize = 1; // Map mouseSpeed (0 = slow, 1+ = fast) to mapSize between 512 and 1
                    const maxSize = 400;
                    const mapSize = Math.round(maxSize - (maxSize - minSize) * mouseSpeed); // Inverse: faster = smaller mapSize
                    light.shadow.mapSize.width = mapSize;
                    light.shadow.mapSize.height = mapSize;
                    light.shadow.needsUpdate = true;
                  }}
                  color={new THREE.Color(0x223060)} />

                {/* SECTIONS */}


                <Title isVisibleLight={isVisibleLight} pos={titlePos} />
                <About isVisibleLight={isVisibleLight} pos={aboutPos} />
                <Education isVisibleLight={isVisibleLight} pos={educationPos} />
                <Experience isVisibleLight={isVisibleLight} pos={experiencePos} />
                <Projects isVisibleLight={isVisibleLight} pos={projectsPos} />
                <Skills isVisibleLight={isVisibleLight} pos={skillsPos} />
                <ContactMe isVisibleLight={isVisibleLight} pos={contactPos}
                  scrollValue={scrollValue} userName={userName} userEmail={userEmail} message={message}
                  feedback={feedback} colorFeedback={colorFeedback} changeUserName={changeUserName} changeUserEmail={changeUserEmail}
                  changeMessage={changeMessage} typeForm={typeForm} changeTypeForm={changeTypeForm} form1Ref={form1Ref} form2Ref={form2Ref} form3Ref={form3Ref}
                  sendFormRef={sendFormRef} changeContentLoaded={changeContentLoaded} changeAnimationDone={changeAnimationDone}
                />
                <Interests isVisibleLight={isVisibleLight} pos={interestPos} />


                {/* FLOOR */}
                <Plane args={[500, 500]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 35]}
                  receiveShadow>
                  <meshPhysicalMaterial color={new THREE.Color(0x444444)} />
                </Plane>

              </Suspense>
            ) : (
              <MobileCaption />
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
        <Navigation secPos={secPos} action={changeScroll} scrollValue={scrollValue} action2={changeContentLoaded}
          cond={isAnimationDone && !((!isMobileDevice() && window.innerHeight > window.innerWidth) || (isMobileDevice() && (window.screen.orientation.type == "portrait-primary" || window.screen.orientation.type == "portrait-secondary")))} />
      </section >
    </>
  );
};

export default Home;
