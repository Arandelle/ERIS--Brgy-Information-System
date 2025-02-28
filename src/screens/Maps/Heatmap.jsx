import React, {useState, useEffect} from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import L from "leaflet";
import { CustomScrollZoomHandler } from "../../helper/scrollUtils";
import { useFetchData } from "../../hooks/useFetchData";
import { HeatmapLayer } from "./HeatmapLayer";

const CoverageRadius = ({ center, radius }) => {
  const map = useMap();

  useEffect(() => {
    if (!center) return;

    const circle = L.circle(center, {
      // color: "black", // border color
      weight: 0.5, // border weight
      fillColor: "#3388ff", 
      fillOpacity: 0.2,
      radius, // in meters
    }).addTo(map);

    return () => {
      map.removeLayer(circle);
    };
  }, [map, center, radius]);

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
        zoom={16}
        className="h-full w-full z-0 rounded-md"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <HeatmapLayer /> {/** to render the heat mark */}
        <CustomScrollZoomHandler /> {/**to prevent the zoom in/out in scroll, should use ctrl + scroll */}
        <CoverageRadius  center={position} radius={700}/> {/**radius for covered area */}
      </MapContainer>
  );
};

export default Heatmap;
