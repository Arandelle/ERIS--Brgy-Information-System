import React, { useState, useEffect } from "react";
import "./index.css";
import Dashboard from "./screens/Dashboard/Dashboard";
import MyCalendar from "./screens/Calendar/MyCalendar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Map from "./screens/Maps/Map";
import Login from "./screens/LoginScreen/Login";
import Records from "./screens/Records";
import Announcement from "./screens/Announcement/AnnouncementList";
import Setting from "./screens/Setting";
import { Toaster } from "sonner";
import { onAuthStateChanged } from "firebase/auth";
import { auth, database } from "./services/firebaseConfig";
import { get, ref } from "firebase/database";
import UserList from "./screens/AccountList/UserList";
import { Spinner } from "./components/ReusableComponents/Spinner";
import Hotlines from "./screens/Hotlines/Hotlines";
import Certification from "./screens/Certification/Certification";
import Templates from "./screens/Templates/Templates";
import { toast } from "sonner";
import { onChildAdded } from "firebase/database";
import Reports from "./screens/Reports/Reports";

const App = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const adminRef = ref(database, `admins/${user.uid}`);
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

  // // Listen for new notifications
  // useEffect(() => {

  //   if (!user) return;

  //   const notificationsRef = ref(
  //     database,
  //     `admins/${user.uid}/notifications`
  //   );

  //   // Listen for new notifications
  //   const unsubscribe = onChildAdded(notificationsRef, (snapshot) => {
  //     const notification = snapshot.val();
  //     if (notification) {
  //       const {message, img, title} = notification;
  //       toast(
  //         <div className="flex items-center justify-center space-x-3 flex-row">
  //         <img
  //           className="w-12 h-12 rounded-full border-2 border-primary-500"
  //           src={img}
  //           alt="Notification avatar"
  //         />
  //         <div className="flex flex-col">
  //           <p className="font-bold">{title}</p>
  //           <p className="text-xs">{message}</p>
  //         </div>
  //       </div>
  //       );
  //     }
  //   });

  //   return () => unsubscribe(); // Cleanup listener on unmount
  // }, [user]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
        <Spinner loading={loading} />
      </div>
    );
  }

  return (
    <Router>
      <>
        <Toaster richColors Headless position="top-center" expand="true" />
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
              element={user && isAdmin ? <Announcement /> : <Navigate to="/" />}
            />
            <Route
              path="/hotlines"
              element={user && isAdmin ? <Hotlines /> : <Navigate to="/" />}
            />
            <Route
              path="/certification"
              element={
                user && isAdmin ? <Certification /> : <Navigate to="/" />
              }
            />
            <Route
              path="/templates"
              element={user && isAdmin ? <Templates /> : <Navigate to="/" />}
            />
            <Route
              path="/records"
              element={user && isAdmin ? <Records /> : <Navigate to="/" />}
            />
            <Route
              path="/reports"
              element={user && isAdmin ? <Reports /> : <Navigate to="/" />}
            />
            <Route
              path="/account-settings"
              element={user && isAdmin ? <Setting /> : <Navigate to="/" />}
            />
          </Routes>
        </div>
      </>
    </Router>
  );
};

export default App;
