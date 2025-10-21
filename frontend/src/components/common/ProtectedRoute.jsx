// src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );

  // Not logged in → redirect to login and store the current location
  if (!currentUser)
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: location.pathname }}
      />
    );

  // Role restricted
  if (allowedRoles.length && !allowedRoles.includes(currentUser.role))
    return <Navigate to="/unauthorized" replace />;

  return children;
};

export default ProtectedRoute;
