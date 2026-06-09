import React, { useState, lazy, Suspense } from 'react';
import Layout from './components/layout/Layout';
import Preloader from './components/ui/Preloader';
import CustomCursor from './components/cursor/CustomCursor';
import HeroSection from './components/hero/HeroSection';
import MissionVisionSection from './components/mission-vision/MissionVisionSection';

// Lazy loading para secciones debajo del fold
const MenuSection = lazy(() => import('./components/menu/MenuSection'));
const ReservationSection = lazy(
  () => import('./components/reservation/ReservationSection')
);
const DeliverySection = lazy(() => import('./components/delivery/DeliverySection'));
const GallerySection = lazy(() => import('./components/gallery/GallerySection'));

function SectionSkeleton() {
  return (
    <div className="section-padding flex items-center justify-center bg-charcoal">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        <span className="font-body text-xs text-warmgray tracking-widest uppercase">
          Cargando...
        </span>
      </div>
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Preloader onComplete={() => setLoading(false)} />
      <CustomCursor />
      {!loading && (
        <Layout>
          <HeroSection />
          <MissionVisionSection />
          <Suspense fallback={<SectionSkeleton />}>
            <MenuSection />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <ReservationSection />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <DeliverySection />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <GallerySection />
          </Suspense>
        </Layout>
      )}
    </>
  );
}

export default App;
