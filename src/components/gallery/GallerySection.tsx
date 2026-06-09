import React, { useState, useCallback } from 'react';
import SectionTitle from '../ui/SectionTitle';
import GalleryGrid from './GalleryGrid';
import Lightbox from './Lightbox';
import { galleryData } from '../../data/galleryData';
import type { GalleryImage } from '../../types/gallery.types';

const categories: { value: GalleryImage['category'] | 'all'; label: string }[] = [
  { value: 'all', label: 'Todo' },
  { value: 'platos', label: 'Platos' },
  { value: 'ambiente', label: 'Ambiente' },
  { value: 'cocina', label: 'Cocina' },
  { value: 'equipo', label: 'Equipo' },
];

const GallerySection = React.memo(function GallerySection() {
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredImages =
    activeCategory === 'all'
      ? galleryData
      : galleryData.filter((img) => img.category === activeCategory);

  const handleImageClick = useCallback((index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsLightboxOpen(false);
  }, []);

  const handleNext = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % filteredImages.length);
  }, [filteredImages.length]);

  const handlePrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === 0 ? filteredImages.length - 1 : prev - 1
    );
  }, [filteredImages.length]);

  return (
    <section
      id="galeria"
      className="relative section-padding bg-charcoal-deep overflow-hidden"
    >
      <div className="section-container">
        <SectionTitle
          label="Galería"
          title="Momentos Únicos"
          subtitle="Cada imagen captura la esencia de lo que somos: pasión, precisión y belleza efímera."
          className="mb-10"
        />

        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              data-cursor="expand"
              className={[
                'px-4 py-1.5 text-xs font-body tracking-widest uppercase transition-all duration-200',
                activeCategory === cat.value
                  ? 'text-gold border-b border-gold'
                  : 'text-warmgray hover:text-cream',
              ].join(' ')}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid masonry */}
        <GalleryGrid images={filteredImages} onImageClick={handleImageClick} />

        {/* CTA Instagram */}
        <div className="mt-12 text-center">
          <p className="font-body text-sm text-warmgray mb-3">
            Síguenos para más momentos
          </p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="expand"
            className="inline-flex items-center gap-2 font-body text-sm text-gold hover:text-gold-light tracking-wider transition-colors"
            aria-label="Seguir en Instagram"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
            @tonysmar
          </a>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        images={filteredImages}
        currentIndex={lightboxIndex}
        isOpen={isLightboxOpen}
        onClose={handleClose}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </section>
  );
});

export default GallerySection;
