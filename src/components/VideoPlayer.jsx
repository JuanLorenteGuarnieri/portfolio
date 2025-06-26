import React, { useRef, useEffect } from 'react';

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
    return () => videoEl.removeEventListener('ended', onEnded);
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
        }}
      />
    </div>
  );
}

export default VideoPlayer;
