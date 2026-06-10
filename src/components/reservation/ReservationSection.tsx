import React, { useState, useCallback } from 'react';
import SectionTitle from '../ui/SectionTitle';
import ReservationForm from './ReservationForm';
import TableMap from './TableMap';
import ReservationModal from './ReservationModal';
import { useReservation } from './useReservation';

const ReservationSection = React.memo(function ReservationSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const reservationHook = useReservation();
  const { state, selectTable } = reservationHook;

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
          subtitle="Una experiencia que comienza desde el momento en que elige su noche perfecta."
          className="mb-12"
        />

        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-12 items-start">
          {/* Formulario */}
          <div className="bg-charcoal-light/30 border border-gold/10 p-6 md:p-8">
            <h3 className="font-display text-xl text-cream mb-6">
              Datos de la Reserva
            </h3>
            <ReservationForm
              onSuccess={handleSuccess}
              reservationHook={reservationHook}
            />
          </div>

          {/* Mapa de mesas */}
          <div className="bg-charcoal-light/30 border border-gold/10 p-6">
            <h3 className="font-display text-xl text-cream mb-6">
              Elige tu Mesa
            </h3>

            {/* Selector de zona como tabs */}
            <div className="flex gap-1 mb-6 bg-charcoal-deep/50 p-1">
              {(['interior', 'terraza', 'barra'] as const).map((zone) => (
                <button
                  key={zone}
                  type="button"
                  onClick={() => reservationHook.setZone(zone)}
                  aria-pressed={state.zone === zone}
                  className={[
                    'flex-1 min-h-[44px] py-2 px-2 text-xs sm:text-sm font-body tracking-wider transition-all duration-200',
                    state.zone === zone
                      ? 'bg-gold/20 text-gold border-b border-gold'
                      : 'text-warmgray hover:text-cream',
                  ].join(' ')}
                >
                  {zone.charAt(0).toUpperCase() + zone.slice(1)}
                </button>
              ))}
            </div>

            <TableMap
              date={state.date}
              time={state.time}
              zone={state.zone}
              guests={state.guests}
              selectedTable={state.selectedTable}
              onTableSelect={selectTable}
              error={state.errors.selectedTable}
            />
          </div>
        </div>

        {/* Información de contacto */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-charcoal-light pt-8">
          {[
            { label: 'Teléfono', value: '+504 2440-1234', sub: 'Reservas y consultas' },
            { label: 'Horario', value: 'Mar–Dom 13:00–23:00', sub: 'Cocina hasta las 22:00' },
            { label: 'Dirección', value: 'Av. San Isidro, La Ceiba', sub: 'A 2 cuadras del Parque Central' },
          ].map(({ label, value, sub }) => (
            <div key={label} className="text-center">
              <p className="font-body text-xs text-gold tracking-widest uppercase mb-1">
                {label}
              </p>
              <p className="font-body text-sm text-cream">{value}</p>
              <p className="font-body text-xs text-warmgray">{sub}</p>
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
