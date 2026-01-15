import React, { useEffect, useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { errorToast } from "@/utils/notificationAudio";
import MapAutoCenter from "@/components/elements/MapAutoCenter";
import {
  fetchAddressForAppointmentApi,
  fetchCoordinatedForAppointmentApi,
} from "@/services/userRouter";

type LatLng = {
  lat: number;
  lng: number;
};

interface Props {
  location: LatLng | null;
  setLocation: (location: LatLng) => void;
}

const MapSection: React.FC<Props> = ({ setLocation, location }) => {
  const [locationName, setLocationName] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          setLoading(false);
        },
        (error) => {
          console.error(error);
          setLoading(false);
        }
      );
    } else {
      errorToast("Geolocation is not supported by this browser");
      setLoading(false);
    }
  };

  const searchLocation = async () => {
    try {
      if (!locationName) return;
      const data = await fetchCoordinatedForAppointmentApi(locationName);
      setLocation({
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lng),
      });
    } catch (error) {
      console.log(error);
      if (error instanceof Error) errorToast(error.message);
    }
  };

  useEffect(() => {
    if (!location) return;

    const controller = new AbortController();

    const setDisplayLocationName = async () => {
      try {
        const res = await fetchAddressForAppointmentApi(
          location.lat,
          location.lng
        );
        setLocationName(
          `${res.city}, ${res.district}, ${res.state}, ${res.pincode}`
        );
      } catch (err) {
        console.error(err);
      }
    };

    setDisplayLocationName();

    return () => controller.abort();
  }, [location]);

  const LocationPicker = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        setLocation({ lat, lng });
      },
    });

    return null;
  };

  return (
    <section className="mb-12">
      <div className="bg-[#2a2a2a] rounded-2xl p-8 shadow-xl">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <MapPin className="h-8 w-8 text-gray-400" />
          Find Nearby Garages
        </h2>

        {/* Search + Current Location */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Search location (optional)"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchLocation();
              }
            }}
            className="flex-1 px-4 py-4 rounded-xl bg-gray-700 text-white border border-gray-600 focus:outline-none"
          />

          <button
            onClick={getCurrentLocation}
            disabled={loading}
            className="px-6 py-4 bg-gray-700 rounded-xl hover:bg-gray-600 transition-all flex items-center gap-2 font-semibold"
          >
            <Navigation className="h-5 w-5" />
            Current Location
          </button>
        </div>

        {/* OpenStreetMap */}
        {location && (
          <div className="rounded-xl overflow-hidden border border-gray-700">
            <MapContainer
              center={[location.lat, location.lng]}
              zoom={14}
              style={{ height: "350px", width: "100%" }}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <LocationPicker />
              <MapAutoCenter lat={location?.lat} lng={location?.lng} />

              <Marker position={[location.lat, location.lng]}>
                <Popup>
                  Your Location <br />
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
      </div>
    </section>
  );
};

export default MapSection;
