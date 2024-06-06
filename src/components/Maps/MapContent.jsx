import { MapContainer, TileLayer, useMap, Marker, Popup, LayerGroup } from "react-leaflet";
import React, { useState, useEffect, useRef } from "react";
import { CustomScrollZoomHandler } from "../../helper/scrollUtils";
import { customIcon, redIcon } from "../../helper/iconUtils";
import { RoutingControl } from "../../helper/routingUtils";
import "leaflet/dist/leaflet.css";
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import 'leaflet-control-geocoder';

function MyMapComponents({isFullscreen}) {
  const [position, setPosition] = useState([14.332867, 120.850672]); // Default start position
  const [otherMarkerPosition, setOtherMarkerPosition] = useState([14.334, 120.850]);
  const [otherMarkerPosition1, setOtherMarkerPosition1] = useState([14.3349, 120.851]);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const [personInfo, setPersonInfo] = useState({
    name: "Juan Dela cruz",
    address: "Block 16, Lot09 Sec24, Ph2 Pabahay 2000",
    timeAgo: "30 minutes ago",
    imageUrl: "https://flowbite.com/docs/images/people/profile-picture-2.jpg", // Placeholder image URL
  });
  const [personInfo1, setPersonInfo1] = useState({
    name: "Person 2",
    address: "Block 16, Lot09 Sec24, Ph2 Pabahay 2000",
    timeAgo: "30 minutes ago",
    imageUrl: "https://flowbite.com/docs/images/people/profile-picture-3.jpg", // Placeholder image URL
  });

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
    <div className={`w-full z-0`} ref={containerRef}>
    <div className={`${isFullscreen ? 'm-3' : ""}`}>
        <MapContainer
          center={position}
          zoom={15}
          className={`z-0 rounded-lg ${isFullscreen ? 'h-screen' : 'h-96'}`}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LayerGroup>
            <Marker position={position} icon={customIcon}>
              <Popup autoOpen={true} ref={popupRef}>You are here</Popup>
            </Marker>
      
            <Marker position={otherMarkerPosition} icon={redIcon}>
              <Popup autoOpen={true} ref={popupRef}>
                <div className="flex items-center w-48">
                  <div className="flex-shrink-0">
                    <img src={personInfo.imageUrl} alt="Person" style={{ width: "44px", height: "44px", borderRadius: "50%" }} />
                  </div>
                  <p className="flex flex-col px-4 text-nowrap w-full text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-gray-900">{personInfo.name}</span>
                    <span className="text-sm text-wrap">{personInfo.address}</span>
                    <span className="text-xs font-medium text-primary-500 dark:text-primary-400">{personInfo.timeAgo}</span>
                  </p>
                </div>
              </Popup>
            </Marker>
            <Marker position={otherMarkerPosition1} icon={redIcon}>
              <Popup autoOpen={true} ref={popupRef}>
                <div className="flex items-center w-48">
                  <div className="flex-shrink-0">
                    <img src={personInfo1.imageUrl} alt="Person" style={{ width: "44px", height: "44px", borderRadius: "50%" }} />
                  </div>
                  <p className="flex flex-col px-4 text-nowrap w-full text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-gray-900">{personInfo1.name}</span>
                    <span className="text-sm text-wrap">{personInfo1.address}</span>
                    <span className="text-xs font-medium text-primary-500 dark:text-primary-400">{personInfo1.timeAgo}</span>
                  </p>
                </div>
              </Popup>
            </Marker>

            {/* Add more markers or layers as needed */}
          </LayerGroup>
          <CustomScrollZoomHandler />
          <RoutingControl zoom={16} start={position} end={otherMarkerPosition} />
        </MapContainer>
      </div>    
    </div>
  );
}

export default MyMapComponents;
