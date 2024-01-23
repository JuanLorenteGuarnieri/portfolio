import { Html, useProgress } from "@react-three/drei";
import { logo } from '../assets';

const Loader = () => {
  const { progress } = useProgress();

  const progressBarStyle = {
    width: '25%', // Ancho fijo de la barra de progreso
    height: '10px', // Altura de la barra de progreso
    backgroundColor: 'grey', // Color de fondo de la barra de progreso
    position: 'relative' // Posición relativa para la barra de carga interna
  };

  const progressIndicatorStyle = {
    width: `${progress}%`, // Ancho de la barra de carga según el progreso
    height: '100%', // Altura completa de la barra de progreso
    backgroundColor: 'blue', // Color de la barra de carga
    position: 'absolute' // Posición absoluta para superponerse a la barra de progreso
  };

  return (
    <Html center>
      <div className="container" style={{ height: '100vh', width: '100vw' }}>
        <img className="logo" height="20%" width="20%" src={logo} alt="logo" />
        <div className="loading">
          <div className="line-box">
            <div className="line" style={{ width: `${(progress - 75) * 4}%` }}></div>
          </div>
        </div>
      </div>
    </Html >
  );
};

export default Loader