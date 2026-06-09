import React from 'react';
import { useParallax } from '../../hooks/useParallax';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const HeroVideo = React.memo(function HeroVideo() {
  const parallaxRef = useParallax(0.3);
  const isMobile = useMediaQuery('(max-width: 767px)');

  if (isMobile) {
    return (
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=800&fit=crop&q=80)',
        }}
      />
    );
  }

  return (
    <div
      ref={parallaxRef}
      className="absolute inset-0 overflow-hidden"
      style={{ willChange: 'transform' }}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-110"
        poster="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=800&fit=crop&q=80"
      >
        {/* Fuente de video - en producción se reemplazaría con un video real */}
        <source
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
});

export default HeroVideo;
