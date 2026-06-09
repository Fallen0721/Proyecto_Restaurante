import { useState, useCallback } from 'react';
import type { ReservationState, ReservationZone } from '../../types/reservation.types';
import { getMinDate, isDateInPast } from '../../utils/dateHelpers';

const initialState: ReservationState = {
  date: '',
  time: '',
  guests: 2,
  name: '',
  email: '',
  phone: '',
  zone: 'interior',
  selectedTable: null,
  errors: {},
  isSubmitting: false,
  isSuccess: false,
};

export function useReservation() {
  const [state, setState] = useState<ReservationState>(initialState);

  const updateField = useCallback(
    <K extends keyof ReservationState>(field: K, value: ReservationState[K]) => {
      setState((prev) => ({
        ...prev,
        [field]: value,
        // Limpiar error del campo al actualizarlo
        errors: { ...prev.errors, [field]: undefined },
        // Resetear mesa seleccionada si cambia fecha, hora o zona
        selectedTable:
          field === 'date' || field === 'time' || field === 'zone'
            ? null
            : prev.selectedTable,
      }));
    },
    []
  );

  const validateField = useCallback(
    (field: keyof ReservationState): string | undefined => {
      const value = state[field];

      switch (field) {
        case 'date':
          if (!value) return 'La fecha es obligatoria';
          if (isDateInPast(value as string))
            return 'La fecha no puede ser en el pasado';
          return undefined;

        case 'time':
          if (!value) return 'El horario es obligatorio';
          return undefined;

        case 'guests':
          if (!value || (value as number) < 1)
            return 'Indica el número de comensales';
          if ((value as number) > 8) return 'Máximo 8 comensales por reserva';
          return undefined;

        case 'name':
          if (!value || (value as string).trim().length < 2)
            return 'Introduce tu nombre completo';
          return undefined;

        case 'email':
          if (!value) return 'El email es obligatorio';
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string))
            return 'Introduce un email válido';
          return undefined;

        case 'phone':
          if (!value) return 'El teléfono es obligatorio';
          if (!/^[+]?[\d\s\-()]{9,}$/.test((value as string).replace(/\s/g, '')))
            return 'Introduce un teléfono válido';
          return undefined;

        default:
          return undefined;
      }
    },
    [state]
  );

  const validateAll = useCallback((): boolean => {
    const fieldsToValidate: (keyof ReservationState)[] = [
      'date', 'time', 'guests', 'name', 'email', 'phone',
    ];

    const newErrors: ReservationState['errors'] = {};
    let isValid = true;

    fieldsToValidate.forEach((field) => {
      const error = validateField(field);
      if (error) {
        newErrors[field as keyof typeof newErrors] = error;
        isValid = false;
      }
    });

    setState((prev) => ({ ...prev, errors: newErrors }));
    return isValid;
  }, [validateField]);

  const submitReservation = useCallback(async (): Promise<boolean> => {
    if (!validateAll()) return false;

    setState((prev) => ({ ...prev, isSubmitting: true }));

    // Simular llamada a API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setState((prev) => ({
      ...prev,
      isSubmitting: false,
      isSuccess: true,
    }));

    return true;
  }, [validateAll]);

  const resetForm = useCallback(() => {
    setState(initialState);
  }, []);

  const selectTable = useCallback((tableId: string) => {
    setState((prev) => ({ ...prev, selectedTable: tableId }));
  }, []);

  const setZone = useCallback((zone: ReservationZone) => {
    setState((prev) => ({ ...prev, zone, selectedTable: null }));
  }, []);

  return {
    state,
    updateField,
    validateField,
    submitReservation,
    resetForm,
    selectTable,
    setZone,
  };
}
