import React, { useState, useEffect, useCallback } from "react";
import { Clock, Phone, Mail, Car, CheckCircle, User } from "lucide-react";
import { getNext7Days } from "@/utils/getNext7Days";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";
import type { IUsersMappedData } from "@/types/UserTypes";
import {
  fetchNearByGaragesApi,
  fetchServicesByGarageIdApi,
  getAppointmentMetaData,
  getVehicleDetailsById,
  getVehicleModelsByBrandApi,
} from "@/services/userRouter";
import { errorToast } from "@/utils/notificationAudio";
import type { fuelTypeType, IPopulatedVehicle } from "@/types/VehicleTypes";
import type { IServiceCategory } from "@/types/ServiceCategoryTypes";
import { fuelTypes } from "@/constants/constantDatas";
import type { IBrand } from "@/types/BrandTypes";
import type { IVehicleModel } from "@/types/VehicleModelTypes";
import MapSection from "./MapSection";
import type { GarageNearbyDto } from "@/types/GarageTypes";
import type { IService } from "@/types/ServicesTypes";
import { metersToKm } from "@/utils/meterToKMs";
import Spinner from "@/components/elements/Spinner";

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

const CarServiceAppointmentForm: React.FC = () => {
  const [userData, setUserData] = useState<Partial<IUsersMappedData>>({
    name: "",
    email: "",
    mobileNumber: "",
  });
  const [vehicleData, setVehicleData] = useState<Partial<IPopulatedVehicle>>({
    _id: "",
    make: {
      _id: "",
      name: "",
    },
    model: {
      _id: "",
      name: "",
    },
    registrationYear: "",
    licensePlate: "",
    fuelType: "",
    variant: "",
    color: "",
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [garages, setGarages] = useState<GarageNearbyDto[]>([]);
  const [selectedGarage, setSelectedGarage] = useState<GarageNearbyDto | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [serviceCategories, setServiceCategories] = useState<
    IServiceCategory[] | []
  >([]);
  const [brands, setBrands] = useState<IBrand[] | []>([]);
  const [models, setModels] = useState<IVehicleModel[] | []>([]);
  const [services, setServices] = useState<IService[] | []>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setUserData({
      name: user?.name,
      email: user?.email,
      mobileNumber: user?.mobileNumber,
    });
  }, [user]);

  useEffect(() => {
    const fetchMetadata = async () => {
      const res = await getAppointmentMetaData();
      setServiceCategories(res.categories);
      setBrands(res.brands);
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    const fetchVehicleModels = async () => {
      if (!vehicleData.make?._id) return;
      const res = await getVehicleModelsByBrandApi(vehicleData.make._id);
      setModels(res);
    };
    fetchVehicleModels();
  }, [vehicleData.make?._id]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const vId = urlParams.get("vehicleId");

    if (vId) {
      fetchVehicleData(vId);
    }
  }, []);

  useEffect(() => {
    if (!location?.lat || !location?.lng) return;

    fetchNearbyGarages(location.lat, location.lng);
  }, [location?.lat, location?.lng]);

  async function fetchVehicleData(vehicleId: string) {
    if (!vehicleId) return;
    setLoading(true);
    try {
      const res = await getVehicleDetailsById(vehicleId);
      console.log(res, "++++++++");
      setVehicleData(res);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) errorToast(error.message);
    } finally {
      setLoading(false);
    }
  }

  const fetchNearbyGarages = useCallback(
    async (lat: number, lng: number) => {
      if (!location) return;
      setLoading(true);
      try {
        const res = await fetchNearByGaragesApi(lat, lng);
        setGarages(res);
      } catch (error) {
        console.error(error);
        if (error instanceof Error) errorToast(error.message);
      } finally {
        setLoading(false);
      }
    },
    [location]
  );

  const fetchAvailableServices = async (garageId: string, category: string) => {
    try {
      const res = await fetchServicesByGarageIdApi(garageId, category);
      setServices(res);
    } catch (error) {
      console.error(error);
    }
  };

  const getTimeSlots = (): TimeSlot[] => {
    return [
      { id: "1", time: "09:00 AM", available: true },
      { id: "2", time: "10:00 AM", available: true },
      { id: "3", time: "11:00 AM", available: false },
      { id: "4", time: "12:00 PM", available: true },
      { id: "5", time: "02:00 PM", available: true },
      { id: "6", time: "03:00 PM", available: true },
      { id: "7", time: "04:00 PM", available: false },
      { id: "8", time: "05:00 PM", available: true },
    ];
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((s) => s !== serviceId)
        : [...prev, serviceId]
    );
  };

  const isFormValid = () => {
    return (
      userData.name &&
      userData.email &&
      userData.mobileNumber &&
      vehicleData.makeName &&
      vehicleData.model &&
      vehicleData.licensePlate &&
      selectedCategory &&
      selectedGarage &&
      selectedServices.length > 0 &&
      selectedDate &&
      selectedTime
    );
  };

  const handleBookAppointment = () => {
    if (isFormValid()) {
      const selectedServiceDetails = services.filter((s) =>
        selectedServices.includes(s._id)
      );
      alert("Appointment booked successfully!");
      console.log({
        userData,
        vehicleData,
        category: selectedCategory,
        services: selectedServiceDetails,
        garage: selectedGarage,
        date: selectedDate,
        time: selectedTime,
      });
    }
  };

  const totalPrice =
    services
      .filter((s) => selectedServices.includes(s._id))
      .reduce((sum, s) => sum + s.price, 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1b1b1b] to-[#111] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Book Your Car Service
          </h1>
          <p className="text-gray-400 text-lg">
            Professional care for your vehicle, whenever you need it
          </p>
        </div>

        {/* Personal & Vehicle Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Personal Information */}
          <div className="bg-[#2a2a2a] rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                <Phone className="h-5 w-5" />
              </div>
              Personal Information
            </h2>
            <div className="grid gap-4">
              <div className="relative md:col-span-2">
                <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="First Name"
                  value={userData.name}
                  onChange={(e) =>
                    setUserData({ ...userData, name: e.target.value })
                  }
                  className="pl-10 pr-4 py-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 w-full focus:outline-none transition-all"
                />
              </div>

              <div className="relative md:col-span-2">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  className="pl-10 pr-4 py-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 w-full focus:outline-none transition-all"
                />
              </div>
              <div className="relative md:col-span-2">
                <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={userData.mobileNumber}
                  onChange={(e) =>
                    setUserData({ ...userData, mobileNumber: e.target.value })
                  }
                  className="pl-10 pr-4 py-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 w-full focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Car Information */}
          <div className="bg-[#2a2a2a] rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                <Car className="h-5 w-5" />
              </div>
              Car Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <select
                value={vehicleData.make?._id}
                onChange={(e) => {
                  const selectedMake = brands.find(
                    (make) => make._id === e.target.value
                  );

                  if (!selectedMake) return;

                  setVehicleData({
                    ...vehicleData,
                    make: {
                      _id: selectedMake._id,
                      name: selectedMake.name,
                    },
                  });
                }}
                className="px-4 py-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-gray-500 focus:outline-none transition-all"
              >
                <option value="">Select Car Make</option>
                {brands.map((make: IBrand) => (
                  <option key={make._id} value={make._id}>
                    {make.name}
                  </option>
                ))}
              </select>

              <select
                value={vehicleData.model?._id}
                onChange={(e) => {
                  const selectedModel = models.find(
                    (model) => model._id === e.target.value
                  );

                  if (!selectedModel) return;

                  setVehicleData({
                    ...vehicleData,
                    model: {
                      _id: selectedModel._id,
                      name: selectedModel.name,
                    },
                  });
                }}
                className="px-4 py-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-gray-500 focus:outline-none transition-all"
              >
                <option value="">Select Model Name</option>
                {models.map((model: IVehicleModel) => (
                  <option key={model._id} value={model._id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Year"
                value={vehicleData.registrationYear}
                onChange={(e) =>
                  setVehicleData({
                    ...vehicleData,
                    registrationYear: e.target.value,
                  })
                }
                className="px-4 py-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-gray-500 focus:outline-none transition-all"
              />
              <input
                type="text"
                placeholder="License Plate"
                value={vehicleData.licensePlate}
                onChange={(e) =>
                  setVehicleData({
                    ...vehicleData,
                    licensePlate: e.target.value,
                  })
                }
                className="px-4 py-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-gray-500 focus:outline-none transition-all"
              />
              <select
                value={vehicleData.fuelType}
                onChange={(e) =>
                  setVehicleData({
                    ...vehicleData,
                    fuelType: e.target.value as fuelTypeType,
                  })
                }
                className="px-4 py-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-gray-500 focus:outline-none transition-all"
              >
                <option value="">Fuel Type</option>
                {fuelTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Variant"
                value={vehicleData.variant}
                onChange={(e) =>
                  setVehicleData({ ...vehicleData, variant: e.target.value })
                }
                className="px-4 py-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-gray-500 focus:outline-none transition-all"
              />
              <input
                type="text"
                placeholder="Color"
                value={vehicleData.color}
                onChange={(e) =>
                  setVehicleData({ ...vehicleData, color: e.target.value })
                }
                className="px-4 py-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-gray-500 focus:outline-none transition-all col-span-2"
              />
            </div>
          </div>
        </div>

        {/* Service Category Selection */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Select Service Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCategories.map((category: IServiceCategory) => (
              <button
                key={category._id}
                onClick={() => {
                  setSelectedCategory(category._id);
                }}
                className={`relative overflow-hidden rounded-2xl p-6 transition-all transform hover:scale-105 ${
                  selectedCategory === category._id
                    ? "bg-red-500 shadow-2xl"
                    : "bg-[#2a2a2a]"
                }`}
              >
                <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                <p className="text-sm opacity-80">{category.description}</p>
                {selectedCategory === category._id && (
                  <CheckCircle className="absolute top-4 right-4 h-6 w-6" />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Location Selection */}
        {selectedCategory && (
          <MapSection setLocation={setLocation} location={location} />
        )}

        {/* Nearby Garages */}
        {garages.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Choose Your Service Center
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {garages.map((garage) => (
                <button
                  key={garage._id}
                  onClick={() => {
                    setSelectedGarage(garage);
                    setSelectedServices([]);
                    fetchAvailableServices(garage.userId, selectedCategory!);
                  }}
                  className={`relative overflow-hidden rounded-2xl p-6 text-left transition-all transform hover:scale-102 ${
                    selectedGarage?._id === garage._id
                      ? "bg-red-500 shadow-2xl"
                      : "bg-[#2a2a2a]"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{garage.name}</h3>
                      <p className="text-sm opacity-80 mb-3">
                        {`${garage.address.city} ${garage.address.district} ${garage.address.state} ${garage.address.pincode}`}
                      </p>
                    </div>
                    {selectedGarage?._id === garage._id && (
                      <CheckCircle className="h-6 w-6 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="bg-black/30 px-3 py-1 rounded-full">
                      📍 {metersToKm(garage.distance)} km
                    </span>
                    <span className="bg-black/30 px-3 py-1 rounded-full">
                      RSA{" "}
                      {garage.isRSAEnabled
                        ? "Road-side assistance available"
                        : "Not avaialable for RSA"}
                    </span>
                    <span className="bg-black/30 px-3 py-1 rounded-full">
                      {garage.supportedFuelTypes.join(", ")} Vehicles
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Service Selection from Garage */}
        {selectedGarage && (
          <section className="mb-12">
            <div className="bg-[#2a2a2a] rounded-2xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold mb-6">
                Available Services at {selectedGarage.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <button
                    key={service._id}
                    onClick={() => toggleService(service._id)}
                    className={`p-5 rounded-xl text-left transition-all ${
                      selectedServices.includes(service._id)
                        ? "bg-red-500 shadow-lg"
                        : "bg-gray-700/50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg">{service.name}</h4>
                      {selectedServices.includes(service._id) && (
                        <CheckCircle className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="bg-black/30 px-3 py-1 rounded-full">
                        ₹{service.price}
                      </span>
                      <span className="bg-black/30 px-3 py-1 rounded-full">
                        ⏱️ {service.durationMinutes}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              {selectedServices.length > 0 && (
                <div className="mt-6 p-4 bg-gray-700/50 border border-gray-600 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">
                      {selectedServices.length} service(s) selected
                    </span>
                    <span className="text-2xl font-bold">
                      Total: ₹{totalPrice}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Date Selection */}
        {selectedServices.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Pick Your Date
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 flex justify-center">
              {getNext7Days().map((day) => (
                <button
                  key={day.date}
                  onClick={() => {
                    setSelectedDate(day.date);
                  }}
                  className={`flex-shrink-0 w-24 p-4 rounded-2xl transition-all transform hover:scale-105 ${
                    selectedDate === day.date
                      ? "bg-red-500 shadow-2xl"
                      : "bg-[#2a2a2a]"
                  }`}
                >
                  <div className="text-sm opacity-80 mb-1">{day.day}</div>
                  <div className="text-3xl font-bold mb-1">{day.dayNum}</div>
                  <div className="text-sm opacity-80">{day.month}</div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Time Slots */}
        {selectedDate && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Choose Your Time
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {getTimeSlots().map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => slot.available && setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  className={`p-4 rounded-xl transition-all font-semibold ${
                    selectedTime === slot.time
                      ? "bg-red-500 shadow-lg"
                      : slot.available
                        ? "bg-[#2a2a2a]"
                        : "bg-[#2a2a2a] opacity-40 cursor-not-allowed"
                  }`}
                >
                  <Clock className="h-5 w-5 mx-auto mb-2" />
                  {slot.time}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Summary & Book Button */}
        {selectedTime && (
          <section className="mb-12">
            <div className="bg-[#2a2a2a] rounded-2xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold mb-6">Booking Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-300">
                    Customer & Vehicle
                  </h3>
                  <div className="space-y-2 text-gray-300">
                    <p>👤 {userData.name}</p>
                    <p>
                      🚗 {vehicleData.make?.name} {vehicleData.model?.name} (
                      {vehicleData.registrationYear})
                    </p>
                    <p>🔖 {vehicleData.licensePlate}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-300">
                    Appointment Details
                  </h3>
                  <div className="space-y-2 text-gray-300">
                    <p>🏢 {selectedGarage?.name}</p>
                    <p>📅 {selectedDate}</p>
                    <p>⏰ {selectedTime}</p>
                    <p className="text-xl font-bold text-white mt-3">
                      💰 Total: ₹{totalPrice}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleBookAppointment}
                disabled={!isFormValid()}
                className="w-full py-5 bg-gray-700 rounded-xl font-bold text-xl hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl transform hover:scale-102"
              >
                🎉 Confirm Booking
              </button>
            </div>
          </section>
        )}
      </div>
      <Spinner loading={loading} />
    </div>
  );
};

export default CarServiceAppointmentForm;
