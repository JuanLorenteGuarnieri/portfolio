import React, { useRef, useEffect } from 'react';

// ---------------------------------------------------------------------------------------------
// Bordes del vídeo difuminados hacia el fondo negro.
//
// En cada borde el vídeo es 100 % transparente (se funde con el fondo) y a un FEATHER % de su
// dimensión en esa dirección (ancho para izquierda/derecha, alto para arriba/abajo) es 100 %
// opaco. Se hace con una máscara CSS (mask-image) en el propio estilo del <video>, de modo que
// existe desde el primer pintado y NO depende de ningún evento ni de JavaScript.
//
// Esto también elimina la línea clara del borde derecho: Intro.mp4 trae su última columna de
// píxeles (x = 1279) en gris (RGB 33,33,33) en todos los fotogramas en lugar de negro. Con la
// máscara, esa columna queda al 0 % de opacidad. (Un primer arreglo con clip-path calculado en
// el evento `loadedmetadata` llegaba tarde si el hilo principal estaba ocupado cargando la
// escena: la línea se veía unos segundos al principio.)
// ---------------------------------------------------------------------------------------------
const FEATHER = '5%';

const fade = (direction) =>
  `linear-gradient(to ${direction}, transparent 0%, #000 ${FEATHER}, #000 calc(100% - ${FEATHER}), transparent 100%)`;

const EDGE_MASK = `${fade('right')}, ${fade('bottom')}`;

function VideoPlayer({ src, onVideoComplete }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    // Set playback rate to half speed
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      videoEl.playbackRate = 0.5;
    } else {
      videoEl.playbackRate = 0.8;
    }

    const onEnded = () => onVideoComplete(true);
    videoEl.addEventListener('ended', onEnded);
    return () => {
      videoEl.removeEventListener('ended', onEnded);
    };
  }, [onVideoComplete]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        background: '#000',
      }}
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        controls={false}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          // Prefijo -webkit- para navegadores anteriores (Chrome < 120, Safari antiguo)
          WebkitMaskImage: EDGE_MASK,
          maskImage: EDGE_MASK,
          WebkitMaskComposite: 'source-in',
          maskComposite: 'intersect',
        }}
      />
    </div>
  );
}

export default VideoPlayer;
