import { useState, useCallback } from 'react';
import type { ReservationState, ReservationZone } from '../../types/reservation.types';
import { isDateInPast, isDateBeyondMax } from '../../utils/dateHelpers';
import { tablesData } from '../../data/tablesData';

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
      setState((prev) => {
        // Si cambia fecha, hora, zona o comensales, la mesa puede dejar de ser válida.
        const resetsTable =
          field === 'date' ||
          field === 'time' ||
          field === 'zone' ||
          field === 'guests';
        return {
          ...prev,
          [field]: value,
          // Limpiar error del campo (y el de la mesa si procede) al actualizar.
          errors: {
            ...prev.errors,
            [field]: undefined,
            ...(resetsTable ? { selectedTable: undefined } : {}),
          },
          // Resetear mesa seleccionada si cambia fecha, hora, zona o comensales.
          selectedTable: resetsTable ? null : prev.selectedTable,
        };
      });
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
          if (isDateBeyondMax(value as string))
            return 'Solo se admiten reservas con hasta 5 días de antelación';
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
    const fieldsValid = validateAll();

    // Validar que se haya seleccionado una mesa disponible con capacidad suficiente.
    let tableError: string | undefined;
    if (!state.selectedTable) {
      tableError = 'Selecciona una mesa disponible';
    } else {
      const table = tablesData.find((t) => t.id === state.selectedTable);
      if (!table) {
        tableError = 'Selecciona una mesa disponible';
      } else if (table.capacity < state.guests) {
        tableError = `Esta mesa admite ${table.capacity} personas. Elige otra para ${state.guests}.`;
      }
    }

    if (tableError) {
      setState((prev) => ({
        ...prev,
        errors: { ...prev.errors, selectedTable: tableError },
      }));
    }

    if (!fieldsValid || tableError) return false;

    setState((prev) => ({ ...prev, isSubmitting: true }));

    // Simular llamada a API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setState((prev) => ({
      ...prev,
      isSubmitting: false,
      isSuccess: true,
    }));

    return true;
  }, [validateAll, state.selectedTable, state.guests]);

  const resetForm = useCallback(() => {
    setState(initialState);
  }, []);

  const selectTable = useCallback((tableId: string) => {
    setState((prev) => ({
      ...prev,
      selectedTable: tableId,
      errors: { ...prev.errors, selectedTable: undefined },
    }));
  }, []);

  const setZone = useCallback((zone: ReservationZone) => {
    setState((prev) => ({
      ...prev,
      zone,
      selectedTable: null,
      errors: { ...prev.errors, selectedTable: undefined },
    }));
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
