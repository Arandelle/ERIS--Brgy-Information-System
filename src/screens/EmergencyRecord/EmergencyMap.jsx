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
  const [position, setPosition] = useState([14.33289, 120.85065]);
  const [emergencyMarker, setEmergencyMarker] = useState([]);

  const MapEvents = ({ onMapClick }) => {
    useMapEvent({
      click: (e) => {
        onMapClick(e);
      },
    });
  };

  const handleMarkLocation = (e) => {
    const { lat, lng } = e.latlng;
    setEmergencyMarker([lat, lng]);
  };

  const saveData = () => {
    if (emergencyMarker) {
      setEmergencyData((prev) => ({
        ...prev,
        location: {
          latitude: emergencyMarker[0],
          longitude: emergencyMarker[1],
        },
      }));
    }
    setOpenMap(false);
  };

  return (
    <div className="w-2/3 h-2/3 relative" onClick={(e) => e.stopPropagation()}>
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
                <span className="font-bold">
                  Your selected emergency location
                </span>
                <span> Latitude: {emergencyMarker[0]}</span>
                <span> Longitude: {emergencyMarker[1]}</span>
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
          Save
        </button>
      )}
    </div>
  );
};

export default EmergencyMap;
