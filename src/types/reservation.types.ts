export interface Table {
  id: string;
  number: number;
  capacity: 2 | 4 | 6;
  zone: 'interior' | 'terraza' | 'barra';
  position: { x: number; y: number };
}

export interface Reservation {
  date: string;
  time: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  zone: 'interior' | 'terraza' | 'barra';
  tableId?: string;
}

export interface ReservationState {
  date: string;
  time: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  zone: 'interior' | 'terraza' | 'barra';
  selectedTable: string | null;
  errors: Partial<Record<keyof Reservation, string>>;
  isSubmitting: boolean;
  isSuccess: boolean;
}

export type ReservationZone = 'interior' | 'terraza' | 'barra';

export interface TimeSlot {
  value: string;
  label: string;
}
