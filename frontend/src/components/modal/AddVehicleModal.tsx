import React, { useState } from "react";
import DarkModal from "../layouts/DarkModal";
import { Upload, Calendar } from "lucide-react";
import { registerVehicleApi } from "@/services/userRouter";
import { errorToast, successToast } from "@/utils/notificationAudio";

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Errors {
  [key: string]: string;
}

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    licensePlate: "",
    make: "",
    model: "",
    registrationYear: "",
    fuelType: "",
    variant: "",
    color: "",
    insuranceValidity: "",
    puccValidity: "",
  });

  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

    const plateRegex = /^[A-Z]{2}-\d{2}-[A-Z]{2}-\d{4}$/;

    if (!formData.licensePlate)
      newErrors.licensePlate = "License plate is required";
    else if (!plateRegex.test(formData.licensePlate.toUpperCase()))
      newErrors.licensePlate = "Invalid license plate format";

    if (!formData.make) newErrors.make = "Car make is required";
    if (!formData.model) newErrors.model = "Car model is required";

    if (!formData.registrationYear)
      newErrors.registrationYear = "Registration year is required";
    else if (
      Number(formData.registrationYear) < 1990 ||
      Number(formData.registrationYear) > new Date().getFullYear()
    )
      newErrors.registrationYear = "Invalid year";

    if (!formData.fuelType) newErrors.fuelType = "Fuel type is required";
    if (!formData.color) newErrors.color = "Color is required";

    if (!formData.insuranceValidity)
      newErrors.insuranceValidity = "Insurance date required";

    if (!formData.puccValidity)
      newErrors.puccValidity = "PUCC date required";

    if (!imageFile) newErrors.image = "Vehicle image is required";

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

      if (imageFile) {
        payload.append("vehicleImage", imageFile);
      }

      const res = await registerVehicleApi(payload)
      successToast(res.message || "Vehicle added to Garage.")
      onClose();
    } catch (err) {
      console.error(err);
      if(err instanceof Error){
        errorToast(err.message)
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <DarkModal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-white text-xl font-semibold mb-1 mt-5">
        Add Your Vehicle
      </h2>
      <p className="text-sm text-gray-400 mb-6">
        Save your vehicle details for quick bookings
      </p>

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
          placeholder="License Plate (KL-01-AA-0000)"
          span
        />

        <Input
          name="make"
          value={formData.make}
          onChange={handleChange}
          error={errors.make}
          placeholder="Car Make"
        />

        <Input
          name="model"
          value={formData.model}
          onChange={handleChange}
          error={errors.model}
          placeholder="Car Model"
        />

        <Input
          name="registrationYear"
          value={formData.registrationYear}
          onChange={handleChange}
          error={errors.registrationYear}
          placeholder="Registration Year"
        />

        <Input
          name="fuelType"
          value={formData.fuelType}
          onChange={handleChange}
          error={errors.fuelType}
          placeholder="Fuel Type"
        />

        <Input
          name="variant"
          value={formData.variant}
          onChange={handleChange}
          placeholder="Variant"
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
          {loading ? "Saving..." : "Add Now"}
        </button>
      </div>
    </DarkModal>
  );
};

const Input = ({
  name,
  value,
  onChange,
  placeholder,
  error,
  span,
}: any) => (
  <div className={span ? "col-span-2" : ""}>
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-white rounded-lg px-4 py-3 text-sm text-gray-800 focus:ring-2 focus:ring-red-500 outline-none"
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const DateInput = ({
  name,
  value,
  onChange,
  error,
}: any) => (
  <div className="relative">
    <input
      type="date"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-white rounded-lg px-4 py-3 pr-10 text-sm text-gray-800 focus:ring-2 focus:ring-red-500 outline-none"
    />
    <Calendar size={16} className="absolute right-3 top-3 text-red-500" />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default AddVehicleModal;