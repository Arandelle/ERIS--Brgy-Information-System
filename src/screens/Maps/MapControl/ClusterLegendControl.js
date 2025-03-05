import { useMap } from "react-leaflet";
import { useEffect } from "react";

export const ClusterLegendControl = () => {
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