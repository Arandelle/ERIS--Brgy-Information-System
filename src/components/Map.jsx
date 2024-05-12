import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // import Leaflet CSS
import L from 'leaflet'; // import Leaflet itself

// Fix Leaflet marker icon issue


function MyMapComponent() {
  const maxBounds = [
    [14.359363, 120.897042], // Southwest coordinates (Tanza, Cavite)
    [14.387543, 120.935325], // Northeast coordinates (Tanza, Cavite)
  ];
  
  return (
    <div className='w-full h-screen z-0'>
        <div style={{ margin: "20px" }}>
          <MapContainer center={[14.3742, 120.9265]} zoom={10} style={{ height: "500px",zIndex: 0 }} maxBounds={maxBounds}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {/* No markers or popups in your code */}
          </MapContainer>
        </div>
    </div>
  );
}

export default MyMapComponent;
