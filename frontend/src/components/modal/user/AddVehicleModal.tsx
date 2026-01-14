import React, { useEffect, useState } from "react";
import DarkModal from "../../layouts/DarkModal";
import { Upload, Calendar } from "lucide-react";
import {
  getAllBrandsApi,
  getVehicleModelsByBrandApi,
  registerVehicleApi,
} from "@/services/userRouter";
import { errorToast, successToast } from "@/utils/notificationAudio";
import type { IBrand } from "@/types/BrandTypes";
import type { IVehicleModel } from "@/types/VehicleModelTypes";
import { isValidIndianPlate } from "@/utils/validateLicencePlate";
import { fuelTypes } from "@/constants/constantDatas";

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

interface Errors {
  [key: string]: string;
}

const intialFormData = { 
    licensePlate: "",
    make: "",
    model: "",
    registrationYear: "",
    fuelType: "",
    variant: "",
    color: "",
    insuranceValidity: "",
    puccValidity: "",
}

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
  isOpen,
  onClose,
  onCreated
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [brands, setBrands] = useState<IBrand[] | []>([]);
  const [vehicleModels, setVehicleModels] = useState<IVehicleModel[] | []>([]);
  const [formData, setFormData] = useState(intialFormData);

  useEffect(() => {
    const fetchBrands = async () => {
      const res = await getAllBrandsApi();
      setBrands(res);
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    const fetchVehicleModels = async () => {
      if(!formData.make) return;
      const res = await getVehicleModelsByBrandApi(formData.make);
      setVehicleModels(res);
    };
    fetchVehicleModels();
  }, [formData.make]);

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

    if (!formData.licensePlate)
      newErrors.licensePlate = "License plate is required";
    else if (!isValidIndianPlate(formData.licensePlate))
      newErrors.licensePlate = "Invalid license plate";

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

    if (!formData.puccValidity) newErrors.puccValidity = "PUCC date required";

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

      const res = await registerVehicleApi(payload);
      successToast(res.message || "Vehicle added to Garage.");
      onCreated();
      onClose();
      setFormData(intialFormData)
      setImageFile(null)
      setPreview(null)
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        errorToast(err.message);
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
        <div>
          <select
            name="make"
            id=""
            onChange={handleChange}
            value={formData.make}
            className="w-full bg-white rounded-lg px-4 py-3 text-sm text-gray-800 focus:ring-2 focus:ring-red-500 outline-none"
          >
            <option value="" selected disabled>
              Select a brand
            </option>
            {brands.map((brand) => {
              return <option value={brand._id}>{brand.name}</option>;
            })}
          </select>
          {errors.make && (
            <p className="text-red-500 text-xs mt-1">{errors.make}</p>
          )}
        </div>
        <div>
          <select
            name="model"
            id=""
            onChange={handleChange}
            value={formData.model}
            className="w-full bg-white rounded-lg px-4 py-3 text-sm text-gray-800 focus:ring-2 focus:ring-red-500 outline-none"
          >
            <option value="" selected disabled>
              Select a model
            </option>
            {vehicleModels.map((model) => {
              return <option value={model._id}>{model.name}</option>;
            })}
          </select>
          {errors.model && (
            <p className="text-red-500 text-xs mt-1">{errors.model}</p>
          )}
        </div>

        <Input
          name="registrationYear"
          value={formData.registrationYear}
          onChange={handleChange}
          error={errors.registrationYear}
          placeholder="Registration Year"
        />

        <div>
          <select
            name="fuelType"
            id=""
            onChange={handleChange}
            value={formData.fuelType}
            className="w-full bg-white rounded-lg px-4 py-3 text-sm text-gray-800 focus:ring-2 focus:ring-red-500 outline-none"
          >
            <option value="" selected disabled>
              Select a fuel-type
            </option>
            {fuelTypes.map((fuel) => {
              return <option value={fuel}>{fuel}</option>;
            })}
          </select>
          {errors.fuelType && (
            <p className="text-red-500 text-xs mt-1">{errors.fuelType}</p>
          )}
        </div>

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

const Input = ({ name, value, onChange, placeholder, error, span }: any) => (
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

const DateInput = ({ name, value, onChange, error, placeholder }: any) => (
  <div className="relative">
    <label className="text-sm text-white">{placeholder} :</label>
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

export default AddVehicleModal;
