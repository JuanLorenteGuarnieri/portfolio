import { useState, useEffect } from 'react';

export function useScrollPosition() {
  const [scrollValue, setScrollValue] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const value = window.scrollY;
      setScrollY(value);
      setScrollValue(value);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll, { passive: true });
    };
  }, []);

  return { scrollValue, scrollY };
}
