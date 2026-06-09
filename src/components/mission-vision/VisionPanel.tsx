import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface PillarCardProps {
  number: string;
  title: string;
  description: string;
  delay: number;
}

const PillarCard = React.memo(function PillarCard({
  number,
  title,
  description,
  delay,
}: PillarCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        opacity: 0,
        x: 40,
        duration: 0.7,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%',
          once: true,
        },
      });
    });

    return () => ctx.revert();
  }, [delay]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      rotateY: 5,
      rotateX: 2,
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 1000,
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-cursor="expand"
      className="bg-charcoal-light/60 border border-gold/10 p-6 cursor-default"
      style={{ willChange: 'transform' }}
    >
      <span className="font-display text-4xl text-gold/20 leading-none block mb-3">
        {number}
      </span>
      <h4 className="font-display text-lg text-cream mb-2">{title}</h4>
      <p className="font-body text-sm text-warmgray leading-relaxed">{description}</p>
    </div>
  );
});

const VisionPanel = React.memo(function VisionPanel() {
  const panelRef = useRef<HTMLDivElement>(null);

  const pillars = [
    {
      number: '01',
      title: 'Mar Fresco Cada Día',
      description:
        'Nuestros mariscos llegan directamente de pescadores artesanales hondureños. Cero congelados, cero intermediarios: solo frescura del Caribe y el Pacífico.',
    },
    {
      number: '02',
      title: 'Raíces Garífunas',
      description:
        'Somos guardianes de las recetas ancestrales de las comunidades garífunas y costeras de Honduras, cocinadas con técnica y alma catracha.',
    },
    {
      number: '03',
      title: 'El Sabor Hondureño',
      description:
        'Cada plato cuenta la historia de nuestras costas: el Caribe de Tela y La Ceiba, el Golfo de Fonseca, las Islas de la Bahía. Honduras en cada bocado.',
    },
  ];

  return (
    <div
      ref={panelRef}
      className="relative overflow-hidden min-h-[500px] lg:min-h-[700px] bg-charcoal flex flex-col justify-center p-8 md:p-12 lg:p-16"
    >
      {/* Número decorativo */}
      <span className="absolute top-8 left-8 font-display text-[120px] lg:text-[180px] text-gold/10 leading-none select-none pointer-events-none">
        02
      </span>

      <div className="relative z-10 max-w-lg ml-auto">
        <span className="font-body text-xs text-gold tracking-[0.3em] uppercase mb-4 block">
          02 — Visión
        </span>

        <h3 className="font-display text-3xl md:text-4xl text-cream mb-2 leading-tight">
          Nuestra Visión
        </h3>

        <p className="font-body text-warmgray/80 text-sm mb-8 leading-relaxed">
          Ser el referente de la cocina marinera hondureña, llevando la
          riqueza de nuestros mares a cada mesa, con respeto por el
          ecosistema y orgullo por nuestra identidad catracha.
        </p>

        <div className="flex flex-col gap-4">
          {pillars.map((pillar, i) => (
            <PillarCard key={pillar.number} {...pillar} delay={i * 0.15} />
          ))}
        </div>
      </div>

      {/* Línea decorativa */}
      <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent hidden lg:block" />
    </div>
  );
});

export default VisionPanel;
