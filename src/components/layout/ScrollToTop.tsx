import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Vuelve al inicio de la página cada vez que cambia la ruta.
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

export default ScrollToTop;
