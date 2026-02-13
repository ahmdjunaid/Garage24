import DarkModal from "@/components/modal/DarkModal";
import type { IRetriveSessionData } from "@/types/CommonTypes";
import { CheckCircle2 } from "lucide-react";
import type React from "react";
import { Link } from "react-router-dom";

interface paymentProps {
  paymentData: IRetriveSessionData | null;
  isOpen: boolean;
  onClose: () => void;
}

const PaymentSuccessModal: React.FC<paymentProps> = ({
  paymentData,
  isOpen,
  onClose,
}) => {
  if (!paymentData) return;
  const {
    transactionId,
    productName,
    amountPaid,
    paymentMethod,
    date,
    receipt_url,
  } = paymentData;

  const formattedDate = new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <DarkModal isOpen={isOpen} onClose={() => onClose()}>
      <div className="p-2 w-full max-w-lg text-center text-white overflow-hidden shadow-2xl backdrop-blur-sm">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <CheckCircle2 size={70} className="text-green-500" />
        </div>

        <h2 className="text-2xl font-bold mb-2 text-green-400">
          Payment Successful!
        </h2>
        <p className="text-gray-300 mb-6">
          Your payment has been processed successfully. Thank you for your
          purchase!
        </p>

        {/* Receipt Card */}
        <div className="bg-gray-900 rounded-xl p-6 text-left">
          <div className="flex justify-between py-2 border-b border-gray-700">
            <span className="text-gray-400">Transaction ID</span>
            <span className="font-small">{transactionId}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-gray-700">
            <span className="text-gray-400">Plan</span>
            <span className="font-small">{productName}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-gray-700">
            <span className="text-gray-400">Amount Paid</span>
            <span className="font-small">₹{amountPaid}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-gray-700">
            <span className="text-gray-400">Payment Method</span>
            <span className="font-small">{paymentMethod}</span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-gray-400">Date</span>
            <span className="font-small">{formattedDate}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <Link
            to={"/"}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg"
          >
            Back to Home
          </Link>
          <button
            onClick={() => window.open(receipt_url, "_blank")}
            className="border border-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg"
          >
            Download Receipt
          </button>
        </div>
      </div>
    </DarkModal>
  );
};

export default PaymentSuccessModal;
