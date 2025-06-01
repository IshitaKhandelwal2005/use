import { useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for handling keyboard shortcuts
 * @param {Object} options - Configuration options
 * @param {boolean} options.ctrlKey - Whether Ctrl key needs to be pressed
 * @param {boolean} options.altKey - Whether Alt key needs to be pressed
 * @param {boolean} options.shiftKey - Whether Shift key needs to be pressed
 * @param {boolean} options.metaKey - Whether Meta/Command key needs to be pressed
 * @param {boolean} options.preventDefault - Whether to prevent default behavior
 * @param {boolean} options.stopPropagation - Whether to stop event propagation
 * @param {string} options.event - The event type to listen for ('keydown' | 'keyup' | 'keypress')
 * @returns {Function} - A function to set up keyboard shortcuts
 */
const useKeyboardShortcut = ({
  ctrlKey = false,
  altKey = false,
  shiftKey = false,
  metaKey = false,
  preventDefault = true,
  stopPropagation = false,
  event = 'keydown',
} = {}) => {
  const callbacksRef = useRef(new Map());
  const pressedKeysRef = useRef(new Set());

  /**
   * Check if the current key combination matches the required modifiers
   * @param {KeyboardEvent} e - The keyboard event
   * @returns {boolean} - Whether the key combination matches
   */
  const checkModifiers = useCallback((e) => {
    return (
      (ctrlKey === false || e.ctrlKey === ctrlKey) &&
      (altKey === false || e.altKey === altKey) &&
      (shiftKey === false || e.shiftKey === shiftKey) &&
      (metaKey === false || e.metaKey === metaKey)
    );
  }, [ctrlKey, altKey, shiftKey, metaKey]);

  /**
   * Handle keyboard events
   * @param {KeyboardEvent} e - The keyboard event
   */
  const handleKeyEvent = useCallback((e) => {
    const key = e.key.toLowerCase();
    
    // Update pressed keys set
    if (event === 'keydown') {
      if (pressedKeysRef.current.has(key)) return; // Prevent key repeat
      pressedKeysRef.current.add(key);
    } else if (event === 'keyup') {
      pressedKeysRef.current.delete(key);
    }

    // Check if we have a callback for this key
    const callback = callbacksRef.current.get(key);
    if (!callback) return;

    // Check if modifiers match
    if (!checkModifiers(e)) return;

    // Handle event options
    if (preventDefault) {
      e.preventDefault();
    }
    if (stopPropagation) {
      e.stopPropagation();
    }

    // Execute the callback
    callback(e);
  }, [event, checkModifiers, preventDefault, stopPropagation]);

  // Set up event listener
  useEffect(() => {
    window.addEventListener(event, handleKeyEvent);
    
    // Clean up
    return () => {
      window.removeEventListener(event, handleKeyEvent);
      pressedKeysRef.current.clear();
    };
  }, [event, handleKeyEvent]);

  /**
   * Add a keyboard shortcut
   * @param {string} key - The key to listen for (case-insensitive)
   * @param {Function} callback - The function to call when the key is pressed
   * @returns {Function} - A function to remove the shortcut
   */
  const addShortcut = useCallback((key, callback) => {
    const normalizedKey = key.toLowerCase();
    callbacksRef.current.set(normalizedKey, callback);
    
    // Return cleanup function
    return () => {
      callbacksRef.current.delete(normalizedKey);
    };
  }, []);

  /**
   * Remove a keyboard shortcut
   * @param {string} key - The key to remove
   */
  const removeShortcut = useCallback((key) => {
    callbacksRef.current.delete(key.toLowerCase());
  }, []);

  /**
   * Clear all keyboard shortcuts
   */
  const clearShortcuts = useCallback(() => {
    callbacksRef.current.clear();
  }, []);

  /**
   * Check if a key is currently pressed
   * @param {string} key - The key to check
   * @returns {boolean} - Whether the key is currently pressed
   */
  const isKeyPressed = useCallback((key) => {
    return pressedKeysRef.current.has(key.toLowerCase());
  }, []);

  return {
    addShortcut,
    removeShortcut,
    clearShortcuts,
    isKeyPressed,
    // For advanced usage
    callbacks: callbacksRef.current,
  };
};

export default useKeyboardShortcut;
