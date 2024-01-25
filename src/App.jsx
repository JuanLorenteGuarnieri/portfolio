import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navigation from "./components/Navigation";
import Home from "./components/Home";
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
  const maxY = 9200;
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
      setScrollValue(window.scrollY / 8500);
    };

    window.addEventListener('scroll', onScroll, false);

    // Limpieza al desmontar
    return () => {
      window.removeEventListener('scroll', onScroll, false);
    };
  }, []);

  return (
    <>

      <CustomCursor color={col} size={5} />
      <Home setScrollValue={changeScrollValue} scrollValue={scrollValue} />
      <div style={{ height: maxY + 'px' }} />

      <Navigation action={changeScroll} />

    </>

  )
}

export default App