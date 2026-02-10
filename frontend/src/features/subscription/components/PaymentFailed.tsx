import type React from "react";
import DarkModal from "../../../components/modal/DarkModal";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PaymentFailed:React.FC<ModalProps> = ({ isOpen, onClose }) => {
  return (
    <DarkModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col space-y-4 text-center">
        {/* ❌ Icon */}
        <div className="flex justify-center">
          <div className="bg-red-600/20 text-red-600 rounded-full p-3 text-xl">
            ❌
          </div>
        </div>

        {/* Title */}
        <p className="text-white font-bold text-lg">Payment Failed</p>

        {/* Message */}
        <p className="text-white/60 text-sm">
          We couldn't complete your payment. Please try again.
        </p>

        {/* Primary Action */}
        <button
        //   onClick={handleRetryPayment}
          className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition"
        >
          Retry Payment
        </button>

        {/* Secondary Action */}
        <button
        //   onClick={handleBack}
          className="text-white/50 font-bold hover:text-red-500 transition"
        >
          Back to Plans
        </button>
      </div>
    </DarkModal>
  );
};

export default PaymentFailed;
