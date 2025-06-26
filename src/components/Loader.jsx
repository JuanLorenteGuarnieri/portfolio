import { useEffect, useCallback, useRef } from "react";
import video from '/public/Intro.mp4';

const Loader = ({ action }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    // Handler que se ejecutará cuando el vídeo termine
    const handleEnded = () => {
      console.log("El video ha terminado.");
      // action(); // Llamamos a la función pasada como prop
    };

    // Añadimos el listener al evento 'ended'
    videoEl.addEventListener('ended', handleEnded);

    // Limpiamos el listener al desmontar el componente
    return () => {
      videoEl.removeEventListener('ended', handleEnded);
    };
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      // action();
      console.log("1 seg");
    }, 1000);
    return () => clearTimeout(timer);
  });


  useEffect(() => {
    const timer = setTimeout(() => {
      // action();
      console.log("2 seg");
    }, 2000);
    return () => clearTimeout(timer);
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      // action();
      console.log("3 seg");
    }, 3000);
    return () => clearTimeout(timer);
  });

  const handleVideoEnd = useCallback(() => {
    console.log("El video ha terminado.");
    // action();
  }, []);

  return (
    // <Html center>
    <div className="container" style={{ height: '100vh', width: '100vw' }}>
      <video
        ref={videoRef}
        width="100%"
        height="100%"
        muted
        autoPlay
        src={video}
        // loop={false} // Elimina este atributo, ya que loop solo se agrega si quieres que el video repita
        // preload="auto"
        onEnded={() => {
          console.log("El video ha terminado2.");
          // action();
        }}
      >
        {/* <source  type="video/mp4" /> */}
        Your browser doesn't support videos.
      </video>
    </div>
    // </Html>
  );
};

export default Loader;