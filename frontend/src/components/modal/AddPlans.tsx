import React, { useState } from "react";
import DarkModal from "../layouts/DarkModal";
import { errorToast, successToast } from "../../utils/notificationAudio";
import Spinner from "../elements/Spinner";
import { nameRegex } from "../../constants/commonRegex";
import { createPlanApi } from "../../services/admin";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
  token: string | null
}

export interface PlanData {
  name: string;
  price: number;
  validity: number;
  noOfMechanics: number;
  noOfServices: number;
}

const AddPlans: React.FC<ModalProps> = ({ isOpen, onClose, onCreated, token }) => {
  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");

  const [price, setPrice] = useState<string>("");
  const [priceError, setPriceError] = useState<string>("");

  const [validity, setValidity] = useState<string>("");
  const [validityError, setValidityError] = useState<string>("");

  const [noOfMechanics, setNoOfMechanics] = useState<string>("");
  const [noOfMechanicsError, setNoOfMechanicsError] = useState<string>("");

  const [noOfServices, setNoOfServices] = useState<string>("");
  const [noOfServicesError, setNoOfServicesError] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const resetErrors = () => {
    setNameError("");
    setPriceError("");
    setValidityError("");
    setNoOfMechanicsError("");
    setNoOfServicesError("");
  };

  const handleSubmit = async () => {
    resetErrors();
    let hasError = false;

    if (!name.trim() || !nameRegex.test(name)) {
      setNameError("Enter a valid plan name (letters and spaces only).");
      hasError = true;
    }

    const priceValue = Number(price);
    if (!price || isNaN(priceValue) || priceValue <= 0) {
      setPriceError("Enter a valid positive price for this plan.");
      hasError = true;
    }

    const validityValue = Number(validity);
    if (!validity || isNaN(validityValue) || validityValue <= 0) {
      setValidityError("Select a valid duration.");
      hasError = true;
    }

    const mechanicsValue = Number(noOfMechanics);
    if (!noOfMechanics || isNaN(mechanicsValue) || mechanicsValue < 1) {
      setNoOfMechanicsError("Enter a valid number of mechanics.");
      hasError = true;
    }

    const servicesValue = Number(noOfServices);
    if (!noOfServices || isNaN(servicesValue) || servicesValue < 1) {
      setNoOfServicesError("Enter a valid number of services allowed.");
      hasError = true;
    }

    if (hasError) return;

    try {
      setLoading(true);
      const data: PlanData = {
        name: name.trim(),
        price: priceValue,
        validity: validityValue,
        noOfMechanics: mechanicsValue,
        noOfServices: servicesValue,
      };

      await createPlanApi(data, token);

      successToast('New plan created.')
      onCreated();

      setTimeout(() => {
        setName("");
        setPrice("");
        setValidity("");
        setNoOfMechanics("");
        setNoOfServices("");
        setLoading(false);
      }, 800);
    } catch (error) {
      if (error instanceof Error) {
        errorToast(error.message || "Error while creating plan");
      }
      setLoading(false);
    }
  };

  return (
    <DarkModal isOpen={isOpen} onClose={onClose}>
      <div className="text-white mt-5 rounded-2xl w-full space-y-4 max-w-md">
        <h2 className="text-xl font-semibold mb-6">Add Plan</h2>

        {/* Plan Name */}
        <div>
          <label className="block mb-2 text-sm font-medium">Plan Name:</label>
          <input
            type="text"
            placeholder="Enter the plan name."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#1c1c1c] border border-transparent focus:border-red-600 rounded-md px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none transition"
          />
          {nameError && <p className="text-red-600 text-sm">{nameError}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block mb-2 text-sm font-medium">Price:</label>
          <input
            type="number"
            placeholder="Enter the price of the plan."
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-[#1c1c1c] border border-transparent focus:border-red-600 rounded-md px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none transition"
          />
          {priceError && <p className="text-red-600 text-sm">{priceError}</p>}
        </div>

        {/* Validity */}
        <div>
          <label className="block mb-2 text-sm font-medium">Validity:</label>
          <select
            value={validity}
            onChange={(e) => setValidity(e.target.value)}
            className="w-full bg-[#1c1c1c] border border-transparent focus:border-red-600 rounded-md px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none transition"
          >
            <option value="">Select duration</option>
            <option value="30">30 Days</option>
            <option value="180">180 Days</option>
            <option value="365">365 Days</option>
          </select>
          {validityError && (
            <p className="text-red-600 text-sm">{validityError}</p>
          )}
        </div>

        {/* No of mechanics */}
        <div>
          <label className="block mb-2 text-sm font-medium">
            Allowed No. of Mechanics:
          </label>
          <input
            type="number"
            placeholder="Enter the number of mechanics allowed."
            value={noOfMechanics}
            onChange={(e) => setNoOfMechanics(e.target.value)}
            className="w-full bg-[#1c1c1c] border border-transparent focus:border-red-600 rounded-md px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none transition"
          />
          {noOfMechanicsError && (
            <p className="text-red-600 text-sm">{noOfMechanicsError}</p>
          )}
        </div>

        {/* No of services */}
        <div>
          <label className="block mb-2 text-sm font-medium">
            Allowed No. of Services (Listings):
          </label>
          <input
            type="number"
            placeholder="Enter the number of listings allowed."
            value={noOfServices}
            onChange={(e) => setNoOfServices(e.target.value)}
            className="w-full bg-[#1c1c1c] border border-transparent focus:border-red-600 rounded-md px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none transition"
          />
          {noOfServicesError && (
            <p className="text-red-600 text-sm">{noOfServicesError}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="bg-black text-white px-5 py-2.5 rounded-lg hover:bg-neutral-900 transition"
          >
            Cancel
          </button>
          <button
            className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Loading..." : "Add Plan"}
          </button>
        </div>
      </div>
      <Spinner loading={loading} />
    </DarkModal>
  );
};

export default AddPlans;
