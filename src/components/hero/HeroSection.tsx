import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import HeroVideo from "./HeroVideo";
import SpiceParticles from "./SpiceParticles";
import ScrollIndicator from "./ScrollIndicator";
import FeaturedDishes from "./FeaturedDishes";
import Button from "../ui/Button";
import { useSmoothScroll } from "../../hooks/useSmoothScroll";

const HeroSection = React.memo(function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    if (!titleRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      // Animar letras del título staggered
      const letters = titleRef.current!.querySelectorAll(".hero-letter");
      tl.from(letters, {
        opacity: 0,
        y: 60,
        stagger: 0.04,
        duration: 0.8,
        ease: "power3.out",
      })
        .from(
          taglineRef.current,
          { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" },
          "-=0.3",
        )
        .from(
          subtitleRef.current,
          { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" },
          "-=0.4",
        )
        .from(
          ctaRef.current,
          { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" },
          "-=0.3",
        );
    });

    return () => ctx.revert();
  }, []);

  // Separar el título en letras para el efecto stagger
  const titleText = "Tony's Mar";
  const letters = titleText.split("").map((char, i) => (
    <span
      key={i}
      className="hero-letter inline-block"
      style={{ whiteSpace: char === " " ? "pre" : "normal" }}
    >
      {char === " " ? " " : char}
    </span>
  ));

  return (
    <section id="inicio">
      {/* Hero a pantalla completa */}
      <div className="relative w-full h-screen min-h-[600px] overflow-hidden flex items-center justify-center">
      {/* Video/Imagen de fondo */}
      <HeroVideo />

      {/* Overlay gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal-deep/60 via-charcoal-deep/40 to-charcoal-deep z-[1]" />

      {/* Partículas de especias */}
      <SpiceParticles />

      {/* Contenido principal */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-5xl mx-auto">
        {/* Línea decorativa superior */}
        <div ref={taglineRef} className="flex items-center gap-4 mb-8">
          <span className="w-12 h-px bg-gold/60" />
          <span className="font-body text-xs text-gold/80 tracking-[0.4em] uppercase">
            Alta Cocina Contemporánea
          </span>
          <span className="w-12 h-px bg-gold/60" />
        </div>

        {/* Título con efecto de letras */}
        <h1
          ref={titleRef}
          className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-cream tracking-tight leading-none mb-6"
          style={{ textShadow: "0 2px 40px rgba(0,0,0,0.5)" }}
        >
          {letters}
        </h1>

        {/* Subtítulo */}
        <p
          ref={subtitleRef}
          className="font-body text-base md:text-lg text-warmgray max-w-xl leading-relaxed mb-10"
        >
          Los tesoros del mar hondureño en tu mesa. Mariscos frescos del
          Caribe y la tradición garífuna en cada plato.
        </p>

        {/* Botones CTA */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-center justify-center w-full max-w-md sm:max-w-none"
        >
          <Button
            variant="primary"
            size="lg"
            fullWidth
            data-cursor="expand"
            onClick={() => scrollTo("#reservaciones")}
            className="tracking-widest sm:w-auto"
          >
            Reservar Mesa
          </Button>
          <Button
            variant="outline"
            size="lg"
            fullWidth
            data-cursor="expand"
            onClick={() => scrollTo("#delivery")}
            className="tracking-widest sm:w-auto"
          >
            Pedir a Domicilio
          </Button>
          <Button
            variant="ghost"
            size="lg"
            fullWidth
            data-cursor="expand"
            onClick={() => scrollTo("#platillos")}
            className="tracking-widest sm:w-auto"
          >
            Ver Platillos
          </Button>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <ScrollIndicator />
      </div>

      {/* Decoración lateral - solo desktop */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-4">
        <span className="writing-mode-vertical font-body text-xs text-gold/40 tracking-widest uppercase">
          Desde 2019
        </span>
        <span className="w-px h-16 bg-gold/20" />
      </div>

      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-4">
        <span className="writing-mode-vertical font-body text-xs text-gold/40 tracking-widest uppercase">
          La Ceiba, Honduras
        </span>
        <span className="w-px h-16 bg-gold/20" />
      </div>
      </div>

      {/* Platillos destacados, dentro de la sección #inicio */}
      <FeaturedDishes />
    </section>
  );
});

export default HeroSection;
