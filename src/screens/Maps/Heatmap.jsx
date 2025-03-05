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

const MaximizeMapControl = ({ maximize, setMaximize }) => {
  const map = useMap();

  useEffect(() => {
    const maximizeButton = L.control({ position: "topright" });

    maximizeButton.onAdd = function () {
      const button = L.DomUtil.create("button", "maximize-button");
      button.innerHTML = `<button class="leaflet-bar p-2 border rounded cursor-pointer bg-white shadow-md" >
       <p class="cursor-pointer">🔍</p>
      </button>`;

      L.DomEvent.on(button, "click", function () {
        setMaximize((prev) => !prev);
      });

      L.DomEvent.disableClickPropagation(button);
      L.DomEvent.disableScrollPropagation(button);

      return button;
    };

    maximizeButton.addTo(map);

    return () => {
      maximizeButton.remove();
    };
  }, [map, maximize]);

  return null;
};

const LegenMap = () => {
  const map = useMap();

  useEffect(() => {
    const legendContainer = L.control({ position: "bottomright" });
    legendContainer.onAdd = function () {
      const div = L.DomUtil.create("div", "container");
      div.innerHTML = `<div class="leaflet-bar bg-white p-2">
      <p>Legend: </p>
        <ul class="">
          <li class="text-orange-500">* Medical</li>
          <li class="text-[#ff0000]">* Fire</li>
          <li class="text-black">* Crime</li>
          <li class="text-purple-500">* Natural Disaster</li>
          <li class="text-blue-500">* Other</li>
        </ul>
      </div>`;

      return div;
    };

    legendContainer.addTo(map);

    return () => {
      legendContainer.remove();
    };
  }, [map]);
};
const CreateHeatLegendControl = () => {
  const map = useMap();
  useEffect(() => {
    const legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "heat-legend");

      // Create gradient blocks
      const grades = [
        { label: "Very Low", color: "rgba(0, 0, 255, 0.4)" }, // Light Blue
        { label: "Low", color: "rgba(0, 255, 255, 0.4)" }, // Cyan
        { label: "Medium", color: "rgba(255, 255, 0, 0.6)" }, // Yellow
        { label: "High", color: "rgba(255, 165, 0, 0.8)" }, // Orange
        { label: "Very High", color: "rgba(255, 0, 0, 1)" }, // Intense Red
      ];

      div.innerHTML = `
        <div class="leaflet-bar bg-white p-2 rounded-md shadow-md" style="min-width: 150px;">
          <div class="mb-2 p-1 text-center font-semibold">
            Emergency Intensity 
            <small class="block text-xs text-gray-600">
              (Varies with zoom level)
            </small>
          </div>
          ${grades
            .map(
              (grade) => `
            <div class="flex items-center mb-1">
             <div class="w-5 h-5 p-2 mr-2 border border-[rgba(0,0,0,0.3)] rounded-md" style="background-color: ${grade.color}"
              "></div>
            ${grade.label}
            </div>
          `
            )
            .join("")}
        </div>
      `;

      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
};

const Heatmap = ({ maximize, setMaximize }) => {
  const [position, setPosition] = useState([14.33289, 120.85065]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Year selection state
  const [availableYears, setAvailableYears] = useState([]);
  const [displayMode, setDisplayMode] = useState("heat");

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition(
  //     (location) => {
  //       setPosition([location.coords.latitude, location.coords.longitude]);
  //     },
  //     (error) => {
  //       console.error(error);
  //       setPosition([14.33289, 120.85065]); // Fallback position
  //     }
  //   );
  // }, []);

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
        <MaximizeMapControl maximize={maximize} setMaximize={setMaximize} />
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
        {displayMode !== "heat" ? <LegenMap /> : <CreateHeatLegendControl />}
        <CustomScrollZoomHandler />
        <CoverageRadius center={position} radius={700} />
      </MapContainer>
    </div>
  );
};

export default Heatmap;
