import React, { useState, useMemo, useRef, useEffect } from 'react';
import gsap from 'gsap';
import SectionTitle from '../ui/SectionTitle';
import DishCard from './DishCard';
import { menuData, menuCategories } from '../../data/menuData';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';
import type { Dish } from '../../types/menu.types';

const MenuSection = React.memo(function MenuSection() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollTo } = useSmoothScroll();

  const filteredDishes = useMemo<Dish[]>(() => {
    if (activeCategory === 'all') return menuData;
    return menuData.filter((dish) => dish.category === activeCategory);
  }, [activeCategory]);

  // Animación suave al cambiar de categoría
  useEffect(() => {
    if (!gridRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        gridRef.current!.children,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
          overwrite: true,
        }
      );
    }, gridRef);
    return () => ctx.revert();
  }, [filteredDishes]);

  const handleReservar = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollTo('#reservaciones');
  };

  return (
    <section id="platillos" className="relative section-padding bg-charcoal-deep overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, #D4A574 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="section-container relative">
        {/* Encabezado */}
        <SectionTitle
          label="Sabores del Caribe Hondureño"
          title="Nuestros Platillos"
          subtitle="Elige una categoría y descubre los tesoros de la cocina garífuna, del mar a tu mesa."
          className="mb-10 lg:mb-14"
        />

        {/* Layout: sidebar de categorías + rejilla de platillos */}
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-10">
          {/* Sidebar / Chips de categorías */}
          <aside className="mb-8 lg:mb-0">
            <nav
              aria-label="Categorías de platillos"
              className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 lg:sticky lg:top-24 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin"
            >
              {menuCategories.map((cat) => {
                const isActive = activeCategory === cat.value;
                const count =
                  cat.value === 'all'
                    ? menuData.length
                    : menuData.filter((d) => d.category === cat.value).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.value)}
                    aria-pressed={isActive}
                    data-cursor="expand"
                    className={[
                      'group relative flex items-center justify-between gap-3 shrink-0',
                      'min-h-[48px] px-5 py-3 rounded-sm font-body tracking-wide text-sm lg:text-base',
                      'transition-all duration-300 lg:w-full',
                      isActive
                        ? 'bg-gold text-charcoal-deep shadow-[0_0_24px_rgba(212,165,116,0.3)] font-semibold'
                        : 'bg-charcoal-light/40 text-warmgray border border-gold/10 hover:border-gold/40 hover:text-cream',
                    ].join(' ')}
                  >
                    <span className="flex items-center gap-2.5 whitespace-nowrap">
                      <span
                        className={[
                          'w-1.5 h-1.5 rotate-45 transition-colors duration-300',
                          isActive ? 'bg-charcoal-deep' : 'bg-gold/50 group-hover:bg-gold',
                        ].join(' ')}
                      />
                      {cat.label}
                    </span>
                    <span
                      className={[
                        'text-xs tabular-nums transition-colors duration-300',
                        isActive ? 'text-charcoal-deep/70' : 'text-warmgray/60',
                      ].join(' ')}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Rejilla de platillos */}
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 content-start"
          >
            {filteredDishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        </div>

        {/* CTA reservar experiencia */}
        <div className="mt-14 text-center">
          <p className="font-body text-warmgray text-sm mb-4">
            Ofrecemos menú degustación de 7 pasos bajo reserva previa
          </p>
          <a
            href="#reservaciones"
            onClick={handleReservar}
            className="inline-flex items-center gap-2 min-h-[44px] font-body text-sm text-gold hover:text-gold-light tracking-wider uppercase transition-colors"
          >
            <span>Reservar Experiencia Completa</span>
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
              <path d="M1 5H15M11 1L15 5L11 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
});

export default MenuSection;
