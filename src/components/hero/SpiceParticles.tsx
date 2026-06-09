import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
  el: HTMLDivElement;
}

const SpiceParticles = React.memo(function SpiceParticles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 767px)');
  const particleCount = isMobile ? 15 : 35;

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const particles: Particle[] = [];
    const ctx = gsap.context(() => {}, container);

    for (let i = 0; i < particleCount; i++) {
      const el = document.createElement('div');
      const size = Math.random() * 4 + 1;
      const isSquare = Math.random() > 0.6;

      el.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: #D4A574;
        border-radius: ${isSquare ? '0' : '50%'};
        pointer-events: none;
        will-change: transform, opacity;
        transform: ${isSquare ? 'rotate(45deg)' : ''};
      `;

      container.appendChild(el);

      const particle: Particle = {
        x: Math.random() * 100,
        y: Math.random() * 100,
        size,
        opacity: Math.random() * 0.5 + 0.1,
        speedX: (Math.random() - 0.5) * 30,
        speedY: -(Math.random() * 40 + 20),
        el,
      };

      particles.push(particle);

      // Animación flotante con GSAP timeline
      const delay = Math.random() * 4;
      const duration = Math.random() * 6 + 8;

      gsap.set(el, {
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        opacity: 0,
      });

      gsap.timeline({ repeat: -1, delay })
        .to(el, {
          opacity: particle.opacity,
          duration: 1,
          ease: 'power1.in',
        })
        .to(
          el,
          {
            x: particle.speedX,
            y: particle.speedY,
            opacity: 0,
            duration,
            ease: 'power1.inOut',
          },
          '-=0.5'
        )
        .set(el, {
          x: 0,
          y: 0,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          opacity: 0,
        });
    }

    return () => {
      ctx.revert();
      particles.forEach((p) => {
        if (container.contains(p.el)) container.removeChild(p.el);
      });
    };
  }, [particleCount]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-10"
      aria-hidden="true"
    />
  );
});

export default SpiceParticles;
