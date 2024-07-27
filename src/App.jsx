import React, { useState, useEffect } from "react";
import "./index.css";
import Dashboard from "./components/Dashboard";
import MyCalendar from "./components/MyCalendar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ResidentsList from "./components/Residents/Residents";
import { Pabahay, Lumina, Carissa } from "./components/Residents/ResidentsData";
import Map from "./components/Maps/Map";
import Login from "./components/Login";
import Reports from "./components/Reports";
import History from "./components/History";
import Activities from "./components/Events/Activities";
import Announcement from "./components/Events/Announcement";
import Events from "./components/Events/Events";
import News from "./components/Events/News";
import Request from "./components/Services/Request";
import AddServices from "./components/Services/AddServices";
import MyProfile from "./components/Header/MyProfile";
import Setting from "./components/Header/Admin/Setting";
import FAQS from "./components/Header/Admin/FAQS";
import TermsConditions from "./components/Header/Admin/TermsConditions";
import Archives from "./components/Header/Admin/Archives";
import { Toaster } from "sonner";
import { useAuthentication } from "./hooks/useAuthentication";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const { isAuthenticated, setAuth } = useAuthentication();
  const [loading, setLoading] = useState(true);

  return (
    <Router>
      <>
        <Toaster richColors closeButton position="top-center" expand="true" />
        <div className="flex">
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Login setAuth={setAuth} />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  {" "}
                  <Dashboard setAuth={setAuth} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <MyCalendar />
                </ProtectedRoute>
              }
            />{" "}
            <Route
              path="/residents/pabahay"
              element={
                <ProtectedRoute>
                  <ResidentsList residents={Pabahay} label="Pabahay" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/residents/carissa"
              element={
                <ProtectedRoute>
                  <ResidentsList residents={Carissa} label="Carissa" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/residents/lumina"
              element={
                <ProtectedRoute>
                  <ResidentsList residents={Lumina} label="Lumina  " />
                </ProtectedRoute>
              }
            />
            <Route
              path="/maps"
              element={
                <ProtectedRoute>
                  <Map />
                </ProtectedRoute>
              }
            />{" "}
            <Route
              path="/events/announcement"
              element={
                <ProtectedRoute>
                  <Announcement />
                </ProtectedRoute>
              }
            />{" "}
            <Route
              path="/events/activity"
              element={
                <ProtectedRoute>
                  <Activities />
                </ProtectedRoute>
              }
            />{" "}
            <Route
              path="/events/event"
              element={
                <ProtectedRoute>
                  <Events />
                </ProtectedRoute>
              }
            />{" "}
            <Route
              path="/events/news"
              element={
                <ProtectedRoute>
                  <News />
                </ProtectedRoute>
              }
            />{" "}
            <Route
              path="/services/request"
              element={
                <ProtectedRoute>
                  <Request />
                </ProtectedRoute>
              }
            />{" "}
            <Route
              path="/services/addService"
              element={
                <ProtectedRoute>
                  <AddServices />
                </ProtectedRoute>
              }
            />{" "}
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />{" "}
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />{" "}
            <Route
              path="/myProfile"
              element={
                <ProtectedRoute>
                  <MyProfile />
                </ProtectedRoute>
              }
            />{" "}
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Setting />
                </ProtectedRoute>
              }
            />{" "}
            <Route
              path="/FAQS"
              element={
                <ProtectedRoute>
                  <FAQS />
                </ProtectedRoute>
              }
            />{" "}
            <Route
              path="/Terms and Conditions"
              element={
                <ProtectedRoute>
                  <TermsConditions />
                </ProtectedRoute>
              }
            />{" "}
            <Route
              path="/archives"
              element={
                <ProtectedRoute>
                  <Archives />
                </ProtectedRoute>
              }
            />{" "}
          </Routes>
        </div>
      </>
    </Router>
  );
};

export default App;
