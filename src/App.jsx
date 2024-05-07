import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { Toggle } from "./hooks/Toggle";
import Dashboard from "./components/Dashboard";
import MyCalendar from "./components/MyCalendar";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Residents from "./components/Residents";

const App = () => {
  const { isOpen, toggleDropdown } = Toggle();
  return (
    <div>
      <Header toggleSideBar={toggleDropdown} />
      <BrowserRouter basename="/">
        <div className="flex">
          <Sidebar isOpen={isOpen} toggleSidebar={toggleDropdown} />
          <Routes >
            <Route path="/dashboard" element={<Dashboard />} /> {/* Render Dashboard when root path is matched */}
            <Route path="/calendar" element={<MyCalendar />} /> {/* Render MyCalendar when /calendar path is matched */}
            <Route path="/residents/registered" element={<Residents />} />
            <Route path="/dashboard" element={<Dashboard />} /> {/* Render Dashboard when root path is matched */}
            <Route path="/calendar" element={<MyCalendar />} /> {/* Render MyCalendar when /calendar path is matched */}
            <Route path="/residents/registered" element={<Residents />} />
            <Route path="/dashboard" element={<Dashboard />} /> {/* Render Dashboard when root path is matched */}
            <Route path="/calendar" element={<MyCalendar />} /> {/* Render MyCalendar when /calendar path is matched */}
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
