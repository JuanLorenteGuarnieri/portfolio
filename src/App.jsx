import React, { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import './App.css';
import CustomCursor from "./components/CustomCursor";

const App = () => {
  const [col, setCol] = useState("white");
  const changeColor = (n) => {
    setCol(n);
  };
  return (
    <>
      <CustomCursor color={col} size={5} />
      <Home />
      <Navigation action={changeColor} />
    </>

  )
}

export default App