import React, { useState } from "react";
import DarkModal from "../layouts/DarkModal";
import { errorToast, successToast } from "../../utils/notificationAudio";
import Spinner from "../elements/Spinner";
import { emailRegex, nameRegex } from "../../constants/commonRegex";
import { registerMechanicApi } from "../../services/garageServices";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const RegisterMechanic:React.FC<ModalProps> = ({ isOpen, onClose, onCreated}) => {
      const [name, setName] = useState<string>("");
      const [email, setEmail] = useState<string>("");
      const [nameError, setNameError] = useState<string>("");
      const [emailError, setEmailError] = useState<string>("");
      const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = async () => {
    setNameError("");
    setEmailError("");
    let hasError = false;
    
    if (!nameRegex.test(name)) {
      setNameError("Enter a valid name.");
      hasError = true;
    }
    
    if (!emailRegex.test(email)) {
      setEmailError("Enter a valid email address.");
      hasError = true;
    }
    
    if (!hasError) {
      try {
        setLoading(true)
        const data = { name, email, role: "mechanic" }
        await registerMechanicApi(data);

        successToast("New mechanic added to your garage.")
        onCreated()

        setTimeout(() => {
          setName("");
          setEmail("");
          setLoading(false)
        }, 2000);
      } catch (error) {
        if(error instanceof Error){
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
        <div className="space-y-5">
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
