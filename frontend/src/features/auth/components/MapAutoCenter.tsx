import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface AutoCenterProps {
  lat?: number;
  lng?: number;
}

const MapAutoCenter = ({ lat, lng }: AutoCenterProps) => {
  const map = useMap();

  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 15, { duration: 1.5 });
    }
  }, [lat, lng, map]);

  return null;
};

export default MapAutoCenter;
