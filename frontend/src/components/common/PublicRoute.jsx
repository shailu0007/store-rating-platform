// src/components/common/PublicRoute.jsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * PublicRoute
 * - Prevents logged-in users from seeing Login/Signup.
 * - Redirects them back to the last page or to a default page based on role.
 */
const PublicRoute = ({ children }) => {
    console.log("running.......")
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("running....")
    if (!loading && currentUser) {
      // get the page user visited before going to /auth/login or /auth/signup
      const from = location.state?.from?.pathname || location?.state?.from || '/';

      // fallback by role (if no previous page)
      let defaultRedirect = '/';
      if (currentUser.role === 'SYSTEM_ADMIN') defaultRedirect = '/admin';
      else if (currentUser.role === 'STORE_OWNER') defaultRedirect = '/owner/dashboard';

      navigate(from || defaultRedirect, { replace: true });
    }
  }, [currentUser, loading, navigate, location]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Checking session...
      </div>
    );

  // Not logged in → show login/signup page
  if (!currentUser) return children;

  // During redirect → show nothing
  return null;
};

export default PublicRoute;
