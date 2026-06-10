import { useCallback, useSyncExternalStore } from 'react';

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      if (typeof window === 'undefined') return () => {};
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener('change', callback);
      return () => mediaQuery.removeEventListener('change', callback);
    },
    [query]
  );

  const getSnapshot = useCallback(
    () =>
      typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
    [query]
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
