import React, { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Car,
  Search,
  Navigation,
  CheckCircle,
  MapPinned,
  User,
} from "lucide-react";
import { getNext7Days } from "@/utils/getNext7Days";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";
import type { IUsersMappedData } from "@/types/UserTypes";
import {
  getAppointmentMetaData,
  getVehicleDetailsById,
  getVehicleModelsByBrandApi,
} from "@/services/userRouter";
import { errorToast } from "@/utils/notificationAudio";
import type { IVehicleDTO } from "@/types/VehicleTypes";
import type { IServiceCategory } from "@/types/ServiceCategoryTypes";
import { fuelTypes } from "@/constants/constantDatas";
import type { IBrand } from "@/types/BrandTypes";
import type { IVehicleModel } from "@/types/VehicleModelTypes";

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
}

interface Garage {
  id: string;
  name: string;
  address: string;
  distance: number;
  rating: number;
  lat: number;
  lng: number;
  services: Service[];
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

const CarServiceAppointmentForm: React.FC = () => {
  const [vehicleId, setVehicleId] = useState<string | null>(null);
  const [userData, setUserData] = useState<Partial<IUsersMappedData>>({
    name: "",
    email: "",
    mobileNumber: "",
  });

  const [vehicleData, setVehicleData] = useState<Partial<IVehicleDTO>>({
    _id: "",
    makeName: "",
    model: "",
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
  const [locationName, setLocationName] = useState<string>("");
  const [garages, setGarages] = useState<Garage[]>([]);
  const [selectedGarage, setSelectedGarage] = useState<Garage | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [serviceCategories, setServiceCategories] = useState<
    IServiceCategory[] | []
  >([]);
  const [brands, setBrands] = useState<IBrand[] | []>([]);
  const [models, setModels] = useState<IVehicleModel[] | []>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setUserData({
      name: user?.name,
      email: user?.email,
      mobileNumber: user?.mobileNumber,
    });
  }, [user]);

  async function fetchVehicleData(vehicleId: string) {
    if (!vehicleId) return;
    setLoading(true);
    try {
      const res = await getVehicleDetailsById(vehicleId);
      setVehicleData(res);
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
      if (error instanceof Error) errorToast(error.message);
    } finally {
      setLoading(false);
    }
  }

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
      if (!vehicleData.makeName) return;
      const res = await getVehicleModelsByBrandApi(vehicleData.makeName);
      setModels(res);
    };
    fetchVehicleModels();
  }, [vehicleData.makeName]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const vId = urlParams.get("vehicleId");

    if (vId) {
      setVehicleId(vId);
      fetchVehicleData(vId);
    }
  }, []);

  useEffect(() => {
    if (location) {
      fetchNearbyGarages(location.lat, location.lng);
    }
  }, [location]);

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          setLocationName(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          setLoading(false);
        },
        (error) => {
          console.error(error);
          setLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser");
      setLoading(false);
    }
  };

  const fetchNearbyGarages = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockGarages: Garage[] = [
        {
          id: "1",
          name: "Premium Auto Service Center",
          address: "123 Main Street, Andheri West, Mumbai",
          distance: 2.3,
          rating: 4.8,
          lat: lat + 0.01,
          lng: lng + 0.01,
          services: [
            { id: "s1", name: "Oil Change", price: 1500, duration: "30 min" },
            {
              id: "s2",
              name: "Brake Inspection",
              price: 800,
              duration: "45 min",
            },
            {
              id: "s3",
              name: "Full Service",
              price: 3500,
              duration: "2 hours",
            },
            {
              id: "s4",
              name: "Wheel Alignment",
              price: 1200,
              duration: "1 hour",
            },
          ],
        },
        {
          id: "2",
          name: "QuickFix Auto Workshop",
          address: "456 Park Avenue, Bandra East, Mumbai",
          distance: 3.5,
          rating: 4.6,
          lat: lat + 0.02,
          lng: lng - 0.01,
          services: [
            {
              id: "s5",
              name: "Engine Diagnostic",
              price: 2000,
              duration: "1 hour",
            },
            {
              id: "s6",
              name: "AC Service",
              price: 2500,
              duration: "1.5 hours",
            },
            {
              id: "s7",
              name: "Battery Replacement",
              price: 4500,
              duration: "30 min",
            },
            {
              id: "s8",
              name: "Car Wash Premium",
              price: 500,
              duration: "45 min",
            },
          ],
        },
        {
          id: "3",
          name: "Expert Car Care Solutions",
          address: "789 Highway Road, Powai, Mumbai",
          distance: 4.8,
          rating: 4.9,
          lat: lat - 0.01,
          lng: lng + 0.02,
          services: [
            {
              id: "s9",
              name: "Transmission Service",
              price: 3000,
              duration: "2 hours",
            },
            {
              id: "s10",
              name: "Suspension Repair",
              price: 5000,
              duration: "3 hours",
            },
            {
              id: "s11",
              name: "Paint Protection",
              price: 8000,
              duration: "4 hours",
            },
            {
              id: "s12",
              name: "Detailing Complete",
              price: 3500,
              duration: "3 hours",
            },
          ],
        },
        {
          id: "4",
          name: "City Motors Service Hub",
          address: "321 Lake View Road, Goregaon, Mumbai",
          distance: 5.2,
          rating: 4.5,
          lat: lat + 0.03,
          lng: lng + 0.01,
          services: [
            {
              id: "s13",
              name: "Tire Rotation",
              price: 600,
              duration: "30 min",
            },
            {
              id: "s14",
              name: "Exhaust Repair",
              price: 2800,
              duration: "1.5 hours",
            },
            {
              id: "s15",
              name: "Windshield Replacement",
              price: 6000,
              duration: "2 hours",
            },
            {
              id: "s16",
              name: "General Checkup",
              price: 1000,
              duration: "1 hour",
            },
          ],
        },
      ];
      setGarages(mockGarages);
    } catch (error) {
      console.error("Error fetching garages:", error);
    } finally {
      setLoading(false);
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
      const selectedServiceDetails = selectedGarage?.services.filter((s) =>
        selectedServices.includes(s.id)
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
    selectedGarage?.services
      .filter((s) => selectedServices.includes(s.id))
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
                value={vehicleData.makeName}
                onChange={(e) =>
                  setVehicleData({ ...vehicleData, makeName: e.target.value })
                }
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
                value={vehicleData.model}
                onChange={(e) =>
                  setVehicleData({ ...vehicleData, model: e.target.value })
                }
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
                    registrationYear: Number(e.target.value),
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
                  setVehicleData({ ...vehicleData, fuelType: e.target.value })
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
          <section className="mb-12">
            <div className="bg-[#2a2a2a] rounded-2xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <MapPin className="h-8 w-8 text-gray-400" />
                Find Nearby Garages
              </h2>
              <div className="flex gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for a location..."
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="pl-12 pr-4 py-4 rounded-xl bg-gray-700 text-white placeholder-gray-400 w-full border border-gray-600 focus:border-gray-500 focus:outline-none transition-all"
                  />
                </div>
                <button
                  onClick={getCurrentLocation}
                  disabled={loading}
                  className="px-6 py-4 bg-gray-700 rounded-xl hover:bg-gray-600 transition-all disabled:opacity-50 flex items-center gap-2 font-semibold shadow-lg"
                >
                  <Navigation className="h-5 w-5" />
                  Current Location
                </button>
              </div>
              {location && (
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gray-800/30" />
                  <div className="relative flex items-center justify-center h-48">
                    <MapPinned className="h-16 w-16 text-gray-400 animate-pulse" />
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 px-4 py-2 rounded-lg">
                      <p className="text-sm text-gray-300">
                        📍 {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
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
                  key={garage.id}
                  onClick={() => {
                    setSelectedGarage(garage);
                    setSelectedServices([]);
                  }}
                  className={`relative overflow-hidden rounded-2xl p-6 text-left transition-all transform hover:scale-102 ${
                    selectedGarage?.id === garage.id
                      ? "bg-red-500 shadow-2xl"
                      : "bg-[#2a2a2a]"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{garage.name}</h3>
                      <p className="text-sm opacity-80 mb-3">
                        {garage.address}
                      </p>
                    </div>
                    {selectedGarage?.id === garage.id && (
                      <CheckCircle className="h-6 w-6 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="bg-black/30 px-3 py-1 rounded-full">
                      📍 {garage.distance} km
                    </span>
                    <span className="bg-black/30 px-3 py-1 rounded-full">
                      ⭐ {garage.rating}
                    </span>
                    <span className="bg-black/30 px-3 py-1 rounded-full">
                      {garage.services.length} Services
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
                {selectedGarage.services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={`p-5 rounded-xl text-left transition-all ${
                      selectedServices.includes(service.id)
                        ? "bg-red-500 shadow-lg"
                        : "bg-gray-700/50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg">{service.name}</h4>
                      {selectedServices.includes(service.id) && (
                        <CheckCircle className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="bg-black/30 px-3 py-1 rounded-full">
                        ₹{service.price}
                      </span>
                      <span className="bg-black/30 px-3 py-1 rounded-full">
                        ⏱️ {service.duration}
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
                    <p>
                      👤 {userData.firstName} {userData.lastName}
                    </p>
                    <p>
                      🚗 {vehicleData.make} {vehicleData.model} (
                      {vehicleData.year})
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
    </div>
  );
};

export default CarServiceAppointmentForm;
