import React from "react";
import { createBrowserRouter } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";
import StoreOwnerLayout from "../layouts/StoreOwnerLayout";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import StoreList from "../pages/user/StoreList";
import StoreDetails from "../pages/user/StoreDetails";
import AdminDashboard from "../pages/admin/Dashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import OwnerDashboard from "../pages/owner/OwnerDashboard";
import UpdatePassword from "../pages/user/UpdatePassword";
import Unauthorized from "../pages/error/Unauthorized";
import NotFound from "../pages/error/NotFound";

import ProtectedRoute from "../components/common/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/auth/login",
    element: <Login />,
  },
  {
    path: "/auth/signup",
    element: <Signup />,
  },

  {
    element: (
      <ProtectedRoute allowedRoles={["NORMAL_USER"]}>
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <StoreList />,
      },
      {
        path: "/stores/:id",
        element: <StoreDetails />,
      },
      {
        path: "/update-password",
        element: <UpdatePassword />,
      },
    ],
  },

  {
    element: (
      <ProtectedRoute allowedRoles={["SYSTEM_ADMIN"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/admin/dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "/admin/manage-users",
        element: <ManageUsers />,
      },
    ],
  },

  {
    element: (
      <ProtectedRoute allowedRoles={["STORE_OWNER"]}>
        <StoreOwnerLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/owner/dashboard",
        element: <OwnerDashboard />,
      },
      {
        path: "/update-password",
        element: <UpdatePassword />,
      },
    ],
  },

  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
