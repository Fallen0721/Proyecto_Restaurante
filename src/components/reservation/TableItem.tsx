import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import type { Table } from '../../types/reservation.types';

interface TableItemProps {
  table: Table;
  isAvailable: boolean;
  isSelected: boolean;
  onSelect: (tableId: string) => void;
}

const capacityIcon = (capacity: 2 | 4 | 6): string => {
  if (capacity === 2) return '⬡';
  if (capacity === 4) return '⬢';
  return '⬣';
};

const TableItem = React.memo(function TableItem({
  table,
  isAvailable,
  isSelected,
  onSelect,
}: TableItemProps) {
  const tableRef = useRef<HTMLButtonElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    if (!isAvailable) return;
    onSelect(table.id);
    if (tableRef.current) {
      gsap.fromTo(
        tableRef.current,
        { scale: 0.9 },
        { scale: 1, duration: 0.3, ease: 'back.out(2)' }
      );
    }
  };

  const tableSize = table.capacity === 2 ? 'w-10 h-10' : table.capacity === 4 ? 'w-12 h-12' : 'w-14 h-14';

  return (
    <div
      className="absolute"
      style={{ left: `${table.position.x}%`, top: `${table.position.y}%`, transform: 'translate(-50%, -50%)' }}
    >
      <button
        ref={tableRef}
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        disabled={!isAvailable}
        aria-label={`Mesa ${table.number} - ${table.capacity} personas - ${isAvailable ? 'Disponible' : 'Ocupada'}`}
        className={[
          tableSize,
          'rounded-sm transition-all duration-200 flex flex-col items-center justify-center relative',
          isSelected
            ? 'bg-gold/20 border-2 border-gold shadow-[0_0_15px_rgba(212,165,116,0.5)] scale-110'
            : isAvailable
            ? 'bg-charcoal border border-gold/40 hover:border-gold hover:bg-gold/10 animate-pulse-gold cursor-pointer'
            : 'bg-charcoal-light/50 border border-charcoal cursor-not-allowed opacity-50',
        ].join(' ')}
      >
        <span className={['text-xs font-body font-medium', isSelected ? 'text-gold' : isAvailable ? 'text-gold/70' : 'text-warmgray/40'].join(' ')}>
          {table.number}
        </span>
        <span className={['text-[8px]', isSelected ? 'text-gold/60' : 'text-warmgray/40'].join(' ')}>
          {table.capacity}p
        </span>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-charcoal-light border border-gold/20 px-3 py-1.5 text-xs font-body text-cream whitespace-nowrap z-50 pointer-events-none">
          Mesa {table.number} · {table.capacity} personas
          <br />
          <span className={isAvailable ? 'text-gold' : 'text-terracotta'}>
            {isAvailable ? 'Disponible' : 'Ocupada'}
          </span>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-charcoal-light" />
        </div>
      )}
    </div>
  );
});

export default TableItem;
