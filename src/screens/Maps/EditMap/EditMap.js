import { useMap } from "react-leaflet";
import { useEffect } from "react";


export const EditMap = ({ isEditMap, setIsEditMap,saveAreas }) => {
  const map = useMap();

  useEffect(() => {
    const editMapButton = L.control({ position: "topleft" });

    editMapButton.onAdd = function () {
      const button = L.DomUtil.create("button", "maximize-button");
      button.innerHTML = `<button class="leaflet-bar p-2 border rounded cursor-pointer bg-white shadow-md" >
       <p class="cursor-pointer font-bold">
       ${isEditMap ? "Save Map" : "Edit Map"}
       </p>
      </button>`;

      L.DomEvent.on(button, "click", function () {
      isEditMap ? saveAreas() : setIsEditMap(prev => !prev)
      });

      L.DomEvent.disableClickPropagation(button);
      L.DomEvent.disableScrollPropagation(button);

      return button;
    };

    editMapButton.addTo(map);

    return () => {
      editMapButton.remove();
    };
  }, [map, isEditMap]);

  return null;
};