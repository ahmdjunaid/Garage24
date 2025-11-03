import React, { useState } from "react";
import DarkModal from "../layouts/DarkModal";
import { signUpApi } from "../../services/auth";
import { errorToast } from "../../utils/notificationAudio";
import Spinner from "../elements/Spinner";
import { emailRegex, nameRegex, passwordRegex } from "../../constants/commonRegex";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (data:registerData) => void;
}

export interface registerData {
    name: string;
    email: string;
    password: string;
    role: string;
}

const RegisterMechanic:React.FC<ModalProps> = ({ isOpen, onClose, onCreated}) => {
      const [name, setName] = useState<string>("");
      const [email, setEmail] = useState<string>("");
      const [password, setPassword] = useState<string>("");
      const [nameError, setNameError] = useState<string>("");
      const [emailError, setEmailError] = useState<string>("");
      const [passwordError, setPasswordError] = useState<string>("");
      const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = async () => {
    setNameError("");
    setEmailError("");
    setPasswordError("");
    let hasError = false;
    
    if (!nameRegex.test(name)) {
      setNameError("Enter a valid name.");
      hasError = true;
    }
    
    if (!emailRegex.test(email)) {
      setEmailError("Enter a valid email address.");
      hasError = true;
    }
    
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be 8+ chars with uppercase, lowercase, number, and special character."
      );
      hasError = true;
    }
    
    if (!hasError) {
      try {
        setLoading(true)
        const data = { name, email, password, role: "mechanic" }
        await signUpApi(data);

        onCreated(data)

        setTimeout(() => {
          setName("");
          setEmail("");
          setPassword("");
          setLoading(false)
        }, 2000);
      } catch (error) {
        if(error instanceof Error){
          console.error(error);
          errorToast(error.message || "Error while creating mechanic");
        }
        setLoading(false)
      } finally {
        setLoading(false)
      }
    }
  };

  return (
    <DarkModal isOpen={isOpen} onClose={() => onClose()}>
      <div className="text-white mt-5 rounded-2xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-6">Add Mechanic</h2>
        {/* Name */}
        <div>
          <label className="block mb-2 text-sm font-medium">Name:</label>
          <input
            type="text"
            placeholder="Enter full-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#1c1c1c] border border-transparent focus:border-red-600 rounded-md px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none transition"
          />
          {nameError ? (
            <p className="text-red-600 font-light text-sm ">{nameError}</p>
          ) : (
            ""
          )}
        </div>

        {/* Login credentials */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Login credentials:</h3>

          {/* Email */}
          <label className="block mb-2 text-sm font-medium">Email ID:</label>
          <input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#1c1c1c] border border-transparent focus:border-red-600 rounded-md px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none transition"
          />
          {emailError ? (
            <p className="text-red-600 font-light text-sm ">{emailError}</p>
          ) : (
            ""
          )}

          {/* Password */}
          <label className="block mt-6 mb-2 text-sm font-medium">
            One-Time Password:
          </label>
          <input
            type="text"
            placeholder="Enter a temporory password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#1c1c1c] border border-transparent focus:border-red-600 rounded-md px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none transition"
          />
          {passwordError ? (
            <p className="text-red-600 font-light text-sm ">{passwordError}</p>
          ) : (
            ""
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={() => onClose()}
            className="bg-black text-white px-5 py-2.5 rounded-lg hover:bg-neutral-900 transition"
          >
            Cancel
          </button>
          <button
            className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Loading..." : "Add Mechanic"}
          </button>
        </div>
      </div>
      <Spinner loading={loading} />
    </DarkModal>
  );
};

export default RegisterMechanic;
