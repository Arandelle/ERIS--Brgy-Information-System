import React, { useState } from "react";
import "leaflet/dist/leaflet.css"; // import Leaflet CSS
import MapContent from "./MapContent";
import HeaderAndSideBar from "../../components/ReusableComponents/HeaderSidebar";
import Heatmap from "./Heatmap";
// Fix Leaflet marker icon issue
function MyMapComponent() {

  return ( 
    <HeaderAndSideBar content={
         <div className="h-screen"> 
         {/* <MapContent /> */}
         <Heatmap />
         </div>
    }/>
  );
}
export default MyMapComponent;