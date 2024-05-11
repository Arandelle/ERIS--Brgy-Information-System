import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';

const Map = () => {
  const [viewport, setViewport] = useState({
    width: '100%',
    height: '100vh',
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 10
  });

  const [userPosition, setUserPosition] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        setUserPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setViewport(viewport => ({
          ...viewport,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
      });
    }
  }, []);

  return (
 <ReactMapGL
  {...viewport}
  mapboxApiAccessToken="pk.eyJ1IjoibXlhc2thciIsImEiOiJja2VubjhybWwwbGx0MnJwNWFoZzVrZHRjIn0.PqIcTkGCvYlYq4X-TUc"
  onViewportChange={viewport => setViewport(viewport)}
>

      {userPosition && (
        <Marker
          latitude={userPosition.latitude}
          longitude={userPosition.longitude}
          offsetLeft={-20}
          offsetTop={-10}
        >
          <div>You are here</div>
        </Marker>
      )}
    </ReactMapGL>
  );
};

export default Map;
