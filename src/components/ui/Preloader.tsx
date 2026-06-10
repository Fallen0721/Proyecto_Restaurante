import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader = React.memo(function Preloader({
  onComplete,
}: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<SVGCircleElement>(null);
  const steamRef = useRef<SVGGElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        onComplete();
      },
    });

    // Animación del plato
    tl.from(plateRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      ease: "back.out(1.7)",
      transformOrigin: "center",
    })
      .from(
        steamRef.current!.children,
        {
          scaleY: 0,
          opacity: 0,
          stagger: 0.15,
          duration: 0.5,
          ease: "power2.out",
          transformOrigin: "bottom center",
        },
        "-=0.2",
      )
      .from(
        textRef.current!.children,
        {
          opacity: 0,
          y: 15,
          stagger: 0.08,
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.3",
      )
      .to({}, { duration: 0.8 }) // pausa de 0.8s
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
      });

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-charcoal-deep"
    >
      {/* Plato SVG */}
      <svg width="120" height="120" viewBox="0 0 120 120" className="mb-6">
        {/* Plato base */}
        <circle
          ref={plateRef}
          cx="60"
          cy="75"
          r="38"
          fill="none"
          stroke="#D4A574"
          strokeWidth="1.5"
          opacity="0.8"
        />
        <circle
          cx="60"
          cy="75"
          r="28"
          fill="none"
          stroke="#D4A574"
          strokeWidth="0.8"
          opacity="0.4"
        />
        {/* Comida en el plato */}
        <ellipse cx="60" cy="74" rx="18" ry="14" fill="#2A2A2A" />
        <ellipse cx="55" cy="70" rx="8" ry="6" fill="#B8894A" opacity="0.7" />
        <ellipse cx="64" cy="76" rx="6" ry="4" fill="#C17A53" opacity="0.8" />
        <circle cx="60" cy="68" r="3" fill="#D4A574" opacity="0.9" />

        {/* Vapor de humo */}
        <g ref={steamRef}>
          <path
            d="M52 55 Q50 45 52 38 Q54 31 52 24"
            stroke="#D4A574"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            d="M60 52 Q58 42 60 35 Q62 28 60 20"
            stroke="#D4A574"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.4"
          />
          <path
            d="M68 55 Q66 45 68 38 Q70 31 68 24"
            stroke="#D4A574"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.5"
          />
        </g>
      </svg>

      {/* Texto */}
      <div ref={textRef} className="flex flex-col items-center gap-2">
        <h1 className="font-display text-2xl md:text-3xl text-gold tracking-[0.15em]">
          TONY'S MAR
        </h1>
        <p className="font-body text-xs text-warmgray tracking-[0.3em] uppercase">
          Alta Cocina Contemporánea
        </p>
        {/* Barra de carga */}
        <div className="mt-4 w-32 h-px bg-charcoal-light overflow-hidden">
          <div className="h-full bg-gold animate-shimmer bg-gradient-to-r from-transparent via-gold to-transparent bg-[length:200%_100%]" />
        </div>
      </div>
    </div>
  );
});

export default Preloader;
