import React, { useEffect, useState, useMemo } from "react";
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
  const maxY = 13550;
  const changeScroll = (n) => {
    setScrollY(n);
    window.scroll({
      top: n,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const onScroll = (e) => {
      setScrollY(window.scrollY);
      setScrollValue(window.scrollY);
    };

    window.addEventListener('scroll', onScroll, false);

    return () => {
      window.removeEventListener('scroll', onScroll, false);
    };
  }, []);

  const isMobileDevice = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };
  const showCursor = !isMobileDevice();

  // Memoriza el CustomCursor para evitar recrearlo innecesariamente
  const memoizedCursor = useMemo(() => {
    return showCursor ? <CustomCursor color={col} size={5} /> : null;
  }, [showCursor, col]);

  // Memoriza el Home para evitar recrearlo innecesariamente
  const memoizedHome = useMemo(() => {
    return (
      <Home
        scrollValue={scrollValue}
        maxY={maxY}
        changeScroll={changeScroll}
      />
    );
  }, [scrollValue, maxY, changeScroll]);

  // Memoriza el div de altura
  const memoizedHeightDiv = useMemo(() => {
    return <div style={{ height: maxY + 'px' }} />;
  }, [maxY]);

  return (
    <>
      {memoizedCursor}
      {memoizedHome}
      {memoizedHeightDiv}
    </>
  );
}

export default App