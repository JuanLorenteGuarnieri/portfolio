import React from 'react';
import { exitPiano, usePianoMode } from '../lib/pianoStore';
import { useFocusLock } from '../hooks/useFocusLock';

// Interfaz del modo piano: botón para salir y una pista con los controles. El bloqueo del scroll
// y Esc los gestiona useFocusLock (la cámara está pegada al teclado: la página no debe moverse).
const PianoOverlay = () => {
  const mode = usePianoMode();
  const busy = mode !== 'idle';
  const shown = mode === 'entering' || mode === 'active';

  useFocusLock(busy, exitPiano);

  if (!busy) return null;

  const fade = { opacity: shown ? 1 : 0, transition: 'opacity 0.6s ease', transitionDelay: shown ? '0.8s' : '0s' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 5, pointerEvents: 'none', fontFamily: '"Work Sans", sans-serif' }}>
      <button
        type="button"
        onClick={exitPiano}
        aria-label="Exit piano mode"
        style={{
          ...fade,
          position: 'absolute',
          top: 20,
          right: 24,
          pointerEvents: shown ? 'auto' : 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 16px',
          color: '#fff',
          background: 'rgba(34, 48, 96, 0.55)',
          border: '1px solid rgba(255,255,255,0.35)',
          borderRadius: 999,
          fontSize: 14,
          letterSpacing: '0.04em',
          cursor: 'pointer',
          backdropFilter: 'blur(6px)',
        }}
      >
        <span aria-hidden="true" style={{ fontSize: 16, lineHeight: 1 }}>✕</span> Exit
      </button>
      <p
        style={{
          ...fade,
          position: 'absolute',
          bottom: 28,
          left: 0,
          right: 0,
          margin: 0,
          textAlign: 'center',
          color: 'rgba(255,255,255,0.75)',
          fontSize: 13,
          letterSpacing: '0.05em',
          textShadow: '0 1px 6px rgba(0,0,0,0.8)',
        }}
      >
        Click or tap the keys · or play with your keyboard (A W S E D F T G Y H U J K…) · Esc to exit
      </p>
    </div>
  );
};

export default PianoOverlay;
