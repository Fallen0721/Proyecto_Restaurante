import React, { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { GalleryImage } from '../../types/gallery.types';

gsap.registerPlugin(ScrollTrigger);

interface GalleryGridProps {
  images: GalleryImage[];
  onImageClick: (index: number) => void;
}

const GalleryGrid = React.memo(function GalleryGrid({
  images,
  onImageClick,
}: GalleryGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const items = gridRef.current.querySelectorAll('.gallery-item');
    const ctx = gsap.context(() => {
      items.forEach((item, i) => {
        gsap.fromTo(
          item,
          { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
          {
            clipPath: 'inset(0% 0 0 0)',
            opacity: 1,
            duration: 0.9,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 90%',
              once: true,
            },
            delay: (i % 3) * 0.1,
          }
        );
      });
    }, gridRef);

    return () => ctx.revert();
  }, [images]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onImageClick(index);
      }
    },
    [onImageClick]
  );

  return (
    <div
      ref={gridRef}
      className="columns-2 md:columns-3 gap-3 md:gap-4"
    >
      {images.map((image, index) => (
        <div
          key={image.id}
          className="gallery-item break-inside-avoid mb-3 md:mb-4 relative group cursor-pointer overflow-hidden"
          onClick={() => onImageClick(index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          role="button"
          tabIndex={0}
          data-cursor="expand"
          aria-label={`Ver imagen: ${image.alt}`}
          style={{ clipPath: 'inset(100% 0 0 0)', opacity: 0 }}
        >
          <img
            src={image.src}
            alt={image.alt}
            loading="lazy"
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            data-speed={image.speed}
          />

          {/* Overlay al hover */}
          <div className="absolute inset-0 bg-charcoal-deep/0 group-hover:bg-charcoal-deep/50 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-gold/60 p-3">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 10H17M10 3V17" stroke="#D4A574" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Categoría badge */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-charcoal-deep/70 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p className="font-body text-xs text-cream/80">{image.alt}</p>
          </div>
        </div>
      ))}
    </div>
  );
});

export default GalleryGrid;
