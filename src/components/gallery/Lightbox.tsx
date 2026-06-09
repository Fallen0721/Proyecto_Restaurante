import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import type { GalleryImage } from '../../types/gallery.types';

interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const Lightbox = React.memo(function Lightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
}: LightboxProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!overlayRef.current) return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.5)', delay: 0.1 }
        );
      }
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, currentIndex]);

  // Animación de cambio de imagen
  const animateImageChange = useCallback((direction: 'next' | 'prev') => {
    if (!imageRef.current) return;
    const xFrom = direction === 'next' ? 60 : -60;
    gsap.fromTo(
      imageRef.current,
      { opacity: 0, x: xFrom },
      { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }
    );
  }, []);

  const handleNext = useCallback(() => {
    onNext();
    animateImageChange('next');
  }, [onNext, animateImageChange]);

  const handlePrev = useCallback(() => {
    onPrev();
    animateImageChange('prev');
  }, [onPrev, animateImageChange]);

  // Atajos de teclado
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen) return null;

  const currentImage = images[currentIndex];

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-charcoal-deep/95 backdrop-blur-xl"
      onClick={onClose}
    >
      {/* Contenedor de imagen */}
      <div
        className="relative max-w-5xl max-h-[90vh] w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          ref={imageRef}
          src={currentImage?.src}
          alt={currentImage?.alt}
          className="w-full h-full object-contain rounded-sm max-h-[80vh]"
          style={{ willChange: 'transform, opacity' }}
        />

        {/* Pie de foto */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-charcoal-deep/80 to-transparent">
          <p className="font-body text-sm text-cream/80">{currentImage?.alt}</p>
          <p className="font-body text-xs text-warmgray">
            {currentIndex + 1} / {images.length}
          </p>
        </div>
      </div>

      {/* Botón cerrar */}
      <button
        ref={closeBtnRef}
        onClick={onClose}
        aria-label="Cerrar galería"
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-cream/70 hover:text-gold border border-cream/20 hover:border-gold rounded-full transition-all duration-200 group"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="transition-transform duration-300 group-hover:rotate-90"
        >
          <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Navegación */}
      <button
        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
        aria-label="Imagen anterior"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-cream/70 hover:text-gold border border-cream/20 hover:border-gold rounded-full transition-all duration-200"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); handleNext(); }}
        aria-label="Imagen siguiente"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-cream/70 hover:text-gold border border-cream/20 hover:border-gold rounded-full transition-all duration-200"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Indicadores de posición */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, i) => (
          <span
            key={i}
            className={['w-1.5 h-1.5 rounded-full transition-all duration-200', i === currentIndex ? 'bg-gold w-4' : 'bg-warmgray/40'].join(' ')}
          />
        ))}
      </div>
    </div>,
    document.body
  );
});

export default Lightbox;
