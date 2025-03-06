import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useFetchData } from "../../../hooks/useFetchData";

export const ResponderListControl = () => {
  const map = useMap();
  const { data: responders } = useFetchData("responders");

  useEffect(() => {
    const marker = L.control({ position: "topleft" });
    marker.onAdd = function () {
      const div = L.DomUtil.create("div", "responder-list");

      // Filter available responders (where hasActiveEmergency is false)
      const availableResponders = responders.filter(
        (responder) => !responder.pendingEmergency
      );

      div.innerHTML = `<div class="leaflet-bar bg-white p-2 rounded-md shadow-md" style="min-width: 150px;">
          <div class="mb-2 p-1 text-center font-semibold">
            Available Responders
          </div>

          ${availableResponders.length > 0 ? (

          `${availableResponders
            .map(
              (responder) => `
            <div class="flex items-center space-x-2 mb-1">
             <div> <img src=${responder.img} loading="lazy" alt="responder" class="w-10 h-10 border rounded-full shadow-md"/></div>
            <p class="text-green-500 font-bold">  ${responder.fullname}</p>
            </div>
          `
            )
            .join("")}`

          ) : (
           
          `<p class="italic text-gray-500">No available responder</p>`
          
          )}
          
        </div>
      `;
      return div;
    };

    marker.addTo(map);

    return () => {marker.remove()};
  }, [map, responders]);

  return null;
};
