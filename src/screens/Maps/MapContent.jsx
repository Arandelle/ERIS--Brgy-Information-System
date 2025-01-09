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
import { ref, get, set } from "firebase/database";
import { database } from "../../services/firebaseConfig";
import { useFetchData } from "../../hooks/useFetchData";

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
  const {data: user } = useFetchData("users");
  const [userDetails, setUserDetails] = useState([]);
  const [position, setPosition] = useState(null);
  const [userLocation, setUserLocation] = useState(null); // Only holds a single location object
  const [loading, setLoading] = useState(true);
  const routingControlRef = useRef(null);
  const mapRef = useRef(null);

  const detailsOfUser = user?.find((user) => user.id === userDetails);

  useEffect(() => {
    // Get the user's current position
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
        const usersSnapshot = await get(usersRef); // Fetch snapshot

        if (usersSnapshot.exists()) {
          let latestActiveRequest = null;

          usersSnapshot.forEach((user) => {
            const userData = user.val();

            // Check if there's an activeRequest with valid location coordinates
            if (
              userData.activeRequest &&
              userData.activeRequest.locationCoords &&
              userData.activeRequest.locationOfResponder
            ) {
              latestActiveRequest = {
                id: user.key,
                location: [
                  userData.activeRequest.locationCoords.latitude,
                  userData.activeRequest.locationCoords.longitude
                ],
                locationOfResponder: [
                  userData.activeRequest.locationOfResponder.latitude,
                  userData.activeRequest.locationOfResponder.longitude
                ],
              };

              setUserDetails(latestActiveRequest.id);
            }
          });
          
          setUserLocation(latestActiveRequest); // Only set the latest valid request
          setLoading(false);
          console.log(latestActiveRequest);
        } else {
          console.log("No data available");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const MapEvents = () => {
    const map = useMap();
    mapRef.current = map;
  
    useEffect(() => {
      if (userLocation && userLocation.location && userLocation.locationOfResponder) {
        if (routingControlRef.current) {
          map.removeControl(routingControlRef.current);
        }

        const waypoints = [
          L.latLng(userLocation.locationOfResponder[0], userLocation.locationOfResponder[1]),
          L.latLng(userLocation.location[0], userLocation.location[1])
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

          {userLocation && (
            <>
              <Marker 
                key={userLocation.id}
                position={userLocation.location}
                icon={redIcon}
              >
                <Popup>
               {detailsOfUser?.firstname || "User Location"}
                </Popup>
              </Marker>

              <Marker 
                key={`responder-${userLocation.id}`}
                position={userLocation.locationOfResponder}
                icon={greenIcon}
              >
                <Popup>
                  This is the responder
                </Popup>
              </Marker>
            </>
          )}
        </LayerGroup>
        <CustomScrollZoomHandler />
        // Add the MapEvents component to the map
        <MapEvents />
      </MapContainer>
    </div>
  );
}

export default MyMapComponents;
