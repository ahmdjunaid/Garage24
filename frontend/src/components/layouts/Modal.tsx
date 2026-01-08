import React from "react";
import { createPortal } from "react-dom";
import logo from "@assets/icons/Logo.png";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal box */}
      <div
        className="relative z-50 w-96 rounded-lg bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-red-600 transition-colors duration-200"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Logo */}
        <img src={logo} alt="GARAGE24" className="mb-4 w-24" />

        {/* Modal content */}
        {children}
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;