import React, { useEffect, useState } from "react";
import DarkModal from "../layouts/DarkModal";
import { errorToast, successToast } from "../../utils/notificationAudio";
import Spinner from "../elements/Spinner";
import { serviceNameRegex } from "../../constants/commonRegex";
import {
  createServiceApi,
  getAllServiceCatoriesApi,
} from "@/services/garageServices";
import type { IServiceCategory } from "@/types/ServiceCategoryTypes";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const RegisterServices: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [categoryId, setCategory] = useState<string>("");
  const [categoryError, setCategoryError] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [price, setPrice] = useState<string>();
  const [priceError, setPriceError] = useState<string>("");
  const [duration, setDuration] = useState<string>();
  const [durationError, setDurationError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [serviceCategories, setServiceCategories] = useState<IServiceCategory[] | null>(null);

  useEffect(() => {
    const fetchServiceCategories = async () => {
      const res = await getAllServiceCatoriesApi();
      console.log(res);
      setServiceCategories(res);
    };

    fetchServiceCategories();
  }, [isOpen]);

  const handleSubmit = async () => {
    setCategoryError("");
    setNameError("");
    setPriceError("");
    setDurationError("");
    const numericPrice = Number(price);
    const numericDuration = Number(duration);
    let hasError = false;

    if (!serviceNameRegex.test(name)) {
      setNameError("Enter a valid name.");
      hasError = true;
    }

    if (!categoryId?.trim()) {
      setCategoryError("Select a category.");
      hasError = true;
    }

    if (!price || isNaN(numericPrice) || numericPrice <= 0) {
      setPriceError("Enter a valid price.");
      hasError = true;
    }

    if (!duration || isNaN(numericDuration) || numericDuration <= 0) {
      setDurationError("Enter a valid duration.");
      hasError = true;
    }

    if (!hasError) {
      try {
        setLoading(true);
        await createServiceApi({
          categoryId,
          name,
          price: numericPrice,
          durationMinutes: numericDuration,
        });

        successToast("New service listed.");
        onCreated();

        setTimeout(() => {
          setCategory("");
          setName("");
          setPrice("");
          setDuration("");
          setLoading(false);
        }, 2000);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error);
          errorToast(error.message || "Error while creating service");
        }
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <DarkModal isOpen={isOpen} onClose={() => onClose()}>
      <div className="text-white mt-5 rounded-2xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-6">Add Service</h2>
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
          <label className="block mb-2 text-sm font-medium">
            Select Category:
          </label>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-[#1c1c1c] border border-transparent focus:border-red-600 rounded-md px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none transition"
          >
            <option value="" selected disabled>
              Select a catgory
            </option>
            {serviceCategories && serviceCategories.map((cat) => {
              return <option value={cat._id}>{cat.name}</option>;
            })}
          </select>
          {categoryError ? (
            <p className="text-red-600 font-light text-sm ">{categoryError}</p>
          ) : (
            ""
          )}

          {/* Price */}
          <label className="block mb-2 text-sm font-medium">Price:</label>
          <input
            type="number"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-[#1c1c1c] border border-transparent focus:border-red-600 rounded-md px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none transition"
          />
          {priceError ? (
            <p className="text-red-600 font-light text-sm ">{priceError}</p>
          ) : (
            ""
          )}

          {/* Duration */}
          <label className="block mb-2 text-sm font-medium">Duration:</label>
          <input
            type="number"
            placeholder="Service duration (in minutes)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full bg-[#1c1c1c] border border-transparent focus:border-red-600 rounded-md px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none transition"
          />
          {durationError ? (
            <p className="text-red-600 font-light text-sm ">{durationError}</p>
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
            {loading ? "Loading..." : "Add Service"}
          </button>
        </div>
      </div>
      <Spinner loading={loading} />
    </DarkModal>
  );
};

export default RegisterServices;
