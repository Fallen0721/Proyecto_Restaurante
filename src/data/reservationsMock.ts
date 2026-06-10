import { parseISO } from 'date-fns';

// Genera disponibilidad pseudo-aleatoria basada en fecha + tableId
function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash % 100) / 100;
}

export function getTableAvailability(
  date: string,
  time: string,
  tableId: string
): boolean {
  if (!date || !time) return true;
  const seed = `${date}-${time}-${tableId}`;
  const random = seededRandom(seed);

  // Los fines de semana y horarios pico tienen más ocupación
  let occupancyRate = 0.3;
  try {
    const parsed = parseISO(date);
    const dayOfWeek = parsed.getDay();
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0;
    if (isWeekend) occupancyRate = 0.65;

    const hour = parseInt(time.split(':')[0]);
    const isPeakHour = hour >= 14 && hour <= 16 || hour >= 20 && hour <= 22;
    if (isPeakHour) occupancyRate += 0.2;
  } catch {
    // Si la fecha no es parseable, usar tasa base
  }

  return random > occupancyRate;
}

export function getAvailableTimeSlots(date: string): string[] {
  const allSlots = [
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
  ];

  if (!date) return allSlots;

  return allSlots.filter((slot) => {
    const seed = `${date}-${slot}-availability`;
    return seededRandom(seed) > 0.2;
  });
}

export function generateReservationNumber(): string {
  const prefix = 'SYF';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export const availableTimeSlots = [
  { value: '13:00', label: '13:00 h' },
  { value: '13:30', label: '13:30 h' },
  { value: '14:00', label: '14:00 h' },
  { value: '14:30', label: '14:30 h' },
  { value: '15:00', label: '15:00 h' },
  { value: '15:30', label: '15:30 h' },
  { value: '19:00', label: '19:00 h' },
  { value: '19:30', label: '19:30 h' },
  { value: '20:00', label: '20:00 h' },
  { value: '20:30', label: '20:30 h' },
  { value: '21:00', label: '21:00 h' },
  { value: '21:30', label: '21:30 h' },
];
