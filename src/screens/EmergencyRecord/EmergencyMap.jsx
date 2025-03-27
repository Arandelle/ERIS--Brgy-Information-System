import React, { useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvent,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { greenIcon } from "../../helper/iconUtils";

const EmergencyMap = ({ setEmergencyData, setOpenMap }) => {
  const [position] = useState([14.33289, 120.85065]);
  const [emergencyMarker, setEmergencyMarker] = useState([]);
  const [locationDetails, setLocationDetails] = useState({});

  const MapEvents = ({ onMapClick }) => {
    useMapEvent("click", (e) => {
      onMapClick(e);
    });
    return null;
  };

  const handleMarkLocation = async (e) => {
    const { lat, lng } = e.latlng;
    setEmergencyMarker([lat, lng]);

    try {
      // Enhanced Nominatim request with more detailed parameters
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&extratags=1`
      );
      const data = await response.json();

      if (data && data.address) {
        const details = {
          geoCodeLocation: data.display_name || "",
          latitude: lat.toFixed(6),
          longitude: lng.toFixed(6),
        };

        setLocationDetails(details);
      }
    } catch (error) {
      console.error("Error fetching geocode:", error);
      setLocationDetails({
        geoCodeLocation: "Unable to fetch location details",
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6),
      });
    }
  };

  const saveData = () => {
    if (emergencyMarker.length > 0) {
      setEmergencyData((prev) => ({
        ...prev,
        location: locationDetails,
        locationOfResponder: position
      }));
      setOpenMap(false);
    }
  };

  return (
    <div
      className="w-[95%] lg:w-2/3 h-2/3 relative"
      onClick={(e) => e.stopPropagation()}
    >
      <MapContainer
        center={position}
        zoom={16}
        className="h-full z-50 rounded-md"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapEvents onMapClick={handleMarkLocation} />
        {emergencyMarker.length > 0 && (
          <Marker position={emergencyMarker} icon={greenIcon}>
            <Popup>
              <div className="flex flex-col space-y-2">
                <span className="font-bold">Emergency Location Details</span>
                <span>Full Address: {locationDetails.geoCodeLocation}</span>
                <span>Latitude: {locationDetails.latitude}</span>
                <span>Longitude: {locationDetails.longitude}</span>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      {emergencyMarker.length > 0 && (
        <button
          className="absolute top-20 left-2 z-50 py-2 px-4 rounded-md text-sm bg-blue-500 text-white"
          onClick={saveData}
        >
          Save Location
        </button>
      )}
    </div>
  );
};

export default EmergencyMap;
