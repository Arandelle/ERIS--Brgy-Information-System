import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {useAuthentication} from "../hooks/useAuthentication"

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthentication();
  const location = useLocation();

//   if (loading) {
//     return <div>Loading...</div>; // Or a loading spinner
//   }

  if (!isAuthenticated) {
    // Redirect to the login page, but save the current location they tried to access
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;