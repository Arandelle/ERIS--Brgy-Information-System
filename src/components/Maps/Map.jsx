import React, {useState} from 'react';
import 'leaflet/dist/leaflet.css'; // import Leaflet CSS
import Header from '../Header';
import Sidebar from '../Sidebar/Sidebar';
import { Toggle } from '../../hooks/Toggle';
import MapContent from './MapContent';
// Fix Leaflet marker icon issue

function MyMapComponent() {
  const { isOpen, toggleDropdown } = Toggle();
  const maxBounds = [
    [14.359363, 120.897042], // Southwest coordinates (Tanza, Cavite)
    [14.387543, 120.935325], // Northeast coordinates (Tanza, Cavite)
  ];
  
  return (
    <div className='w-full h-screen z-0'>
       <Header toggleSideBar={toggleDropdown} /> 
        <div className='flex'>
        <Sidebar isOpen={isOpen} toggleSidebar={toggleDropdown} />
        <MapContent/>
        </div>
    </div>
  );
}

export default MyMapComponent;
