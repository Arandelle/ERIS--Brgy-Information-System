import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  Marker,
  Polygon,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import L from "leaflet";
import { CustomScrollZoomHandler } from "../../helper/scrollUtils";
import { DisplayLayer } from "./useDisplayLayer";
import { DisplayModeControl } from "./MapControl/DisplayModeControl";
import { YearSelectorControl } from "./MapControl/YearSelectorControl";
import { ClusterLegendControl } from "./MapControl/ClusterLegendControl";
import { HeatLegendControl } from "./MapControl/HeatLegendControl";
import { MarkerLegendControl } from "./MapControl/MarkerLegendControl";
import { ResponderListControl } from "./MapControl/ResponderListControl";
import { useFetchData } from "../../hooks/useFetchData";
import { MaximizeMapControl } from "./MapControl/MaximizeMapControl";
import { EditMapButton } from "./EditMap/EditMapButton";
import { EditButtonsControl } from "./EditMap/EditButtonsControl";
import { RenderPointModal } from "./EditMap/RenderPointModal";
import handleEditData from "../../hooks/handleEditData";
import { useFetchSystemData } from "../../hooks/useFetchSystemData";
import { greenIcon } from "../../helper/iconUtils";
import AskCard from "../../components/ReusableComponents/AskCard";
import { toast } from "sonner";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import handleErrorMessage from "../../helper/handleErrorMessage";
import logAuditTrail from "../../hooks/useAuditTrail";
import { InputField } from "../../components/ReusableComponents/InputField";
import Modal from "../../components/ReusableComponents/Modal";
import { Spinner } from "../../components/ReusableComponents/Spinner";
import { handleEmergencyDone } from "./Functions/MarkAsDone";

const CoverageRadius = ({ center, radius }) => {
  const map = useMap();

  useEffect(() => {
    if (!center) return;

    const circle = L.circle(center, {
      weight: 0.5,
      fillColor: "#3388ff",
      fillOpacity: 0.2,
      radius,
    }).addTo(map);

    return () => {
      map.removeLayer(circle);
    };
  }, [map, center, radius]);

  return null;
};

const MapEvents = ({ isEditMap, onMapClick }) => {
  useMapEvent({
    click: (e) => {
      if (isEditMap) {
        onMapClick(e);
      }
    },
  });

  return null;
};

const MainMap = ({ maximize, setMaximize }) => {
  const mapRef = useRef(null);
  const user = auth.currentUser;
  const { data: emergencyRequest } = useFetchData("emergencyRequest"); //fetch the emergency request from firebase
  const { systemData } = useFetchSystemData(); // use for getting the coordinates of map
  const [position, setPosition] = useState([14.33289, 120.85065]); // set default position (to center the circle)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Year selection state
  const [availableYears, setAvailableYears] = useState([]); // state to handle available years to reuse through out the map
  const [displayMode, setDisplayMode] = useState(); // default state for display mode to reuse in other hooks
  const [showRespondersList, setShowResponderList] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState({});

  const [filteredEmergency, setFilteredEmergency] = useState([]);
  const [emergencyTypeCount, setEmergencyTypeCount] = useState({});
  const [isEditMap, setIsEditMap] = useState(false);
  const [currentArea, setCurrentArea] = useState([]);
  const [storedArea, setStoredArea] = useState([]);
  const [manualPointModal, setManualPointModal] = useState(false);
  const [latitudeInput, setLatitudeInput] = useState("");
  const [longitudeInput, setLongitudeInput] = useState("");
  const [isSaveMap, setIsSaveMap] = useState(false);
  const [password, setPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [markAsDoneModal, setMarkAsDoneModal] = useState({
    done: false,
    emergency: null,
    responderId: null,
  });

  console.log(systemData?.coordinates);
  // get the coordinates of map
  useEffect(() => {
    if (systemData && systemData.coordinates) {
      // Convert object to array
      const formattedArea = Object.values(systemData.coordinates);

      setStoredArea(formattedArea); // Now storedArea is an array of {lat, lng}
    }
  }, [systemData]);

  useEffect(() => {
    if (!emergencyRequest || emergencyRequest.length === 0) return; // if no emergency request, stop execution

    // Filter emergencies for the selected year and pending/on-going statuses
    const filter = emergencyRequest.filter((emergency) => {
      const year = new Date(emergency.timestamp).getFullYear();
      return (
        year === selectedYear &&
        (emergency.status === "pending" || emergency.status === "on-going")
      );
    });

    setFilteredEmergency(filter); // store filtered emergencies for further use (now it used for marker legend)

    // Check if there are any "pending" statuses in the filtered data
    const hasPendingStatus = filter.some(
      (emergency) => emergency.status === "pending"
    );

    // Dynamically set the display mode
    setDisplayMode((prevMode) => {
      if (hasPendingStatus && !prevMode) {
        return "marker"; // keep in marker mode if already selected, to prevent changing mode when in selected year has no pending emergency
      }

      return prevMode || "heat"; // default to heat if no pending status
    });

    // Count emergency types and statuses for the selected year
    const typeCount = emergencyRequest.reduce((acc, emergency) => {
      const year = new Date(emergency.timestamp).getFullYear();
      if (year === selectedYear) {
        acc[emergency.emergencyType] = (acc[emergency.emergencyType] || 0) + 1; // {Fire: 1, medical: 2} etc
        acc[emergency.status] = (acc[emergency.status] || 0) + 1; // {pending : 1, on-going: 2} etc
      }
      return acc;
    }, {}); // Start with an empty object as the initial value for accumulating counts

    setEmergencyTypeCount(typeCount); // put it in state to reuse
  }, [emergencyRequest, selectedYear]);

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition(
  //     (location) => {
  //       setPosition([location.coords.latitude, location.coords.longitude]);
  //     },
  //     (error) => {
  //       console.error(error);
  //       setPosition([14.33289, 120.85065]); // Fallback position
  //     }
  //   );
  // }, []);

  // add point to the current drawing area by clicking on map
  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setCurrentArea([...currentArea, [lat, lng]]);
  };

  // add manually the coordinates of the point
  const addManualPoint = (e) => {
    e.preventDefault();

    const latitude = parseFloat(latitudeInput);
    const longitude = parseFloat(longitudeInput);

    if (isNaN(latitude) || isNaN(longitude)) {
      alert("Please enter valid numeric coordinates.");
      return;
    }

    if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      alert(
        "Latitude must be between -90 and 90, and longitude between -180 and 180."
      );
      return;
    }

    setCurrentArea([...currentArea, [latitude, longitude]]);
    setLatitudeInput("");
    setLongitudeInput("");
    setManualPointModal(false);

    // Center map on the new point
    if (mapRef.current) {
      mapRef.current.flyTo([latitude, longitude], 15);
    }
  };

  const clearAreas = () => {
    setCurrentArea([]);
  };

  const cancelEditMap = () => {
    setIsEditMap(false);
    setCurrentArea([]);
  };

  const removePoint = (index) => {
    const updatedArea = [...currentArea];
    updatedArea.splice(index, 1);
    setCurrentArea(updatedArea);
  };

  // save the edited map
  const saveAreas = async () => {
    try {
      if (currentArea.length >= 3) {
        setShowPasswordModal(true);
      } else {
        toast.warning("You need at least 3 points to create valid area");
      }
      setIsSaveMap(false);
    } catch (error) {
      handleErrorMessage(error);
    }
  };

  const saveAreasWithPassword = async () => {
    try {
      if (!user) {
        toast.error("User not authenticated");
        return;
      }
      if (!password) {
        toast.error("Please enter your password");
        return;
      }
      // reauthenticate the user
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      const coordinatesData = {
        coordinates: currentArea.reduce((acc, point, index) => {
          acc[`Point ${index + 1}`] = { lat: point[0], lng: point[1] };

          return acc;
        }, {}),
      };

      await handleEditData("details", coordinatesData, "systemData");
      await logAuditTrail("Update Map");
      setIsEditMap(false);
      setCurrentArea([]);
      setShowPasswordModal(false);
      setPassword("");
    } catch (error) {
      handleErrorMessage(error);
    }
  };

  if (!position || loading) {
    return (
        <Spinner loading={loading || !position} />
    );
  }

  return (
    <div className="relative h-full">
      {manualPointModal && (
        <RenderPointModal
          manualPointModal={manualPointModal}
          setManualPointModal={setManualPointModal}
          addManualPoint={addManualPoint}
          latitudeInput={latitudeInput}
          longitudeInput={longitudeInput}
          setLatitudeInput={setLatitudeInput}
          setLongitudeInput={setLongitudeInput}
        />
      )}
      <MapContainer
        center={position}
        zoom={16}
        className="h-full w-full z-0 rounded-md"
        whenCreated={(map) => {
          mapRef.current = map;
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapEvents isEditMap={isEditMap} onMapClick={handleMapClick} />
        <MaximizeMapControl maximize={maximize} setMaximize={setMaximize} />

        {/** display the button to trigger edit map or save map */}
        <EditMapButton isEditMap={isEditMap} setIsEditMap={setIsEditMap} />

        {/** to display the control of buttons : add point manually and clear areas */}
        {isEditMap && (
          <EditButtonsControl
            saveAreas={() => setIsSaveMap(true)}
            setManualPointModal={setManualPointModal}
            clearAreas={clearAreas}
            cancelEditMap={cancelEditMap}
          />
        )}

        {/**render the stored or created points */}
        {storedArea.length > 0 && (
          <Polygon
            positions={storedArea} // Now it's an array
            pathOptions={{
              fillColor: "#3388ff",
              fillOpacity: 0.2,
              color: "#3388ff",
              weight: 0.5,
            }}
          >
            {/* <Popup>Emergency Area</Popup> */}
          </Polygon>
        )}

        {/** render the on-going creating points */}
        {currentArea.length > 0 && (
          <Polygon
            positions={currentArea}
            pathOptions={{
              fillColor: "green",
              fillOpacity: 0.3,
              color: "red",
              weight: 2,
            }}
          />
        )}

        {/** Display markers for the points of the current area */}
        {currentArea.map((point, index) => (
          <Marker key={`point-${index}`} position={point} icon={greenIcon}>
            <Popup>
              <div>
                <p>Point {index + 1}</p>
                <div className="space-y-2 flex flex-col my-2">
                  <span>Latitude: {point[0].toFixed(6)}</span>
                  <span>Longitude: {point[1].toFixed(6)}</span>
                </div>
                <button
                  onClick={(event) => {
                    L.DomEvent.stopPropagation(event); // Prevent popup from closing
                    removePoint(index);
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        <DisplayLayer
          emergencyRequest={emergencyRequest}
          selectedYear={selectedYear}
          setAvailableYears={setAvailableYears}
          displayMode={displayMode}
          setShowResponderList={setShowResponderList}
          setSelectedEmergency={setSelectedEmergency}
          setMarkAsDoneModal={setMarkAsDoneModal}
        />
        {availableYears.length > 0 && (
          <YearSelectorControl
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            availableYears={availableYears}
          />
        )}
        <DisplayModeControl
          displayMode={displayMode}
          setDisplayMode={setDisplayMode}
        />

        {showRespondersList && selectedEmergency.status === "pending" && (
          <ResponderListControl selectedEmergency={selectedEmergency} 
            setLoading={setLoading}
          />
        )}

        {displayMode === "heat" ? (
          <HeatLegendControl />
        ) : displayMode === "cluster" ? (
          <ClusterLegendControl
            emergencyTypeCount={emergencyTypeCount}
            selectedYear={selectedEmergency}
          />
        ) : (
          <MarkerLegendControl
            filteredEmergency={filteredEmergency}
            selectedYear={selectedYear}
            emergencyTypeCount={emergencyTypeCount}
          />
        )}
        <CustomScrollZoomHandler />
        {/* <CoverageRadius center={position} radius={700} /> */}
      </MapContainer>

      {/** Modal to show the question if edited map is correct */}
      {isSaveMap && (
        <AskCard
          toggleModal={(prev) => setIsSaveMap(!prev)}
          question={
            "Please double-check the updated map,as it will directly reflect on the user's map as well"
          }
          confirmText={"Save Map"}
          onConfirm={saveAreas}
        />
      )}
      {/**Modal to show the question if emergency is done */}
      {markAsDoneModal.done && (
        <AskCard
          toggleModal={(prev) => setMarkAsDoneModal(!prev)}
          question={"Are you sure you want to mark this emergency as done?"}
          confirmText={"Mark as Done"}
          onConfirm={() =>
           { handleEmergencyDone(
              markAsDoneModal.emergency,
              markAsDoneModal.responderId,
              setLoading
            ),
            setMarkAsDoneModal({ done: false, emergency: null, responderId: null })}
          }
        />
      )}

      {/** modal for admin to input their password to proceed to save the map */}
      {showPasswordModal && (
        <Modal
          title={"Enter your password"}
          closeButton={() => setShowPasswordModal(false)}
          children={
            <div className="max-w-2xl space-y-6">
              <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                Please enter your password to save the changes
              </p>

              <div className="flex flex-col space-y-2">
                <label className="text-gray-600">Password: </label>
                <InputField
                  type="password"
                  placeholder={"Enter your password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={true}
                />
                <button
                  type="submit"
                  className="bg-blue-500 py-3 rounded-md text-white font-bold text-sm w-full"
                  onClick={saveAreasWithPassword}
                >
                  Save Map
                </button>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
};

export default MainMap;
