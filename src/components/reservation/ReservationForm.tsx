import React, { useCallback } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useReservation } from './useReservation';
import { availableTimeSlots } from '../../data/reservationsMock';
import { getMinDate, getMaxDate } from '../../utils/dateHelpers';
import type { ReservationZone } from '../../types/reservation.types';

interface ReservationFormProps {
  onSuccess: () => void;
  reservationHook: ReturnType<typeof useReservation>;
}

const zones: { value: ReservationZone; label: string }[] = [
  { value: 'interior', label: 'Salón Interior' },
  { value: 'terraza', label: 'Terraza' },
  { value: 'barra', label: 'Barra del Chef' },
];

const guestOptions = Array.from({ length: 8 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1} ${i === 0 ? 'persona' : 'personas'}`,
}));

const ReservationForm = React.memo(function ReservationForm({
  onSuccess,
  reservationHook,
}: ReservationFormProps) {
  const { state, updateField, submitReservation, setZone } = reservationHook;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const success = await submitReservation();
      if (success) onSuccess();
    },
    [submitReservation, onSuccess]
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {/* Fecha y Hora */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Fecha"
          type="date"
          value={state.date}
          min={getMinDate()}
          max={getMaxDate()}
          error={state.errors.date}
          onChange={(e) => updateField('date', e.target.value)}
        />
        <Select
          label="Hora"
          value={state.time}
          options={availableTimeSlots}
          error={state.errors.time}
          onChange={(e) => updateField('time', e.target.value)}
        />
      </div>

      {/* Comensales y Zona */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Comensales"
          value={String(state.guests)}
          options={guestOptions}
          error={state.errors.guests}
          onChange={(e) => updateField('guests', Number(e.target.value))}
        />
        <Select
          label="Zona preferida"
          value={state.zone}
          options={zones}
          onChange={(e) => setZone(e.target.value as ReservationZone)}
        />
      </div>

      {/* Línea divisoria */}
      <div className="flex items-center gap-3 my-1">
        <span className="flex-1 h-px bg-charcoal-light" />
        <span className="font-body text-xs text-warmgray tracking-widest uppercase">
          Sus datos
        </span>
        <span className="flex-1 h-px bg-charcoal-light" />
      </div>

      {/* Nombre */}
      <Input
        label="Nombre completo"
        type="text"
        value={state.name}
        error={state.errors.name}
        autoComplete="name"
        onChange={(e) => updateField('name', e.target.value)}
      />

      {/* Email y Teléfono */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Correo electrónico"
          type="email"
          value={state.email}
          error={state.errors.email}
          autoComplete="email"
          onChange={(e) => updateField('email', e.target.value)}
        />
        <Input
          label="Teléfono"
          type="tel"
          value={state.phone}
          error={state.errors.phone}
          autoComplete="tel"
          onChange={(e) => updateField('phone', e.target.value)}
        />
      </div>

      {/* Nota de política */}
      <p className="font-body text-[11px] text-warmgray/60 leading-relaxed">
        Reservas con hasta 5 días de antelación. Cancelación gratuita si se
        realiza 5 h o más antes; con menos de 5 h se aplica un recargo de L400.
      </p>

      {/* Botón de envío */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={state.isSubmitting}
        className="mt-2"
      >
        {state.isSubmitting ? 'Confirmando...' : 'Confirmar Reserva'}
      </Button>
    </form>
  );
});

export default ReservationForm;
