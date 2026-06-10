import React from 'react';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';

const ScrollIndicator = React.memo(function ScrollIndicator() {
  const { scrollTo } = useSmoothScroll();

  return (
    <button
      onClick={() => scrollTo('#destacados')}
      aria-label="Desplazarse hacia abajo"
      data-cursor="expand"
      className="flex flex-col items-center gap-2 text-cream/60 hover:text-gold transition-colors duration-300 group"
    >
      <span className="font-body text-xs tracking-[0.25em] uppercase">
        Descubrir
      </span>
      {/* Contenedor del scroll animado */}
      <div className="w-5 h-8 border border-current rounded-full flex items-start justify-center p-1">
        <div className="w-1 h-1.5 bg-current rounded-full animate-bounce-arrow" />
      </div>
    </button>
  );
});

export default ScrollIndicator;
