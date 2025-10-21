import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  console.log("currentUser:", currentUser, "allowedRoles:", allowedRoles);
  if (loading) return <div>Checking session...</div>; 

  if (!currentUser) return <Navigate to="/auth/login" replace state={{ from: location }} />;
  if (!allowedRoles.includes(currentUser.role)) return <Navigate to="/unauthorized" replace />;

  return children;
};

export default ProtectedRoute;
