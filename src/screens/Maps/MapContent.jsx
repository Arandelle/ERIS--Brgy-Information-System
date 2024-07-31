import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  LayerGroup,
} from "react-leaflet";
import React, { useState, useEffect, useRef } from "react";
import { CustomScrollZoomHandler } from "../../helper/scrollUtils";
import { customIcon, redIcon } from "../../helper/iconUtils";
import { RoutingControl } from "../../helper/routingUtils";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import "leaflet-control-geocoder";
import { ref, onValue } from "firebase/database";
import { auth, database } from "../../services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export const personInfo = [
  {
    name: "Juan Dela cruz",
    address: "Block 16, Lot09 Sec24, Ph2 Pabahay 2000",
    timeAgo: "40 minutes ago",
    imageUrl: "https://flowbite.com/docs/images/people/profile-picture-2.jpg",
    position: [14.334, 120.85],
    isEndPoint: false, // Assuming this is not the endpoint
  },
  {
    name: "Person 2",
    address: "Block 16, Lot09 Sec24, Ph2 Pabahay 2000",
    timeAgo: "30 minutes ago",
    imageUrl: "https://flowbite.com/docs/images/people/profile-picture-3.jpg",
    position: [14.3349, 120.851],
    isEndPoint: true, // Assuming this is the endpoint
  },
];

function MyMapComponents({ isFullscreen }) {
  const [position, setPosition] = useState([14.332867, 120.850672]); // Default start position
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const endPoint = personInfo.find((person) => person.isEndPoint); // to get the endpoint

  const [emergencyData, setEmergencyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requestRef = ref(database, "emergencyRequests");
    const unsubscribe = onValue(requestRef, (snapshot) => {
      try {
        const data = snapshot.val();
        const emergencyList = [];
        for (const id in data) {
          if (data[id].location && data[id].status !== "done") {
            emergencyList.push({
              id,
              name: data[id].name || "Unknown",
              type: data[id].type || "Unspecified",
              location: [data[id].lat, data[id].long],
              status: data[id].status || "active"
              // Add any other relevant fields
            });
          }
        }
        setEmergencyData(emergencyList);
        setLoading(false);
      } catch (error) {
        console.error("Error", error);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const popupRef = useRef(null);

  useEffect(() => {
    if (popupRef.current) {
      setTimeout(() => {
        popupRef.current.closePopup();
      }, 5000); // Close the popup after 5 seconds (5000 milliseconds)
    }
  }, [popupRef]);

  useEffect(() => {
    // Get the device's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error("Error getting location: ", error);
        // Fallback position if geolocation fails
        setPosition([14.33289, 120.85065]);
      }
    );
  }, []);

  if (!position) {
    return <div>Loading...</div>; // Show a loading message until the position is obtained
  }

  return (
    <div className={`w-full z-0 shadow-md`} ref={containerRef}>
      <div className={`${isFullscreen ? "m-3" : ""}`}>
        <MapContainer
          center={position}
          zoom={15}
          className={`z-0 rounded-md ${isFullscreen ? "h-screen" : "h-96"}`}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LayerGroup>
            <Marker position={position} icon={customIcon}>
              <Popup autoOpen={true} ref={popupRef}>
                You are here
              </Popup>
            </Marker>

            {emergencyData.map((emergency) => (
              <Marker key={emergency.id} position={emergency.location} icon={redIcon}>
                <Popup>
                  <div className="flex flex-col w-48">
                    <span className="font-semibold text-gray-900">{emergency.name}</span>
                    <span className="text-sm">Type: {emergency.type}</span>
                    <span className="text-sm">Status: {emergency.status}</span>
                    {/* Add more emergency details as needed */}
                  </div>
                </Popup>
              </Marker>
            ))}

            {personInfo.map((person, index) => (
              <Marker key={index} position={person.position} icon={redIcon}>
                <Popup autoOpen={true} ref={popupRef}>
                  <div className="flex items-center w-48">
                    <div className="flex-shrink-0">
                      <img
                        src={person.imageUrl}
                        alt="Person"
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "50%",
                        }}
                      />
                    </div>
                    <p className="flex flex-col px-4 text-nowrap w-full text-gray-500 dark:text-gray-400">
                      <span className="font-semibold text-gray-900">
                        {person.name}
                      </span>
                      <span className="text-sm text-wrap">
                        {person.address}
                      </span>
                      <span className="text-xs font-medium text-primary-500 dark:text-primary-400">
                        {person.timeAgo}
                      </span>
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </LayerGroup>
          <CustomScrollZoomHandler />
          {endPoint && (
            <RoutingControl
              zoom={16}
              start={position}
              end={endPoint.position}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default MyMapComponents;
