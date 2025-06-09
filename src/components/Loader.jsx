import { Html } from "@react-three/drei";
import { useEffect, useRef } from "react";
import video from '/public/Intro.mp4';

const Loader = ({ action }) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      action();
    }, 4000);
    return () => clearTimeout(timer);
  }, [action]);

  return (
    <Html center>
      <div className="container" style={{ height: '100vh', width: '100vw' }}>
        <video
          width="100%"
          height="100%"
          muted
          autoPlay
          loop={false}
          playsInline
          preload="auto" // <-- Aquí se indica que se debe precargar
        >
          <source src={video} type="video/mp4" />
          Your browser doesn't support videos.
        </video>
      </div>
    </Html>
  );
};


export default Loader;