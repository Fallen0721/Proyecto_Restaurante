import { useState } from 'react';
import Layout from './components/layout/Layout';
import Preloader from './components/ui/Preloader';
import HeroSection from './components/hero/HeroSection';
import MissionVisionSection from './components/mission-vision/MissionVisionSection';
import MenuSection from './components/menu/MenuSection';
import DeliverySection from './components/delivery/DeliverySection';
import ReservationSection from './components/reservation/ReservationSection';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      {!loading && (
        <Layout>
          <HeroSection />
          <MissionVisionSection />
          <MenuSection />
          <DeliverySection />
          <ReservationSection />
        </Layout>
      )}
    </>
  );
}

export default App;
