import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Home,
  User,
  Users,
  ShoppingBag,
  Grid,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SidebarItem = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'
      }`
    }
  >
    {children}
  </NavLink>
);

const Sidebar = () => {
  const { currentUser } = useAuth();
  const role = currentUser?.role;
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`bg-white border-r h-full min-h-screen ${
        collapsed ? 'w-20' : 'w-64'
      } transition-width duration-200`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <Link to="/" className={`flex items-center gap-2 ${collapsed ? 'justify-center' : ''}`}>
            <Grid size={20} className="text-indigo-600" />
            {!collapsed && <span className="font-semibold text-lg text-gray-800">Store Rating</span>}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-1 rounded hover:bg-gray-100"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <SidebarItem to="/">
            <Home size={16} />
            {!collapsed && <span>Home</span>}
          </SidebarItem>

          <SidebarItem to="/stores">
            <ShoppingBag size={16} />
            {!collapsed && <span>Stores</span>}
          </SidebarItem>

          {role === 'NORMAL_USER' && (
            <>
              <SidebarItem to="/user/stores">
                <Users size={16} />
                {!collapsed && <span>My Ratings</span>}
              </SidebarItem>
            </>
          )}

          {role === 'STORE_OWNER' && (
            <>
              <SidebarItem to="/owner/dashboard">
                <BarChart2 size={16} />
                {!collapsed && <span>Owner Dashboard</span>}
              </SidebarItem>
              <SidebarItem to="/owner/my-store">
                <ShoppingBag size={16} />
                {!collapsed && <span>My Store</span>}
              </SidebarItem>
            </>
          )}

          {role === 'SYSTEM_ADMIN' && (
            <>
              <SidebarItem to="/admin/dashboard">
                <BarChart2 size={16} />
                {!collapsed && <span>Admin Dashboard</span>}
              </SidebarItem>
              <SidebarItem to="/admin/manage-users">
                <Users size={16} />
                {!collapsed && <span>Manage Users</span>}
              </SidebarItem>
              <SidebarItem to="/admin/manage-stores">
                <Grid size={16} />
                {!collapsed && <span>Manage Stores</span>}
              </SidebarItem>
            </>
          )}

          <div className="mt-4 border-t pt-4">
            <SidebarItem to="/profile">
              <User size={16} />
              {!collapsed && <span>Profile</span>}
            </SidebarItem>

            <SidebarItem to="/settings">
              <Settings size={16} />
              {!collapsed && <span>Settings</span>}
            </SidebarItem>
          </div>
        </nav>

        <div className="px-4 py-4 border-t">
          <div className={`text-xs text-gray-500 ${collapsed ? 'text-center' : ''}`}>
            {!collapsed && (
              <>
                <div>Logged in as</div>
                <div className="mt-1 font-medium text-gray-800">
                  {currentUser?.name || 'Guest'}
                </div>
                <div className="text-[11px] text-gray-500">{currentUser?.email}</div>
              </>
            )}
            {collapsed && <div className="text-xs text-gray-500">Account</div>}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
