import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

import type { Dish } from '../../types/menu.types';
import DishCard from './DishCard';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface MenuCarouselProps {
  dishes: Dish[];
}

const MenuCarousel = React.memo(function MenuCarousel({ dishes }: MenuCarouselProps) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isTablet = useMediaQuery('(min-width: 768px)');

  const slidesPerView = isDesktop ? 2.5 : isTablet ? 2 : 1;

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination, EffectCoverflow, Autoplay]}
        slidesPerView={slidesPerView}
        spaceBetween={30}
        centeredSlides={isDesktop}
        effect={isDesktop ? 'coverflow' : 'slide'}
        coverflowEffect={{
          rotate: 5,
          stretch: 0,
          depth: 80,
          modifier: 1,
          slideShadows: false,
        }}
        autoplay={{ delay: 4000, disableOnInteraction: true, pauseOnMouseEnter: true }}
        pagination={{ clickable: true, el: '.swiper-custom-pagination' }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper: SwiperType) => {
          if (
            swiper.params.navigation &&
            typeof swiper.params.navigation !== 'boolean'
          ) {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }
        }}
        className="pb-12"
      >
        {dishes.map((dish) => (
          <SwiperSlide key={dish.id} className="h-auto">
            <DishCard dish={dish} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Paginación personalizada */}
      <div className="swiper-custom-pagination flex justify-center gap-2 mt-6" />

      {/* Botones de navegación personalizados */}
      <button
        ref={prevRef}
        aria-label="Plato anterior"
        className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-6 z-10 w-12 h-12 rounded-full bg-charcoal-light border border-gold/30 text-gold hover:bg-gold hover:text-charcoal-deep transition-all duration-300 flex items-center justify-center shadow-lg"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        ref={nextRef}
        aria-label="Plato siguiente"
        className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-6 z-10 w-12 h-12 rounded-full bg-charcoal-light border border-gold/30 text-gold hover:bg-gold hover:text-charcoal-deep transition-all duration-300 flex items-center justify-center shadow-lg"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
});

export default MenuCarousel;
