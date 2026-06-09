import React, { useState, useMemo } from 'react';
import SectionTitle from '../ui/SectionTitle';
import MenuCarousel from './MenuCarousel';
import { menuData, menuCategories } from '../../data/menuData';
import type { Dish } from '../../types/menu.types';

const MenuSection = React.memo(function MenuSection() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredDishes = useMemo<Dish[]>(() => {
    if (activeCategory === 'all') return menuData;
    return menuData.filter((dish) => dish.category === activeCategory);
  }, [activeCategory]);

  return (
    <section id="menu" className="relative section-padding bg-charcoal-deep overflow-hidden">
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
          label="Temporada Otoño-Invierno"
          title="Nuestra Carta"
          subtitle="Platos concebidos como obras de arte efímeras, donde cada bocado cuenta una historia."
          className="mb-12"
        />

        {/* Filtros de categoría */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {menuCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.value)}
              data-cursor="expand"
              className={[
                'px-5 py-2 text-sm font-body tracking-wider transition-all duration-300',
                activeCategory === cat.value
                  ? 'bg-gold text-charcoal-deep shadow-[0_0_20px_rgba(212,165,116,0.3)]'
                  : 'bg-charcoal-light text-warmgray border border-charcoal hover:border-gold/40 hover:text-cream',
              ].join(' ')}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Carrusel */}
        <div className="relative px-6 md:px-8">
          <MenuCarousel dishes={filteredDishes} />
        </div>

        {/* CTA ver carta completa */}
        <div className="mt-12 text-center">
          <p className="font-body text-warmgray text-sm mb-4">
            Ofrecemos menú degustación de 7 pasos bajo reserva previa
          </p>
          <a
            href="#reservacion"
            className="inline-flex items-center gap-2 font-body text-sm text-gold hover:text-gold-light tracking-wider uppercase transition-colors"
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
