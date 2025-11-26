import React, { useState, useEffect } from "react";
import DarkModal from "../layouts/DarkModal";
import { errorToast, successToast } from "../../utils/notificationAudio";
import Spinner from "../elements/Spinner";
import { nameRegex } from "../../constants/commonRegex";
import { updatePlanApi } from "../../services/adminServices";

interface ModalProps {
  planData: PlanData;
  onClose: () => void;
  onEdited: () => void;
}

export interface PlanData {
  _id: string;
  name: string;
  price: number;
  validity: number;
  noOfMechanics: number;
  noOfServices: number;
}

const EditPlans: React.FC<ModalProps> = ({ planData, onClose, onEdited }) => {
  const [name, setName] = useState<string>(planData.name);
  const [price, setPrice] = useState<string>(String(planData.price));
  const [validity, setValidity] = useState<string>(String(planData.validity));
  const [noOfMechanics, setNoOfMechanics] = useState<string>(
    String(planData.noOfMechanics)
  );
  const [noOfServices, setNoOfServices] = useState<string>(
    String(planData.noOfServices)
  );

  const [nameError, setNameError] = useState<string>("");
  const [priceError, setPriceError] = useState<string>("");
  const [validityError, setValidityError] = useState<string>("");
  const [noOfMechanicsError, setNoOfMechanicsError] = useState<string>("");
  const [noOfServicesError, setNoOfServicesError] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setName(planData.name);
    setPrice(String(planData.price));
    setValidity(String(planData.validity));
    setNoOfMechanics(String(planData.noOfMechanics));
    setNoOfServices(String(planData.noOfServices));
  }, [planData]);

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
      setNameError("Enter a valid plan name.");
      hasError = true;
    }

    const priceValue = Number(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      setPriceError("Enter a valid price.");
      hasError = true;
    }

    const validityValue = Number(validity);
    if (isNaN(validityValue) || validityValue <= 0) {
      setValidityError("Enter valid duration.");
      hasError = true;
    }

    const mechanicsValue = Number(noOfMechanics);
    if (isNaN(mechanicsValue) || mechanicsValue < 1) {
      setNoOfMechanicsError("Enter valid mechanic limit.");
      hasError = true;
    }

    const servicesValue = Number(noOfServices);
    if (isNaN(servicesValue) || servicesValue < 1) {
      setNoOfServicesError("Enter valid services limit.");
      hasError = true;
    }

    if (hasError) return;

    try {
      setLoading(true);

      const updatedData: PlanData = {
        _id: planData._id,
        name: name.trim(),
        price: priceValue,
        validity: validityValue,
        noOfMechanics: mechanicsValue,
        noOfServices: servicesValue,
      };

      await updatePlanApi(planData._id,updatedData);
      successToast("Plan updated successfully");
      onEdited();

      setLoading(false);
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        errorToast(error.message || "Failed to update plan");
      }
      setLoading(false);
    }
  };

  return (
    <DarkModal isOpen={planData !== null} onClose={onClose}>
      <div className="text-white mt-5 rounded-2xl w-full space-y-4 max-w-md">
        <h2 className="text-xl font-semibold mb-6">Edit Plan</h2> {/* name */}
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
          <input
            value={validity}
            placeholder="Enter no. of days"
            onChange={(e) => setValidity(e.target.value)}
            className="w-full bg-[#1c1c1c] border border-transparent focus:border-red-600 rounded-md px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none transition"
          />
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
          <button className="bg-black px-5 py-2.5 rounded-lg" onClick={onClose}>
            Cancel
          </button>
          <button
            className="bg-red-600 px-5 py-2.5 rounded-lg"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
      <Spinner loading={loading} />
    </DarkModal>
  );
};

export default EditPlans;
