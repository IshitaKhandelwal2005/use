import { useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Custom hook for managing modal state and behavior
 * @param {Object} options - Modal options
 * @param {boolean} options.closeOnEscape - Whether to close the modal when pressing Escape
 * @param {boolean} options.closeOnOutsideClick - Whether to close when clicking outside the modal
 * @param {boolean} options.preventScroll - Whether to prevent body scrolling when modal is open
 * @returns {Object} Modal state and methods
 */
const useModal = ({
  closeOnEscape = true,
  closeOnOutsideClick = true,
  preventScroll = true,
} = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const modalRef = useRef(null);
  const [animationClass, setAnimationClass] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [modalOptions, setModalOptions] = useState({
    title: '',
    size: 'md',
    showCloseButton: true,
    closeButtonLabel: 'Close',
    showFooter: true,
    footer: null,
    onClose: null,
    onConfirm: null,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    hideCancelButton: false,
    hideConfirmButton: false,
    isConfirmLoading: false,
    isConfirmDisabled: false,
    className: '',
    contentClassName: '',
    overlayClassName: '',
    bodyClassName: '',
    headerClassName: '',
    footerClassName: '',
    ...modalOptions,
  });

  // Handle Escape key press
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeOnEscape]);

  // Handle outside click
  useEffect(() => {
    if (!closeOnOutsideClick || !isOpen) return;

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeOnOutsideClick]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (!preventScroll) return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, preventScroll]);

  // Open modal with content and options
  const openModal = useCallback((content, options = {}) => {
    setModalOptions(prev => ({
      ...prev,
      ...options,
    }));
    
    if (content) {
      setModalContent(content);
    }
    
    setIsOpen(true);
    setAnimationClass('modal-enter');
    setIsAnimating(true);
    
    // Trigger reflow to ensure animation plays
    // eslint-disable-next-line no-unused-expressions
    modalRef.current?.offsetHeight;
    
    setAnimationClass('modal-enter-active');
  }, []);

  // Close modal with optional result
  const closeModal = useCallback((result) => {
    setAnimationClass('modal-exit');
    setIsAnimating(true);
    
    const onTransitionEnd = () => {
      setIsOpen(false);
      setIsAnimating(false);
      setAnimationClass('');
      
      if (modalOptions.onClose) {
        modalOptions.onClose(result);
      }
      
      // Clean up
      modalRef.current?.removeEventListener('transitionend', onTransitionEnd);
    };
    
    // Wait for exit animation to complete
    if (modalRef.current) {
      modalRef.current.addEventListener('transitionend', onTransitionEnd, { once: true });
    } else {
      onTransitionEnd();
    }
  }, [modalOptions]);

  // Confirm action
  const confirmModal = useCallback(async () => {
    if (modalOptions.onConfirm) {
      try {
        setModalOptions(prev => ({ ...prev, isConfirmLoading: true }));
        const result = await modalOptions.onConfirm();
        closeModal(result);
      } catch (error) {
        console.error('Modal confirmation error:', error);
      } finally {
        setModalOptions(prev => ({ ...prev, isConfirmLoading: false }));
      }
    } else {
      closeModal(true);
    }
  }, [closeModal, modalOptions]);

  // Render modal
  const Modal = useCallback(() => {
    if (!isOpen && !isAnimating) return null;

    const modal = (
      <div className={`modal-overlay ${animationClass} ${modalOptions.overlayClassName}`}>
        <div 
          ref={modalRef}
          className={`modal ${modalOptions.size ? `modal-${modalOptions.size}` : ''} ${animationClass} ${modalOptions.className}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          {(modalOptions.title || modalOptions.showCloseButton) && (
            <div className={`modal-header ${modalOptions.headerClassName}`}>
              {modalOptions.title && (
                <h2 id="modal-title" className="modal-title">
                  {modalOptions.title}
                </h2>
              )}
              {modalOptions.showCloseButton && (
                <button
                  type="button"
                  className="modal-close"
                  onClick={closeModal}
                  aria-label={modalOptions.closeButtonLabel || 'Close'}
                >
                  &times;
                </button>
              )}
            </div>
          )}
          
          {/* Body */}
          <div className={`modal-body ${modalOptions.bodyClassName}`}>
            {modalContent}
          </div>
          
          {/* Footer */}
          {modalOptions.showFooter && (
            <div className={`modal-footer ${modalOptions.footerClassName}`}>
              {modalOptions.footer || (
                <>
                  {!modalOptions.hideCancelButton && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeModal}
                      disabled={modalOptions.isConfirmLoading}
                    >
                      {modalOptions.cancelText}
                    </button>
                  )}
                  {!modalOptions.hideConfirmButton && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={confirmModal}
                      disabled={modalOptions.isConfirmLoading || modalOptions.isConfirmDisabled}
                    >
                      {modalOptions.isConfirmLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          {modalOptions.confirmText}
                        </>
                      ) : (
                        modalOptions.confirmText
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );

    return createPortal(modal, document.body);
  }, [isOpen, isAnimating, animationClass, modalContent, modalOptions, closeModal, confirmModal]);

  // Convenience methods for common modal types
  const alert = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      openModal(
        <div className="alert-message">{message}</div>,
        {
          ...options,
          onClose: () => {
            resolve(true);
            options.onClose?.();
          },
          hideCancelButton: true,
          confirmText: options.confirmText || 'OK',
        }
      );
    });
  }, [openModal]);

  const confirm = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      openModal(
        <div className="confirm-message">{message}</div>,
        {
          ...options,
          onClose: (result) => {
            resolve(result || false);
            options.onClose?.(result);
          },
          onConfirm: async () => {
            const result = options.onConfirm ? await options.onConfirm() : true;
            return result !== false; // Only close if not explicitly returning false
          },
          confirmText: options.confirmText || 'Confirm',
          cancelText: options.cancelText || 'Cancel',
        }
      );
    });
  }, [openModal]);

  const prompt = useCallback((message, defaultValue = '', options = {}) => {
    return new Promise((resolve) => {
      let inputRef = null;
      
      const handleSubmit = (e) => {
        e.preventDefault();
        const value = inputRef?.value || '';
        closeModal(value);
      };
      
      const content = (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="prompt-input" className="form-label">
              {message}
            </label>
            <input
              id="prompt-input"
              type={options.type || 'text'}
              className="form-control"
              defaultValue={defaultValue}
              ref={(el) => { inputRef = el; }}
              autoFocus
              {...options.inputProps}
            />
          </div>
        </form>
      );
      
      openModal(content, {
        ...options,
        onClose: (result) => {
          resolve(result || null);
          options.onClose?.(result);
        },
        onConfirm: () => {
          const value = inputRef?.value || '';
          return options.required ? value.trim() !== '' : true;
        },
        confirmText: options.confirmText || 'Submit',
        cancelText: options.cancelText || 'Cancel',
        showFooter: true,
      });
    });
  }, [openModal, closeModal]);

  return {
    // State
    isOpen,
    isAnimating,
    modalContent,
    modalOptions,
    
    // Refs
    modalRef,
    
    // Methods
    openModal,
    closeModal,
    confirmModal,
    setModalContent,
    setModalOptions,
    
    // Convenience methods
    alert,
    confirm,
    prompt,
    
    // Render method
    Modal,
  };
};

export default useModal;
