import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAuth } from "../context/AuthContext";

const UserLayout = () => {
  const { currentUser, logout } = useAuth();

  if (!currentUser) return <Navigate to="/auth/login" replace />;
  // if (currentUser.role !== "NORMAL_USER") return <Navigate to="/unauthorized" replace />;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentUser={currentUser} onLogout={logout} />
      <main className="flex-1 bg-gray-50 p-6 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
