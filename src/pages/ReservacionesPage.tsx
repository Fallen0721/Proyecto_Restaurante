import { useEffect } from 'react';
import ReservationSection from '../components/reservation/ReservationSection';

function ReservacionesPage() {
  useEffect(() => {
    document.title = "Tony's Mar — Reservaciones";
  }, []);

  return <ReservationSection />;
}

export default ReservacionesPage;
