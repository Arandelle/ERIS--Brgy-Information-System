import React, { useState } from 'react';
import { Toggle } from '../hooks/Toggle';

const Sidebar = ({ isOpen, toggleSideBar}) => {
const {isOpen: servicesOpen, toggleDropdown: toggleServices} = Toggle();

  return (
    <div className={`dark:bg-gray-800 bg-gray-300 dark:text-white w-50 h-screen ${isOpen ? 'hidden' : 'block'}`}>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>
      <ul>
        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Dashboard</li>
        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={()=> toggleSection('user')}>View Residents</li>
        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Map</li>
        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Calendar</li>
        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Events</li>
        <li 
          className="px-4 py-2 hover:bg-gray-700 cursor-pointer" 
          onClick={toggleServices}
        >
          Services
        
        </li>
        {servicesOpen && (
            <ul className="ml-4">
              <li className="px-4 py-2 hover:bg-gray-600 cursor-pointer">Request</li>
              <li className="px-4 py-2 hover:bg-gray-600 cursor-pointer">Add Service</li>
              {/* Add more sub-items here */}
            </ul>
          )}
        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Reports</li>
        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">History</li>
      </ul>
    </div>
  );
};

export default Sidebar;
