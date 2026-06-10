import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface CartItem {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
}

type PaymentMethod = 'tarjeta' | 'efectivo';

interface DeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  address: string;
  name: string;
  paymentMethod: PaymentMethod | null;
  cashGiven?: number;
  change?: number;
}

const paymentLabel: Record<PaymentMethod, string> = {
  tarjeta: '💳 Tarjeta (simulado)',
  efectivo: '💵 Efectivo al recibir',
};

const DeliveryModal = React.memo(function DeliveryModal({
  isOpen,
  onClose,
  orderNumber,
  items,
  subtotal,
  shipping,
  total,
  address,
  name,
  paymentMethod,
  cashGiven,
  change,
}: DeliveryModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-md">
      <div className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-gold flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M5 14L11 20L23 8"
              stroke="#D4A574"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h3 className="font-display text-2xl text-cream mb-2">
          ¡Pedido Confirmado!
        </h3>
        <p className="font-body text-warmgray text-sm mb-6">
          Tu pedido está en camino. Tiempo estimado: 45–60 minutos.
        </p>

        <div className="bg-charcoal-deep border border-gold/20 p-4 mb-6 font-mono">
          <p className="text-xs text-warmgray mb-1 font-body">Número de pedido</p>
          <p className="text-gold text-lg tracking-widest">{orderNumber}</p>
        </div>

        <div className="text-left mb-6">
          <div className="bg-charcoal/50 p-4 mb-3">
            <p className="font-body text-[10px] text-warmgray tracking-wider uppercase mb-2">
              Resumen del Pedido
            </p>
            <div className="flex flex-col gap-1">
              {items.map((item) => (
                <div key={item.dishId} className="flex justify-between">
                  <span className="font-body text-xs text-cream">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-body text-xs text-gold">
                    L{item.price * item.quantity}
                  </span>
                </div>
              ))}
              <div className="flex justify-between border-t border-charcoal-light mt-2 pt-2">
                <span className="font-body text-xs text-warmgray">Subtotal</span>
                <span className="font-body text-xs text-cream">L{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-body text-xs text-warmgray">Envío</span>
                <span className="font-body text-xs text-cream">
                  {shipping === 0 ? 'Gratis' : `L${shipping}`}
                </span>
              </div>
              <div className="flex justify-between mt-1 pt-1 border-t border-charcoal-light/60">
                <span className="font-body text-xs text-warmgray">Total</span>
                <span className="font-body text-xs text-gold font-medium">L{total}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-charcoal/50 p-3">
              <p className="font-body text-[10px] text-warmgray tracking-wider uppercase mb-1">
                Nombre
              </p>
              <p className="font-body text-xs text-cream">{name}</p>
            </div>
            <div className="bg-charcoal/50 p-3">
              <p className="font-body text-[10px] text-warmgray tracking-wider uppercase mb-1">
                Dirección
              </p>
              <p className="font-body text-xs text-cream truncate">{address}</p>
            </div>
          </div>

          <div className="bg-charcoal/50 p-3">
            <p className="font-body text-[10px] text-warmgray tracking-wider uppercase mb-1">
              Método de pago
            </p>
            <p className="font-body text-xs text-cream">
              {paymentMethod ? paymentLabel[paymentMethod] : '—'}
            </p>
            {paymentMethod === 'efectivo' &&
              cashGiven !== undefined &&
              change !== undefined && (
                <p className="font-body text-[11px] text-gold/80 mt-1">
                  Pagas con L{cashGiven.toFixed(2)} · Cambio: L{change.toFixed(2)}
                </p>
              )}
          </div>
        </div>

        <Button variant="primary" fullWidth onClick={onClose}>
          ¡Perfecto, a esperar!
        </Button>
      </div>
    </Modal>
  );
});

export default DeliveryModal;
