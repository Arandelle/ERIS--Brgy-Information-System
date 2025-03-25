import { useMap } from "react-leaflet";
import { useEffect } from "react";


export const EditMapButton = ({ isEditMap, setIsEditMap}) => {
  const map = useMap();

  useEffect(() => {
    const editMapButton = L.control({ position: "topleft" });

    editMapButton.onAdd = function () {
      const button = L.DomUtil.create("button", "maximize-button");
      button.innerHTML = `<button class="leaflet-bar p-2 border rounded cursor-pointer bg-white shadow-md font-bold text-blue-500" >
    ${isEditMap ? `<p class="w-32 font-normal text-black">Click the area to start drawing the map</p>` : `Edit Map`}
      </button>`;

      L.DomEvent.on(button, "click", function () {
      !isEditMap && setIsEditMap(prev => !prev);
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