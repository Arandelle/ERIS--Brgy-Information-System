import { useMap } from "react-leaflet";
import { useEffect } from "react";


export const MaximizeMapControl = ({ maximize, setMaximize }) => {
  const map = useMap();

  useEffect(() => {
    const maximizeButton = L.control({ position: "topright" });

    maximizeButton.onAdd = function () {
      const button = L.DomUtil.create("button", "maximize-button");
      button.innerHTML = `<button class="leaflet-bar p-2 border rounded cursor-pointer bg-white shadow-md" >
       <p class="cursor-pointer text-xl">⛶</p>
      </button>`;

      L.DomEvent.on(button, "click", function () {
        setMaximize((prev) => !prev);
      });

      L.DomEvent.disableClickPropagation(button);
      L.DomEvent.disableScrollPropagation(button);

      return button;
    };

    maximizeButton.addTo(map);

    return () => {
      maximizeButton.remove();
    };
  }, [map, maximize]);

  return null;
};