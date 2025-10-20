import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';

const SIZE_CLASSES = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
};

const Modal = ({ isOpen, onClose, title, children, size = 'md', closeOnBackdrop = true }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-40"
        onClick={() => closeOnBackdrop && onClose?.()}
        aria-hidden="true"
      />

      <div className={clsx('relative z-10 w-full mx-4', SIZE_CLASSES[size])} role="dialog" aria-modal="true">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="text-lg font-medium">{title}</div>
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="p-1 rounded hover:bg-gray-100"
            >
              ✕
            </button>
          </div>

          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
