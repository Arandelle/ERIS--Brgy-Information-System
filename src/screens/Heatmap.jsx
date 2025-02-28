import React, {useState, useEffect} from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import L from "leaflet";
import { CustomScrollZoomHandler } from "../helper/scrollUtils";
import { useFetchData } from "../hooks/useFetchData";

// Emergency data: 5 clustered points and 5 spread-out points
const emergencyData = [
    // Clustered emergencies (around 14.3950, 120.8575)
    [14.33289, 120.85065, 1.0],
    [14.33288, 120.85066, 1.0],
    [14.33287, 120.85067, 1.0],
    [14.33286, 120.85068, 1.0],
    [14.33285, 120.85069, 1.0],
  
    // Scattered emergencies
    [14.33300, 120.86005, 1],
    [14.33320, 120.85920, 50],
    [14.33320, 120.85930, 1],
    [14.33320, 120.85920, 1],
    [14.4000, 120.8620, 1.0],
    [14.3900, 120.8540, 0.7],
    [14.3965, 120.8582, 50],
  ];
  
const HeatmapLayer = () => {
    const map = useMap();
    const {data: emergencyRequest} = useFetchData("emergencyRequest");
    useEffect(() => {
        const heatLayer = L.heatLayer(emergencyData, {
            radius: 25,
            blur: 15,
            maxZoom: 17
        }).addTo(map);

        return () => {
            map.removeLayer(heatLayer);
        };
    }, [map]);

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
