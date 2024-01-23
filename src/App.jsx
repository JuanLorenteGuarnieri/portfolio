import React from "react";
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import './App.css';
import CustomCursor from "./components/CustomCursor";

const App = () => {
  return (
    <>
      <CustomCursor color="white" size={5} />
      <Home />
      <Navigation />

    </>

  )
}

export default App