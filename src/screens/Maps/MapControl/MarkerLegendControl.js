import { useEffect } from "react";
import { useMap } from "react-leaflet";

export const MarkerLegendControl = ({filteredEmergency,selectedYear}) => {
  const map = useMap();

  useEffect(() => {
    const marker = L.control({ position: "bottomright" });
    marker.onAdd = function () {
      const div = L.DomUtil.create("div", "marker-legend");

      const colors = [
        { label: "Pending", color: "#ff0000" },
        { label: "On-going", color: "#28a745" },
      ];

      div.innerHTML = `<div class="leaflet-bar bg-white p-2 rounded-md shadow-md" style="min-width: 150px;">
          <div class="mb-2 p-1 text-center font-semibold">
            Emergency Marker
          </div>
          ${
            filteredEmergency.length > 0
              ? `${colors
                  .map(
                    (color) => `
            <div class="flex items-center mb-1">
             <div class="w-5 h-5 p-2 mr-2 border border-[rgba(0,0,0,0.3)] rounded-md" style="background-color: ${color.color}"
              "></div>
            ${color.label}
            </div>
          `
                  )
                  .join("")}`
              : `<p>Great!, no emergency occur</p>`
          }
          
        </div>
      `;
      return div;
    };

    marker.addTo(map);

    return () => {
      marker.remove();
    };
  }, [map, filteredEmergency,selectedYear]);

  return null;
};
