import { useEffect } from 'react';
import MenuSection from '../components/menu/MenuSection';

function PlatillosPage() {
  useEffect(() => {
    document.title = "Tony's Mar — Platillos";
  }, []);

  return <MenuSection />;
}

export default PlatillosPage;
