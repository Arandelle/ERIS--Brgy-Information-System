import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import { Toggle } from "./hooks/Toggle";
import Dashboard from "./components/Dashboard";
import MyCalendar from "./components/MyCalendar";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Residents from "./components/Residents/Residents";

const App = () => {
  const { isOpen, toggleDropdown } = Toggle();

  return (
    <div>
      <Header toggleSideBar={toggleDropdown} />
      <BrowserRouter basename="/">
        <div className="flex">
          <Sidebar isOpen={isOpen} toggleSidebar={toggleDropdown} />
          <Routes basename="/dashboard">
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />{" "}
            <Route path="/calendar" element={<MyCalendar />} />{" "}
            <Route path="/residents/registered" element={<Residents />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
