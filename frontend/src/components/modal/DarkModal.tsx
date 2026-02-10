import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import whiteLogo from "@assets/icons/logo-white.png";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  handleError?: () => void;
}

const DarkModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  handleError,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal box */}
      <div
        className="relative z-50 w-[480px] max-h-[90vh] overflow-y-auto rounded-lg bg-black p-6 shadow-lg dark-modal-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => {
            onClose?.();
            handleError?.();
          }}
          className="absolute right-4 top-4 text-gray-500 hover:text-red-600"
        >
          ✕
        </button>

        {/* Logo */}
        <img src={whiteLogo} alt="GARAGE24" className="mb-4 w-24" />

        {/* Modal content */}
        {children}
      </div>
    </div>,
    modalRoot,
  );
};

export default DarkModal;
