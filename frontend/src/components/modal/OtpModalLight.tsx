import React, { useState } from "react";
import Modal from "../layouts/Modal";
import Input from "../elements/Input";
import AuthButton from "../elements/AuthButton";
import { resendOtpApi, verifyOtpApi } from "../../services/authServices";
import { successToast } from "../../utils/notificationAudio";
import { OTP_VERIFIED } from "../../constants/messages";
import passwordIcon from "../../assets/icons/password.svg";
import { useOtpTimer } from "../../hooks/useOtpTimer";
import { otpRegex } from "../../constants/commonRegex";

interface ModalProps {
  isOpen: boolean;
  email: string;
  context: "register" | "other"
  onClose: () => void;
  onVerified: (accessToken:string) => void;
}

const OtpModalLight: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  context,
  email,
  onVerified
}) => {
  const { seconds, resetTimer } = useOtpTimer(120, isOpen);
  const [otpError, setOtpError] = useState<string>("");
  const [resendDisabled, setResendDisabled] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");

  const handleOtp = async () => {
    try {
      if(!otpRegex.test(otp)){
        setOtpError("OTP must be a 6-digit number.");
        return;
      }

      const res = await verifyOtpApi({ email, otp, context});
      successToast(OTP_VERIFIED);

      setTimeout(() => {
        onClose();
        setOtp("");
        onVerified(res?.token)
      }, 2000);
    } catch (error) {
      console.error("error on sending otp", error);
      if(error instanceof Error){
          setOtpError(error.message);
      }else{
        setOtpError("Something went wrong")
      }
    }
  };

  const handleResendOtp = async () => {
    try {
      setResendDisabled(true);
      await resendOtpApi({ email, context });
      resetTimer()
      successToast("OTP has been resent successfully.");

      setTimeout(() => {
        setResendDisabled(false);
      }, 120000);
    } catch (error) {
      setResendDisabled(false);
      console.error(error,"Error while resend otp");
      if(error instanceof Error){
          setOtpError(error.message);
      }else{
        setOtpError("Error while resend OTP.")
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => onClose()}>
      <div className="flex flex-col space-y-4">
        <p className="text-center text-black/50 font-bold">OTP Verification</p>
        {otpError && (
          <div className="bg-red-100 border border-red-600 p-2 rounded-lg mb-2">
            <p className="text-red-600 text-center text-sm">{otpError}</p>
          </div>
        )}
        <Input
          icon={passwordIcon}
          placeholder="Enter OTP"
          onChange={(e) => setOtp(e.target.value)}
          type="text"
          value={otp}
        />
        <AuthButton
          action={handleOtp}
          text={"Verify OTP"}
          loading={seconds > 0 ? false : true}
        />
        {seconds > 0 ? (
          <p className="text-center text-black/50 font-light">
            {seconds} Seconds Left
          </p>
        ) : (
          <button
            onClick={handleResendOtp}
            className="text-center text-black/50 font-bold hover:text-red-500"
            disabled={resendDisabled}
          >
            {resendDisabled ? "Please wait..." : "Resend OTP"}
          </button>
        )}
      </div>
    </Modal>
  );
};

export default OtpModalLight;