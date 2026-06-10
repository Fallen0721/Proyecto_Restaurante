import React, { useRef } from 'react';
import gsap from 'gsap';
import type { Dish } from '../../types/menu.types';
import Badge from '../ui/Badge';

interface DishCardProps {
  dish: Dish;
}

const DishCard = React.memo(function DishCard({ dish }: DishCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -6,
      boxShadow: '0 20px 60px rgba(212, 165, 116, 0.2)',
      duration: 0.3,
      ease: 'power2.out',
    });
    gsap.to(imageRef.current, {
      scale: 1.05,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      boxShadow: '0 0 0 rgba(212, 165, 116, 0)',
      duration: 0.4,
      ease: 'power2.out',
    });
    gsap.to(imageRef.current, {
      scale: 1,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-cursor="expand"
      className="relative bg-charcoal-light border border-gold/10 overflow-hidden cursor-default h-full"
      style={{ willChange: 'transform, box-shadow' }}
    >
      {/* Imagen con recorte asimétrico */}
      <div className="relative overflow-hidden h-64 md:h-72 rounded-tl-[60px] rounded-br-[80px]">
        <div
          ref={imageRef}
          className="w-full h-full"
          style={{ willChange: 'transform' }}
        >
          <img
            src={dish.image}
            alt={dish.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-light/80 to-transparent" />

        {/* Badge signature */}
        {dish.isSignature && (
          <div className="absolute top-4 right-4">
            <Badge variant="gold">Firma del Chef</Badge>
          </div>
        )}

        {/* Categoría */}
        <div className="absolute bottom-4 left-4">
          <Badge variant="terracotta">
            {dish.category.charAt(0).toUpperCase() + dish.category.slice(1)}
          </Badge>
        </div>
      </div>

      {/* Información del plato */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-display text-xl text-cream leading-tight flex-1 pr-4">
            {dish.name}
          </h3>
          <span className="font-display text-xl text-gold whitespace-nowrap">
            L{dish.price}
          </span>
        </div>

        <p className="font-body text-sm text-warmgray leading-relaxed mb-4">
          {dish.description}
        </p>

        {/* Ingredientes */}
        <div className="flex flex-wrap gap-1.5">
          {dish.ingredients.slice(0, 4).map((ingredient) => (
            <Badge key={ingredient} variant="dark">
              {ingredient}
            </Badge>
          ))}
          {dish.ingredients.length > 4 && (
            <Badge variant="outline">+{dish.ingredients.length - 4}</Badge>
          )}
        </div>
      </div>
    </div>
  );
});

export default DishCard;
