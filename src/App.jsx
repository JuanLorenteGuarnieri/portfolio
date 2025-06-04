import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navigation from "./components/Navigation";
import Home from "./sections/Home";
import './App.css';
import CustomCursor from "./components/CustomCursor";

const App = () => {
  const [scrollValue, setScrollValue] = useState(0);

  const changeScrollValue = (value) => {
    setScrollValue(value);
  };


  const [col, setCol] = useState("white");
  const changeColor = (n) => {
    setCol(n);
  };

  const [scrollY, setScrollY] = useState('0');
  const maxY = 14000;
  const changeScroll = (n) => {
    setScrollY(n);
    window.scroll({
      top: n,
      behavior: 'smooth'
    });

  };


  useEffect(() => {

    // Controlador de desplazamiento
    const onScroll = (e) => {
      // Calcula el valor de desplazamiento y actualiza la cámara o la escena
      setScrollY(window.scrollY);
      setScrollValue(window.scrollY);
    };

    window.addEventListener('scroll', onScroll, false);

    // Limpieza al desmontar
    return () => {
      window.removeEventListener('scroll', onScroll, false);
    };
  }, []);


  const isMobileDevice = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };
  const showCursor = !isMobileDevice();


  return (
    <>
      {showCursor && <CustomCursor color={col} size={5} />}
      <Home scrollValue={scrollValue} maxY={maxY} changeScroll={changeScroll} />
      <div style={{ height: maxY + 'px' }} />
    </>

  )
}

export default App