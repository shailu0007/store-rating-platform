import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";
import { useAuth } from "../context/AuthContext";

const StoreOwnerLayout = () => {
  const { currentUser, logout } = useAuth();

  if (!currentUser) return <Navigate to="/auth/login" replace />;
  if (currentUser.role !== "STORE_OWNER") return <Navigate to="/unauthorized" replace />;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentUser={currentUser} onLogout={logout} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default StoreOwnerLayout;
