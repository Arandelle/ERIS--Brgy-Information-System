import { MapContainer, TileLayer, useMap} from 'react-leaflet';
import React, {useState, useEffect} from 'react';
import 'leaflet/dist/leaflet.css'; // import Leaflet CSS

function CustomScrollZoomHandler() {
  const map = useMap();

  useEffect(() => {
    const handleWheel = (event) => {
      if (event.ctrlKey) {
        event.preventDefault(); // Prevent the default zoom behavior of the browser
        const zoomDelta = event.deltaY > 0 ? -1 : 1;
        map.zoomIn(zoomDelta); // Manually handle zoom in/out
      }
    };

    map.scrollWheelZoom.disable(); // Disable scroll zoom by default
    map.getContainer().addEventListener('wheel', handleWheel);

    return () => {
      map.getContainer().removeEventListener('wheel', handleWheel);
    };
  }, [map]);

  return null;
}

function MyMapComponents() {
  return (
    <div className='w-full h-screen z-0'>
            <div style={{ margin: "20px" }}>
              <h1 className='absolute top-2 left-20 z-10 font-medium rounded shadow-lg text-gray-900 bg-white py-2 px-4 dark:bg-gray-600 dark:text-green-400'>Ctrl + mouse wheel to zoom in/out</h1>
              <MapContainer center={[14.334, 120.85]} zoom={16} style={{ height: "600px",zIndex: 0 }} >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {/* No markers or popups in your code */}
                <CustomScrollZoomHandler />
              </MapContainer>
            </div>
          </div>
  );
}

export default MyMapComponents;
