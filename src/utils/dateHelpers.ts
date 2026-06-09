import { format, addDays, isToday, isTomorrow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export function getMinDate(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getMaxDate(): string {
  return format(addDays(new Date(), 90), 'yyyy-MM-dd');
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
