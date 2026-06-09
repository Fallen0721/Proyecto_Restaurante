import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TypewriterText from './TypewriterText';
import { useParallax } from '../../hooks/useParallax';
import { useMediaQuery } from '../../hooks/useMediaQuery';

gsap.registerPlugin(ScrollTrigger);

const MissionPanel = React.memo(function MissionPanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const bgRef = useParallax(0.4);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  useEffect(() => {
    if (!panelRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(panelRef.current, {
        opacity: 0,
        x: -50,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: panelRef.current,
          start: 'top 80%',
          once: true,
        },
      });
    }, panelRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={panelRef}
      className={[
        'relative overflow-hidden min-h-[500px] lg:min-h-[700px]',
        isDesktop ? 'clip-diagonal' : '',
      ].join(' ')}
    >
      {/* Imagen de fondo con parallax */}
      <div ref={bgRef} className="absolute inset-0 scale-110" style={{ willChange: 'transform' }}>
        <img
          src="https://images.unsplash.com/photo-1560684352-8497838a2229?w=900&h=700&fit=crop&q=80"
          alt="Mariscos frescos de Honduras"
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal-deep/90 via-charcoal-deep/75 to-charcoal-deep/50" />

      {/* Número decorativo */}
      <span className="absolute top-8 right-8 font-display text-[120px] lg:text-[180px] text-gold/10 leading-none select-none pointer-events-none">
        01
      </span>

      {/* Contenido */}
      <div className="relative z-10 p-8 md:p-12 lg:p-16 h-full flex flex-col justify-center max-w-lg">
        {/* Label rotado - solo desktop */}
        {isDesktop && (
          <div className="hidden lg:block mb-6">
            <span className="writing-mode-vertical font-body text-xs text-gold/60 tracking-[0.4em] uppercase">
              Nuestra Esencia
            </span>
          </div>
        )}

        <span className="font-body text-xs text-gold tracking-[0.3em] uppercase mb-4 block">
          01 — Misión
        </span>

        <h3 className="font-display text-3xl md:text-4xl text-cream mb-6 leading-tight">
          {isDesktop ? (
            <TypewriterText
              text="Nuestra Esencia"
              speed={60}
              className="block"
            />
          ) : (
            'Nuestra Esencia'
          )}
        </h3>

        <div className="w-8 h-px bg-gold mb-6" />

        <p className="font-body text-warmgray leading-relaxed text-sm md:text-base">
          En Tony's Mar honramos la riqueza del mar hondureño y la sabiduría
          de las comunidades costeras que durante generaciones han dominado
          el arte de cocinar mariscos. Nuestra misión es preservar y elevar
          los sabores auténticos del Caribe y el Pacífico de Honduras.
        </p>

        <p className="font-body text-warmgray/80 leading-relaxed text-sm md:text-base mt-4">
          Trabajamos directamente con pescadores artesanales y comunidades
          garífunas, garantizando ingredientes frescos del día y una cocina
          que celebra la identidad marina de Honduras con orgullo y pasión.
        </p>

        {/* Detalle decorativo */}
        <div className="flex items-center gap-3 mt-8">
          <span className="w-8 h-px bg-gold/50" />
          <span className="font-body text-xs text-gold/60 tracking-widest uppercase">
            Desde 2019
          </span>
        </div>
      </div>
    </div>
  );
});

export default MissionPanel;
