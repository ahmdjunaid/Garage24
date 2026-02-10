import React, { useEffect, useState } from "react";
import DarkModal from "../../../components/modal/DarkModal";
import { Upload } from "lucide-react";
import { errorToast, successToast } from "@/utils/notificationAudio";
import type { IBrand } from "@/types/BrandTypes";
import type { IVehicleModel } from "@/types/VehicleModelTypes";
import type { IVehicleDTO } from "@/types/VehicleTypes";
import { isValidIndianPlate } from "@/utils/validateLicencePlate";
import { fuelTypes } from "@/constants/constantDatas";
import {
  getAllBrandsApi,
  getVehicleModelsByBrandApi,
  registerVehicleApi,
  updateVehicleApi,
} from "../services/vehicleServices";

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
  vehicle: IVehicleDTO | null;
}

interface Errors {
  [key: string]: string;
}

const initialFormData = {
  licensePlate: "",
  make: "",
  model: "",
  registrationYear: "",
  fuelType: "",
  variant: "",
  color: "",
  insuranceValidity: "",
  puccValidity: "",
};

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
  isOpen,
  onClose,
  onCreated,
  vehicle,
}) => {
  const isEditMode = Boolean(vehicle);

  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [vehicleModels, setVehicleModels] = useState<IVehicleModel[]>([]);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const fetchBrands = async () => {
      const res = await getAllBrandsApi();
      setBrands(res);
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    const fetchVehicleModels = async () => {
      if (!formData.make) return;
      const res = await getVehicleModelsByBrandApi(formData.make);
      setVehicleModels(res);
    };
    fetchVehicleModels();
  }, [formData.make]);

  useEffect(() => {
    if (vehicle && isOpen) {
      setFormData({
        licensePlate: vehicle.licensePlate || "",
        make: vehicle.makeId || "",
        model: vehicle.modelId || "",
        registrationYear: String(vehicle.registrationYear || ""),
        fuelType: vehicle.fuelType || "",
        variant: vehicle.variant || "",
        color: vehicle.color || "",
        insuranceValidity: vehicle.insuranceValidity
          ? vehicle.insuranceValidity.toString().slice(0, 10)
          : "",
        puccValidity: vehicle.puccValidity
          ? vehicle.puccValidity.toString().slice(0, 10)
          : "",
      });

      setPreview(vehicle.imageUrl || null);
      setImageFile(null);
    }

    if (!vehicle && isOpen) {
      setFormData(initialFormData);
      setPreview(null);
      setImageFile(null);
      setErrors({});
    }
  }, [vehicle, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (file: File) => {
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const validate = () => {
    const newErrors: Errors = {};

    if (!formData.licensePlate)
      newErrors.licensePlate = "License plate is required";
    else if (!isValidIndianPlate(formData.licensePlate))
      newErrors.licensePlate = "Invalid license plate";

    if (!formData.make) newErrors.make = "Car make is required";
    if (!formData.model) newErrors.model = "Car model is required";

    if (!formData.registrationYear)
      newErrors.registrationYear = "Registration year is required";
    else if (
      Number(formData.registrationYear) < 1950 ||
      Number(formData.registrationYear) > new Date().getFullYear()
    )
      newErrors.registrationYear = "Invalid year";

    if (!formData.fuelType) newErrors.fuelType = "Fuel type is required";
    if (!formData.color) newErrors.color = "Color is required";
    if (!formData.insuranceValidity)
      newErrors.insuranceValidity = "Insurance date required";
    if (!formData.puccValidity) newErrors.puccValidity = "PUCC date required";

    if (!imageFile && !isEditMode)
      newErrors.image = "Vehicle image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });

      if (imageFile) payload.append("vehicleImage", imageFile);

      if (isEditMode && vehicle?._id) {
        await updateVehicleApi(vehicle._id, payload);
        successToast("Vehicle updated successfully");
      } else {
        await registerVehicleApi(payload);
        successToast("Vehicle added successfully");
      }
      setFormData(initialFormData);
      onCreated();
      onClose();
    } catch (err) {
      if (err instanceof Error) errorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DarkModal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-white text-xl font-semibold mb-1 mt-5">
        {isEditMode ? "Update Vehicle" : "Add Your Vehicle"}
      </h2>
      <p className="text-sm text-gray-400 mb-6">
        {isEditMode
          ? "Update your vehicle details"
          : "Save your vehicle details for quick bookings"}
      </p>

      {/* IMAGE */}
      <div className="mb-6">
        <label className="text-sm text-gray-400 mb-2 block">
          Vehicle Image
        </label>

        <div className="relative h-44 rounded-xl border border-dashed border-gray-600 hover:border-red-500 transition overflow-hidden">
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) =>
              e.target.files && handleImageChange(e.target.files[0])
            }
          />

          {preview ? (
            <img src={preview} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <Upload className="mb-2" />
              <p className="text-sm">Upload vehicle image</p>
            </div>
          )}
        </div>

        {errors.image && (
          <p className="text-red-500 text-xs mt-1">{errors.image}</p>
        )}
      </div>

      {/* FORM */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          name="licensePlate"
          value={formData.licensePlate}
          onChange={handleChange}
          error={errors.licensePlate}
          placeholder="License Plate"
          disabled={isEditMode}
          span
        />

        <Select
          name="make"
          value={formData.make}
          onChange={handleChange}
          error={errors.make}
          options={brands.map((b) => ({ value: b._id, label: b.name }))}
          disabled={isEditMode}
          placeholder="Select brand"
        />

        <Select
          name="model"
          value={formData.model}
          onChange={handleChange}
          error={errors.model}
          options={vehicleModels.map((m) => ({
            value: m._id,
            label: m.name,
          }))}
          disabled={isEditMode}
          placeholder="Select model"
        />

        <Input
          name="registrationYear"
          value={formData.registrationYear}
          onChange={handleChange}
          error={errors.registrationYear}
          placeholder="Registration Year"
          disabled={isEditMode}
        />

        <Select
          name="fuelType"
          value={formData.fuelType}
          onChange={handleChange}
          error={errors.fuelType}
          options={fuelTypes.map((f) => ({ value: f, label: f }))}
          placeholder="Select fuel type"
          disabled={isEditMode}
        />

        <Input
          name="variant"
          value={formData.variant}
          onChange={handleChange}
          placeholder="Variant"
          disabled={isEditMode}
        />

        <Input
          name="color"
          value={formData.color}
          onChange={handleChange}
          error={errors.color}
          placeholder="Color"
        />

        <DateInput
          name="insuranceValidity"
          value={formData.insuranceValidity}
          onChange={handleChange}
          error={errors.insuranceValidity}
          placeholder="Insurance Validity"
        />

        <DateInput
          name="puccValidity"
          value={formData.puccValidity}
          onChange={handleChange}
          error={errors.puccValidity}
          placeholder="PUCC Validity"
        />
      </div>

      {/* ACTION */}
      <div className="flex justify-end mt-8">
        <button
          disabled={loading}
          onClick={handleSubmit}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition"
        >
          {loading ? "Saving..." : isEditMode ? "Update Vehicle" : "Add Now"}
        </button>
      </div>
    </DarkModal>
  );
};

interface InputProps {
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  placeholder: string;
  error?: string;
  disabled?: boolean;
  span?: boolean;
}

const Input = ({
  name,
  value,
  onChange,
  placeholder,
  error,
  disabled,
  span,
}: InputProps) => (
  <div className={span ? "col-span-2" : ""}>
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full rounded-lg px-4 py-3 text-sm text-gray-800 focus:ring-2 focus:ring-red-500 outline-none
        ${
          disabled
            ? "bg-white/70 cursor-not-allowed opacity-70"
            : "bg-white hover:bg-white/90"
        }
      `}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const DateInput = ({
  name,
  value,
  onChange,
  error,
  placeholder,
}: InputProps) => (
  <div>
    <label className="text-sm text-white">{placeholder}</label>
    <input
      type="date"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-white rounded-lg px-4 py-3 text-sm text-gray-800 focus:ring-2 focus:ring-red-500 outline-none"
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

interface SelectProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
  placeholder: string;
}

const Select = ({
  name,
  value,
  onChange,
  error,
  options,
  disabled,
  placeholder,
}: SelectProps) => (
  <div>
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full rounded-lg px-4 py-3 text-sm text-gray-800 focus:ring-2 focus:ring-red-500 outline-none
        ${
          disabled
            ? "bg-white/70 cursor-not-allowed opacity-70"
            : "bg-white hover:bg-white/90"
        }
        
        `}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default AddVehicleModal;
