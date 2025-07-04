import { useMap } from "react-leaflet";
import { useEffect } from "react";

export const ClusterLegendControl = ({emergencyTypeCount,selectedYear}) => {
  const map = useMap();

  useEffect(() => {
    const legendContainer = L.control({ position: "bottomright" });
    legendContainer.onAdd = function () {
      const div = L.DomUtil.create("div", "container");

      const colors = [
        { label: "Medical", color: "#ff5733", count: emergencyTypeCount["medical"] || 0 },
        { label: "Fire", color: "#ff0000", count: emergencyTypeCount["fire"] || 0},
        { label: "Crime", color: "#000000", count: emergencyTypeCount["crime"] || 0},
        { label: "Natural Disaster", color: "#8e44ad", count: emergencyTypeCount["natural disaster"] || 0 },
        { label: "Public Disturbance", color: "#f1c40f", count: emergencyTypeCount["public disturbance"] || 0 },
        { label: "Other", color: "#3498db", count: emergencyTypeCount["other"] || 0},
      ];

      div.innerHTML = `<div class="leaflet-bar bg-white p-2 rounded-md shadow-md" style="min-width: 150px;">
      <div class="mb-2 p-1 text-center font-semibold">
       Emergency Type Indicator
      <p class="font-normal">(Mixed colors indicate multiple types)</p>
      </div>
      ${colors
        .map(
          (color) => `
        <div class="flex items-center mb-1">
         <div class="w-5 h-5 p-2 mr-2 border border-[rgba(0,0,0,0.3)] rounded-md" style="background-color: ${color.color}"
          "></div>
        ${color.label}
       ( ${color.count} count )
        </div>
      `
        )
        .join("")}
    </div>
  `;
     L.DomEvent.disableClickPropagation(div);
      L.DomEvent.disableScrollPropagation(div);
  return div;
    };

    legendContainer.addTo(map);

    return () => {
      legendContainer.remove();
    };
  }, [map,emergencyTypeCount,selectedYear]);
};