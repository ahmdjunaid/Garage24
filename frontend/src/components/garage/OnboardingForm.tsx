import "leaflet/dist/leaflet.css";
import L from "leaflet";
import React, { useEffect, useState } from "react";
import logo from "@assets/icons/Logo.png";
import AuthButton from "@components/elements/AuthButton";
import type { ILocation, User } from "@/types/UserTypes";
import type { RootState } from "@/redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { validateTime } from "@/utils/validateTime";
import {
  fetchAddressApi,
  getGarageDetailsApi,
  onboardingApi,
} from "@/services/garageServices";
import { errorToast, successToast } from "@/utils/notificationAudio";
import { daysOfWeek, fuelTypes, getTimeOptions } from "@/constants/constantDatas";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { login } from "@/redux/slice/userSlice";
import { mobileRegex } from "@/constants/commonRegex";
import ImageUploader from "@components/garage/ImageUploader";
import { ConfirmModalLight } from "@components/modal/ConfirmModalLight";
import MapAutoCenter from "../elements/MapAutoCenter";
import { Locate } from "lucide-react";
import FileUploader from "./FileUploader";
import type { IMappedGarageData } from "@/types/GarageTypes";

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
});

interface formProps {
  handleSubmit: () => void;
}

const Registration: React.FC<formProps> = ({ handleSubmit }) => {
  const [location, setLocation] = useState<ILocation | null>(null);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [timeError, setTimeError] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string>("");
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docError, setDocError] = useState<string>("");
  const [selectedHolidays, setSelectedHolidays] = useState<string[]>([]);
  const [selectHolidaysError, setSelectedHolidaysError] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [mobileError, setMobileError] = useState<string>("");
  const [isRSAEnabled, setIsRSAEnabled] = useState<boolean | null>(null);
  const [RSAError, setRSAError] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [city, setCity] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [pincode, setPincode] = useState<string>("");
  const [locationError, setLocationError] = useState<string>("");
  const [isRejected, setIsRejected] = useState<boolean>(false);
  const [numOfServiceBays, setNumOfServiceBays] = useState<number | string>("");
  const [serviceBayError, setServiceBayError] = useState<string>("");
  const [supportedFuelTypes, setSupportedFuelTypes] = useState<string[]>([]);
  const [supportedFuelTypesError, setSupportedFuelTypesError] = useState<string>("");

  const { user, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const timeOptions = getTimeOptions();

  useEffect(() => {
    const fetchGarageData = async () => {
      if (!user) return;
      const response: IMappedGarageData = await getGarageDetailsApi(user?._id);
      if (response) {
        setLocation({
          lat: response.location?.coordinates[0] ?? 0,
          lng: response.location?.coordinates[1] ?? 0,
        });
        setStartTime(response.startTime!);
        setEndTime(response.endTime!);
        setSelectedHolidays(response.selectedHolidays!);
        setMobile(response.mobileNumber!);
        setIsRSAEnabled(response.isRSAEnabled!);
        setIsRejected(true);
      }
    };

    fetchGarageData();
  }, [user]);

  useEffect(() => {
    const getAddress = async () => {
      if (!location) return;
      const address = await fetchAddressApi(location.lat, location.lng);
      setCity(address.city);
      setDistrict(address.district);
      setState(address.state);
      setPincode(address.pincode);
    };
    getAddress();
  }, [location]);

  const handleCheckboxChange = (day: string) => {
    setSelectedHolidays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleFuelTypeChange = (t: string) => {
    setSupportedFuelTypes((prev) =>
      prev.includes(t) ? prev.filter((d) => d !== t) : [...prev, t]
    );
  };

  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        setLocationError("");
        setLocation(e.latlng);
      },
    });
    return location ? <Marker position={location} icon={markerIcon} /> : null;
  };

  const handleCompleteRegistration = () => {
    let hasError = false;
    setTimeError("");
    setMobileError("");
    setLocationError("");
    setRSAError("");
    setDocError("");
    setImageError("");
    setSelectedHolidaysError("");

    if (!validateTime(startTime, endTime)) {
      setTimeError("Select a valid timing.");
      hasError = true;
    }

    if (!mobileRegex.test(mobile)) {
      setMobileError("Enter a valid mobile number.");
      hasError = true;
    }

    if (isRSAEnabled === null) {
      setRSAError("Select an option to proceed");
      hasError = true;
    }

    if (!location || !city) {
      setLocationError("Select your location from the map.");
      hasError = true;
    }

    if (!docFile) {
      setDocError("Upload document to verify your garage.");
      hasError = true;
    }

    if (!imageFile) {
      setImageError("Upload image to verify your garage.");
      hasError = true;
    }

    if (selectedHolidays.length > 6) {
      setSelectedHolidaysError(
        "At least one working day is required. You can’t mark all days as holidays."
      );
      hasError = true;
    }

      if (supportedFuelTypes.length<1) {
      setSupportedFuelTypesError(
        "Please select the fuel types supported by your garage."
      );
      hasError = true;
    }

    if (
      !numOfServiceBays ||
      Number.isNaN(numOfServiceBays) ||
      Number(numOfServiceBays) < 0
    ) {
      setServiceBayError("Enter valid number of service bays.");
      hasError = true;
    }

    if (hasError) return;
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      const address = { city, district, state, pincode };

      formData.append("name", user?.name || "");
      formData.append("userId", user?._id || "");
      formData.append("startTime", startTime);
      formData.append("endTime", endTime);
      formData.append("mobile", mobile);
      formData.append("isRSAEnabled", String(isRSAEnabled));
      formData.append("address", JSON.stringify(address));
      formData.append("location", JSON.stringify(location));
      formData.append("selectedHolidays", JSON.stringify(selectedHolidays));
      formData.append("numOfServiceBays", String(numOfServiceBays));
      formData.append("supportedFuelTypes", JSON.stringify(supportedFuelTypes));

      if (imageFile) formData.append("image", imageFile);
      if (docFile) formData.append("document", docFile);

      await onboardingApi(formData);
      dispatch(
        login({
          user: { ...user, isOnboardingRequired: false } as User,
          token,
        })
      );

      successToast("Successfully submitted for verification.");
      setTimeout(() => {
        setShowConfirm(false);
        setSubmitting(false);
        handleSubmit();
      }, 1500);
    } catch (error) {
      if (error instanceof Error) errorToast(error.message);
      console.error(error);
      setSubmitting(false);
    }
  };

  const handleRSAchange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setRSAError("");
    if (value === "Yes") setIsRSAEnabled(true);
    else if (value === "No") setIsRSAEnabled(false);
    else setIsRSAEnabled(null);
  };

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
        setLocationError("");
      },
      (err) => {
        console.error("Error getting location", err);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg p-8 md:p-12 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center pb-6">
          <img src={logo} className="w-44 mb-4 md:mb-0" alt="Garage Logo" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Finish Registration
          </h1>
        </div>

        {isRejected && (
          <div className="bg-red-100 rounded p-2 text-center">
            <p className="text-red-600 text-sm mt-1">
              <strong>Application rejected. </strong>
              Please check your email for the rejection reason and resubmit
              after uploading valid documents.
            </p>
          </div>
        )}

        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Section */}
          <div className="space-y-6">
            {/* Garage name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Garage Name
              </label>
              <input
                type="text"
                value={user?.name}
                className="w-full bg-gray-50 rounded-lg p-3 text-gray-800 border-2 border-transparent focus:border-red-600 focus:outline-none"
                readOnly
              />
            </div>

            {/* Working hours */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Working Hours
              </label>
              <div className="flex gap-3">
                <select
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    setTimeError("");
                  }}
                  className="flex-1 bg-gray-50 rounded-lg p-3 text-gray-800 border-2 border-transparent focus:border-red-600 focus:outline-none"
                >
                  <option value="">Select Opening</option>
                  {timeOptions.map((time) => (
                    <option key={`start-${time}`} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <select
                  value={endTime}
                  onChange={(e) => {
                    setEndTime(e.target.value);
                    setTimeError("");
                  }}
                  className="flex-1 bg-gray-50 rounded-lg p-3 text-gray-800 border-2 border-transparent focus:border-red-600 focus:outline-none"
                >
                  <option value="">Select Closing</option>
                  {timeOptions.map((time) => (
                    <option key={`end-${time}`} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              {timeError && (
                <p className="text-red-600 font-light text-sm mt-1">
                  {timeError}
                </p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mobile Number
              </label>
              <input
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value);
                  setMobileError("");
                }}
                maxLength={15}
                placeholder="Enter mobile number"
                className="w-full bg-gray-50 rounded-lg p-3 text-gray-800 border-2 border-transparent focus:border-red-600 focus:outline-none"
              />
              {mobileError && (
                <p className="text-red-600 font-light text-sm mt-1">
                  {mobileError}
                </p>
              )}
            </div>

            {/* Holidays */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Holidays
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {daysOfWeek.map((day) => (
                  <label
                    key={day}
                    className="flex items-center space-x-2 text-gray-800"
                  >
                    <input
                      type="checkbox"
                      checked={selectedHolidays.includes(day)}
                      onChange={() => {
                        handleCheckboxChange(day);
                        setSelectedHolidaysError("");
                      }}
                      className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span>{day}</span>
                  </label>
                ))}
              </div>
              {selectHolidaysError && (
                <p className="text-red-600 font-light text-sm mt-1">
                  {selectHolidaysError}
                </p>
              )}
            </div>

            {/* supportedFuelTypes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Supported Fuel Types
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {fuelTypes.map(
                  (type) => (
                    <label
                      key={type}
                      className="flex items-center space-x-2 text-gray-800"
                    >
                      <input
                        type="checkbox"
                        checked={supportedFuelTypes.includes(type)}
                        onChange={() => {
                          handleFuelTypeChange(type);
                          setSupportedFuelTypesError("");
                        }}
                        className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span>{type}</span>
                    </label>
                  )
                )}
              </div>
              {supportedFuelTypesError && (
                <p className="text-red-600 font-light text-sm mt-1">
                  {supportedFuelTypesError}
                </p>
              )}
            </div>

            {/* ServiceBays */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Service Bays{" "}
                <span className="relative group cursor-help">
                  <i
                    className="fa fa-question-circle text-gray-400 hover:text-gray-600"
                    aria-hidden="true"
                  />

                  {/* Tooltip */}
                  <span
                    className="
                    absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                    hidden group-hover:block
                    bg-gray-900 text-white text-xs px-3 py-1 rounded-md
                    whitespace-nowrap shadow-lg z-50
                    "
                    role="tooltip"
                  >
                    Number of vehicles that can be serviced at the same time
                  </span>
                </span>
              </label>
              <input
                value={numOfServiceBays}
                onChange={(e) => {
                  setNumOfServiceBays(Number(e.target.value));
                  setServiceBayError("");
                }}
                maxLength={3}
                placeholder="Enter no of service bays"
                className="w-full bg-gray-50 rounded-lg p-3 text-gray-800 border-2 border-transparent focus:border-red-600 focus:outline-none"
              />
              {serviceBayError && (
                <p className="text-red-600 font-light text-sm mt-1">
                  {serviceBayError}
                </p>
              )}
            </div>

            {/* RSA */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Roadside Assistance
              </label>
              <select
                id="roadside"
                className="w-full bg-gray-50 rounded-lg p-3 text-gray-800 border-2 border-transparent focus:border-red-600 focus:outline-none"
                onChange={handleRSAchange}
                value={isRSAEnabled === null ? "" : isRSAEnabled ? "Yes" : "No"}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {RSAError && (
                <p className="text-red-600 font-light text-sm mt-1">
                  {RSAError}
                </p>
              )}
            </div>
          </div>

          {/* Right Section - Map & Uploads */}
          <div className="space-y-6">
            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>
              {/* Button */}
              <button
                onClick={handleGetLocation}
                className="
                  flex items-center gap-2
                  bg-blue-600 hover:bg-white 
                  text-white hover:text-blue-600 px-4 py-2.5 
                  rounded-lg shadow my-2
                  transition-all duration-200
                  "
              >
                <Locate size={18} />
              </button>

              {/* Map */}
              <div className="rounded-xl overflow-hidden border border-gray-700 shadow-lg">
                <MapContainer
                  center={[location?.lat || 11.303, location?.lng || 75.78]}
                  zoom={13}
                  style={{ height: "350px", width: "100%" }}
                  className="z-0"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
                  />

                  <LocationPicker />

                  <MapAutoCenter lat={location?.lat} lng={location?.lng} />

                  {location && <Marker position={location} icon={markerIcon} />}
                </MapContainer>
              </div>
              {location && (
                <p className="text-sm text-gray-500 mt-2">
                  <b>Selected:</b> {location.lat.toFixed(5)},{" "}
                  {location.lng.toFixed(5)} <br />
                  <b>City:</b> {city} | <b>District:</b> {district} |{" "}
                  <b>State:</b> {state}
                </p>
              )}
              {locationError && (
                <p className="text-red-600 font-light text-sm mt-1">
                  {locationError}
                </p>
              )}
            </div>

            {/* Garage Image */}
            <div>
              <ImageUploader
                label="Garage Image"
                onImageSelect={(data) => {
                  setImageFile(data);
                  setImageError("");
                }}
              />
              {imageError && (
                <p className="text-red-600 font-light text-sm mt-1">
                  {imageError}
                </p>
              )}
            </div>

            {/* Document */}
            <div>
              <FileUploader
                label="Upload Document"
                onFileSelect={(data) => {
                  setDocFile(data);
                  setDocError("");
                }}
              />
              {docError && (
                <p className="text-red-600 font-light text-sm mt-1">
                  {docError}
                </p>
              )}
            </div>
          </div>
        </div>
        {/* Submit */}
        <div>
          <AuthButton
            action={handleCompleteRegistration}
            text={isRejected ? "RE-SUBMIT" : "COMPLETE REGISTRATION"}
          />
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModalLight
        title="Are you sure?"
        isOpen={showConfirm}
        message="Check all details before proceeding. Click ‘Confirm’ to continue or ‘Cancel’ to edit."
        confirmText={submitting ? "Submitting" : "Confirm"}
        cancelText="Cancel"
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default Registration;
