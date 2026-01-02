import React, { useEffect } from "react";
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div
        className="relative z-50 w-[480px] max-h-[90vh] overflow-y-auto rounded-lg bg-black p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            onClose?.();
            handleError?.();
          }}
          className="absolute right-4 top-4 text-gray-500 hover:text-red-600"
        >
          ✕
        </button>

        <img src={whiteLogo} alt="GARAGE24" className="w-24 mb-4" />

        {children}
      </div>
    </div>
  );
};

export default DarkModal;
