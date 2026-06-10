import React, { useEffect, useMemo, useRef, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { generateReservationNumber } from '../../data/reservationsMock';
import { tablesData } from '../../data/tablesData';
import {
  formatDateDisplay,
  getCancellationInfo,
  LATE_CANCELLATION_FEE,
} from '../../utils/dateHelpers';
import type {
  CancellationInfo,
  ReservationState,
} from '../../types/reservation.types';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservationData: ReservationState;
}

const zoneLabels: Record<string, string> = {
  interior: 'Salón Interior',
  terraza: 'Terraza',
  barra: 'Barra',
};

const ReservationModal = React.memo(function ReservationModal({
  isOpen,
  onClose,
  reservationData,
}: ReservationModalProps) {
  const confettiRef = useRef<HTMLDivElement>(null);
  const reservationNumber = useRef(generateReservationNumber());
  const [cancelInfo, setCancelInfo] = useState<CancellationInfo | null>(null);

  const selectedTable = useMemo(
    () => tablesData.find((t) => t.id === reservationData.selectedTable),
    [reservationData.selectedTable]
  );

  // Reiniciar la simulación de cancelación al abrir el modal.
  useEffect(() => {
    if (isOpen) setCancelInfo(null);
  }, [isOpen]);

  const handleSimulateCancel = () => {
    setCancelInfo(
      getCancellationInfo(reservationData.date, reservationData.time)
    );
  };

  useEffect(() => {
    if (!isOpen || !confettiRef.current) return;

    const container = confettiRef.current;
    const particles: HTMLDivElement[] = [];

    // Crear partículas de confeti dorado
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 6 + 3;
      const isSquare = Math.random() > 0.5;

      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${Math.random() > 0.5 ? '#D4A574' : '#E8C9A0'};
        border-radius: ${isSquare ? '0' : '50%'};
        left: ${Math.random() * 100}%;
        top: -10px;
        animation: confetti-fall ${Math.random() * 2 + 1.5}s ease-in ${Math.random() * 1}s forwards;
        transform: rotate(${Math.random() * 360}deg);
        pointer-events: none;
      `;

      container.appendChild(particle);
      particles.push(particle);
    }

    const timeout = setTimeout(() => {
      particles.forEach((p) => {
        if (container.contains(p)) container.removeChild(p);
      });
    }, 3500);

    return () => {
      clearTimeout(timeout);
      particles.forEach((p) => {
        if (container.contains(p)) container.removeChild(p);
      });
    };
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-md">
      {/* Confeti */}
      <div
        ref={confettiRef}
        className="absolute inset-0 overflow-hidden pointer-events-none z-10"
      />

      <div className="p-8 text-center relative z-20">
        {/* Ícono de éxito */}
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
          ¡Reserva Confirmada!
        </h3>
        <p className="font-body text-warmgray text-sm mb-6">
          Te esperamos para una experiencia gastronómica excepcional.
        </p>

        {/* Número de reserva */}
        <div className="bg-charcoal-deep border border-gold/20 p-4 mb-6 font-mono">
          <p className="text-xs text-warmgray mb-1 font-body">
            Número de reserva
          </p>
          <p className="text-gold text-lg tracking-widest">
            {reservationNumber.current}
          </p>
        </div>

        {/* Detalles */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-left">
          {[
            { label: 'Fecha', value: formatDateDisplay(reservationData.date) },
            { label: 'Hora', value: reservationData.time + ' h' },
            { label: 'Comensales', value: reservationData.guests + ' personas' },
            { label: 'Zona', value: zoneLabels[reservationData.zone] },
            {
              label: 'Mesa',
              value: selectedTable
                ? `Nº ${selectedTable.number} · ${selectedTable.capacity} plazas`
                : '—',
            },
            { label: 'Nombre', value: reservationData.name },
            { label: 'Contacto', value: reservationData.email },
          ].map(({ label, value }) => (
            <div key={label} className="bg-charcoal/50 p-3">
              <p className="font-body text-[10px] text-warmgray tracking-wider uppercase mb-1">
                {label}
              </p>
              <p className="font-body text-xs text-cream truncate">{value}</p>
            </div>
          ))}
        </div>

        {/* Política de cancelación */}
        <div className="bg-charcoal/50 border border-gold/10 p-4 mb-6 text-left">
          <p className="font-body text-[10px] text-gold tracking-widest uppercase mb-2">
            Política de cancelación
          </p>
          <p className="font-body text-xs text-warmgray leading-relaxed">
            Cancelación gratuita si se realiza 5 h o más antes de la reserva.
            Con menos de 5 h se aplica un recargo de L{LATE_CANCELLATION_FEE}.
          </p>

          {/* Demo de cancelación (solo simulación visual) */}
          <button
            type="button"
            onClick={handleSimulateCancel}
            className="mt-3 min-h-[44px] w-full border border-terracotta/40 text-terracotta font-body text-xs tracking-wide py-2 px-3 rounded-sm transition-colors duration-200 hover:bg-terracotta/10 active:scale-[0.98]"
          >
            Simular cancelación
          </button>

          {cancelInfo && (
            <div
              role="status"
              className={[
                'mt-3 p-3 rounded-sm border text-xs font-body',
                cancelInfo.isFree
                  ? 'border-gold/30 bg-gold/5 text-gold'
                  : 'border-terracotta/40 bg-terracotta/5 text-terracotta',
              ].join(' ')}
            >
              {cancelInfo.isFree ? (
                <>
                  <span className="font-semibold">Cancelación gratuita.</span>{' '}
                  Faltan {Math.floor(cancelInfo.hoursUntil)} h para tu reserva
                  (5 h o más de antelación).
                </>
              ) : (
                <>
                  <span className="font-semibold">
                    Se aplicaría un recargo de L{cancelInfo.fee}.
                  </span>{' '}
                  Faltan menos de 5 h para tu reserva.
                </>
              )}
            </div>
          )}
        </div>

        <p className="font-body text-xs text-warmgray/60 mb-6">
          Recibirás confirmación en {reservationData.email}.<br />
          Para modificaciones llama al +504 2440-1234.
        </p>

        <Button variant="primary" fullWidth onClick={onClose}>
          Perfecto, ¡hasta pronto!
        </Button>
      </div>
    </Modal>
  );
});

export default ReservationModal;
