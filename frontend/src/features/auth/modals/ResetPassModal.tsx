import React, { useState } from "react";
import Modal from "../../../components/modal/Modal";
import Input from "../components/Input";
import AuthButton from "../components/AuthButton";
import passwordIcon from "@assets/icons/password.svg";
import { resetPasswordApi } from "../services/authServices";
import { errorToast, successToast } from "../../../utils/notificationAudio";
import { passwordRegex } from "../../../constants/commonRegex";
import { useNavigate } from "react-router-dom";

interface ModalProps {
  isOpen: boolean;
  email: string;
  onClose: () => void;
}

const ResetPassModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  email,
}) => {
  const [passwordError, setPasswordError] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [CPassword, setCPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleResetPassword = async () => {
    setLoading(true);
    let hasError = false;
    setPasswordError("");

    if (!password.trim() || !CPassword.trim()) {
      setPasswordError("Enter and confirm your password.");
      hasError = true;
    }

    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be 8+ chars with uppercase, lowercase, number, and special character."
      );
      hasError = true;
    }

    if (password !== CPassword) {
      setPasswordError("Please make sure the passwords match.");
      hasError = true;
    }

    if (hasError) {
      setLoading(false);
      return;
    }

    try {
        const res = await resetPasswordApi({ email, password });
        successToast(res.message || "Password reset successfull.");

        setTimeout(() => {
          onClose();
          navigate("/login");
          setPassword("");
          setCPassword("");
        }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        errorToast(error.message);
      } else {
        errorToast("Password reset failed, Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => onClose()}>
      <div className="flex flex-col space-y-4">
        <p className="text-center text-black/50 font-bold">Reset password</p>
        {passwordError && (
          <div className="bg-red-100 border border-red-600 p-2 rounded-lg mb-2">
            <p className="text-red-600 text-center text-sm">{passwordError}</p>
          </div>
        )}
        <Input
          icon={passwordIcon}
          placeholder="New password"
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          value={password}
        />
        <Input
          icon={passwordIcon}
          placeholder="Confirm password"
          onChange={(e) => setCPassword(e.target.value)}
          type="password"
          value={CPassword}
        />
        <AuthButton
          action={handleResetPassword}
          text={"Reset password"}
          loading={loading}
        />
      </div>
    </Modal>
  );
};

export default ResetPassModal;
