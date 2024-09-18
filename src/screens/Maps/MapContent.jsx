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
import { blueIcon, redIcon, greenIcon } from "../../helper/iconUtils";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import "leaflet-control-geocoder";
import { ref, onValue, get } from "firebase/database";
import { database } from "../../services/firebaseConfig";

function AutoOpenPopup({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      const marker = L.marker(position, { icon: blueIcon });
      marker.addTo(map).bindPopup("You are here").openPopup();

      return () => {
        map.removeLayer(marker);
      };
    }
  }, [map, position]);

  return null;
}

function MyMapComponents() {
  const [position, setPosition] = useState(null);
  const [userLocation, setUserLocation] = useState([]);
  const [loading, setLoading] = useState(true);
  const routingControlRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (location) => {
        setPosition([location.coords.latitude, location.coords.longitude]);
      },
      (error) => {
        console.error("Error getting location: ", error);
        setPosition([14.33289, 120.85065]); // Fallback position
      }
    );
  }, []);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const usersRef = ref(database, "users");
        const usersSnapshot = await get(usersRef);

        if (usersSnapshot.exists()) {
          const usersWithActiveRequest = [];
          usersSnapshot.forEach((user) => {
            const userData = user.val();

            if (userData.activeRequest && userData.activeRequest.locationCoords) {
              usersWithActiveRequest.push({
                id: user.key,
                location: [
                  userData.activeRequest.locationCoords.latitude,
                  userData.activeRequest.locationCoords.longitude
                ],
                locationOfResponder: [
                  userData.activeRequest.locationOfResponder.latitude,
                  userData.activeRequest.locationOfResponder.longitude
                ],
              });
            }
          });
          setUserLocation(usersWithActiveRequest);
          setLoading(false)
          console.log(usersWithActiveRequest);
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchUser();
  }, []);

  const MapEvents = () => {
    const map = useMap();
    mapRef.current = map;
  
    useEffect(() => {
      if (userLocation.length > 0) {
        if (routingControlRef.current) {
          map.removeControl(routingControlRef.current);
        }

        const waypoints = [
          ...userLocation.map(user => L.latLng(user.locationOfResponder[0], user.locationOfResponder[1])),
          ...userLocation.map(user => L.latLng(user.location[0], user.location[1]))
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

        // Fit the map to show all points
        const bounds = L.latLngBounds(waypoints);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [map, userLocation, position]);
  
    return null;
  };

  if (loading || !position) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`w-full h-full z-0 shadow-md`}>
      <MapContainer
        center={position}
        zoom={15}
        className={`z-0 rounded-md h-full`}
        ref={mapRef}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LayerGroup>
          <AutoOpenPopup position={position} />

          {userLocation.map((emergency) => (
            <Marker
              key={emergency.id}
              position={emergency.location}
              icon={redIcon}
            >
              <Popup>
                User with active request
              </Popup>
            </Marker>
          ))}

          {userLocation.map((emergency) => (
            <Marker
              key={emergency.id}
              position={emergency.locationOfResponder}
              icon={greenIcon}
            >
              <Popup>
               This is Responder
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