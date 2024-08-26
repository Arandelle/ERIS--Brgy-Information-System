import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  LayerGroup,
} from "react-leaflet";
import L from 'leaflet';
import { CustomScrollZoomHandler } from "../../helper/scrollUtils";
import { customIcon, redIcon } from "../../helper/iconUtils";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import "leaflet-control-geocoder";
import { ref, onValue } from "firebase/database";
import { database } from "../../services/firebaseConfig";

function AutoOpenPopup({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      const marker = L.marker(position, { icon: customIcon });
      marker.addTo(map).bindPopup("You are here").openPopup();

      return () => {
        map.removeLayer(marker);
      };
    }
  }, [map, position]);

  return null;
}

function MyMapComponents({ isFullscreen }) {
  const [position, setPosition] = useState(null);
  const [emergencyData, setEmergencyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const routingControlRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (error) => {
        console.error("Error getting location: ", error);
        setPosition([14.33289, 120.85065]); // Fallback position
      }
    );
  }, []);

  useEffect(() => {
    const requestRef = ref(database, "emergencyRequest");
    const unsubscribe = onValue(requestRef, (snapshot) => {
      try {
        const data = snapshot.val();
        const emergencyList = Object.entries(data)
          .filter(([_, emergency]) => emergency.locationCoords && emergency.status !== "done")
          .map(([id, emergency]) => ({
            id,
            name: emergency.name || "Unknown",
            type: emergency.type || "Unspecified",
            location: [emergency.locationCoords.latitude, emergency.locationCoords.longitude],
            status: emergency.status || "active",
            description: emergency.description || "none",
          }));
        setEmergencyData(emergencyList);
        setLoading(false);
      } catch (error) {
        console.error("Error", error);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSelectEmergency = (emergency) => {
    setSelectedEmergency(emergency);
  };

  const MapEvents = () => {
    const map = useMap();
    mapRef.current = map;
  
    useEffect(() => {
      if (selectedEmergency && position) {
        if (routingControlRef.current) {
          map.removeControl(routingControlRef.current);
        }

        const waypoints = [
          L.latLng(position[0], position[1]),
          L.latLng(selectedEmergency.location[0], selectedEmergency.location[1])
        ];

        const newRoutingControl = L.Routing.control({
          waypoints: waypoints,
          routeWhileDragging: false,
          showAlternatives: true,
          fitSelectedRoutes: true,
          lineOptions: {
            styles: [{ color: '#6FA1EC', weight: 4 }]
          },
          altLineOptions: {
            styles: [{ color: '#ED7B7B', weight: 4 }]
          },
          createMarker: function() { return null; } // Prevent creation of new markers
        }).addTo(map);

        routingControlRef.current = newRoutingControl;

        // Fit the map to show both the start and end points
        const bounds = L.latLngBounds(waypoints);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [map, selectedEmergency, position]);
  
    return null;
  };

  if (loading || !position) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`w-full z-0 shadow-md`}>
      <MapContainer
        center={position}
        zoom={15}
        className={`z-0 rounded-md ${isFullscreen ? "h-screen" : "h-96"}`}
        ref={mapRef}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LayerGroup>
          <AutoOpenPopup position={position} />
          {emergencyData.map((emergency) => (
            <Marker
              key={emergency.id}
              position={emergency.location}
              icon={redIcon}
            >
              <Popup>
                <div className="flex items-center w-full">
                  <p className="flex flex-col px-4 text-nowrap w-full text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-gray-900">
                      Name: {emergency.name}
                    </span>
                    <span className="text-sm text-wrap">
                      Type: {emergency.type}
                    </span>
                    <span className="text-sm text-wrap">
                      Description: {emergency.description}
                    </span>
                    <button 
                      className="mt-2 bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => handleSelectEmergency(emergency)}
                    >
                      Route to this area
                    </button>
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </LayerGroup>
        <CustomScrollZoomHandler />
        <MapEvents />
      </MapContainer>
    </div>
  );
}

export default MyMapComponents;