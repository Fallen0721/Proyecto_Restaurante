import type { Table } from '../types/reservation.types';

export const tablesData: Table[] = [
  // Interior - 4 mesas de 2 personas
  { id: 'int-1', number: 1, capacity: 2, zone: 'interior', position: { x: 15, y: 15 } },
  { id: 'int-2', number: 2, capacity: 2, zone: 'interior', position: { x: 35, y: 15 } },
  { id: 'int-3', number: 3, capacity: 2, zone: 'interior', position: { x: 15, y: 45 } },
  { id: 'int-4', number: 4, capacity: 2, zone: 'interior', position: { x: 35, y: 45 } },
  // Interior - 2 mesas de 4 personas
  { id: 'int-5', number: 5, capacity: 4, zone: 'interior', position: { x: 60, y: 20 } },
  { id: 'int-6', number: 6, capacity: 4, zone: 'interior', position: { x: 60, y: 55 } },
  // Interior - 2 mesas de 6 personas
  { id: 'int-7', number: 7, capacity: 6, zone: 'interior', position: { x: 80, y: 20 } },
  { id: 'int-8', number: 8, capacity: 6, zone: 'interior', position: { x: 80, y: 55 } },

  // Terraza - 3 mesas de 2 personas
  { id: 'ter-1', number: 9, capacity: 2, zone: 'terraza', position: { x: 15, y: 20 } },
  { id: 'ter-2', number: 10, capacity: 2, zone: 'terraza', position: { x: 50, y: 20 } },
  { id: 'ter-3', number: 11, capacity: 2, zone: 'terraza', position: { x: 82, y: 20 } },
  // Terraza - 2 mesas de 4 personas
  { id: 'ter-4', number: 12, capacity: 4, zone: 'terraza', position: { x: 30, y: 65 } },
  { id: 'ter-5', number: 13, capacity: 4, zone: 'terraza', position: { x: 65, y: 65 } },

  // Barra - 4 asientos individuales
  { id: 'bar-1', number: 14, capacity: 2, zone: 'barra', position: { x: 15, y: 50 } },
  { id: 'bar-2', number: 15, capacity: 2, zone: 'barra', position: { x: 35, y: 50 } },
  { id: 'bar-3', number: 16, capacity: 2, zone: 'barra', position: { x: 55, y: 50 } },
  { id: 'bar-4', number: 17, capacity: 2, zone: 'barra', position: { x: 75, y: 50 } },
];
