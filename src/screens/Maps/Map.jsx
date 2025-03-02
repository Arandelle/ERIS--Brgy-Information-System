import React, { useState } from "react";
import "leaflet/dist/leaflet.css"; // import Leaflet CSS
import MapContent from "./MapContent";
import HeaderAndSideBar from "../../components/ReusableComponents/HeaderSidebar";
import Heatmap from "./Heatmap";
// Fix Leaflet marker icon issue
function MyMapComponent() {

  const [maximize, setMaximize] = useState(false);

  return (
    <>
      {!maximize ? (
        <HeaderAndSideBar
          content={
            <div className="h-screen">
              {/* <MapContent /> */}
              <Heatmap maximize={maximize} setMaximize={setMaximize}/>
            </div>
          }
        />
      ) : (
        <div className="h-screen w-screen">
          <Heatmap maximize={maximize} setMaximize={setMaximize}/>
        </div>
      )}
    </>
  );
}
export default MyMapComponent;
