import React, { useState, useEffect, useCallback } from "react";
import {
  Clock,
  Phone,
  Mail,
  Car,
  CheckCircle,
  User,
  AlertTriangle,
  MapPin,
  Timer,
  User2,
  CarIcon,
  LucideTag,
  Building,
  Calendar,
  TimerIcon,
  TimerResetIcon,
  IndianRupee,
} from "lucide-react";
import { getNext7Days } from "@/utils/getNext7Days";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";
import type { IUsersMappedData } from "@/types/UserTypes";
import { errorToast } from "@/utils/notificationAudio";
import type { fuelTypeType, IPopulatedVehicle } from "@/types/VehicleTypes";
import type { IServiceCategory } from "@/types/ServiceCategoryTypes";
import { fuelTypes } from "@/constants/constantDatas";
import type { IBrand } from "@/types/BrandTypes";
import type { IVehicleModel } from "@/types/VehicleModelTypes";
import MapSection from "../../home/components/MapSection";
import type { GarageNearbyDto } from "@/types/GarageTypes";
import type { IService } from "@/types/ServicesTypes";
import { metersToKm } from "@/utils/meterToKMs";
import Spinner from "@/components/common/Spinner";
import type { ISlots } from "@/types/SlotTypes";
import {
  bookAppointmentApi,
  fetchNearByGaragesApi,
  fetchServicesByGarageIdApi,
  getAppointmentMetaData,
  getAvailableSlotsByGarageId,
} from "../services/appointmentServices";
import {
  getVehicleDetailsById,
  getVehicleModelsByBrandApi,
} from "@/features/myGarage/services/vehicleServices";

export interface timeSlot {
  startTime: string;
  slotId: string;
}

interface AppointmentFormProps {
  onSuccess: (id: string) => void;
}

const CarServiceAppointmentForm: React.FC<AppointmentFormProps> = ({
  onSuccess,
}) => {
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
    null,
  );
  const [garages, setGarages] = useState<GarageNearbyDto[]>([]);
  const [selectedGarage, setSelectedGarage] = useState<GarageNearbyDto | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<timeSlot | null>(null);
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);
  const [serviceCategories, setServiceCategories] = useState<
    IServiceCategory[] | []
  >([]);
  const [brands, setBrands] = useState<IBrand[] | []>([]);
  const [models, setModels] = useState<IVehicleModel[] | []>([]);
  const [services, setServices] = useState<IService[] | []>([]);
  const [filteredGarages, setFilteredGarages] = useState<GarageNearbyDto[]>([]);
  const [TimeSlots, setTimeSlots] = useState<ISlots[] | []>([]);
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
    if (!location?.lat || !location?.lng) {
      setGarages([]);
      setFilteredGarages([]);
      setSelectedGarage(null);
      return;
    }

    setSelectedGarage(null);
    setSelectedServices([]);
    setServices([]);

    fetchNearbyGarages(location.lat, location.lng);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.lat, location?.lng]);

  useEffect(() => {
    if (!selectedCategory || garages.length === 0) {
      setFilteredGarages(garages);
      return;
    }

    if (serviceCategories.length === 0) {
      setFilteredGarages(garages);
      return;
    }

    const filterGaragesByCategory = async () => {
      try {
        const garagesWithCategoryServices = await Promise.all(
          garages.map(async (garage) => {
            try {
              const categoryServices = await fetchServicesByGarageIdApi(
                garage.userId,
                selectedCategory,
              );
              return {
                garage,
                hasCategoryServices: categoryServices.length > 0,
              };
            } catch (error) {
              console.error(
                `Error checking services for garage ${garage._id}:`,
                error,
              );
              return { garage, hasCategoryServices: false };
            }
          }),
        );

        const filtered = garagesWithCategoryServices
          .filter((item) => item.hasCategoryServices)
          .map((item) => item.garage);

        setFilteredGarages(filtered);
      } catch (error) {
        console.error("Error filtering garages by category:", error);
        setFilteredGarages(garages);
      }
    };

    filterGaragesByCategory();
  }, [selectedCategory, garages, serviceCategories]);

  // Reset time selection when services change
  useEffect(() => {
    if (selectedServices.length > 0 && selectedTime) {
      setSelectedTime(null);
      setSelectedSlotIds([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedServices]);

  async function fetchVehicleData(vehicleId: string) {
    if (!vehicleId) return;
    setLoading(true);
    try {
      const res = await getVehicleDetailsById(vehicleId);
      setVehicleData(res);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) errorToast(error.message);
    } finally {
      setLoading(false);
    }
  }

  const fetchNearbyGarages = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const res = await fetchNearByGaragesApi(lat, lng);
      setGarages(res);
      setFilteredGarages(res);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) errorToast(error.message);
      setGarages([]);
      setFilteredGarages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAvailableServices = async (garageId: string) => {
    try {
      setLoading(true);
      const allServicesPromises = serviceCategories.map((category) =>
        fetchServicesByGarageIdApi(garageId, category._id).catch(() => []),
      );

      const allServicesArrays = await Promise.all(allServicesPromises);
      const allServices = allServicesArrays.flat();

      const uniqueServices = allServices.filter(
        (service, index, self) =>
          index === self.findIndex((s) => s._id === service._id),
      );

      setServices(uniqueServices);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) errorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((s) => s !== serviceId)
        : [...prev, serviceId],
    );
  };

  const getTotalServiceDuration = (): number => {
    return services
      .filter((s) => selectedServices.includes(s._id))
      .reduce((sum, s) => sum + s.durationMinutes, 0);
  };

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const getRequiredSlots = (
    startSlotIndex: number,
    totalDuration: number,
  ): ISlots[] => {
    const requiredSlots: ISlots[] = [];
    let remainingDuration = totalDuration;
    let currentIndex = startSlotIndex;

    while (remainingDuration > 0 && currentIndex < TimeSlots.length) {
      const slot = TimeSlots[currentIndex];
      requiredSlots.push(slot);
      remainingDuration -= slot.durationInMinutes || 30;
      currentIndex++;
    }

    return requiredSlots;
  };

  const areSlotsAvailable = (slots: ISlots[]): boolean => {
    return slots.every((slot) => slot.capacity > 0);
  };

  const areSlotsConsecutive = (slots: ISlots[]): boolean => {
    for (let i = 0; i < slots.length - 1; i++) {
      const currentSlotEndTime =
        timeToMinutes(slots[i].startTime) + (slots[i].durationInMinutes || 30);
      const nextSlotStartTime = timeToMinutes(slots[i + 1].startTime);

      if (currentSlotEndTime !== nextSlotStartTime) {
        return false;
      }
    }
    return true;
  };

  // Handle time slot click with duration validation
  const handleTimeSlotClick = (clickedSlot: ISlots, slotIndex: number) => {
    const totalDuration = getTotalServiceDuration();

    if (totalDuration === 0) {
      errorToast("Please select at least one service first");
      return;
    }
    const requiredSlots = getRequiredSlots(slotIndex, totalDuration);

    if (requiredSlots.length * 30 < totalDuration) {
      errorToast(
        `Not enough consecutive time slots available for ${totalDuration} minutes of service. Please select an earlier time or a different date.`,
      );
      return;
    }

    if (!areSlotsConsecutive(requiredSlots)) {
      errorToast(
        "Required time slots are not consecutive. Please select a different time.",
      );
      return;
    }

    if (!areSlotsAvailable(requiredSlots)) {
      errorToast(
        `Some of the required time slots are fully booked. Please select a different time.`,
      );
      return;
    }

    const slotIds = requiredSlots.map((slot) => slot._id);
    setSelectedSlotIds(slotIds);
    setSelectedTime({
      slotId: clickedSlot._id,
      startTime: clickedSlot.startTime,
    });
  };

  const isFormValid = () => {
    return (
      userData.name &&
      userData.email &&
      userData.mobileNumber &&
      vehicleData.make?._id &&
      vehicleData.model?._id &&
      vehicleData.licensePlate &&
      selectedGarage &&
      selectedServices.length > 0 &&
      selectedDate &&
      selectedTime
    );
  };

  useEffect(() => {
    if (!selectedDate) return;
    getAvailableTimeSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const getAvailableTimeSlots = async () => {
    if (!selectedGarage?.userId || !selectedDate) return;
    try {
      setLoading(true);
      const res = await getAvailableSlotsByGarageId(
        selectedGarage?.userId,
        selectedDate,
      );
      setTimeSlots(res);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) errorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    if (isFormValid()) {
      const selectedServiceDetails = services.filter((s) =>
        selectedServices.includes(s._id),
      );

      const totalDuration = getTotalServiceDuration();

      // Validate that we have the right number of slots
      if (selectedSlotIds.length * 30 < totalDuration) {
        errorToast(
          "Selected time slots don't cover the full service duration. Please reselect your time.",
        );
        return;
      }

      const data = {
        userData,
        vehicleData,
        services: selectedServiceDetails,
        garage: selectedGarage?._id,
        garageUID: selectedGarage?.userId,
        date: selectedDate,
        time: selectedTime,
        slotIds: selectedSlotIds,
        totalDuration: totalDuration,
      };

      try {
        setLoading(true);
        const res = await bookAppointmentApi(data);
        onSuccess(res._id);
        setSelectedGarage(null);
        setSelectedTime(null);
        setSelectedSlotIds([]);
        setSelectedServices([]);
        setSelectedDate(null);
      } catch (error) {
        console.error(error);
        if (error instanceof Error) errorToast(error.message);
      } finally {
        setLoading(false);
      }
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
                    (make) => make._id === e.target.value,
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
                    (model) => model._id === e.target.value,
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

        {/* Service Category Selection - Optional, for filtering garages */}
        <section className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2">
              Select Service Category (Optional)
            </h2>
            <p className="text-gray-400 text-sm">
              Choose a category to filter garages, or skip to see all garages.
              You can select services from multiple categories later.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
            {serviceCategories.map((category: IServiceCategory) => (
              <button
                key={category._id}
                onClick={() => {
                  // Toggle category selection
                  if (selectedCategory === category._id) {
                    setSelectedCategory(null);
                  } else {
                    setSelectedCategory(category._id);
                  }
                  // Reset garage selection when category changes
                  setSelectedGarage(null);
                  setSelectedServices([]);
                  setServices([]);
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
          {selectedCategory && (
            <div className="text-center">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedGarage(null);
                  setSelectedServices([]);
                  setServices([]);
                }}
                className="text-sm text-gray-400 hover:text-gray-300 underline"
              >
                Clear category filter to see all garages
              </button>
            </div>
          )}
        </section>

        {/* Location Selection */}
        <MapSection setLocation={setLocation} location={location} />

        {/* Nearby Garages */}
        {location && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Choose Your Service Center
            </h2>

            {loading && garages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  Loading garages near your location...
                </p>
              </div>
            )}

            {selectedCategory && filteredGarages.length > 0 && (
              <p className="text-center text-gray-400 mb-4">
                Showing {filteredGarages.length} garage(s) with services in{" "}
                {serviceCategories.find((c) => c._id === selectedCategory)
                  ?.name || "selected category"}
                .
                <span className="block text-xs mt-1 text-gray-500">
                  Note: You can still select services from all categories after
                  choosing a garage.
                </span>
              </p>
            )}
            {selectedCategory &&
              filteredGarages.length === 0 &&
              garages.length > 0 &&
              !loading && (
                <p className="text-center text-gray-400 mb-4">
                  Filtering garages by category...
                </p>
              )}
            {!selectedCategory && location && garages.length > 0 && (
              <p className="text-center text-gray-400 mb-4">
                Showing {garages.length} garage(s) near your location.
                <span className="block text-xs mt-1 text-gray-500">
                  Select a category above to filter garages, or choose any
                  garage to see all available services.
                </span>
              </p>
            )}
            {location && garages.length === 0 && !loading && (
              <div className="bg-yellow-500/20 border border-yellow-500 rounded-xl p-4 mb-6 text-center">
                <AlertTriangle className="h-5 w-5 inline-block mr-2" />
                No garages found near this location. Try selecting a different
                location.
              </div>
            )}
            {filteredGarages.length === 0 &&
              garages.length > 0 &&
              selectedCategory &&
              serviceCategories.length > 0 &&
              !loading && (
                <div className="bg-yellow-500/20 border border-yellow-500 rounded-xl p-4 mb-6 text-center">
                  <AlertTriangle className="h-5 w-5 inline-block mr-2" />
                  No garages found with services in the selected category in
                  this area.
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="ml-2 text-yellow-300 underline hover:text-yellow-200"
                  >
                    Clear category filter
                  </button>
                </div>
              )}
            {(filteredGarages.length > 0 ||
              (!selectedCategory && garages.length > 0)) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {(filteredGarages.length > 0 && selectedCategory
                  ? filteredGarages
                  : garages
                ).map((garage) => (
                  <button
                    key={garage._id}
                    onClick={() => {
                      setSelectedGarage(garage);
                      setSelectedServices([]);
                      fetchAvailableServices(garage.userId);
                    }}
                    className={`relative overflow-hidden rounded-2xl p-6 text-left transition-all transform hover:scale-102 ${
                      selectedGarage?._id === garage._id
                        ? "bg-red-500 shadow-2xl"
                        : "bg-[#2a2a2a]"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">
                          {garage.name}
                        </h3>
                        <p className="text-sm opacity-80 mb-3">
                          {`${garage.address.city} ${garage.address.district} ${garage.address.state} ${garage.address.pincode}`}
                        </p>
                      </div>
                      {selectedGarage?._id === garage._id && (
                        <CheckCircle className="h-6 w-6 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="bg-black/30 px-3 py-1 rounded-full flex items-center gap-1">
                        <MapPin size={14} />
                        {metersToKm(garage.distance)} km
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
            )}
          </section>
        )}

        {/* Service Selection from Garage */}
        {selectedGarage && (
          <section className="mb-12">
            <div className="bg-[#2a2a2a] rounded-2xl p-8 shadow-xl">
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-2">
                  Available Services at {selectedGarage.name}
                </h2>
                <p className="text-gray-400 text-sm">
                  Select services from any category. You can choose multiple
                  services from different categories.
                </p>
              </div>

              {/* Group services by category */}
              {serviceCategories.length > 0 && (
                <div className="space-y-6">
                  {serviceCategories.map((category) => {
                    const categoryServices = services.filter(
                      (s) =>
                        s.categoryId === category._id ||
                        s.categoryId === category._id,
                    );

                    if (categoryServices.length === 0) return null;

                    return (
                      <div key={category._id} className="mb-6">
                        <h3 className="text-xl font-semibold mb-4 text-gray-300">
                          {category.name}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {categoryServices.map((service) => {
                            const isSelected = selectedServices.includes(
                              service._id,
                            );

                            return (
                              <button
                                key={service._id}
                                onClick={() => toggleService(service._id)}
                                className={`p-5 rounded-xl text-left transition-all relative ${
                                  isSelected
                                    ? "bg-red-500 shadow-lg"
                                    : "bg-gray-700/50 hover:bg-gray-700"
                                }`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-bold text-lg">
                                    {service.name}
                                  </h4>
                                  {isSelected && (
                                    <CheckCircle className="h-5 w-5" />
                                  )}
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                  <span className="bg-black/30 px-3 py-1 rounded-full">
                                    ₹{service.price}
                                  </span>
                                  <span className="bg-black/30 px-3 py-1 rounded-full flex items-center gap-1">
                                    <Timer size={14} />{" "}
                                    {service.durationMinutes} min
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Fallback if services are not grouped by category */}
              {serviceCategories.length === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => {
                    const isSelected = selectedServices.includes(service._id);

                    return (
                      <button
                        key={service._id}
                        onClick={() => toggleService(service._id)}
                        className={`p-5 rounded-xl text-left transition-all ${
                          isSelected
                            ? "bg-red-500 shadow-lg"
                            : "bg-gray-700/50 hover:bg-gray-700"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-lg">{service.name}</h4>
                          {isSelected && <CheckCircle className="h-5 w-5" />}
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="bg-black/30 px-3 py-1 rounded-full">
                            ₹{service.price}
                          </span>
                          <span className="bg-black/30 px-3 py-1 rounded-full flex items-center gap-1">
                            <Timer size={14} /> {service.durationMinutes} min
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Selected services summary */}
              {selectedServices.length > 0 && (
                <div className="mt-6 space-y-4">
                  <div className="p-4 bg-gray-700/50 border border-gray-600 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">
                        {selectedServices.length} service(s) selected
                      </span>
                      <span className="text-2xl font-bold">
                        Total: ₹{totalPrice}
                      </span>
                    </div>
                  </div>

                  {/* Info message about service availability */}
                  {services.length === 0 && (
                    <div className="p-4 bg-yellow-500/20 border border-yellow-500 rounded-xl">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-yellow-400">
                            No services available at this garage for the
                            selected category.
                          </h4>
                          <p className="text-sm text-yellow-300 mt-1">
                            Please select a different garage or category.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
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
              {getNext7Days().map((day) => {
                const isClosed = selectedGarage?.selectedHolidays.includes(
                  day.dayFull,
                );

                return (
                  <div key={day.date} className="relative group">
                    <button
                      onClick={() => {
                        setSelectedDate(day.date);
                      }}
                      disabled={isClosed}
                      className={`flex-shrink-0 w-24 p-4 rounded-2xl transition-all transform
                        ${selectedDate === day.date ? "bg-red-500 shadow-2xl" : "bg-[#2a2a2a]"}
                        disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isClosed && (
                        <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full" />
                      )}

                      <div className="text-sm opacity-80 mb-1">{day.day}</div>
                      <div className="text-3xl font-bold mb-1">
                        {day.dayNum}
                      </div>
                      <div className="text-sm opacity-80">{day.month}</div>
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Time Slots */}
        {selectedDate && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center">
              {TimeSlots.length > 0
                ? "Choose Your Time"
                : "No slots available — try another date"}
            </h2>
            {TimeSlots.length > 0 && selectedServices.length > 0 && (
              <div className="text-center mb-4">
                <p className="text-gray-400 text-sm">
                  Total service duration:{" "}
                  <span className="font-semibold text-white">
                    {getTotalServiceDuration()} minutes
                  </span>{" "}
                  ({Math.ceil(getTotalServiceDuration() / 30)} slots required)
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {TimeSlots.map((slot, index) => {
                const isPartOfSelection = selectedSlotIds.includes(slot._id);
                const isStartSlot = selectedTime?.slotId === slot._id;

                return (
                  <button
                    key={slot._id}
                    onClick={() => handleTimeSlotClick(slot, index)}
                    disabled={slot.capacity - slot.bookedCount <= 0}
                    className={`p-4 rounded-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed relative ${
                      isStartSlot
                        ? "bg-red-500 shadow-lg ring-2 ring-red-300"
                        : isPartOfSelection
                          ? "bg-red-400 shadow-md"
                          : slot.capacity > 0
                            ? "bg-[#2a2a2a] hover:bg-[#353535]"
                            : "bg-[#2a2a2a] opacity-40 cursor-not-allowed"
                    }`}
                  >
                    {isStartSlot && (
                      <span className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        ✓
                      </span>
                    )}
                    <Clock className="h-5 w-5 mx-auto mb-2" />
                    <div className="text-sm">{slot.startTime}</div>
                    {slot.capacity - slot.bookedCount <= 0 && (
                      <div className="text-xs text-gray-400 mt-1">Full</div>
                    )}
                    {slot.capacity - slot.bookedCount > 0 && (
                      <div className="text-xs text-yellow-400 mt-1">
                        {slot.capacity - slot.bookedCount} left
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            {selectedSlotIds.length > 0 && (
              <div className="mt-4 p-4 bg-blue-500/20 border border-blue-500 rounded-xl text-center">
                <p className="text-sm text-blue-300">
                  {selectedSlotIds.length} time slot
                  {selectedSlotIds.length > 1 ? "s" : ""} selected (
                  {selectedSlotIds.length * 30} minutes total)
                </p>
              </div>
            )}
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
                  <div className="space-y-3 text-gray-300 text-sm">
                    <p className="flex items-center gap-2">
                      <User2 size={16} className="text-red-400" />
                      {userData.name}
                    </p>

                    <p className="flex items-center gap-2">
                      <CarIcon size={16} className="text-red-400" />
                      {vehicleData.make?.name} {vehicleData.model?.name} (
                      {vehicleData.registrationYear})
                    </p>

                    <p className="flex items-center gap-2">
                      <LucideTag size={16} className="text-red-400" />
                      {vehicleData.licensePlate}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-300">
                    Appointment Details
                  </h3>
                  <div className="space-y-3 text-gray-300 text-sm">
                    <p className="flex items-center gap-2">
                      <Building size={16} className="text-red-400" />
                      {selectedGarage?.name}
                    </p>

                    <p className="flex items-center gap-2">
                      <Calendar size={16} className="text-red-400" />
                      {selectedDate}
                    </p>

                    <p className="flex items-center gap-2">
                      <TimerIcon size={16} className="text-red-400" />
                      {selectedTime.startTime}
                    </p>

                    <p className="flex items-center gap-2">
                      <TimerResetIcon size={16} className="text-red-400" />
                      Duration: {getTotalServiceDuration()} minutes
                    </p>

                    <p className="flex items-center gap-2 text-xl text-green-400 mt-4 font-semibold">
                      <IndianRupee size={18} className="text-green-400" />
                      {totalPrice}
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                      Payable at the time of vehicle delivery
                    </p>
                  </div>
                </div>
              </div>
              {!isFormValid() && (
                <div className="my-4 p-4 w-full bg-red-600/50 border border-red-700 rounded-xl text-center">
                  <p className="text-white text-sm font-medium">
                    Please fill all required fields before booking.
                  </p>
                </div>
              )}
              <button
                onClick={handleBookAppointment}
                disabled={!isFormValid()}
                className="w-full py-5 bg-gray-700 rounded-xl font-bold text-xl hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl transform hover:scale-102"
              >
                Confirm Booking
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
