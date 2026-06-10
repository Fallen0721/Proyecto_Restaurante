import type { CityId } from '../types/reservation.types';

export interface Branch {
  id: CityId;
  city: string;
  label: string;
  address: string;
  phone: string;
  /** URL de Google Maps embebible (sin API key) para mostrar en un iframe */
  mapSrc: string;
  /** Colonias/zonas que cubre el reparto a domicilio de esta sucursal */
  zones: string[];
}

export const branches: Branch[] = [
  {
    id: 'sps',
    city: 'San Pedro Sula',
    label: 'San Pedro Sula',
    address: 'Av. Circunvalación, Barrio Río de Piedras, San Pedro Sula',
    phone: '+504 2550-1234',
    mapSrc:
      'https://www.google.com/maps?q=San%20Pedro%20Sula%2C%20Honduras&output=embed',
    zones: [
      'Barrio El Centro',
      'Colonia Trejo',
      'Colonia Moderna',
      'Jardines del Valle',
      'Bella Vista',
      'Río de Piedras',
      'Colonia Universidad',
      'Las Mesetas',
    ],
  },
  {
    id: 'tegus',
    city: 'Tegucigalpa',
    label: 'Tegucigalpa',
    address: 'Bulevar Morazán, Colonia Palmira, Tegucigalpa',
    phone: '+504 2240-1234',
    mapSrc:
      'https://www.google.com/maps?q=Tegucigalpa%2C%20Honduras&output=embed',
    zones: [
      'Colonia Palmira',
      'Lomas del Guijarro',
      'Colonia Kennedy',
      'Colonia Las Colinas',
      'Colonia Miraflores',
      'Colonia Tepeyac',
      'El Hatillo',
      'Comayagüela Centro',
    ],
  },
];

export const branchById = (id: CityId): Branch =>
  branches.find((b) => b.id === id) ?? branches[0];
