import { useEffect } from "react";
import L from 'leaflet';
import { useMap } from "react-leaflet";
import { customIcon, redIcon } from "./iconUtils";

// export function RoutingControl({ start, end }) {
//   const map = useMap();

//   useEffect(() => {
//     if (!map) return;

//     const routingControl = L.Routing.control({
//       waypoints: [
//         L.latLng(start[0], start[1]),
//         L.latLng(end[0], end[1])
//       ],
//       routeWhileDragging: true,
//       createMarker: (i, waypoint, n) => {
//         const icon = i === 0 ? customIcon : redIcon;
//         const draggable = i !== 0; // Make only the destination marker draggable
//         return L.marker(waypoint.latLng, { icon, draggable });
//       }
      
//     }).addTo(map);

//     return () => map.removeControl(routingControl);
//   }, [map, start, end]);

//   return null;
// }
