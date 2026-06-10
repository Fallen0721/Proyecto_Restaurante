import { useEffect } from 'react';
import DeliverySection from '../components/delivery/DeliverySection';

function DeliveryPage() {
  useEffect(() => {
    document.title = "Tony's Mar — Delivery";
  }, []);

  return <DeliverySection />;
}

export default DeliveryPage;
