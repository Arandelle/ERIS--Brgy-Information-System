import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import L from "leaflet";
import { CustomScrollZoomHandler } from "../../helper/scrollUtils";
import { HeatmapLayer } from "./HeatmapLayer";
import { DisplayModeControl } from "./MapControl/DisplayModeControl";
import { YearSelectorControl } from "./MapControl/YearSelectorControl";

const CoverageRadius = ({ center, radius }) => {
  const map = useMap();

  useEffect(() => {
    if (!center) return;

    const circle = L.circle(center, {
      weight: 0.5,
      fillColor: "#3388ff",
      fillOpacity: 0.2,
      radius,
    }).addTo(map);

    return () => {
      map.removeLayer(circle);
    };
  }, [map, center, radius]);

  return null;
};

const Heatmap = () => {
  const [position, setPosition] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Year selection state
  const [availableYears, setAvailableYears] = useState([]);
  const [displayMode, setDisplayMode] = useState("heat");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (location) => {
        setPosition([location.coords.latitude, location.coords.longitude]);
      },
      (error) => {
        console.error(error);
        setPosition([14.33289, 120.85065]); // Fallback position
      }
    );
  }, []);

  if (!position) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative h-full">
      <MapContainer
        center={position}
        zoom={16}
        className="h-full w-full z-0 rounded-md"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <HeatmapLayer
          selectedYear={selectedYear}
          setAvailableYears={setAvailableYears}
          displayMode={displayMode}
        />
        {availableYears.length > 0 && (
          <YearSelectorControl
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            availableYears={availableYears}
          />
        )}
        <DisplayModeControl
          displayMode={displayMode}
          setDisplayMode={setDisplayMode}
        />
        <CustomScrollZoomHandler />
        <CoverageRadius center={position} radius={700} />
      </MapContainer>
    </div>
  );
};

export default Heatmap;
