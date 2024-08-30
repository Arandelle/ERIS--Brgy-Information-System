import React, { useState } from "react";
import "leaflet/dist/leaflet.css"; // import Leaflet CSS
import MapContent from "./MapContent";
import HeadSide from "../../components/ReusableComponents/HeaderSidebar";
// Fix Leaflet marker icon issue
function MyMapComponent() {

  return ( 
    <HeadSide child={
         <div className="h-screen"> <MapContent /></div>
    }/>
  );
}
export default MyMapComponent;