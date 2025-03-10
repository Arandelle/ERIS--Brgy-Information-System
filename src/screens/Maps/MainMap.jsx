import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
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

const MaximizeMapControl = ({ maximize, setMaximize }) => {
  const map = useMap();

  useEffect(() => {
    const maximizeButton = L.control({ position: "topright" });

    maximizeButton.onAdd = function () {
      const button = L.DomUtil.create("button", "maximize-button");
      button.innerHTML = `<button class="leaflet-bar p-2 border rounded cursor-pointer bg-white shadow-md" >
       <p class="cursor-pointer">🔍</p>
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

const MainMap = ({ maximize, setMaximize }) => {
  const {data: emergencyRequest} = useFetchData("emergencyRequest"); //fetch the emergency request from firebase
  const [position, setPosition] = useState([14.33289, 120.85065]); // set default position (to center the circle)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Year selection state
  const [availableYears, setAvailableYears] = useState([]); // state to handle available years to reuse through out the map
  const [displayMode, setDisplayMode] = useState(); // default state for display mode to reuse in other hooks
  const [showRespondersList, setShowResponderList] = useState(false); 
  const [selectedEmergency, setSelectedEmergency] = useState({}); 

  const [filteredEmergency, setFilteredEmergency] = useState([]);
  const [emergencyTypeCount, setEmergencyTypeCount] = useState({});
  
  useEffect(() => {
    if (!emergencyRequest || emergencyRequest.length === 0) return; // if no emergency request, stop execution
  
    // Filter emergencies for the selected year and pending/on-going statuses
    const filter = emergencyRequest.filter((emergency) => {
      const year = new Date(emergency.timestamp).getFullYear();
      return year === selectedYear && (emergency.status === "pending" || emergency.status === "on-going");
    });
  
    setFilteredEmergency(filter); // store filtered emergencies for further use (now it used for marker legend)
  
    // Check if there are any "pending" statuses in the filtered data
    const hasPendingStatus = filter.some((emergency) => emergency.status === "pending");
  
    // Dynamically set the display mode
    setDisplayMode((prevMode) => {
      if(hasPendingStatus && !prevMode){
        return "marker"; // keep in marker mode if already selected, to prevent changing mode when in selected year has no pending emergency
      }

      return prevMode || "heat"; // default to heat if no pending status
    })
  
    // Count emergency types and statuses for the selected year
    const typeCount = emergencyRequest.reduce((acc, emergency) => {
      const year = new Date(emergency.timestamp).getFullYear();
      if (year === selectedYear) {
        acc[emergency.emergencyType] = (acc[emergency.emergencyType] || 0) + 1; // {Fire: 1, medical: 2} etc
        acc[emergency.status] = (acc[emergency.status] || 0) + 1 // {pending : 1, on-going: 2} etc
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

  if (!position) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative h-full">
      <MapContainer
        center={position}
        zoom={16}
        className="h-full w-full z-0 rounded-md"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MaximizeMapControl maximize={maximize} setMaximize={setMaximize} />
        <DisplayLayer
          emergencyRequest={emergencyRequest}
          selectedYear={selectedYear}
          setAvailableYears={setAvailableYears}
          displayMode={displayMode}
          setShowResponderList={setShowResponderList}
          setSelectedEmergency={setSelectedEmergency}
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
        {showRespondersList && <ResponderListControl selectedEmergency={selectedEmergency}/>}
        {displayMode === "heat" ? (
          <HeatLegendControl />
        ) : displayMode === "cluster" ? (
          <ClusterLegendControl emergencyTypeCount={emergencyTypeCount} selectedYear={selectedEmergency}/>
        ) : (
          <MarkerLegendControl filteredEmergency={filteredEmergency} selectedYear={selectedYear} emergencyTypeCount={emergencyTypeCount}/>
        )}
        <CustomScrollZoomHandler />
        <CoverageRadius center={position} radius={700} />
      </MapContainer>
    </div>
  );
};

export default MainMap;
