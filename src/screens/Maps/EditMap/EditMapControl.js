import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with webpack
// You'll need to ensure these icon files are in your public folder or import them properly
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// MapEvents component for handling map clicks
const MapEvents = ({ isDrawing, onMapClick }) => {
  useMapEvents({
    click: (e) => {
      if (isDrawing) {
        onMapClick(e);
      }
    }
  });
  return null;
};

const RestrictedAreaMap = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [restrictedAreas, setRestrictedAreas] = useState([]);
  const [currentArea, setCurrentArea] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [latitudeInput, setLatitudeInput] = useState('');
  const [longitudeInput, setLongitudeInput] = useState('');
  const mapRef = useRef(null);

  // Get current location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([latitude, longitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Default to San Francisco if geolocation fails
          setCurrentLocation([37.7749, -122.4194]);
        }
      );
    } else {
      // Default to San Francisco if geolocation not supported
      setCurrentLocation([37.7749, -122.4194]);
    }
  }, []);

  // Start drawing a new restricted area
  const startDrawing = () => {
    setIsDrawing(true);
    setCurrentArea([]);
  };

  // Finish and save the restricted area
  const finishDrawing = () => {
    if (currentArea.length >= 3) {
      // Close the polygon by adding the first point again
      const closedArea = [...currentArea];
      setRestrictedAreas([...restrictedAreas, closedArea]);
      alert('Restricted area saved successfully.');
    } else {
      alert('You need at least 3 points to create a valid area.');
    }
    setIsDrawing(false);
    setCurrentArea([]);
  };

  // Add a point to the current drawing area by clicking on map
  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setCurrentArea([...currentArea, [lat, lng]]);
  };

  // Add a point to the current drawing area by manual input
  const addManualPoint = (e) => {
    e.preventDefault();
    
    const latitude = parseFloat(latitudeInput);
    const longitude = parseFloat(longitudeInput);

    if (isNaN(latitude) || isNaN(longitude)) {
      alert('Please enter valid numeric coordinates.');
      return;
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      alert('Latitude must be between -90 and 90, and longitude between -180 and 180.');
      return;
    }

    setCurrentArea([...currentArea, [latitude, longitude]]);
    setLatitudeInput('');
    setLongitudeInput('');
    setShowModal(false);
    
    // Center map on the new point
    if (mapRef.current) {
      mapRef.current.flyTo([latitude, longitude], 15);
    }
  };

  // Remove a specific point from current area
  const removePoint = (index) => {
    const updatedArea = [...currentArea];
    updatedArea.splice(index, 1);
    setCurrentArea(updatedArea);
  };

  // Clear all restricted areas
  const clearAreas = () => {
    setRestrictedAreas([]);
    setCurrentArea([]);
    setIsDrawing(false);
  };

  // Check if a point is inside a polygon (ray casting algorithm)
  const isPointInPolygon = (point, polygon) => {
    const x = point[0];
    const y = point[1];
    let inside = false;
    
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0];
      const yi = polygon[i][1];
      const xj = polygon[j][0];
      const yj = polygon[j][1];
      
      const intersect = ((yi > y) !== (yj > y)) && 
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      
      if (intersect) {
        inside = !inside;
      }
    }
    
    return inside;
  };

  // Check if current location is in any restricted area
  const checkRestriction = () => {
    if (!currentLocation) {
      alert('Current location is not available.');
      return;
    }

    let isRestricted = false;
    restrictedAreas.forEach(area => {
      if (isPointInPolygon(currentLocation, area)) {
        isRestricted = true;
      }
    });

    alert(isRestricted 
      ? 'You are currently in a restricted area!' 
      : 'You are not in any restricted area.');
  };

  // Export coordinates as JSON
  const exportCoordinates = () => {
    if (restrictedAreas.length === 0) {
      alert('There are no restricted areas to export.');
      return;
    }

    const exportData = JSON.stringify(restrictedAreas);
    console.log('Exported Coordinates:', exportData);
    
    // Create downloadable file
    const element = document.createElement("a");
    const file = new Blob([exportData], {type: 'application/json'});
    element.href = URL.createObjectURL(file);
    element.download = "restricted_areas.json";
    document.body.appendChild(element);
    element.click();
  };

  // Render modal for coordinate entry
  const renderModal = () => {
    if (!showModal) return null;
    
    return (
      <div className="modal" style={styles.modal}>
        <div className="modal-content" style={styles.modalContent}>
          <h3 style={styles.modalTitle}>Enter Exact Coordinates</h3>
          <form onSubmit={addManualPoint}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Latitude:</label>
              <input
                type="number"
                step="any"
                value={latitudeInput}
                onChange={(e) => setLatitudeInput(e.target.value)}
                placeholder="Enter latitude (e.g., 37.7749)"
                style={styles.input}
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Longitude:</label>
              <input
                type="number"
                step="any"
                value={longitudeInput}
                onChange={(e) => setLongitudeInput(e.target.value)}
                placeholder="Enter longitude (e.g., -122.4194)"
                style={styles.input}
                required
              />
            </div>
            
            <div style={styles.buttonGroup}>
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                style={{...styles.button, ...styles.cancelButton}}
              >
                Cancel
              </button>
              <button 
                type="submit"
                style={{...styles.button, ...styles.addButton}}
              >
                Add Point
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (!currentLocation) {
    return <div>Loading map...</div>;
  }

  return (
    <div style={styles.container}>
      <MapContainer 
        center={currentLocation} 
        zoom={15} 
        style={{ height: '70vh', width: '100%' }}
        whenCreated={(map) => { mapRef.current = map; }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapEvents isDrawing={isDrawing} onMapClick={handleMapClick} />
        
        {/* Current location marker */}
        <Marker position={currentLocation}>
          <Popup>
            Your current location<br />
            Lat: {currentLocation[0].toFixed(6)}, Lng: {currentLocation[1].toFixed(6)}
          </Popup>
        </Marker>

        {/* Display all saved restricted areas */}
        {restrictedAreas.map((area, index) => (
          <Polygon
            key={`area-${index}`}
            positions={area}
            pathOptions={{
              fillColor: 'red',
              fillOpacity: 0.3,
              color: 'red',
              weight: 2
            }}
          >
            <Popup>Restricted Area {index + 1}</Popup>
          </Polygon>
        ))}

        {/* Display current drawing area */}
        {currentArea.length > 0 && (
          <Polygon
            positions={currentArea}
            pathOptions={{
              fillColor: 'green',
              fillOpacity: 0.3,
              color: 'green',
              weight: 2
            }}
          />
        )}

        {/* Display markers for the points of the current area */}
        {currentArea.map((point, index) => (
          <Marker key={`point-${index}`} position={point}>
            <Popup>
              Point {index + 1}<br />
              Lat: {point[0].toFixed(6)}, Lng: {point[1].toFixed(6)}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Coordinate list panel */}
      {isDrawing && currentArea.length > 0 && (
        <div style={styles.coordinatesPanel}>
          <h3 style={styles.panelTitle}>Current Points:</h3>
          <div style={styles.coordinatesList}>
            {currentArea.map((point, index) => (
              <div key={`coord-${index}`} style={styles.coordinateItem}>
                <span>
                  Point {index + 1}: Lat: {point[0].toFixed(6)}, Lng: {point[1].toFixed(6)}
                </span>
                <button 
                  onClick={() => removePoint(index)}
                  style={styles.removeButton}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Control panel */}
      <div style={styles.controlPanel}>
        {!isDrawing ? (
          <button 
            onClick={startDrawing}
            style={{...styles.button, ...styles.primaryButton}}
          >
            Start Drawing Area
          </button>
        ) : (
          <>
            <button 
              onClick={() => setShowModal(true)}
              style={{...styles.button, ...styles.manualButton}}
            >
              Add Point Manually
            </button>
            <button 
              onClick={finishDrawing}
              style={{...styles.button, ...styles.finishButton}}
            >
              Finish Area
            </button>
          </>
        )}

        <button 
          onClick={checkRestriction}
          style={{...styles.button, ...styles.primaryButton}}
        >
          Check Current Location
        </button>

        <button 
          onClick={exportCoordinates}
          style={{...styles.button, ...styles.primaryButton}}
        >
          Export Coordinates
        </button>

        <button 
          onClick={clearAreas}
          style={{...styles.button, ...styles.clearButton}}
        >
          Clear All Areas
        </button>
      </div>

      {/* Modal for coordinate entry */}
      {renderModal()}
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    position: 'relative',
    width: '100%',
  },
  controlPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '5px',
    margin: '10px 0',
  },
  button: {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  primaryButton: {
    backgroundColor: '#3498db',
  },
  finishButton: {
    backgroundColor: '#2ecc71',
  },
  clearButton: {
    backgroundColor: '#e74c3c',
  },
  manualButton: {
    backgroundColor: '#9b59b6',
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
  },
  addButton: {
    backgroundColor: '#27ae60',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    width: '80%',
    maxWidth: '500px',
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: '15px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
  },
  coordinatesPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '10px',
    borderRadius: '5px',
    margin: '10px 0',
    maxHeight: '200px',
    overflowY: 'auto',
  },
  panelTitle: {
    margin: '0 0 10px 0',
  },
  coordinatesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  coordinateItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px 0',
    borderBottom: '1px solid #ddd',
  },
  removeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'red',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default RestrictedAreaMap;