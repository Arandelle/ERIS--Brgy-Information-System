import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import { Toggle } from "./hooks/Toggle";
import Dashboard from "./components/Dashboard";
import MyCalendar from "./components/MyCalendar";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ResidentsList from "./components/Residents/Residents";
import { Pabahay, Lumina, Carissa } from './components/Residents/ResidentsData'; 
import Map from "./components/Map";
import Login from "./components/Login"
import { Link } from "@mui/material";

const App = () => {
  const { isOpen, toggleDropdown } = Toggle();
  const [isAuthenticated, setAuth] = useState(false);

  return (
    <Router>
        <>       
            <div className="flex">
              <Routes>
              <Route
                    path="/"
                    element={isAuthenticated ? <Navigate to="/login" /> : <Login setAuth={setAuth} />}
                />
                <Route
                    path="/dashboard"
                    element={<Dashboard /> }
                />
                <Route path="/calendar" element={<MyCalendar />} />{" "}
                <Route path="/residents/pabahay" element={<ResidentsList residents={Pabahay} label="Pabahay"/>} />
                <Route path="/residents/carissa" element={<ResidentsList residents={Carissa} label="Carissa" />} />
                <Route path="/residents/lumina" element={<ResidentsList residents={Lumina} label="Lumina  " />} />
                <Route path="/maps" element={<Map />} />{" "}
              </Routes>
            </div>
        </>
    </Router>
  );
};

export default App;
