import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/layout/ScrollToTop';
import Preloader from './components/ui/Preloader';
import HomePage from './pages/HomePage';
import NosotrosPage from './pages/NosotrosPage';
import PlatillosPage from './pages/PlatillosPage';
import DeliveryPage from './pages/DeliveryPage';
import ReservacionesPage from './pages/ReservacionesPage';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      {!loading && (
        <>
          <ScrollToTop />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/nosotros" element={<NosotrosPage />} />
              <Route path="/platillos" element={<PlatillosPage />} />
              <Route path="/delivery" element={<DeliveryPage />} />
              <Route path="/reservaciones" element={<ReservacionesPage />} />
              {/* Cualquier ruta desconocida cae en Inicio */}
              <Route path="*" element={<HomePage />} />
            </Route>
          </Routes>
        </>
      )}
    </>
  );
}

export default App;
