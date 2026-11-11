import React, { useCallback } from "react";
import Home from "./sections/Home";
import './App.css';

// Altura total de la página: define el recorrido de scroll que mueve la cámara 3D.
const MAX_Y = 14800;

// App ya no guarda el scroll en el estado de React: el scroll se gestiona en
// ./scrollStore y la cámara se mueve de forma imperativa (ver Home / CameraController).
const App = () => {
  const changeScroll = useCallback((n) => {
    window.scroll({ top: n, behavior: 'smooth' });
  }, []);

  return (
    <>
      <Home maxY={MAX_Y} changeScroll={changeScroll} />
      <div style={{ height: `${MAX_Y}px` }} />
    </>
  );
};

export default App;
