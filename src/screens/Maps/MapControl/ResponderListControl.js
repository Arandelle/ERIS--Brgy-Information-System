import { useEffect, useMemo } from "react";
import { useMap } from "react-leaflet";
import { useFetchData } from "../../../hooks/useFetchData";

export const ResponderListControl = ({emergencyId}) => {
  const map = useMap();
  const { data: responders } = useFetchData("responders");

  // Memoize available responders to prevent unnecessary recalculations
  const availableResponders = useMemo(() => {
    return responders ? responders.filter((responder) => !responder.pendingEmergency) : [];
  }, [responders]);

  useEffect(() => {
    const marker = L.control({ position: "topleft" });

    marker.onAdd = function () {
      const div = L.DomUtil.create("div", "responder-list");
      div.innerHTML = `<div class="leaflet-bar bg-white p-2 rounded-md shadow-md" style="min-width: 150px;">
          <div class="mb-2 p-1 text-center font-semibold">
            Available Responders
          </div>
          <div id="responder-list-container"></div>
        </div>`;

      return div;
    };

    marker.addTo(map);

    // Wait for the control to be added, then append responder list dynamically
    setTimeout(() => {
      const container = document.getElementById("responder-list-container");
      if (container) {
        availableResponders.forEach((responder) => {
          const responderDiv = document.createElement("div");
          responderDiv.classList.add("flex", "items-center", "space-x-2", "mb-1");

          // Responder Image
          const img = document.createElement("img");
          img.src = responder.img;
          img.alt = "responder";
          img.classList.add("w-10", "h-10", "border", "rounded-full", "shadow-md");

          // Responder Name
          const name = document.createElement("p");
          name.textContent = responder.fullname;
          name.classList.add("text-green-500", "font-bold");

          // Deploy Button
          const button = document.createElement("button");
          button.textContent = "Deploy";
          button.classList.add("bg-blue-500", "text-white", "px-3", "py-1", "rounded-md", "hover:bg-blue-600");

          // Add click event listener
          button.addEventListener("click", () => {
            alert(`Deploying ${responder.fullname} to ${emergencyId}!`);
          });

          // Append elements to the responder div
          responderDiv.appendChild(img);
          responderDiv.appendChild(name);
          responderDiv.appendChild(button);

          // Append responder div to the container
          container.appendChild(responderDiv);
        });
      }
    }, 100); // Small delay to ensure the container exists

    return () => {
      marker.remove();
    };
  }, [map, availableResponders]);

  return null;
};
