import React from 'react'
import { logo } from '../assets'


const Navigation = () => {
  const handleAboutClick = () => {
    console.log('About button clicked');
    // Aquí puedes añadir más lógica para el botón About
  };

  const handleProjectsClick = () => {
    console.log('Projects button clicked');
    // Aquí puedes añadir más lógica para el botón Projects
  };

  const handleContactClick = () => {
    console.log('Contact button clicked');
    // Aquí puedes añadir más lógica para el botón Contact
  };

  return (
    <header className="header">
      <button onClick={handleAboutClick}>
        <img src={logo} style={{ height: '70px', width: '70px' }} alt="logo" />
      </button>

      <nav className='flex text-lg gap-7 font-medium'>
        <button onClick={handleAboutClick} className="w-20 h-15 items-center justify-center flex font-bold">
          <p className="blue-gradient_text_logo">About</p>
        </button>
        <button onClick={handleProjectsClick} className="w-20 h-15 items-center justify-center flex font-bold">
          <p className="blue-gradient_text_logo">Projects</p>
        </button>
        <button onClick={handleContactClick} className="w-20 h-15 items-center justify-center flex font-bold">
          <p className="blue-gradient_text_logo">Contact</p>
        </button>
      </nav>
    </header>
  );
};

export default Navigation