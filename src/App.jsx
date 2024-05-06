import React, { useState } from 'react';
import Header from "./components/Header";
import Sidebar from './components/Sidebar';
import { Toggle } from './hooks/Toggle';
import Dashboard from './components/Dashboard';
import MyCalendar from './components/MyCalendar';

const App = () => {
  const { isOpen, toggleDropdown } = Toggle();
  return (
    <div>
      <Header toggleSideBar={toggleDropdown} />
      <div className="flex">  
        <Sidebar isOpen={isOpen} toggleSidebar={toggleDropdown} />
        <div className='flex flex-col flex-1'>
          <Dashboard />
          <MyCalendar/>
        </div>
      </div>
     
    </div>
  );
};

export default App;
