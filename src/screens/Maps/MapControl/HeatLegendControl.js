import { useMap } from "react-leaflet";
import { useEffect } from "react";

export const HeatLegendControl = () => {
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
      L.DomEvent.disableClickPropagation(div);
      L.DomEvent.disableScrollPropagation(div)
      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
};