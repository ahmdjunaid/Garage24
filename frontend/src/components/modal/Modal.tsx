import React from "react";
import logo from '../../assets/icons/Logo.png'

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  handleError?: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, handleError }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black/50 z-40"
        onClick={(e) => e.stopPropagation()}
      ></div>

      <div className="relative bg-white p-6 rounded-lg shadow-lg z-50 w-96">
        <button
          onClick={() => (onClose?.(), handleError?.())}
          className="absolute right-4 top-4 text-gray-500 hover:text-red-600 transition-colors duration-200"
          aria-label="Close"
        >
          ✕
        </button>
        {/* child component will be rendered here */}
        <img src={logo} alt="GARAGE24" className="w-25" />
        {children}
      </div>
    </div>
  );
};

export default Modal;
