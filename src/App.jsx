import React, { useState, useEffect } from "react";
import "./index.css";
import Dashboard from "./screens/Dashboard";
import MyCalendar from "./screens/MyCalendar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ResidentsList from "./screens/AccountList/Residents";
import Map from "./screens/Maps/Map";
import Login from "./screens/Login";
import Reports from "./screens/Reports";
import History from "./screens/History";
import Activities from "./screens/Events/Activities";
import Announcement from "./screens/Events/Announcement";
import Events from "./screens/Events/Events";
import News from "./screens/Events/News";
import MyProfile from "./components/Header/MyProfile";
import Setting from "./screens/Profile/Setting"
import FAQS from "./screens/Profile/FAQS"
import TermsConditions from "./screens/Profile/TermsConditions";
import Archives from "./screens/Profile/Archives"
import { Toaster } from "sonner";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { get, getDatabase, ref } from "firebase/database";
import Luncher from "./components/Launcher";
import { useFetchData } from "./hooks/useFetchData";

const App = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const {data: users} = useFetchData("users");
  const {data: responders} = useFetchData("responders");

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
    return <Luncher />
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
              path="/accounts/users"
              element={
                user && isAdmin ? (
                  <ResidentsList data={users} label="users" />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/accounts/responder"
              element={
                user && isAdmin ? (
                  <ResidentsList data={responders} label="responders" />
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
