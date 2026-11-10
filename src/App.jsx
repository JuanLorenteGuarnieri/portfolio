import React, { useCallback } from "react";
import Home from "./sections/Home";
import './App.css';
import { useScrollPosition } from "./hooks/useScrollPosition";

const MAX_Y = 14800;

const App = () => {
  const { scrollValue } = useScrollPosition();

  const changeScroll = useCallback((n) => {
    window.scroll({ top: n, behavior: 'smooth' });
  }, []);

  return (
    <>
      <Home scrollValue={scrollValue} maxY={MAX_Y} changeScroll={changeScroll} />
      <div style={{ height: `${MAX_Y}px` }} />
    </>
  );
};

export default App;