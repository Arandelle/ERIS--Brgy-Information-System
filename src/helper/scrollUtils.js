import { useEffect } from "react";
import { useMap } from "react-leaflet";

export function CustomScrollZoomHandler() {
  const map = useMap();

  useEffect(() => {
    const handleWheel = (event) => {
      if (event.ctrlKey) {
        event.preventDefault();
        const zoomDelta = event.deltaY > 0 ? -1 : 1;
        map.zoomIn(zoomDelta);
      }
    };

    map.scrollWheelZoom.disable();
    map.getContainer().addEventListener("wheel", handleWheel);

    return () => {
      map.getContainer().removeEventListener("wheel", handleWheel);
    };
  }, [map]);

  return null;
}
