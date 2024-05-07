import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { Toggle } from "./hooks/Toggle";
import Dashboard from "./components/Dashboard";
import MyCalendar from "./components/MyCalendar";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Residents from "./components/Residents";
import { Data } from "./components/Data";

const App = () => {
  const { isOpen, toggleDropdown } = Toggle();

  return (
    <div>
      <Header toggleSideBar={toggleDropdown} />
      <BrowserRouter basename="/">
        <div className="flex">
          <Sidebar isOpen={isOpen} toggleSidebar={toggleDropdown} />
          <Routes >
          {Data.map((item, index) => (
              <Route
                key={index}
                path={item.link}
                element={<Dashboard />} // You can replace this with appropriate component based on the link
              />
            ))}
            <Route path="/calendar" element={<MyCalendar />} /> {/* Render MyCalendar when /calendar path is matched */}
            <Route path="/residents/registered" element={<Residents />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
