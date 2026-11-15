import React, { useEffect, useState } from 'react';
import {
  exitCube,
  getCubeElapsed,
  shuffleCube,
  solveCube,
  useCubeGame,
  useCubeMode,
} from '../lib/cubeStore';
import { useFocusLock } from '../hooks/useFocusLock';

// Interfaz del modo cubo: cronómetro, botones Mezclar / Resolver y salir. El bloqueo del scroll
// y Esc los gestiona useFocusLock (la cámara está pegada al cubo: la página no debe moverse).

const FONT = '"Work Sans", sans-serif';
const MONO = '"Source Code Pro", ui-monospace, monospace';

/** 83450 ms -> "1:23.45" */
function formatTime(ms) {
  const total = Math.max(0, Math.floor(ms / 10));
  const cs = String(total % 100).padStart(2, '0');
  const s = String(Math.floor(total / 100) % 60).padStart(2, '0');
  const m = Math.floor(total / 6000);
  return `${m}:${s}.${cs}`;
}

const MESSAGES = {
  idle: 'Free play · press Shuffle for a timed solve',
  scrambling: 'Shuffling…',
  ready: 'Your time starts with your first move',
  running: 'Go!',
  solving: 'Solving…',
};

// El texto del cronómetro se repinta con requestAnimationFrame solo mientras corre
function Timer({ phase }) {
  const [ms, setMs] = useState(() => getCubeElapsed());
  useEffect(() => {
    if (phase !== 'running') {
      setMs(getCubeElapsed());
      return undefined;
    }
    let raf = 0;
    const tick = () => {
      setMs(getCubeElapsed());
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  const color = phase === 'solved' ? '#7dffb0' : phase === 'running' ? '#ffffff' : 'rgba(255,255,255,0.7)';
  return (
    <div style={{ fontFamily: MONO, fontSize: 'clamp(30px, 5vw, 52px)', lineHeight: 1, color, letterSpacing: '0.04em', textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}>
      {formatTime(ms)}
    </div>
  );
}

const pill = (disabled) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '10px 22px',
  color: '#fff',
  background: 'rgba(34, 48, 96, 0.55)',
  border: '1px solid rgba(255,255,255,0.35)',
  borderRadius: 999,
  fontFamily: FONT,
  fontSize: 15,
  letterSpacing: '0.05em',
  cursor: disabled ? 'default' : 'pointer',
  opacity: disabled ? 0.4 : 1,
  backdropFilter: 'blur(6px)',
  transition: 'opacity 0.2s ease',
});

const CubeOverlay = () => {
  const mode = useCubeMode();
  const game = useCubeGame();
  const busy = mode !== 'idle';
  const shown = mode === 'entering' || mode === 'active';

  useFocusLock(busy, exitCube);

  if (!busy) return null;

  const fade = { opacity: shown ? 1 : 0, transition: 'opacity 0.6s ease', transitionDelay: shown ? '0.8s' : '0s' };
  const automatic = game.phase === 'scrambling' || game.phase === 'solving';
  const interactive = shown ? 'auto' : 'none';

  let message = MESSAGES[game.phase];
  if (game.phase === 'solved') {
    message = game.newBest ? 'Solved! New best time 🎉' : `Solved! · best ${formatTime(game.best ?? game.elapsed)}`;
  }
  if (game.notice) message = game.notice;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 5, pointerEvents: 'none', fontFamily: FONT }}>
      <button
        type="button"
        onClick={exitCube}
        aria-label="Exit Rubik's cube mode"
        style={{ ...pill(false), ...fade, position: 'absolute', top: 20, right: 24, pointerEvents: interactive, padding: '8px 16px', fontSize: 14 }}
      >
        <span aria-hidden="true" style={{ fontSize: 16, lineHeight: 1 }}>✕</span> Exit
      </button>

      <div style={{ ...fade, position: 'absolute', top: 22, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <Timer phase={game.phase} />
        <div aria-live="polite" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, letterSpacing: '0.05em', textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}>
          {message}
        </div>
      </div>

      <div style={{ ...fade, position: 'absolute', bottom: 24, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', gap: 14, pointerEvents: interactive }}>
          <button type="button" onClick={shuffleCube} disabled={automatic} style={pill(automatic)}>
            <span aria-hidden="true">⤮</span> Shuffle
          </button>
          <button type="button" onClick={solveCube} disabled={automatic} style={pill(automatic)}>
            <span aria-hidden="true">✓</span> Solve
          </button>
        </div>
        <p style={{ margin: 0, textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: 12, letterSpacing: '0.05em', textShadow: '0 1px 6px rgba(0,0,0,0.8)', padding: '0 12px' }}>
          Drag a face to turn it · drag the background to rotate the cube · Esc to exit
        </p>
      </div>
    </div>
  );
};

export default CubeOverlay;
