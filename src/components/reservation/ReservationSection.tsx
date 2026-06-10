import React, { useState, useCallback } from 'react';
import {
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
  FiPhone,
  FiClock,
  FiMapPin,
} from 'react-icons/fi';
import SectionTitle from '../ui/SectionTitle';
import ReservationForm from './ReservationForm';
import TableMap from './TableMap';
import ReservationModal from './ReservationModal';
import { useReservation } from './useReservation';
import { branches, branchById } from '../../data/branchesData';
import type {
  ReservationZone,
  CityId,
  Floor,
} from '../../types/reservation.types';

const zoneTabs: { value: ReservationZone; label: string }[] = [
  { value: 'interior', label: 'Interior' },
  { value: 'terraza', label: 'Terraza' },
  { value: 'barra', label: 'Barra' },
];

const floorTabs: { value: Floor; label: string }[] = [
  { value: 1, label: 'Planta 1' },
  { value: 2, label: 'Planta 2' },
];

const policies = [
  {
    icon: <FiCalendar size={18} />,
    title: 'Hasta 5 días antes',
    text: 'Reserva tu mesa con un máximo de 5 días de anticipación.',
  },
  {
    icon: <FiCheckCircle size={18} />,
    title: 'Cancelación gratuita',
    text: 'Sin costo si cancelas 5 horas o más antes de tu reserva.',
  },
  {
    icon: <FiAlertCircle size={18} />,
    title: 'Recargo de L400',
    text: 'Cancelaciones con menos de 5 horas aplican un recargo de L400.',
  },
];

const buildContactInfo = (city: CityId) => {
  const branch = branchById(city);
  return [
    {
      icon: <FiPhone size={16} />,
      label: 'Teléfono',
      value: branch.phone,
      sub: 'Reservas y consultas',
    },
    {
      icon: <FiClock size={16} />,
      label: 'Horario',
      value: 'Mar–Dom · 13:00–23:00',
      sub: 'Cocina hasta las 22:00',
    },
    {
      icon: <FiMapPin size={16} />,
      label: `Sucursal ${branch.city}`,
      value: branch.address,
      sub: 'Dos plantas · valet parking',
    },
  ];
};

const ReservationSection = React.memo(function ReservationSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const reservationHook = useReservation();
  const { state, selectTable } = reservationHook;
  const contactInfo = buildContactInfo(state.city);

  const handleSuccess = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    reservationHook.resetForm();
  }, [reservationHook]);

  return (
    <section
      id="reservaciones"
      className="relative section-padding bg-charcoal overflow-hidden"
    >
      {/* Decoración de fondo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-terracotta/5 rounded-full blur-2xl" />
      </div>

      <div className="section-container relative">
        <SectionTitle
          label="Reservaciones"
          title="Reserve su Mesa"
          subtitle="Elige tu día, tu zona y la mesa que prefieras. Te confirmamos al instante."
          className="mb-10 lg:mb-14"
        />

        {/* Reglas de reserva */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 lg:mb-14">
          {policies.map((p) => (
            <div
              key={p.title}
              className="flex items-start gap-3.5 bg-charcoal-light/30 border border-gold/10 rounded-sm p-5"
            >
              <span className="flex-shrink-0 w-10 h-10 rounded-full border border-gold/30 bg-charcoal-deep flex items-center justify-center text-gold">
                {p.icon}
              </span>
              <div className="min-w-0">
                <p className="font-body text-sm text-cream font-medium">
                  {p.title}
                </p>
                <p className="font-body text-xs text-warmgray leading-relaxed mt-1">
                  {p.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Formulario + mapa */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Paso 1: Formulario */}
          <div className="bg-charcoal-light/30 border border-gold/10 rounded-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gold/15 text-gold flex items-center justify-center font-body text-xs font-semibold">
                1
              </span>
              <h3 className="font-display text-xl text-cream">
                Detalles de tu reserva
              </h3>
            </div>
            <ReservationForm
              onSuccess={handleSuccess}
              reservationHook={reservationHook}
            />
          </div>

          {/* Paso 2: Elegir mesa */}
          <div className="bg-charcoal-light/30 border border-gold/10 rounded-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gold/15 text-gold flex items-center justify-center font-body text-xs font-semibold">
                2
              </span>
              <h3 className="font-display text-xl text-cream">Elige tu mesa</h3>
            </div>

            {/* Selector de sucursal (ciudad) */}
            <p className="font-body text-[11px] text-warmgray tracking-wider uppercase mb-2">
              Sucursal
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {branches.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => reservationHook.setCity(b.id)}
                  aria-pressed={state.city === b.id}
                  className={[
                    'min-h-[44px] py-2 px-2 rounded-sm text-xs sm:text-sm font-body tracking-wide transition-all duration-200 border',
                    state.city === b.id
                      ? 'bg-gold text-charcoal-deep border-gold font-semibold shadow-[0_0_18px_rgba(212,165,116,0.25)]'
                      : 'bg-charcoal-deep/40 text-warmgray border-gold/10 hover:border-gold/40 hover:text-cream',
                  ].join(' ')}
                >
                  {b.label}
                </button>
              ))}
            </div>

            {/* Selector de planta */}
            <p className="font-body text-[11px] text-warmgray tracking-wider uppercase mb-2">
              Planta
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {floorTabs.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => reservationHook.setFloor(f.value)}
                  aria-pressed={state.floor === f.value}
                  className={[
                    'min-h-[44px] py-2 px-2 rounded-sm text-xs sm:text-sm font-body tracking-wide transition-all duration-200 border',
                    state.floor === f.value
                      ? 'bg-gold text-charcoal-deep border-gold font-semibold shadow-[0_0_18px_rgba(212,165,116,0.25)]'
                      : 'bg-charcoal-deep/40 text-warmgray border-gold/10 hover:border-gold/40 hover:text-cream',
                  ].join(' ')}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Selector de zona */}
            <p className="font-body text-[11px] text-warmgray tracking-wider uppercase mb-2">
              Zona
            </p>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {zoneTabs.map((z) => (
                <button
                  key={z.value}
                  type="button"
                  onClick={() => reservationHook.setZone(z.value)}
                  aria-pressed={state.zone === z.value}
                  className={[
                    'min-h-[44px] py-2 px-2 rounded-sm text-xs sm:text-sm font-body tracking-wide transition-all duration-200 border',
                    state.zone === z.value
                      ? 'bg-gold text-charcoal-deep border-gold font-semibold shadow-[0_0_18px_rgba(212,165,116,0.25)]'
                      : 'bg-charcoal-deep/40 text-warmgray border-gold/10 hover:border-gold/40 hover:text-cream',
                  ].join(' ')}
                >
                  {z.label}
                </button>
              ))}
            </div>

            <TableMap
              date={state.date}
              time={state.time}
              zone={state.zone}
              city={state.city}
              floor={state.floor}
              guests={state.guests}
              selectedTable={state.selectedTable}
              onTableSelect={selectTable}
              error={state.errors.selectedTable}
            />
          </div>
        </div>

        {/* Información de contacto */}
        <div className="mt-10 lg:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-4 border-t border-charcoal-light pt-8">
          {contactInfo.map((c) => (
            <div key={c.label} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-9 h-9 rounded-full border border-gold/20 bg-charcoal-deep/40 text-gold flex items-center justify-center">
                {c.icon}
              </span>
              <div className="min-w-0">
                <p className="font-body text-[10px] text-gold tracking-widest uppercase mb-0.5">
                  {c.label}
                </p>
                <p className="font-body text-sm text-cream">{c.value}</p>
                <p className="font-body text-xs text-warmgray">{c.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de confirmación */}
      <ReservationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        reservationData={state}
      />
    </section>
  );
});

export default ReservationSection;
