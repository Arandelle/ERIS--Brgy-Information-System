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
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { get, getDatabase, ref } from "firebase/database";

const App = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const db = getDatabase();
        const adminRef = ref(db, `admins/${user.uid}`);
        const adminSnapshot = await get(adminRef);
        setIsAdmin(adminSnapshot.exists());
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <Router>
      <>
        <Toaster richColors closeButton position="top-center" expand="true" />
        <div className="flex">
          <Routes>
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route
              path="/"
              element={
                user && isAdmin ? <Navigate to="/dashboard" /> : <Login />
              }
            />
            <Route
              path="/dashboard"
              element={user && isAdmin ? <Dashboard /> : <Navigate to="/" />}
            />
            <Route
              path="/calendar"
              element={user && isAdmin ? <MyCalendar /> : <Navigate to="/" />}
            />
            <Route
              path="/residents/pabahay"
              element={
                user && isAdmin ? (
                  <ResidentsList residents={Pabahay} label="Pabahay" />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/residents/carissa"
              element={
                user && isAdmin ? (
                  <ResidentsList residents={Carissa} label="Carissa" />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/residents/lumina"
              element={
                user && isAdmin ? (
                  <ResidentsList residents={Lumina} label="Lumina  " />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/maps"
              element={user && isAdmin ? <Map /> : <Navigate to="/" />}
            />
            <Route
              path="/events/announcement"
              element={user && isAdmin ? <Announcement /> : <Navigate to="/" />}
            />
            <Route
              path="/events/activity"
              element={user && isAdmin ? <Activities /> : <Navigate to="/" />}
            />
            <Route
              path="/events/event"
              element={user && isAdmin ? <Events /> : <Navigate to="/" />}
            />
            <Route
              path="/events/news"
              element={user && isAdmin ? <News /> : <Navigate to="/" />}
            />
            <Route
              path="/services/request"
              element={user && isAdmin ? <Request /> : <Navigate to="/" />}
            />
            <Route
              path="/services/addService"
              element={user && isAdmin ? <AddServices /> : <Navigate to="/" />}
            />
            <Route
              path="/reports"
              element={user && isAdmin ? <Reports /> : <Navigate to="/" />}
            />
            <Route
              path="/history"
              element={user && isAdmin ? <History /> : <Navigate to="/" />}
            />
            <Route
              path="/myProfile"
              element={user && isAdmin ? <MyProfile /> : <Navigate to="/" />}
            />
            <Route
              path="/settings"
              element={user && isAdmin ? <Setting /> : <Navigate to="/" />}
            />
            <Route
              path="/FAQS"
              element={user && isAdmin ? <FAQS /> : <Navigate to="/" />}
            />
            <Route
              path="/Terms and Conditions"
              element={
                user && isAdmin ? <TermsConditions /> : <Navigate to="/" />
              }
            />
            <Route
              path="/archives"
              element={user && isAdmin ? <Archives /> : <Navigate to="/" />}
            />
          </Routes>
        </div>
      </>
    </Router>
  );
};

export default App;
