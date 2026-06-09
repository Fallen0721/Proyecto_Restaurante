import React, { useState, useCallback } from 'react';
import SectionTitle from '../ui/SectionTitle';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { menuData } from '../../data/menuData';
import DeliveryModal from './DeliveryModal';

interface CartItem {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
}

interface DeliveryForm {
  name: string;
  phone: string;
  address: string;
  notes: string;
  errors: {
    name?: string;
    phone?: string;
    address?: string;
  };
}

const categoryLabels: Record<string, string> = {
  all: 'Todo',
  entrada: 'Entradas',
  principal: 'Principales',
  postre: 'Postres',
};

const MINIMUM_ORDER = 25;

const DeliverySection = React.memo(function DeliverySection() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [form, setForm] = useState<DeliveryForm>({
    name: '',
    phone: '',
    address: '',
    notes: '',
    errors: {},
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const filteredDishes =
    activeCategory === 'all'
      ? menuData
      : menuData.filter((d) => d.category === activeCategory);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = useCallback((dishId: string) => {
    const dish = menuData.find((d) => d.id === dishId)!;
    setCart((prev) => {
      const existing = prev.find((i) => i.dishId === dishId);
      if (existing) {
        return prev.map((i) =>
          i.dishId === dishId ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { dishId, name: dish.name, price: dish.price, quantity: 1 }];
    });
  }, []);

  const decreaseFromCart = useCallback((dishId: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.dishId === dishId);
      if (existing && existing.quantity > 1) {
        return prev.map((i) =>
          i.dishId === dishId ? { ...i, quantity: i.quantity - 1 } : i,
        );
      }
      return prev.filter((i) => i.dishId !== dishId);
    });
  }, []);

  const removeFromCart = useCallback((dishId: string) => {
    setCart((prev) => prev.filter((i) => i.dishId !== dishId));
  }, []);

  const updateField = useCallback(
    (field: keyof Omit<DeliveryForm, 'errors'>, value: string) => {
      setForm((prev) => ({
        ...prev,
        [field]: value,
        errors: { ...prev.errors, [field]: undefined },
      }));
    },
    [],
  );

  const validate = useCallback((): boolean => {
    const errors: DeliveryForm['errors'] = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      errors.name = 'Introduce tu nombre completo';
    if (!form.phone || !/^[+]?[\d\s\-()]{9,}$/.test(form.phone.replace(/\s/g, '')))
      errors.phone = 'Introduce un teléfono válido';
    if (!form.address.trim() || form.address.trim().length < 10)
      errors.address = 'Introduce la dirección completa';
    setForm((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  }, [form]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (cart.length === 0 || cartTotal < MINIMUM_ORDER) return;
      if (!validate()) return;

      setIsSubmitting(true);
      await new Promise((r) => setTimeout(r, 1500));
      const num = 'DEL-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      setOrderNumber(num);
      setIsSubmitting(false);
      setIsModalOpen(true);
    },
    [cart, cartTotal, validate],
  );

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setCart([]);
    setForm({ name: '', phone: '', address: '', notes: '', errors: {} });
  }, []);

  return (
    <section
      id="delivery"
      className="relative section-padding bg-charcoal-deep overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-gold/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-terracotta/5 rounded-full blur-2xl" />
      </div>

      <div className="section-container relative">
        <SectionTitle
          label="Pedidos a Domicilio"
          title="Tu Mesa en Casa"
          subtitle="Disfruta de nuestra cocina en la comodidad de tu hogar. Entrega en 45–60 minutos dentro de Madrid capital."
          className="mb-12"
        />

        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-12 items-start">
          {/* Menú para pedir */}
          <div>
            {/* Filtros de categoría */}
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.entries(categoryLabels).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setActiveCategory(value)}
                  className={[
                    'px-4 py-1.5 text-xs font-body tracking-widest uppercase transition-all duration-200',
                    activeCategory === value
                      ? 'text-gold border-b border-gold'
                      : 'text-warmgray hover:text-cream',
                  ].join(' ')}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Grid de platos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredDishes.map((dish) => {
                const cartItem = cart.find((i) => i.dishId === dish.id);
                return (
                  <div
                    key={dish.id}
                    className="bg-charcoal-light/30 border border-gold/10 overflow-hidden group"
                  >
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {dish.isSignature && (
                        <span className="absolute top-2 left-2 bg-gold/90 text-charcoal-deep text-[10px] font-body tracking-widest px-2 py-0.5">
                          FIRMA
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-display text-sm text-cream leading-tight">
                          {dish.name}
                        </h4>
                        <span className="font-body text-gold text-sm flex-shrink-0">
                          {dish.price}€
                        </span>
                      </div>
                      <p className="font-body text-[11px] text-warmgray leading-relaxed mb-3 line-clamp-2">
                        {dish.description}
                      </p>

                      {cartItem ? (
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => decreaseFromCart(dish.id)}
                            className="w-7 h-7 border border-gold/30 text-gold flex items-center justify-center hover:bg-gold/10 transition-colors text-base leading-none"
                          >
                            −
                          </button>
                          <span className="font-body text-sm text-cream w-8 text-center">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => addToCart(dish.id)}
                            className="w-7 h-7 border border-gold/30 text-gold flex items-center justify-center hover:bg-gold/10 transition-colors text-base leading-none"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(dish.id)}
                          className="w-full py-1.5 text-xs font-body tracking-widest text-gold border border-gold/30 hover:bg-gold/10 transition-all duration-200"
                        >
                          Añadir al pedido
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Carrito + formulario */}
          <div className="lg:sticky lg:top-24">
            {/* Carrito */}
            <div className="bg-charcoal-light/30 border border-gold/10 p-6 mb-4">
              <h3 className="font-display text-xl text-cream mb-4 flex items-center justify-between">
                Tu Pedido
                {cartCount > 0 && (
                  <span className="bg-gold text-charcoal-deep text-xs font-body px-2 py-0.5 min-w-[20px] text-center">
                    {cartCount}
                  </span>
                )}
              </h3>

              {cart.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="font-body text-sm text-warmgray/60">
                    Añade platos para comenzar tu pedido
                  </p>
                  <p className="font-body text-xs text-warmgray/40 mt-1">
                    Mínimo {MINIMUM_ORDER}€
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-3 mb-4 max-h-48 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.dishId} className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-xs text-cream truncate">
                            {item.name}
                          </p>
                          <p className="font-body text-[11px] text-warmgray">
                            {item.price}€ × {item.quantity}
                          </p>
                        </div>
                        <span className="font-body text-xs text-gold flex-shrink-0 w-10 text-right">
                          {item.price * item.quantity}€
                        </span>
                        <button
                          onClick={() => removeFromCart(item.dishId)}
                          className="text-warmgray/40 hover:text-cream transition-colors text-sm leading-none flex-shrink-0"
                          aria-label={`Eliminar ${item.name}`}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-charcoal-light pt-3">
                    <div className="flex justify-between mb-1">
                      <span className="font-body text-sm text-warmgray">Total</span>
                      <span className="font-body text-sm text-gold font-medium">
                        {cartTotal}€
                      </span>
                    </div>
                    {cartTotal < MINIMUM_ORDER && (
                      <p className="font-body text-[10px] text-terracotta mt-1">
                        Pedido mínimo {MINIMUM_ORDER}€ · Faltan {MINIMUM_ORDER - cartTotal}€
                      </p>
                    )}
                    {cartTotal >= 50 && (
                      <p className="font-body text-[10px] text-gold/70 mt-1">
                        ✓ Envío gratuito aplicado
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Formulario de envío */}
            <div className="bg-charcoal-light/30 border border-gold/10 p-6">
              <h3 className="font-display text-xl text-cream mb-4">Datos de Envío</h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                <Input
                  label="Nombre completo"
                  type="text"
                  value={form.name}
                  error={form.errors.name}
                  autoComplete="name"
                  onChange={(e) => updateField('name', e.target.value)}
                />
                <Input
                  label="Teléfono"
                  type="tel"
                  value={form.phone}
                  error={form.errors.phone}
                  autoComplete="tel"
                  onChange={(e) => updateField('phone', e.target.value)}
                />
                <Input
                  label="Dirección completa"
                  type="text"
                  value={form.address}
                  error={form.errors.address}
                  autoComplete="street-address"
                  onChange={(e) => updateField('address', e.target.value)}
                />
                <Input
                  label="Notas para el repartidor (opcional)"
                  type="text"
                  value={form.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                />

                <p className="font-body text-[11px] text-warmgray/60 leading-relaxed">
                  Entrega en 45–60 min · Madrid capital · Envío gratuito desde 50€
                </p>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isSubmitting}
                  disabled={cart.length === 0 || cartTotal < MINIMUM_ORDER}
                  className="mt-1"
                >
                  {isSubmitting ? 'Procesando pedido...' : 'Confirmar Pedido'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <DeliveryModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        orderNumber={orderNumber}
        items={cart}
        total={cartTotal}
        address={form.address}
        name={form.name}
      />
    </section>
  );
});

export default DeliverySection;
