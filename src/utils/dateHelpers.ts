import { format, addDays, isToday, isTomorrow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import type { CancellationInfo } from '../types/reservation.types';

// Máximo de días de antelación para reservar.
export const MAX_ADVANCE_DAYS = 5;

// Horas mínimas de antelación para cancelar gratis.
export const FREE_CANCELLATION_HOURS = 5;

// Recargo aplicado a cancelaciones tardías (en lempiras, L).
export const LATE_CANCELLATION_FEE = 400;

export function getMinDate(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getMaxDate(): string {
  return format(addDays(new Date(), MAX_ADVANCE_DAYS), 'yyyy-MM-dd');
}

// Comprueba si la fecha supera la ventana máxima de reserva (hoy + MAX_ADVANCE_DAYS).
export function isDateBeyondMax(dateStr: string): boolean {
  if (!dateStr) return false;
  try {
    const date = parseISO(dateStr);
    date.setHours(0, 0, 0, 0);
    const max = addDays(new Date(), MAX_ADVANCE_DAYS);
    max.setHours(23, 59, 59, 999);
    return date > max;
  } catch {
    return false;
  }
}

// Calcula la información de cancelación según las horas restantes hasta la reserva.
export function getCancellationInfo(
  dateStr: string,
  timeStr: string
): CancellationInfo {
  let hoursUntil: number;
  try {
    const [hours, minutes] = (timeStr || '00:00').split(':').map(Number);
    const target = parseISO(dateStr);
    target.setHours(hours || 0, minutes || 0, 0, 0);
    hoursUntil = (target.getTime() - Date.now()) / (1000 * 60 * 60);
  } catch {
    hoursUntil = 0;
  }

  const isFree = hoursUntil >= FREE_CANCELLATION_HOURS;
  return {
    hoursUntil,
    isFree,
    fee: isFree ? 0 : LATE_CANCELLATION_FEE,
  };
}

export function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Hoy';
    if (isTomorrow(date)) return 'Mañana';
    return format(date, "EEEE d 'de' MMMM", { locale: es });
  } catch {
    return dateStr;
  }
}

export function formatDateShort(dateStr: string): string {
  if (!dateStr) return '';
  try {
    return format(parseISO(dateStr), 'dd/MM/yyyy');
  } catch {
    return dateStr;
  }
}

export function isDateInPast(dateStr: string): boolean {
  if (!dateStr) return false;
  try {
    const date = parseISO(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  } catch {
    return false;
  }
}
