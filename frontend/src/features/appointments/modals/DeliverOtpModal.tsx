import React, { useState } from "react";
import DarkModal from "../../../components/modal/DarkModal";
import { otpRegex } from "../../../constants/commonRegex";
import { successToast } from "../../../utils/notificationAudio";
import {
  resendDeliveryOtpApi,
  verifyDeliveryOtpApi,
} from "../services/appointmentServices";

interface ModalProps {
  isOpen: boolean;
  appointmentId: string | null;
  onClose: () => void;
}

const DeliveryOtpModal: React.FC<ModalProps> = ({
  isOpen,
  appointmentId,
  onClose,
}) => {
  const [otp, setOtp] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);

  const handleOtp = async () => {
    setOtpError("");
    try {
      setLoading(true);
      if (!otpRegex.test(otp)) {
        setLoading(false);
        setOtpError("OTP must be a 6-digit number.");
        return;
      }

      if (!appointmentId) return;
      await verifyDeliveryOtpApi({ appointmentId, otp });
      successToast("OTP Verified");
      setTimeout(() => {
        onClose();
        setOtp("");
      }, 1000);
    } catch (error) {
      if (error instanceof Error) {
        setOtpError(error.message || "something went wrong");
        console.error("error on verifying Otp", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setResendLoading(true);

      if (!appointmentId) return;
      await resendDeliveryOtpApi(appointmentId);

      successToast("OTP has been resent successfully.");
      setResendLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        setOtpError(error.message || "Error while resend OTP.");
      }
      setResendLoading(false);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <DarkModal isOpen={isOpen} onClose={() => onClose()}>
      <div className="flex flex-col space-y-4">
        <p className="text-center text-white/50 font-bold">
          Delivery OTP Verification
        </p>
        {otpError && (
          <div className="border border-red-600 p-2 rounded-lg mb-2">
            <p className="text-red-600 text-center text-sm">{otpError}</p>
          </div>
        )}
        <input
          type="text"
          placeholder="Please enter the OTP sent to the customer’s email address."
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full bg-[#1c1c1c] border border-transparent focus:border-red-600 rounded-md px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none transition"
        />
        <button
          className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          onClick={handleOtp}
          disabled={loading || resendLoading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
        <button
          onClick={handleResendOtp}
          disabled={resendLoading || loading}
          className="text-center text-white/50 font-bold hover:text-red-500"
        >
          {resendLoading ? "Please wait..." : "Resend OTP"}
        </button>
      </div>
    </DarkModal>
  );
};

export default DeliveryOtpModal;
