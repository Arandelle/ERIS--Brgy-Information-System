import React, { useState } from 'react';
import Header from "./components/Header";
import List from "./components/List";
import Sidebar from './components/Sidebar';
import { Toggle } from './hooks/Toggle';
import Dashboard from './components/Dashboard';

const App = () => {
  const {isOpen, toggleDropdown } = Toggle ();
  const username = "Arandelle";
  const titleName = "Project Sample";

  return (
    <div>
      <Header toggleSideBar={toggleDropdown} />
      <div className="flex">  
        <Sidebar isOpen={isOpen} toggleSidebar={toggleDropdown} />
        <div className='flex flex-col flex-1'>
          <Dashboard />
          <div className="flex-1">
            <h1 className="text-xl font-bold text-primary">Hello {username}!</h1>
            <button onClick={toggleDropdown}>Toggle Sidebar</button>
            <h3>List of Students Age 18 and above</h3>
            <List />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
