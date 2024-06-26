import React, { useState } from "react";
import "./index.css"
import Dashboard from "./components/Dashboard";
import MyCalendar from "./components/MyCalendar";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ResidentsList from "./components/Residents/Residents";
import { Pabahay, Lumina, Carissa } from './components/Residents/ResidentsData'; 
import Map from "./components/Maps/Map";
import Login from "./components/Login"
import Reports from "./components/Reports";
import History from "./components/History";
import Activities from "./components/Events/Activities";
import Announcement from "./components/Events/Announcement";
import Events from "./components/Events/Events";
import News from "./components/Events/News";
import Request from "./components/Services/Request";
import AddServices from "./components/Services/AddServices";
import MyProfile from "./components/Header/MyProfile"
import Setting from "./components/Header/Admin/Setting"
import FAQS from "./components/Header/Admin/FAQS"
import TermsConditions from "./components/Header/Admin/TermsConditions";
import Archives from "./components/Header/Admin/Archives";
import { Toaster } from "sonner";

const App = () => {

  const [isAuthenticated, setAuth] = useState(false);

  return (
    <Router>
        <>       
        <Toaster richColors closeButton position="top-center" expand="true" />
            <div className="flex">
              <Routes>
              <Route
                    path="/"
                    element={isAuthenticated ? <Navigate to="/" /> : <Login setAuth={setAuth} />}
                />
               <Route
                    path="/dashboard"
                    element={ <Dashboard setAuth={setAuth} />}
                />
                <Route path="/calendar" element={<MyCalendar />} />{" "}
                <Route path="/residents/pabahay" element={<ResidentsList residents={Pabahay} label="Pabahay"/>} />
                <Route path="/residents/carissa" element={<ResidentsList residents={Carissa} label="Carissa" />} />
                <Route path="/residents/lumina" element={<ResidentsList residents={Lumina} label="Lumina  " />} />
                <Route path="/maps" element={<Map />} />{" "}
                <Route path="/events/announcement" element={<Announcement />} />{" "}
                <Route path="/events/activity" element={<Activities />} />{" "}
                <Route path="/events/event" element={<Events />} />{" "}
                <Route path="/events/news" element={<News />} />{" "}
                <Route path="/services/request" element={<Request />} />{" "}
                <Route path="/services/addService" element={<AddServices />} />{" "}
                <Route path="/reports" element={<Reports />} />{" "}
                <Route path="/history" element={<History />} />{" "}
                <Route path="/myProfile" element={<MyProfile />} />{" "}
                <Route path="/settings" element={<Setting />} />{" "}
                <Route path="/FAQS" element={<FAQS />} />{" "}
                <Route path="/Terms and Conditions" element={<TermsConditions />} />{" "}
                <Route path="/archives" element={<Archives />} />{" "}
              </Routes>
            </div>
        </>
    </Router>
  );
};

export default App;
