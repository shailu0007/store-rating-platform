import React, { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = ({ currentUser, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-indigo-600 font-semibold text-xl"
          >
            <span>⭐ Store Rating</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              Home
            </Link>
            <Link
              to="/stores"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              Stores
            </Link>

            {currentUser?.role === "SYSTEM_ADMIN" && (
              <>
                <Link
                  to="/admin/dashboard"
                  className="text-gray-700 hover:text-indigo-600 transition"
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/manage-users"
                  className="text-gray-700 hover:text-indigo-600 transition"
                >
                  Manage Users
                </Link>
              </>
            )}

            {currentUser?.role === "STORE_OWNER" && (
              <Link
                to="/owner/dashboard"
                className="text-gray-700 hover:text-indigo-600 transition"
              >
                Owner Panel
              </Link>
            )}

            {currentUser ? (
              <button
                onClick={onLogout}
                className="cursor-pointer flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/auth/login"
                  className="text-gray-700 hover:text-indigo-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/auth/signup"
                  className="bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-700 hover:text-indigo-600 focus:outline-none"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 pb-4">
          <div className="flex flex-col space-y-2 pt-3">
            <Link to="/" onClick={toggleMenu} className="text-gray-700 hover:text-indigo-600">Home</Link>
            <Link to="/stores" onClick={toggleMenu} className="text-gray-700 hover:text-indigo-600">Stores</Link>

            {currentUser?.role === "SYSTEM_ADMIN" && (
              <>
                <Link to="/admin/dashboard" onClick={toggleMenu} className="text-gray-700 hover:text-indigo-600">Dashboard</Link>
                <Link to="/admin/manage-users" onClick={toggleMenu} className="text-gray-700 hover:text-indigo-600">Manage Users</Link>
              </>
            )}

            {currentUser?.role === "STORE_OWNER" && (
              <Link to="/owner/dashboard" onClick={toggleMenu} className="text-gray-700 hover:text-indigo-600">Owner Panel</Link>
            )}

            {currentUser ? (
              <button
                onClick={() => { toggleMenu(); onLogout?.(); }}
                className="cursor-pointer flex items-center gap-2 text-red-600 mt-2"
              >
                <LogOut size={16} /> Logout
              </button>
            ) : (
              <>
                <Link to="/auth/login" onClick={toggleMenu} className="text-gray-700 hover:text-indigo-600">Login</Link>
                <Link to="/auth/signup" onClick={toggleMenu} className="bg-indigo-600 text-white text-center py-1.5 rounded-md hover:bg-indigo-700 transition">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
