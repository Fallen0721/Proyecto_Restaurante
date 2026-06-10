import React from 'react';
import type { Table } from '../../types/reservation.types';

interface TableItemProps {
  table: Table;
  isAvailable: boolean;
  isSelected: boolean;
  onSelect: (tableId: string) => void;
  onHover: (tableId: string | null) => void;
}

// Diámetro de la mesa y área táctil (caja) según la capacidad.
const TABLE_DIAMETER: Record<number, number> = { 2: 26, 4: 32, 6: 38 };
const BOX_SIZE: Record<number, number> = { 2: 48, 4: 56, 6: 64 };

const TableItem = React.memo(function TableItem({
  table,
  isAvailable,
  isSelected,
  onSelect,
  onHover,
}: TableItemProps) {
  const box = BOX_SIZE[table.capacity];
  const dia = TABLE_DIAMETER[table.capacity];
  const seatR = dia / 2 + 7;

  // Reparte las sillas alrededor de la mesa empezando por arriba.
  const seats = Array.from({ length: table.capacity }, (_, i) => {
    const a = (i / table.capacity) * Math.PI * 2 - Math.PI / 2;
    return {
      x: Math.cos(a) * seatR,
      y: Math.sin(a) * seatR,
      rot: (a * 180) / Math.PI + 90,
    };
  });

  const seatCls = isSelected
    ? 'bg-gold'
    : isAvailable
      ? 'bg-gold/50'
      : 'bg-warmgray/20';

  const tableCls = isSelected
    ? 'bg-gold border-gold text-charcoal-deep shadow-[0_0_18px_rgba(212,165,116,0.6)] scale-110'
    : isAvailable
      ? 'bg-charcoal border-gold/50 text-gold/90 animate-pulse-gold group-hover:border-gold group-hover:bg-gold/15'
      : 'bg-charcoal-light/40 border-charcoal text-warmgray/40';

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${table.position.x}%`, top: `${table.position.y}%` }}
    >
      {/* .table-anim: objetivo de la animación de entrada (GSAP) en TableMap */}
      <div className="table-anim">
        <button
          type="button"
          onClick={() => isAvailable && onSelect(table.id)}
          onMouseEnter={() => onHover(table.id)}
          onFocus={() => onHover(table.id)}
          disabled={!isAvailable}
          aria-pressed={isSelected}
          aria-label={`Mesa ${table.number}, hasta ${table.capacity} personas, ${
            isAvailable ? 'disponible' : 'no disponible'
          }`}
          className={[
            'group relative flex items-center justify-center touch-manipulation transition-transform duration-200',
            isAvailable
              ? 'cursor-pointer hover:-translate-y-[3px] active:scale-90'
              : 'cursor-not-allowed',
            isSelected ? 'z-20' : 'z-[11]',
          ].join(' ')}
          style={{ width: box, height: box }}
        >
          {/* halo al seleccionar */}
          {isSelected && (
            <span
              aria-hidden="true"
              className="absolute inset-1 rounded-full bg-gold/20 blur-md animate-pulse"
            />
          )}

          {/* sillas */}
          {seats.map((s, i) => (
            <span
              key={i}
              aria-hidden="true"
              className={['absolute rounded-[2px] transition-colors duration-200', seatCls].join(' ')}
              style={{
                width: 8,
                height: 5,
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) translate(${s.x}px, ${s.y}px) rotate(${s.rot}deg)`,
              }}
            />
          ))}

          {/* mesa */}
          <span
            className={[
              'relative flex items-center justify-center rounded-full border transition-all duration-200',
              tableCls,
            ].join(' ')}
            style={{ width: dia, height: dia }}
          >
            <span className="text-[10px] font-body font-semibold leading-none">
              {table.number}
            </span>
          </span>

          {/* check de seleccionada */}
          {isSelected && (
            <span
              aria-hidden="true"
              className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gold text-charcoal-deep flex items-center justify-center text-[9px] font-bold shadow z-30"
            >
              ✓
            </span>
          )}

          {/* marca de no disponible */}
          {!isAvailable && (
            <span
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center text-warmgray/25 text-base"
            >
              ✕
            </span>
          )}
        </button>
      </div>
    </div>
  );
});

export default TableItem;
