import React, { useMemo } from 'react';
import TableItem from './TableItem';
import { tablesData } from '../../data/tablesData';
import { getTableAvailability } from '../../data/reservationsMock';
import type { ReservationZone } from '../../types/reservation.types';

interface TableMapProps {
  date: string;
  time: string;
  zone: ReservationZone;
  selectedTable: string | null;
  onTableSelect: (tableId: string) => void;
}

const zoneLabels: Record<ReservationZone, string> = {
  interior: 'Salón Interior',
  terraza: 'Terraza',
  barra: 'Barra',
};

const zoneDescriptions: Record<ReservationZone, string> = {
  interior: 'Ambiente íntimo y climatizado, ideal para ocasiones especiales.',
  terraza: 'Bajo las estrellas, con vistas al jardín. Solo en temporada.',
  barra: 'Experiencia frente a la cocina, perfecta para maridajes.',
};

const TableMap = React.memo(function TableMap({
  date,
  time,
  zone,
  selectedTable,
  onTableSelect,
}: TableMapProps) {
  const zoneTables = useMemo(
    () => tablesData.filter((t) => t.zone === zone),
    [zone]
  );

  const availabilityMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    zoneTables.forEach((table) => {
      map[table.id] = getTableAvailability(date, time, table.id);
    });
    return map;
  }, [zoneTables, date, time]);

  const availableCount = useMemo(
    () => Object.values(availabilityMap).filter(Boolean).length,
    [availabilityMap]
  );

  const hasAvailability = availableCount > 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Cabecera de zona */}
      <div>
        <h4 className="font-display text-xl text-cream mb-1">
          {zoneLabels[zone]}
        </h4>
        <p className="font-body text-sm text-warmgray">
          {zoneDescriptions[zone]}
        </p>
      </div>

      {/* Estado de disponibilidad */}
      {date && time ? (
        <div className={['flex items-center gap-2 text-xs font-body', hasAvailability ? 'text-gold' : 'text-terracotta'].join(' ')}>
          <span className={['w-2 h-2 rounded-full', hasAvailability ? 'bg-gold animate-pulse' : 'bg-terracotta'].join(' ')} />
          {hasAvailability
            ? `${availableCount} mesa${availableCount !== 1 ? 's' : ''} disponible${availableCount !== 1 ? 's' : ''}`
            : 'Sin disponibilidad para este horario'}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs font-body text-warmgray">
          <span className="w-2 h-2 rounded-full bg-warmgray/40" />
          Selecciona fecha y hora para ver disponibilidad
        </div>
      )}

      {/* Mapa de mesas */}
      <div className="relative bg-charcoal/50 border border-charcoal-light rounded-sm overflow-hidden"
        style={{ height: '240px' }}>

        {/* Etiqueta del plano */}
        <div className="absolute top-2 left-2 z-10">
          <span className="font-body text-[10px] text-warmgray/50 tracking-widest uppercase">
            Plano — {zoneLabels[zone]}
          </span>
        </div>

        {/* Leyenda */}
        <div className="absolute bottom-2 right-2 z-10 flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 border border-gold/40 bg-charcoal rounded-sm inline-block" />
            <span className="text-[9px] font-body text-warmgray/60">Libre</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 border border-gold bg-gold/20 rounded-sm inline-block" />
            <span className="text-[9px] font-body text-warmgray/60">Seleccionada</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 border border-charcoal bg-charcoal-light/50 rounded-sm inline-block opacity-50" />
            <span className="text-[9px] font-body text-warmgray/60">Ocupada</span>
          </div>
        </div>

        {/* Mesas */}
        {zoneTables.map((table) => (
          <TableItem
            key={table.id}
            table={table}
            isAvailable={availabilityMap[table.id] ?? true}
            isSelected={selectedTable === table.id}
            onSelect={onTableSelect}
          />
        ))}

        {/* Sin disponibilidad */}
        {!hasAvailability && date && time && (
          <div className="absolute inset-0 flex items-center justify-center bg-charcoal-deep/70 backdrop-blur-sm">
            <div className="text-center p-4">
              <p className="font-body text-sm text-warmgray mb-2">
                No hay disponibilidad
              </p>
              <p className="font-body text-xs text-warmgray/60">
                Prueba con 13:00 · 14:00 · 20:00 · 21:00
              </p>
            </div>
          </div>
        )}
      </div>

      {selectedTable && (
        <p className="font-body text-xs text-gold">
          ✓ Mesa {zoneTables.find((t) => t.id === selectedTable)?.number} seleccionada
        </p>
      )}
    </div>
  );
});

export default TableMap;
