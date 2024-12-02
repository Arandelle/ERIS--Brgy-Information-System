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
import Records from "./screens/Records";
import Activities from "./screens/Events/Activities";
import Setting from "./screens/Profile/Setting"
import { Toaster } from "sonner";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { get, getDatabase, ref } from "firebase/database";
import Luncher from "./components/Launcher";
import { useFetchData } from "./hooks/useFetchData";
import ErrorBoundary from "./ErrorBoundary";
import UserList from "./screens/UserList";

const App = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  // const {data: users} = useFetchData("users");
  // const {data: responders} = useFetchData("responders");

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
         <ErrorBoundary>
        <>
          <Toaster richColors Headless position="top-right" expand="true" />
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
                    <UserList data="users" />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/accounts/responders"
                element={
                  user && isAdmin ? (
                    <UserList data="responders" />
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
                path="/announcement"
                element={user && isAdmin ? <Activities /> : <Navigate to="/" />}
              />
              <Route
                path="/records"
                element={user && isAdmin ? <Records /> : <Navigate to="/" />}
              />
              <Route
                path="/account-settings"
                element={user && isAdmin ? <Setting /> : <Navigate to="/" />}
              />
            </Routes>
          </div>
        </>
        </ErrorBoundary>
      </Router>

  );
};

export default App;
