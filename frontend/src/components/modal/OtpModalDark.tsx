import React, { useState } from "react";
import DarkModal from "../layouts/DarkModal";
import { resendOtpApi, verifyOtpApi } from "../../services/authServices";
import { useOtpTimer } from "../../hooks/useOtpTimer";
import { otpRegex } from "../../constants/commonRegex";
import { successToast } from "../../utils/notificationAudio";

interface ModalProps {
  isOpen: boolean;
  email: string | undefined;
  context: "register" | "other";
  onClose: () => void;
  onVerified: (userId: string) => void;
}

const OtpModalDark: React.FC<ModalProps> = ({
  isOpen,
  email,
  context,
  onClose,
  onVerified,
}) => {
  const { seconds, resetTimer } = useOtpTimer(120, isOpen);
  const [resendDisabled, setResendDisabled] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");

  const handleOtp = async () => {
    setOtpError("");
    try {
      if (!otpRegex.test(otp)) {
        setOtpError("OTP must be a 6-digit number.");
        return;
      }

      if (!email) return;
      const { userId } = await verifyOtpApi({ email, otp, context });

      setTimeout(() => {
        onClose();
        onVerified(userId);
        setOtp("");
      }, 1000);
    } catch (error) {
      if (error instanceof Error) {
        setOtpError(error.message || "something went wrong");
        console.error("error on verifying Otp", error.message);
      }
    }
  };

  const handleResendOtp = async () => {
    try {
      setResendDisabled(true);
      if (!email) return;
      await resendOtpApi({ email, context: "register" });
      resetTimer();

      successToast("OTP has been resent successfully.");

      setTimeout(() => {
        setResendDisabled(false);
      }, 10000);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        setOtpError(error.message || "Error while resend OTP.");
      }
      setResendDisabled(false);
    }
  };

  return (
    <DarkModal isOpen={isOpen} onClose={() => onClose()}>
      <div className="flex flex-col space-y-4">
        <p className="text-center text-white/50 font-bold">OTP Verification</p>
        {otpError && (
          <div className="border border-red-600 p-2 rounded-lg mb-2">
            <p className="text-red-600 text-center text-sm">{otpError}</p>
          </div>
        )}
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full bg-[#1c1c1c] border border-transparent focus:border-red-600 rounded-md px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none transition"
        />
        <button
          className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition"
          onClick={handleOtp}
          disabled={seconds > 0 ? false : true}
        >
          Verify OTP
        </button>
        {seconds > 0 ? (
          <p className="text-center text-white/50 font-light">
            {seconds} Seconds Left
          </p>
        ) : (
          <button
            onClick={handleResendOtp}
            disabled={resendDisabled}
            className="text-center text-white/50 font-bold hover:text-red-500"
          >
            {resendDisabled ? "Please wait..." : "Resend OTP"}
          </button>
        )}
      </div>
    </DarkModal>
  );
};

export default OtpModalDark;
