import { MapContainer, TileLayer, useMap, Marker, Popup,LayerGroup,LayersControl } from "react-leaflet";
import React, { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css"; // import Leaflet CSS
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';

function CustomScrollZoomHandler() {
  const map = useMap();

  useEffect(() => {
    const handleWheel = (event) => {
      if (event.ctrlKey) {
        event.preventDefault(); // Prevent the default zoom behavior of the browser
        const zoomDelta = event.deltaY > 0 ? -1 : 1;
        map.zoomIn(zoomDelta); // Manually handle zoom in/out
      }
    };

    map.scrollWheelZoom.disable(); // Disable scroll zoom by default
    map.getContainer().addEventListener("wheel", handleWheel);

    return () => {
      map.getContainer().removeEventListener("wheel", handleWheel);
    };
  }, [map]);

  return null;
}
const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
});
function RoutingControl({ start, end }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start[0], start[1]),
        L.latLng(end[0], end[1])
      ],
      routeWhileDragging: true
    }).addTo(map);
  
    return () => map.removeControl(routingControl);
  }, [map, start, end]);

  return null;
}

function MyMapComponents() {
  const [position, setPosition] = useState([14.332867, 120.850672]); // Default position
  const [otherMarkerPosition, setOtherMarkerPosition] = useState([14.334, 120.850]);
  const [personInfo, setPersonInfo] = useState({
    name: "Juan Dela cruz",
    address: "Ph2 Pabahay",
    timeAgo: "30 minutes ago",
    imageUrl: "https://flowbite.com/docs/images/people/profile-picture-5.jpg", // Placeholder image URL
  });
  return (
    <div className="w-full h-screen z-0">
      <div style={{ margin: "20px" }}>
        <h1 className="absolute top-2 left-20 z-10 font-medium rounded shadow-lg text-gray-900 bg-white py-2 px-4 dark:bg-gray-600 dark:text-green-400">
          Ctrl + scroll to zoom in/out
        </h1>
        <MapContainer
          center={[14.334, 120.85]}
          zoom={16}
          style={{ height: "600px", zIndex: 0, borderRadius: "8px" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LayerGroup>
          <Marker position={position} icon={customIcon}>
            <Popup>You are here</Popup>
          </Marker>
       
          <Marker position={otherMarkerPosition} icon={redIcon}>
            <Popup>
              <div className="flex items-center w-40">
                  <div className="flex-shrink-0">
                    <img src={personInfo.imageUrl} alt="Person" style={{ width: "44px", height: "44px", borderRadius: "50%" }} />
                  </div>
                    <p className="flex flex-col px-4 text-nowrap w-full text-gray-500  dark:text-gray-400">
                      <span class="font-semibold text-gray-900">{personInfo.name}</span>
                      <span className="text-sm">{personInfo.address}</span>
                      <span className="text-xs font-medium text-primary dark:text-primary">{personInfo.timeAgo}</span>
                    </p>
            </div>
            </Popup>
          </Marker>
            {/* Add more markers or layers as needed */}
          </LayerGroup>
          <CustomScrollZoomHandler />
          <RoutingControl start={position} end={otherMarkerPosition} />
        </MapContainer>
      </div>
    </div>
  );
}

export default MyMapComponents;
