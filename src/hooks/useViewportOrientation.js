import { useState, useEffect, useCallback } from 'react';

export function useViewportOrientation() {
  const isMobileDevice = useCallback(() => {
    return /Mobi|Android/i.test(navigator.userAgent);
  }, []);

  const [isPhoneVertical, setIsPhoneVertical] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      if (isMobileDevice() && window.innerHeight / 1.3 > window.innerWidth) {
        setIsPhoneVertical(true);
      } else {
        setIsPhoneVertical(false);
      }
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, [isMobileDevice]);

  return { isPhoneVertical, isMobileDevice };
}
