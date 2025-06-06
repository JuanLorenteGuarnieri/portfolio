import { Html, useProgress } from "@react-three/drei";
import { useEffect, useRef } from "react";
import video from '/public/Intro.mp4'; // Ajusta la ruta según la ubicación de tu video


const Loader = ({ action }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      action();
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Html center>
      <div className="container" style={{ height: '100vh', width: '100vw' }}>
        <video ref={videoRef} width="100%" height="100%" muted autoPlay loop={false}>
          <source src={video} type="video/mp4" />
          Your browser doesn't support videos.
        </video>
      </div>
    </Html>
  );
};

export default Loader;






// import { Html, useProgress } from "@react-three/drei";
// import { logo } from '../assets';
// import { useEffect } from "react";

// const Loader = ({ action }) => {
//   const { progress } = useProgress();

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       action();
//     }, 5000);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <Html center>
//       <div className="container" style={{ height: '100vh', width: '100vw' }}>
//         <img className="logo" height="20%" width="20%" src={logo} alt="logo" />
//         <div className="loading">
//           <div className="line-box">
//             <div className="line" style={{ width: `${Math.max(0, progress - 75) * 4}%` }}></div>
//           </div>
//         </div>
//       </div>
//     </Html >
//   );
// };

// export default Loader