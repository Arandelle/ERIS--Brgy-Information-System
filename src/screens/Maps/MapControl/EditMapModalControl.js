import { useMap } from "react-leaflet";
import { useEffect } from "react";


export const EditMapModalControl = ({setManualPointModal,clearAreas}) => {
  const map = useMap();

  useEffect(() => {
    const editMapButton = L.control({ position: "topleft" });

    editMapButton.onAdd = function () {
      const div = L.DomUtil.create("div", "maximize-div");
      div.innerHTML = `<div class="leaflet-bar p-2 border rounded cursor-pointer bg-white shadow-md" >
        <button class="font-bold text-green-500">Add Point Manually</button> <br/>
         <button class="font-bold text-red-500">Clear All Areas</button>
      </div>`;

      L.DomEvent.on(div, "click", function () {
        setManualPointModal(prev => !prev)
      });

      L.DomEvent.disableClickPropagation(div);
      L.DomEvent.disableScrollPropagation(div);

      return div;
    };

    editMapButton.addTo(map);

    return () => {
      editMapButton.remove();
    };
  }, [map]);

  return null;
};