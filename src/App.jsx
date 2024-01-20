import React from "react";
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navigation from "./components/Navigation";
import Home from "./components/Home";


const App = () => {
  return (
    <>
      <Home />
      <Navigation />

    </>

  )
}

export default App