import { useState, useEffect, useRef } from 'react';

/**
 * A custom hook to manage state synchronized with localStorage.
 * Handles parsing, stringifying, and default values.
 *
 * @param key The localStorage key
 * @param defaultValue The default value if no key exists or parsing fails
 * @returns [state, setState] tuple
 */
export function useLocalStorageState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn(`Error reading localStorage key "${key}":`, e);
    }
    return typeof defaultValue === 'function' ? (defaultValue as () => T)() : defaultValue;
  });

  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setState(parsed);
        } catch (e) {
          console.warn(`Error parsing storage change for key "${key}":`, e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [state, setState];
}
