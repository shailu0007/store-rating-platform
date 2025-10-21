import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Checking session...
      </div>
    );
  }

  if (currentUser) {
    const roleToPath = {
      NORMAL_USER: '/',
      SYSTEM_ADMIN: '/admin/dashboard',
      STORE_OWNER: '/owner/dashboard',
    };

    const redirectPath = roleToPath[currentUser.role] || '/';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default PublicRoute;
