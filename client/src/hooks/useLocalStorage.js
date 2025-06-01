import { useState, useEffect, useCallback } from 'react';

// Helper function to safely parse JSON with a fallback
export const safeJsonParse = (value, fallback = null) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return fallback;
  }
};

/**
 * Custom hook to use localStorage with React
 * @param {string} key - The key under which the value is stored in localStorage
 * @param {*} initialValue - The initial value to use if no value exists in localStorage
 * @param {Object} options - Additional options
 * @param {number} options.expiresIn - Time in milliseconds after which the value expires
 * @param {boolean} options.sync - Whether to sync changes across tabs
 * @returns {[any, (value: any) => void, () => void]} - The stored value, setter function, and remove function
 */
const useLocalStorage = (key, initialValue, { expiresIn, sync = true } = {}) => {
  // Get from local storage then parse stored json or return initialValue
  const getStoredValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      
      // If no value exists, return initialValue
      if (item === null) {
        return initialValue;
      }

      const parsed = safeJsonParse(item);
      
      // Check if the stored value has expired
      if (expiresIn && parsed?.timestamp) {
        const isExpired = Date.now() - parsed.timestamp > expiresIn;
        if (isExpired) {
          window.localStorage.removeItem(key);
          return initialValue;
        }
      }

      return parsed.value ?? initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue, expiresIn]);

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(getStoredValue);

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save to state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        const item = {
          value: valueToStore,
          timestamp: expiresIn ? Date.now() : undefined
        };
        window.localStorage.setItem(key, JSON.stringify(item));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue, expiresIn]);

  // Remove the value from both state and localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Sync changes across tabs
  useEffect(() => {
    if (!sync || typeof window === 'undefined') return;

    const handleStorageChange = (event) => {
      if (event.key === key && event.newValue !== event.oldValue) {
        const newValue = safeJsonParse(event.newValue)?.value;
        if (newValue !== storedValue) {
          setStoredValue(newValue ?? initialValue);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue, storedValue, sync]);

  // Update state if the key or initialValue changes
  useEffect(() => {
    setStoredValue(getStoredValue());
  }, [key, initialValue, getStoredValue]);

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;
