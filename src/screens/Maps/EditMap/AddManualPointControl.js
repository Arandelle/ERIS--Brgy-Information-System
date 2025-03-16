import { useMap } from "react-leaflet";
import { useEffect } from "react";


export const AddManualPointControl = ({setManualPointModal,clearAreas}) => {
  const map = useMap();

  useEffect(() => {
    const editMapButton = L.control({ position: "topleft" });

    editMapButton.onAdd = function () {
      const div = L.DomUtil.create("div", "editMap-div");
      div.innerHTML = `<div class="leaflet-bar p-2 border rounded cursor-pointer bg-white shadow-md" >
        <button id="addPointBtn" class="font-bold text-green-500">Add Point Manually</button> <br/>
         <button id="clearAreasBtn" class="font-bold text-red-500">Clear All Areas</button>
      </div>`;

      setTimeout(() => {
        // get buttons and add event listeners
        const addPointBtn = div.querySelector("#addPointBtn");
        const clearAreasBtn = div.querySelector("#clearAreasBtn");

        if(addPointBtn){
            L.DomEvent.on(addPointBtn, "click", (e) => {
                L.DomEvent.stopPropagation(e);
                setManualPointModal(prev => !prev);
            });
        }

        if(clearAreasBtn){
            L.DomEvent.on(clearAreasBtn, "click", (e) => {
                L.DomEvent.stopPropagation(e);
                clearAreas();
            });
        }

      }, 0); // ensure DOM elements exists before adding events

      L.DomEvent.disableClickPropagation(div);
      L.DomEvent.disableScrollPropagation(div);

      return div;
    };

    editMapButton.addTo(map);

    return () => {
      editMapButton.remove();
    };
  }, [map, setManualPointModal, clearAreas]);

  return null;
};