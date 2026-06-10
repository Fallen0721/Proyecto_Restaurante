import { useEffect } from 'react';
import MissionVisionSection from '../components/mission-vision/MissionVisionSection';

function NosotrosPage() {
  useEffect(() => {
    document.title = "Tony's Mar — Nosotros";
  }, []);

  return <MissionVisionSection />;
}

export default NosotrosPage;
