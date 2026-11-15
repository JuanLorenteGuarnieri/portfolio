import { useEffect } from 'react';

/**
 * Mientras un modo foco (piano, cubo) está activo la cámara está pegada al objeto, así que la
 * página no debe moverse: se bloquea el scroll (rueda, táctil, teclado) y `Esc` sale del modo.
 *
 * @param {boolean} active     true mientras dura el modo (incluidos el vuelo de ida y el de vuelta)
 * @param {() => void} onEscape  se llama al pulsar Esc
 */
export function useFocusLock(active, onEscape) {
  useEffect(() => {
    if (!active) return undefined;

    const html = document.documentElement;
    const body = document.body;
    const prev = {
      overflow: body.style.overflow,
      bodyTouch: body.style.touchAction,
      htmlTouch: html.style.touchAction,
    };
    body.style.overflow = 'hidden';
    // Sin esto el navegador convierte arrastrar el dedo en scroll y cancela el toque
    body.style.touchAction = 'none';
    html.style.touchAction = 'none';

    const stop = (e) => e.preventDefault();
    const onKeyDown = (e) => { if (e.key === 'Escape') onEscape(); };
    window.addEventListener('wheel', stop, { passive: false });
    window.addEventListener('touchmove', stop, { passive: false });
    window.addEventListener('keydown', onKeyDown);

    return () => {
      body.style.overflow = prev.overflow;
      body.style.touchAction = prev.bodyTouch;
      html.style.touchAction = prev.htmlTouch;
      window.removeEventListener('wheel', stop, { passive: false });
      window.removeEventListener('touchmove', stop, { passive: false });
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [active, onEscape]);
}
