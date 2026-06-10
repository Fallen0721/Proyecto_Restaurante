import { useEffect } from 'react';
import HeroSection from '../components/hero/HeroSection';

function HomePage() {
  useEffect(() => {
    document.title = "Tony's Mar — Inicio";
  }, []);

  return <HeroSection />;
}

export default HomePage;
