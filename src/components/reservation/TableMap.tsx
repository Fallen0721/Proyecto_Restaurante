import React, { useMemo, useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import TableItem from './TableItem';
import { tablesData } from '../../data/tablesData';
import { getTableAvailability } from '../../data/reservationsMock';
import type { ReservationZone } from '../../types/reservation.types';

interface TableMapProps {
  date: string;
  time: string;
  zone: ReservationZone;
  guests: number;
  selectedTable: string | null;
  onTableSelect: (tableId: string) => void;
  error?: string;
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

const toneCls = {
  gold: 'text-gold',
  terracotta: 'text-terracotta',
  cream: 'text-cream',
} as const;

const TableMap = React.memo(function TableMap({
  date,
  time,
  zone,
  guests,
  selectedTable,
  onTableSelect,
  error,
}: TableMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const planeRef = useRef<HTMLDivElement>(null);

  const zoneTables = useMemo(
    () => tablesData.filter((t) => t.zone === zone),
    [zone]
  );

  const availabilityMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    zoneTables.forEach((table) => {
      // No disponible si su capacidad es menor que el número de comensales.
      const fitsParty = table.capacity >= guests;
      map[table.id] = fitsParty && getTableAvailability(date, time, table.id);
    });
    return map;
  }, [zoneTables, date, time, guests]);

  const availableCount = useMemo(
    () => Object.values(availabilityMap).filter(Boolean).length,
    [availabilityMap]
  );
  const hasAvailability = availableCount > 0;

  // Animación de entrada de las mesas al cambiar de zona.
  useEffect(() => {
    if (!planeRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        planeRef.current!.querySelectorAll('.table-anim'),
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.4, stagger: 0.04, ease: 'back.out(1.7)' }
      );
    }, planeRef);
    return () => ctx.revert();
  }, [zone]);

  // Mesa "activa": la señalada con el cursor o, si no hay, la seleccionada.
  const activeTable = useMemo(() => {
    const id = hoveredId ?? selectedTable;
    return zoneTables.find((t) => t.id === id) ?? null;
  }, [hoveredId, selectedTable, zoneTables]);

  const activeInfo = useMemo(() => {
    if (!activeTable) return null;
    const fits = activeTable.capacity >= guests;
    const occupied =
      !!date && !!time && !getTableAvailability(date, time, activeTable.id);
    const isSel = selectedTable === activeTable.id;
    let estado: string;
    let tone: keyof typeof toneCls;
    if (isSel) {
      estado = 'Seleccionada';
      tone = 'gold';
    } else if (!fits) {
      estado = `No apta para ${guests} personas`;
      tone = 'terracotta';
    } else if (occupied) {
      estado = 'Ocupada en este horario';
      tone = 'terracotta';
    } else {
      estado = 'Disponible';
      tone = 'cream';
    }
    return { isSel, estado, tone, selectable: fits && !occupied && !isSel };
  }, [activeTable, guests, date, time, selectedTable]);

  return (
    <div className="flex flex-col gap-4">
      {/* Cabecera de zona */}
      <div>
        <h4 className="font-display text-xl text-cream mb-1">{zoneLabels[zone]}</h4>
        <p className="font-body text-sm text-warmgray">{zoneDescriptions[zone]}</p>
      </div>

      {/* Estado de disponibilidad */}
      {date && time ? (
        <div
          className={[
            'flex items-center gap-2 text-xs font-body',
            hasAvailability ? 'text-gold' : 'text-terracotta',
          ].join(' ')}
        >
          <span
            className={[
              'w-2 h-2 rounded-full',
              hasAvailability ? 'bg-gold animate-pulse' : 'bg-terracotta',
            ].join(' ')}
          />
          {hasAvailability
            ? `${availableCount} mesa${availableCount !== 1 ? 's' : ''} disponible${
                availableCount !== 1 ? 's' : ''
              } para ${guests} ${guests === 1 ? 'persona' : 'personas'}`
            : 'Sin disponibilidad para este horario'}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs font-body text-warmgray">
          <span className="w-2 h-2 rounded-full bg-warmgray/40" />
          Selecciona fecha y hora para ver la disponibilidad
        </div>
      )}

      {/* Plano interactivo */}
      <div
        ref={planeRef}
        className="relative bg-charcoal/50 border border-charcoal-light rounded-sm overflow-hidden h-[300px] sm:h-[330px]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(212,165,116,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(212,165,116,0.05) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      >
        {/* Etiqueta del plano */}
        <div className="absolute top-2 left-2 z-10 pointer-events-none">
          <span className="font-body text-[10px] text-warmgray/50 tracking-widest uppercase">
            Plano · {zoneLabels[zone]}
          </span>
        </div>

        {/* Decoración según la zona */}
        {zone === 'barra' && (
          <div className="absolute left-[6%] right-[6%] top-[72%] h-7 border border-gold/15 bg-charcoal-light/30 rounded-sm flex items-center justify-center pointer-events-none">
            <span className="text-[8px] tracking-[0.35em] text-warmgray/40 uppercase">
              Barra · Cocina
            </span>
          </div>
        )}
        {zone === 'interior' && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-2 px-3 py-0.5 border border-gold/15 rounded-sm pointer-events-none">
            <span className="text-[8px] tracking-[0.35em] text-warmgray/40 uppercase">
              Entrada
            </span>
          </div>
        )}
        {zone === 'terraza' && (
          <div className="absolute top-2 right-3 pointer-events-none text-gold/20 text-sm tracking-widest">
            ✺ ✺
          </div>
        )}

        {/* Mesas */}
        {zoneTables.map((table) => (
          <TableItem
            key={table.id}
            table={table}
            isAvailable={availabilityMap[table.id] ?? true}
            isSelected={selectedTable === table.id}
            onSelect={onTableSelect}
            onHover={setHoveredId}
          />
        ))}

        {/* Sin disponibilidad */}
        {!hasAvailability && date && time && (
          <div className="absolute inset-0 flex items-center justify-center bg-charcoal-deep/75 backdrop-blur-sm">
            <div className="text-center p-4">
              <p className="font-body text-sm text-warmgray mb-2">
                No hay mesas para este horario
              </p>
              <p className="font-body text-xs text-warmgray/60">
                Prueba con 13:00 · 14:00 · 20:00 · 21:00 u otra zona
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Leyenda */}
      <div className="flex items-center gap-4 flex-wrap">
        {[
          { cls: 'bg-charcoal border border-gold/50', label: 'Libre' },
          { cls: 'bg-gold', label: 'Seleccionada' },
          { cls: 'bg-charcoal-light/40 border border-charcoal', label: 'Ocupada' },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className={['w-3 h-3 rounded-full inline-block', l.cls].join(' ')} />
            <span className="text-[10px] font-body text-warmgray/60">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Panel de detalle de la mesa activa (reacciona a hover / toque) */}
      {activeTable && activeInfo ? (
        <div
          key={activeTable.id}
          className="flex items-center gap-3 border border-gold/15 bg-charcoal/40 rounded-sm p-3 min-h-[76px] animate-fade-in"
        >
          {/* mini-ficha con número y plazas */}
          <div className="flex-shrink-0 w-12 h-12 rounded-full border border-gold/40 bg-charcoal-deep flex flex-col items-center justify-center">
            <span className="font-display text-base text-gold leading-none">
              {activeTable.number}
            </span>
            <span className="text-[8px] text-warmgray/70 mt-0.5">
              {activeTable.capacity}p
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-body text-sm text-cream leading-tight">
              Mesa {activeTable.number} · {zoneLabels[zone]}
            </p>
            <p className="font-body text-xs text-warmgray">
              Hasta {activeTable.capacity} personas
            </p>
            <p
              className={['font-body text-xs mt-0.5', toneCls[activeInfo.tone]].join(' ')}
            >
              {activeInfo.isSel ? '✓ ' : ''}
              {activeInfo.estado}
            </p>
          </div>
          {activeInfo.selectable && (
            <button
              type="button"
              onClick={() => onTableSelect(activeTable.id)}
              className="flex-shrink-0 min-h-[40px] px-4 text-xs font-body tracking-wide text-charcoal-deep bg-gold hover:bg-gold-dark rounded-sm transition-colors"
            >
              Elegir
            </button>
          )}
        </div>
      ) : (
        <p className="font-body text-xs text-warmgray/60 border border-dashed border-charcoal-light rounded-sm p-3 min-h-[76px] flex items-center justify-center text-center">
          Pasa el cursor o toca una mesa del plano para ver sus detalles y elegirla.
        </p>
      )}

      {error && (
        <p className="font-body text-xs text-terracotta" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

export default TableMap;
