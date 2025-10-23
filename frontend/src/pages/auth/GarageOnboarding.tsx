import "leaflet/dist/leaflet.css";
import L from "leaflet";
import React, { useEffect, useState } from "react";
import logo from "../../assets/icons/Logo.png";
import Modal from "../../components/modal/Layout/Modal";
import AuthButton from "../../components/elements/AuthButton";
import type { ILocation } from "../../types/UserTypes";
import type { RootState } from "../../redux/store/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { validateTime } from "../../utils/validateTime";
import { fetchAddressApi, onboardingApi } from "../../services/garage";
import { errorToast, successToast } from "../../utils/notificationAudio";
import { daysOfWeek, getTimeOptions } from "../../constants/constantDatas";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
});

const Registration = () => {
  const [location, setLocation] = useState<ILocation | null>(null);
  const [plan, setPlan] = useState<string>("");
  const [planError, setPlanError] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [timeError, setTimeError] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(null);
  const [imageError, setImageError] = useState<string>("");
  const [selectedHolidays, setSelectedHolidays] = useState<string[]>([]);
  const [mobile, setMobile] = useState<string>("");
  const [mobileError, setMobileError] = useState<string>("");
  const [isRSAEnabled, setIsRSAEnabled] = useState<boolean>(true);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [city, setCity] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [pincode, setPincode] = useState<string>("");
  const [locationError, setLocationError] = useState<string>("")

  const { user, token } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();
  const timeOptions = getTimeOptions();


  //checking needed
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!user.isOnboardingRequired) {
      const targetRoute = user.role === "user" ? "/" : `/${user.role}`;
      navigate(targetRoute);
    }
  }, [user, navigate]);

  useEffect(() => {
    const getAddress = async () => {
      if (location) {
        const address = await fetchAddressApi(location.lat, location.lng, token);

        setCity(address.city);
        setDistrict(address.district);
        setState(address.state);
        setPincode(address.pincode);
      }
    };

    getAddress();
  }, [location, token]);

  const handleCheckboxChange = (day: string) => {
    setSelectedHolidays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        setLocation(e.latlng);
      },
    });

    return location ? <Marker position={location} icon={markerIcon} /> : null;
  };

  const handleCompleteRegistration = () => {
    let hasError = false;
    setTimeError("");
    setMobileError("");
    setImageError("");
    setPlanError("");
    setLocationError("")

    if (!validateTime(startTime, endTime)) {
      setTimeError("Select a valid timing.");
      hasError = true;
    }

    const mobileRegex = /^[6-9]\d{9}$/;

    if (!mobileRegex.test(mobile)) {
      setMobileError("Enter a valid mobile number.");
      hasError = true;
    }

    if (!imagePreview) {
      setImageError("Upload image of your garage.");
      hasError = true;
    }

    if (!plan) {
      setPlanError("Select a plan to proceed.");
      hasError = true;
    }

    if(!location || !city){
      setLocationError("Select your location from the map.")
      hasError = true
    }

    if (hasError) return;
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (!token) {
      errorToast("Session expired. Log in again and resubmit.");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();

      const address = { city, district, state, pincode };

      formData.append("name", user?.name || "")
      formData.append("garageId", user?._id || "");
      formData.append("plan", plan);
      formData.append("startTime", startTime);
      formData.append("endTime", endTime);
      formData.append("mobile", mobile);
      formData.append("isRSAEnabled", String(isRSAEnabled));
      formData.append("address", JSON.stringify(address));
      formData.append("location", JSON.stringify(location));
      formData.append("selectedHolidays", JSON.stringify(selectedHolidays));

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await onboardingApi(formData, token);

      successToast("Successfully submitted");
      setSubmitting(false);
      setShowConfirm(false);

      setTimeout(() => {
        navigate("/garage");
      }, 2000);
    } catch (error: any) {
      console.error(error.message);
      errorToast(error.message);
      setSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    const maxSize = 500 * 1024;

    if (file && file.size > maxSize) {
      errorToast("Image must be less than 500 KB!");
      return;
    }

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    } else {
      errorToast("Please select a valid image file");
      e.target.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-lg p-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <img src={logo} className="w-30 sm:w-30 md:w-56 lg:w-56" alt="" />
          <h1 className="sm:text-2xl md:text-3xl font-bold">
            Finish Registration
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Garage Name:
                </label>
                <input
                  id="garageName"
                  type="text"
                  value={user?.name}
                  className="w-full bg-gray-50 rounded-lg p-3 text-gray-800 border-2 border-transparent focus:border-red-600 focus:outline-none transition-colors"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Working Hours:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-gray-50 rounded-lg p-3 text-gray-800 border-2 border-transparent focus:border-red-600 focus:outline-none transition-colors"
                  >
                    <option value="" selected>
                      Select Opening
                    </option>
                    {timeOptions.map((time) => (
                      <option key={`start-${time}`} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <select
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-gray-50 rounded-lg p-3 text-gray-800 border-2 border-transparent focus:border-red-600 focus:outline-none transition-colors"
                  >
                    <option value="" selected>
                      Select Closing
                    </option>
                    {timeOptions.map((time) => (
                      <option key={`end-${time}`} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {timeError ? (
                    <p className="text-red-600 font-light text-sm ">
                      {timeError}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location:
              </label>
              <div className="relative border-2 border-transparent focus-within:border-red-600 rounded-xl transition-colors">
                <MapContainer
                  center={[location?.lat || 11.303, location?.lng || 75.78]}
                  zoom={13}
                  style={{
                    height: "300px",
                    width: "100%",
                    borderRadius: "12px",
                  }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
                  />

                  <LocationPicker />

                  {/* show marker only after user clicks */}
                  {location && <Marker position={location} icon={markerIcon} />}
                </MapContainer>
              </div>
              {location && (
                <>
                  <p className="text-sm text-gray-500 mt-2">
                    <b>Selected: </b>
                    {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    <strong>City: </strong>{city}, 
                    <strong> District:</strong>{district},
                    <strong> State: </strong>{state}
                  </p>
                </>
              )}
              {locationError ? (
                    <p className="text-red-600 font-light text-sm ">
                      {locationError}
                    </p>
                  ) : (
                    ""
                  )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number:
                </label>
                <input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  type="text"
                  placeholder="Enter mobile number"
                  className="w-full bg-gray-50 rounded-lg p-3 text-gray-800 border-2 border-transparent focus:border-red-600 focus:outline-none transition-colors"
                />
                {mobileError ? (
                  <p className="text-red-600 font-light text-sm ">
                    {mobileError}
                  </p>
                ) : (
                  ""
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Holidays:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {daysOfWeek.map((day) => (
                    <label
                      key={day}
                      className="inline-flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={selectedHolidays.includes(day)}
                        onChange={() => handleCheckboxChange(day)}
                        className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span className="text-gray-800">{day}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full bg-gray-50 rounded-lg p-3 text-gray-800 border-2 border-transparent focus:border-red-600 focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
              />
              {imageError ? (
                <p className="text-red-600 font-light text-sm ">{imageError}</p>
              ) : (
                ""
              )}
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Preview:
                  </p>
                  <div className="relative inline-block">
                    <img
                      src={imagePreview as string}
                      alt="Preview"
                      className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      onClick={() => setImagePreview(null)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition"
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Roadside Assistance:
              </label>
              <select
                id="roadside"
                className="w-full bg-gray-50 rounded-lg p-3 text-gray-800 border-2 border-transparent 
               focus:border-red-600 focus:outline-none transition-colors"
                onChange={(e) => setIsRSAEnabled(e.target.value === "Yes")}
                value={isRSAEnabled ? "Yes" : "No"}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          {/* Right Section - Plan Selection */}
          <div className="lg:col-span-1">
            <div className="bg-gray-200 rounded-2xl p-6 sticky top-8">
              <h2 className="text-lg font-semibold mb-4">Select Plan:</h2>

              <div
                className={`rounded-xl p-4 mb-3 cursor-pointer transition-all ${
                  plan === "Basic"
                    ? "bg-white border-2 border-red-600 shadow-md"
                    : "bg-white border-2 border-transparent hover:border-gray-300"
                }`}
                onClick={() => setPlan("Basic")}
              >
                <label className="flex items-start cursor-pointer">
                  <input
                    type="radio"
                    name="plan"
                    value="Basic"
                    checked={plan === "Basic"}
                    onChange={() => setPlan("Basic")}
                    className="mt-1 mr-3 accent-red-600"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      Basic: ₹1999 (Yearly)
                    </div>
                    <div className="text-sm text-gray-600 mt-2 space-y-1">
                      <div>Mechanic Management : 3 (Maximum)</div>
                      <div>Service Management : 3 (Maximum)</div>
                      <div>Appointments : 15 (Monthly)</div>
                    </div>
                  </div>
                </label>
              </div>

              <div
                className={`rounded-xl p-4 cursor-pointer transition-all ${
                  plan === "Enterprise"
                    ? "bg-white border-2 border-red-600 shadow-md"
                    : "bg-white border-2 border-transparent hover:border-gray-300"
                }`}
                onClick={() => setPlan("Enterprise")}
              >
                <label className="flex items-start cursor-pointer">
                  <input
                    type="radio"
                    name="plan"
                    value="Enterprise"
                    checked={plan === "Enterprise"}
                    onChange={() => setPlan("Enterprise")}
                    className="mt-1 mr-3 accent-red-600"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      Enterprise: ₹4999 (Yearly)
                    </div>
                    <div className="text-sm text-gray-600 mt-2 space-y-1">
                      <div>Mechanic Management : Unlimited</div>
                      <div>Service Management : Unlimited</div>
                      <div>Appointments : Unlimited</div>
                    </div>
                  </div>
                </label>
              </div>
              {planError ? (
                <p className="text-red-600 font-light text-sm mt-2">
                  {planError}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        {/* Complete Registration Button */}
        <div className="mt-8 w-100 mx-auto">
          <AuthButton
            action={handleCompleteRegistration}
            text="COMPLETE REGISTRATION"
          />
        </div>
      </div>

      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(!showConfirm)}>
        <div className="p-3">
          <p className="mb-6">
            Please confirm that all data entered are correct.
          </p>
          <p className="mb-4">
            {" "}
            Click <strong>Cancel</strong> to review the form again.
          </p>
          <div className="flex justify-end gap-4">
            <button
              className="px-4 py-2 bg-black/100 text-white rounded hover:bg-black-50"
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={handleConfirm}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Confirm"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Registration;
