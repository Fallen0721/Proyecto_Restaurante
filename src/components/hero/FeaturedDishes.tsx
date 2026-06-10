import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionTitle from '../ui/SectionTitle';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { menuData } from '../../data/menuData';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';

gsap.registerPlugin(ScrollTrigger);

const FeaturedDishes = React.memo(function FeaturedDishes() {
  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollTo } = useSmoothScroll();

  // Platillos firma (máximo 4) para los destacados del inicio
  const featured = menuData.filter((dish) => dish.isSignature).slice(0, 4);

  useEffect(() => {
    if (!gridRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gridRef.current!.querySelectorAll('.featured-card');
      gsap.from(cards, {
        opacity: 0,
        y: 40,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 85%',
          once: true,
        },
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative bg-charcoal-deep section-padding overflow-hidden">
      <div className="section-container">
        <SectionTitle
          label="Nuestros Destacados"
          title="Sabores que nos definen"
          subtitle="Una selección de nuestros platillos firma, donde el mar del Caribe hondureño y la tradición garífuna se encuentran en cada bocado."
          align="center"
        />

        {/* Rejilla de platillos destacados */}
        <div
          ref={gridRef}
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {featured.map((dish) => (
            <article
              key={dish.id}
              className="featured-card group flex flex-col overflow-hidden rounded-sm border border-gold/10 bg-charcoal-light/30 transition-colors duration-300 hover:border-gold/40"
            >
              {/* Imagen */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-deep/80 via-transparent to-transparent" />
                {dish.isSignature && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="gold">Firma</Badge>
                  </div>
                )}
              </div>

              {/* Contenido */}
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl text-cream leading-tight">
                    {dish.name}
                  </h3>
                  <span className="font-display text-lg text-gold whitespace-nowrap">
                    L{dish.price}
                  </span>
                </div>
                <p className="font-body text-sm text-warmgray leading-relaxed line-clamp-3">
                  {dish.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Llamadas a la acción */}
        <div className="mt-12 flex flex-col items-center gap-6">
          <div className="flex w-full flex-col items-stretch gap-4 sm:w-auto sm:flex-row sm:items-center">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              data-cursor="expand"
              onClick={() => scrollTo('#delivery')}
              className="tracking-widest sm:w-auto"
            >
              Pedir a Domicilio
            </Button>
            <Button
              variant="outline"
              size="lg"
              fullWidth
              data-cursor="expand"
              onClick={() => scrollTo('#reservaciones')}
              className="tracking-widest sm:w-auto"
            >
              Reservar Mesa
            </Button>
          </div>

          <button
            type="button"
            data-cursor="expand"
            onClick={() => scrollTo('#platillos')}
            className="group flex min-h-[44px] items-center gap-2 px-2 font-body text-sm tracking-widest uppercase text-warmgray transition-colors duration-300 hover:text-gold"
          >
            Ver todos los platillos
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
});

export default FeaturedDishes;
