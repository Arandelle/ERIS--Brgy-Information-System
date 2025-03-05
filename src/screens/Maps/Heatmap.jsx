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
    const legendContainer = L.control({ position: "topright" });
    legendContainer.onAdd = function() {
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
    }

    legendContainer.addTo(map);

    return () => {legendContainer.remove();}
  }, [map]);
};
const CreateHeatLegendControl = () => {
  const map = useMap();
  useEffect(() => {
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function() {
      const div = L.DomUtil.create('div', 'heat-legend');
      
      // Create gradient blocks
      const grades = [
        { label: 'Very Low', color: 'rgba(128, 0, 128, 0.2)' },  // Light Purple
        { label: 'Low', color: 'rgba(160, 32, 240, 0.4)' },     // Medium Purple
        { label: 'Medium', color: 'rgba(255, 0, 255, 0.6)' },   // Magenta
        { label: 'High', color: 'rgba(255, 64, 64, 0.8)' },     // Reddish
        { label: 'Very High', color: 'rgba(255, 0, 0, 1)' }     // Intense Red
      ];

      div.innerHTML = `
        <div class="leaflet-bar bg-white p-2 rounded-md shadow-md" style="min-width: 150px;">
          <div class="bg-gray-100 p-2 mb-2 rounded text-center font-semibold">
            Heat Intensity
          </div>
          ${grades.map((grade) => `
            <div class="flex items-center mb-1">
              <div style="
                width: 20px; 
                height: 20px; 
                background-color: ${grade.color}; 
                margin-right: 10px;
                border: 1px solid rgba(0,0,0,0.3);
                border-radius: 4px;
              "></div>
              <span class="text-sm">${grade.label}</span>
            </div>
          `).join('')}
        </div>
      `;

      return div;
    }; 

    legend.addTo(map);

    return () => {legend.remove()};
  },[map]);

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
        {displayMode !== "heat" ? (
          <LegenMap />
        ) : <CreateHeatLegendControl />}
        <CustomScrollZoomHandler />
        <CoverageRadius center={position} radius={700} />
      </MapContainer>
    </div>
  );
};

export default Heatmap;
