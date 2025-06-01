import { useCallback } from 'react';
import { toast } from 'react-toastify';
import config from '../config';

/**
 * Custom hook for displaying notifications
 * @returns {Object} Notification methods
 */
const useNotification = () => {
  // Default toast options
  const defaultOptions = {
    position: config.ui.toast.position,
    autoClose: config.ui.toast.autoClose,
    hideProgressBar: config.ui.toast.hideProgressBar,
    closeOnClick: config.ui.toast.closeOnClick,
    pauseOnHover: config.ui.toast.pauseOnHover,
    draggable: config.ui.toast.draggable,
    theme: 'colored',
  };

  /**
   * Show a success notification
   * @param {string} message - The message to display
   * @param {Object} options - Custom toast options
   */
  const success = useCallback((message, options = {}) => {
    toast.success(message, {
      ...defaultOptions,
      ...options,
      className: 'bg-success text-white',
    });
  }, []);

  /**
   * Show an error notification
   * @param {string|Error} error - The error message or Error object
   * @param {Object} options - Custom toast options
   */
  const error = useCallback((error, options = {}) => {
    const message = error instanceof Error ? error.message : error;
    
    toast.error(message, {
      ...defaultOptions,
      ...options,
      className: 'bg-danger text-white',
      autoClose: 10000, // Longer display for errors
    });
  }, []);

  /**
   * Show a warning notification
   * @param {string} message - The message to display
   * @param {Object} options - Custom toast options
   */
  const warning = useCallback((message, options = {}) => {
    toast.warn(message, {
      ...defaultOptions,
      ...options,
      className: 'bg-warning text-dark',
    });
  }, []);

  /**
   * Show an info notification
   * @param {string} message - The message to display
   * @param {Object} options - Custom toast options
   */
  const info = useCallback((message, options = {}) => {
    toast.info(message, {
      ...defaultOptions,
      ...options,
      className: 'bg-info text-white',
    });
  }, []);

  /**
   * Show a loading notification that can be updated
   * @param {string} message - The loading message
   * @param {Object} options - Custom toast options
   * @returns {string} The toast ID for updating later
   */
  const loading = useCallback((message = 'Loading...', options = {}) => {
    const toastId = toast.loading(message, {
      ...defaultOptions,
      ...options,
      isLoading: true,
      className: 'bg-secondary text-white',
    });
    return toastId;
  }, []);

  /**
   * Update an existing toast notification
   * @param {string} toastId - The ID of the toast to update
   * @param {Object} options - New toast options
   */
  const update = useCallback((toastId, options) => {
    if (toastId) {
      toast.update(toastId, {
        ...defaultOptions,
        ...options,
        isLoading: false,
      });
    }
  }, []);

  /**
   * Dismiss a specific toast
   * @param {string} toastId - The ID of the toast to dismiss
   */
  const dismiss = useCallback((toastId) => {
    toast.dismiss(toastId);
  }, []);

  /**
   * Dismiss all toasts
   */
  const dismissAll = useCallback(() => {
    toast.dismiss();
  }, []);

  return {
    success,
    error,
    warning,
    info,
    loading,
    update,
    dismiss,
    dismissAll,
    toast, // Direct access to toast for advanced use cases
  };
};

export default useNotification;
