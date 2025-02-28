import React, {useState, useEffect} from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import L from "leaflet";
import { CustomScrollZoomHandler } from "../../helper/scrollUtils";
import { useFetchData } from "../../hooks/useFetchData";
  
const HeatmapLayer = () => {
    const map = useMap();
    const { data: emergencyRequest } = useFetchData("emergencyRequest");
    const [emergencyData, setEmergencyData] = useState([]);
  
    useEffect(() => {
      if (!emergencyRequest || emergencyRequest.length === 0) return;
  
      const locationMap = new Map();
  
      // Process emergency requests
      emergencyRequest.forEach((request) => {
        if (request.location && request.location.latitude && request.location.longitude) {
          const lat = request.location.latitude;
          const lng = request.location.longitude;
          const key = `${lat},${lng}`;
  
          // Count occurrences
          locationMap.set(key, (locationMap.get(key) || 0) + 1);
        }
      });
  
      // Convert map data into heatmap format
      const heatData = Array.from(locationMap.entries()).map(([key, count]) => {
        const [lat, lng] = key.split(",").map(Number);
        return [lat, lng, count]; // Use count as intensity
      });
  
      setEmergencyData(heatData);
    }, [emergencyRequest]);
  
    useEffect(() => {
      if (emergencyData.length === 0) return;
  
      const heatLayer = L.heatLayer(emergencyData, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
      }).addTo(map);
  
      return () => {
        map.removeLayer(heatLayer);
      };
    }, [map, emergencyData]);
  
    return null;
  };
  
const Heatmap = () => {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (location) => {
        setPosition([location.coords.latitude, location.coords.longitude]);
      },
      (error) => {
        console.error(error);
        setPosition([14.33289, 120.85065]); //fall back position
      }
    );
  }, []);

  if (!position) {
    return <div>Loading...</div>;
  }

  return (
      <MapContainer
        center={position}
        zoom={15}
        className="h-full w-full z-0 rounded-md"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <HeatmapLayer /> {/** to render the heat mark */}
        <CustomScrollZoomHandler /> {/**to prevent the zoom in/out in scroll, should use ctrl + scroll */}
      </MapContainer>
  );
};

export default Heatmap;
