import React, { useState, useCallback, useMemo } from 'react';
import { FiCreditCard, FiDollarSign, FiMapPin } from 'react-icons/fi';
import SectionTitle from '../ui/SectionTitle';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { menuData, menuCategories } from '../../data/menuData';
import { branches, branchById } from '../../data/branchesData';
import type { CityId } from '../../types/reservation.types';
import DeliveryModal from './DeliveryModal';

interface CartItem {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
}

type PaymentMethod = 'tarjeta' | 'efectivo';

interface DeliveryForm {
  name: string;
  phone: string;
  zone: string;
  address: string;
  notes: string;
  errors: {
    name?: string;
    phone?: string;
    zone?: string;
    address?: string;
  };
}

interface CardForm {
  number: string;
  holder: string;
  expiry: string;
  cvv: string;
}

const MINIMUM_ORDER = 600;
const FREE_SHIPPING_THRESHOLD = 1200;
const SHIPPING_COST = 100;

const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
};

const formatExpiry = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const DeliverySection = React.memo(function DeliverySection() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [city, setCity] = useState<CityId>('sps');
  const [form, setForm] = useState<DeliveryForm>({
    name: '',
    phone: '',
    zone: '',
    address: '',
    notes: '',
    errors: {},
  });
  const branch = branchById(city);
  const [payment, setPayment] = useState<PaymentMethod | null>(null);
  const [card, setCard] = useState<CardForm>({
    number: '',
    holder: '',
    expiry: '',
    cvv: '',
  });
  const [cashGiven, setCashGiven] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const filteredDishes = useMemo(
    () =>
      activeCategory === 'all'
        ? menuData
        : menuData.filter((d) => d.category === activeCategory),
    [activeCategory],
  );

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const hasItems = cart.length > 0;
  const reachesMinimum = subtotal >= MINIMUM_ORDER;
  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = !hasItems || freeShipping ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const cashGivenNum = parseFloat(cashGiven.replace(',', '.'));
  const cashIsValid = !Number.isNaN(cashGivenNum) && cashGiven.trim() !== '';
  const change = cashIsValid ? cashGivenNum - total : 0;
  const cashShort = cashIsValid && change < 0;

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

  const updateCard = useCallback((field: keyof CardForm, value: string) => {
    setCard((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Cambiar de sucursal invalida la zona elegida (cada ciudad cubre otras colonias).
  const changeCity = useCallback((next: CityId) => {
    setCity(next);
    setForm((prev) => ({
      ...prev,
      zone: '',
      errors: { ...prev.errors, zone: undefined },
    }));
  }, []);

  const zoneOptions = useMemo(
    () => branch.zones.map((z) => ({ value: z, label: z })),
    [branch],
  );

  // Validez en vivo para habilitar/deshabilitar el botón
  const contactValid = useMemo(() => {
    const nameOk = form.name.trim().length >= 2;
    const phoneOk = /^[+]?[\d\s\-()]{9,}$/.test(form.phone.replace(/\s/g, ''));
    const zoneOk = form.zone.trim() !== '';
    const addressOk = form.address.trim().length >= 10;
    return nameOk && phoneOk && zoneOk && addressOk;
  }, [form.name, form.phone, form.zone, form.address]);

  const cardComplete = useMemo(() => {
    const numberOk = card.number.replace(/\D/g, '').length >= 15;
    const holderOk = card.holder.trim().length >= 3;
    const expiryOk = /^\d{2}\/\d{2}$/.test(card.expiry);
    const cvvOk = /^\d{3,4}$/.test(card.cvv);
    return numberOk && holderOk && expiryOk && cvvOk;
  }, [card]);

  const paymentValid = payment === 'efectivo' || (payment === 'tarjeta' && cardComplete);

  const canConfirm =
    hasItems && reachesMinimum && contactValid && payment !== null && paymentValid;

  const validate = useCallback((): boolean => {
    const errors: DeliveryForm['errors'] = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      errors.name = 'Introduce tu nombre completo';
    if (!form.phone || !/^[+]?[\d\s\-()]{9,}$/.test(form.phone.replace(/\s/g, '')))
      errors.phone = 'Introduce un teléfono válido';
    if (!form.zone.trim())
      errors.zone = `Elige tu zona de entrega en ${branch.city}`;
    if (!form.address.trim() || form.address.trim().length < 10)
      errors.address = 'Introduce la dirección completa';
    setForm((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  }, [form, branch.city]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!canConfirm) return;
      if (!validate()) return;

      setIsSubmitting(true);
      await new Promise((r) => setTimeout(r, 1500));
      const num = 'DEL-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      setOrderNumber(num);
      setIsSubmitting(false);
      setIsModalOpen(true);
    },
    [canConfirm, validate],
  );

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setCart([]);
    setForm({ name: '', phone: '', zone: '', address: '', notes: '', errors: {} });
    setPayment(null);
    setCard({ number: '', holder: '', expiry: '', cvv: '' });
    setCashGiven('');
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
          subtitle={`Disfruta de nuestra cocina en la comodidad de tu hogar. Entrega en 45–60 minutos dentro de ${branch.city}.`}
          className="mb-12"
        />

        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-12 items-start">
          {/* Menú para pedir */}
          <div>
            {/* Filtros de categoría (derivados de menuCategories) */}
            <div className="flex flex-wrap gap-2 mb-6">
              {menuCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.value)}
                  className={[
                    'min-h-[44px] px-4 py-2 text-xs font-body tracking-widest uppercase transition-all duration-200',
                    activeCategory === cat.value
                      ? 'text-gold border-b border-gold'
                      : 'text-warmgray hover:text-cream',
                  ].join(' ')}
                >
                  {cat.label}
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
                          L{dish.price}
                        </span>
                      </div>
                      <p className="font-body text-[11px] text-warmgray leading-relaxed mb-3 line-clamp-2">
                        {dish.description}
                      </p>

                      {cartItem ? (
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => decreaseFromCart(dish.id)}
                            aria-label={`Quitar una unidad de ${dish.name}`}
                            className="w-11 h-11 border border-gold/30 text-gold flex items-center justify-center hover:bg-gold/10 transition-colors text-xl leading-none"
                          >
                            −
                          </button>
                          <span className="font-body text-sm text-cream w-10 text-center">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => addToCart(dish.id)}
                            aria-label={`Añadir una unidad de ${dish.name}`}
                            className="w-11 h-11 border border-gold/30 text-gold flex items-center justify-center hover:bg-gold/10 transition-colors text-xl leading-none"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(dish.id)}
                          className="w-full min-h-[44px] py-2 text-xs font-body tracking-widest text-gold border border-gold/30 hover:bg-gold/10 transition-all duration-200"
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
                    Mínimo L{MINIMUM_ORDER}
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
                            L{item.price} × {item.quantity}
                          </p>
                        </div>
                        <span className="font-body text-xs text-gold flex-shrink-0 w-12 text-right">
                          L{item.price * item.quantity}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.dishId)}
                          className="w-11 h-11 flex items-center justify-center text-warmgray/40 hover:text-cream transition-colors text-sm leading-none flex-shrink-0"
                          aria-label={`Eliminar ${item.name}`}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-charcoal-light pt-3 flex flex-col gap-1">
                    <div className="flex justify-between">
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
                      <span className="font-body text-sm text-warmgray">Total</span>
                      <span className="font-body text-sm text-gold font-medium">
                        L{total}
                      </span>
                    </div>
                    {!reachesMinimum && (
                      <p className="font-body text-[10px] text-terracotta mt-1">
                        Pedido mínimo L{MINIMUM_ORDER} · Faltan L{MINIMUM_ORDER - subtotal}
                      </p>
                    )}
                    {freeShipping && (
                      <p className="font-body text-[10px] text-gold/70 mt-1">
                        ✓ Envío gratuito aplicado
                      </p>
                    )}
                    {!freeShipping && hasItems && (
                      <p className="font-body text-[10px] text-warmgray/50 mt-1">
                        Envío gratis desde L{FREE_SHIPPING_THRESHOLD} · Faltan{' '}
                        L{FREE_SHIPPING_THRESHOLD - subtotal}
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
                {/* Selector de sucursal / ciudad */}
                <div>
                  <p className="font-body text-[11px] text-warmgray tracking-wider uppercase mb-3">
                    Sucursal de entrega
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {branches.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => changeCity(b.id)}
                        aria-pressed={city === b.id}
                        className={[
                          'min-h-[56px] flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-sm border transition-all duration-200',
                          city === b.id
                            ? 'border-gold bg-gold/10 text-gold'
                            : 'border-charcoal text-warmgray hover:border-gold/40 hover:text-cream',
                        ].join(' ')}
                      >
                        <FiMapPin className="text-lg" aria-hidden="true" />
                        <span className="font-body text-xs tracking-wide">
                          {b.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mapa de la sucursal seleccionada */}
                <div className="overflow-hidden rounded-sm border border-gold/10">
                  <iframe
                    key={branch.id}
                    title={`Mapa de ${branch.city}`}
                    src={branch.mapSrc}
                    className="w-full h-40 grayscale-[0.3] contrast-[1.05]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <p className="font-body text-[11px] text-warmgray bg-charcoal/40 px-3 py-2 leading-relaxed">
                    {branch.address}
                  </p>
                </div>

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
                <Select
                  label={`Zona de entrega (${branch.city})`}
                  value={form.zone}
                  options={zoneOptions}
                  error={form.errors.zone}
                  onChange={(e) => updateField('zone', e.target.value)}
                />
                <Input
                  label="Dirección exacta (calle, casa, referencia)"
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

                {/* Método de pago */}
                <div>
                  <p className="font-body text-[11px] text-warmgray tracking-wider uppercase mb-3">
                    Método de pago
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPayment('tarjeta')}
                      aria-pressed={payment === 'tarjeta'}
                      className={[
                        'min-h-[64px] flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-sm border transition-all duration-200',
                        payment === 'tarjeta'
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-charcoal text-warmgray hover:border-gold/40 hover:text-cream',
                      ].join(' ')}
                    >
                      <FiCreditCard className="text-2xl" aria-hidden="true" />
                      <span className="font-body text-xs tracking-wide">Tarjeta</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayment('efectivo')}
                      aria-pressed={payment === 'efectivo'}
                      className={[
                        'min-h-[64px] flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-sm border transition-all duration-200',
                        payment === 'efectivo'
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-charcoal text-warmgray hover:border-gold/40 hover:text-cream',
                      ].join(' ')}
                    >
                      <FiDollarSign className="text-2xl" aria-hidden="true" />
                      <span className="font-body text-xs tracking-wide">Efectivo</span>
                    </button>
                  </div>
                </div>

                {/* Campos de tarjeta (simulado) */}
                {payment === 'tarjeta' && (
                  <div className="flex flex-col gap-4 border border-gold/10 bg-charcoal/30 p-4 rounded-sm">
                    <Input
                      label="Número de tarjeta"
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      value={card.number}
                      onChange={(e) =>
                        updateCard('number', formatCardNumber(e.target.value))
                      }
                    />
                    <Input
                      label="Titular de la tarjeta"
                      type="text"
                      autoComplete="cc-name"
                      value={card.holder}
                      onChange={(e) => updateCard('holder', e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Vencimiento (MM/AA)"
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        value={card.expiry}
                        onChange={(e) =>
                          updateCard('expiry', formatExpiry(e.target.value))
                        }
                      />
                      <Input
                        label="CVV"
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        value={card.cvv}
                        onChange={(e) =>
                          updateCard(
                            'cvv',
                            e.target.value.replace(/\D/g, '').slice(0, 4),
                          )
                        }
                      />
                    </div>
                    <p className="font-body text-[11px] text-gold/80 leading-relaxed">
                      Pago simulado — no se realiza ningún cobro real.
                    </p>
                  </div>
                )}

                {/* Pago en efectivo */}
                {payment === 'efectivo' && (
                  <div className="flex flex-col gap-3 border border-gold/10 bg-charcoal/30 p-4 rounded-sm">
                    <p className="font-body text-xs text-cream leading-relaxed">
                      Pagarás en efectivo al recibir el pedido.
                    </p>
                    <Input
                      label="¿Con cuánto pagas? (opcional)"
                      type="text"
                      inputMode="decimal"
                      value={cashGiven}
                      onChange={(e) =>
                        setCashGiven(e.target.value.replace(/[^\d.,]/g, ''))
                      }
                    />
                    {cashIsValid && !cashShort && (
                      <p className="font-body text-xs text-gold/80">
                        Cambio a devolver:{' '}
                        <span className="font-medium">L{change.toFixed(2)}</span>
                      </p>
                    )}
                    {cashShort && (
                      <p className="font-body text-xs text-terracotta">
                        El importe es menor al total (L{total}). Lleva el efectivo
                        suficiente.
                      </p>
                    )}
                  </div>
                )}

                {/* Resumen del pedido */}
                <div className="border border-gold/10 bg-charcoal/40 p-4 rounded-sm">
                  <p className="font-body text-[10px] text-warmgray tracking-wider uppercase mb-3">
                    Resumen del pedido
                  </p>
                  {hasItems ? (
                    <div className="flex flex-col gap-1.5">
                      {cart.map((item) => (
                        <div key={item.dishId} className="flex justify-between gap-3">
                          <span className="font-body text-xs text-cream min-w-0 truncate">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="font-body text-xs text-gold flex-shrink-0">
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
                        <span className="font-body text-sm text-warmgray">Total</span>
                        <span className="font-body text-sm text-gold font-medium">
                          L{total}
                        </span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="font-body text-xs text-warmgray">
                          Método de pago
                        </span>
                        <span className="font-body text-xs text-cream inline-flex items-center gap-1">
                          {payment === 'tarjeta' ? (
                            <>
                              <FiCreditCard aria-hidden="true" /> Tarjeta
                            </>
                          ) : payment === 'efectivo' ? (
                            <>
                              <FiDollarSign aria-hidden="true" /> Efectivo
                            </>
                          ) : (
                            'Sin elegir'
                          )}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="font-body text-xs text-warmgray/60">
                      Tu resumen aparecerá aquí cuando añadas platos.
                    </p>
                  )}
                </div>

                <p className="font-body text-[11px] text-warmgray/60 leading-relaxed">
                  Entrega en 45–60 min · {branch.city} · Envío gratuito desde{' '}
                  L{FREE_SHIPPING_THRESHOLD}
                </p>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isSubmitting}
                  disabled={!canConfirm}
                  className="mt-1"
                >
                  {isSubmitting
                    ? 'Procesando pedido...'
                    : `Confirmar Pedido${hasItems ? ` · L${total}` : ''}`}
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
        subtotal={subtotal}
        shipping={shipping}
        total={total}
        address={form.address}
        name={form.name}
        branchName={branch.city}
        zone={form.zone}
        paymentMethod={payment}
        cashGiven={payment === 'efectivo' && cashIsValid ? cashGivenNum : undefined}
        change={payment === 'efectivo' && cashIsValid && !cashShort ? change : undefined}
      />
    </section>
  );
});

export default DeliverySection;
