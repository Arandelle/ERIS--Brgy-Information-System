import { useMap } from "react-leaflet";
import { useEffect } from "react";

export const ClusterLegendControl = () => {
  const map = useMap();

  useEffect(() => {
    const legendContainer = L.control({ position: "bottomright" });
    legendContainer.onAdd = function () {
      const div = L.DomUtil.create("div", "container");

      const colors = [
        { label: "Medical", color: "#ff5733" },
        { label: "Fire", color: "#ff0000" },
        { label: "Crime", color: "#000000" },
        { label: "Natural Disaster", color: "#8e44ad" },
        { label: "Other", color: "#3498db" },
      ];

      div.innerHTML = `<div class="leaflet-bar bg-white p-2 rounded-md shadow-md" style="min-width: 150px;">
      <div class="mb-2 p-1 text-center font-semibold">
        Color Legend
      </div>
      ${colors
        .map(
          (color) => `
        <div class="flex items-center mb-1">
         <div class="w-5 h-5 p-2 mr-2 border border-[rgba(0,0,0,0.3)] rounded-md" style="background-color: ${color.color}"
          "></div>
        ${color.label}
        </div>
      `
        )
        .join("")}
    </div>
  `;
  return div;
    };

    legendContainer.addTo(map);

    return () => {
      legendContainer.remove();
    };
  }, [map]);
};