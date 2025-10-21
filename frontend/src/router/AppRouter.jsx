// src/router/AppRouter.jsx
import React from "react";
import { createBrowserRouter } from "react-router-dom";

// layouts
import UserLayout from "../layouts/UserLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import StoreOwnerLayout from "../layouts/StoreOwnerLayout.jsx";

// pages (ensure these files exist and default-export components)
import StoreList from "../pages/user/StoreList.jsx";
import StoreDetails from "../pages/user/StoreDetails.jsx";

import Login from "../pages/auth/Login.jsx";
import Signup from "../pages/auth/Signup.jsx";
import NotFound from "../pages/error/NotFound.jsx";
import Unauthorized from "../pages/error/Unauthorized.jsx";

// admin pages
import Dashboard from "../pages/admin/Dashboard.jsx";
import ManageStores from "../pages/admin/ManageStores.jsx";
import ManageUsers from "../pages/admin/ManageUsers.jsx";

// owner pages
import OwnerDashboard from "../pages/owner/OwnerDashboard.jsx";

// route helpers
import ProtectedRoute from "../components/common/ProtectedRoute.jsx";
import PublicRoute from "../components/common/PublicRoute.jsx";
import AddUser from "../pages/admin/AddUser.jsx";
import AddStore from "../pages/admin/AddStore.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    children: [
      { index: true, element: <StoreList /> },
      { path: "stores", element: <StoreList /> },
      { path: "stores/:id", element: <StoreDetails /> },
      { path: "unauthorized", element: <Unauthorized /> },
      { path: "*", element: <NotFound /> },
    ],
  },
   {
    path: "/auth",
    children: [
      {
        path: "login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <PublicRoute>
            <Signup />
          </PublicRoute>
        ),
      },
    ],
  },

  
  // Admin section
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["SYSTEM_ADMIN"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "manage-stores", element: <ManageStores /> },
      { path: "manage-users", element: <ManageUsers /> },
      { path: "add-user", element: <AddUser /> },
      { path: "add-store", element: <AddStore /> },
    ],
  },

  // Owner section
  {
    path: "/owner",
    element: (
      <ProtectedRoute allowedRoles={["STORE_OWNER"]}>
        <StoreOwnerLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <OwnerDashboard /> },
      { path: "dashboard", element: <OwnerDashboard /> },
    ],
  },
]);

export default router;
