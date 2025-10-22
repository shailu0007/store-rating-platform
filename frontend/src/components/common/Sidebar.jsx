import React, { useCallback, useMemo, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  User,
  Users,
  ShoppingBag,
  Grid,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  LogIn
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SidebarItem = React.memo(({ to, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'
      }`
    }
    aria-current={undefined}
  >
    {children}
  </NavLink>
));
SidebarItem.displayName = 'SidebarItem';

const Sidebar = () => {
  const { currentUser, logout } = useAuth();
  const role = currentUser?.role;
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleToggle = useCallback(() => setCollapsed((s) => !s), []);
  const handleLogout = useCallback(async () => {
    await logout({ redirect: false }); 
    navigate('/auth/login');
  }, [logout, navigate]);

  const adminLinks = useMemo(() => ([
    { to: '/admin', icon: <BarChart2 size={16} />, label: 'Admin Dashboard' },
    { to: '/admin/manage-users', icon: <Users size={16} />, label: 'Manage Users' },
    { to: '/admin/manage-stores', icon: <Grid size={16} />, label: 'Manage Stores' },
  ]), []);

  const ownerLinks = useMemo(() => ([
    { to: '/owner', icon: <BarChart2 size={16} />, label: 'Owner Dashboard' },
    // { to: '/owner/my-store', icon: <ShoppingBag size={16} />, label: 'My Store' },
  ]), []);

  const userLinks = useMemo(() => ([
    { to: '/user/stores', icon: <Users size={16} />, label: 'My Ratings' },
  ]), []);

  return (
    <aside
      className={`bg-white border-r h-full min-h-screen ${
        collapsed ? 'w-20' : 'w-64'
      } transition-all duration-200 flex-shrink-0`}
      aria-label="Main sidebar"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <Link to="/" className={`flex items-center gap-2 ${collapsed ? 'justify-center' : ''}`}>
            <Grid size={20} className="text-indigo-600" />
            {!collapsed && <span className="font-semibold text-lg text-gray-800">Store Rating</span>}
          </Link>

          <button
            onClick={handleToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-1 rounded hover:bg-gray-100"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 overflow-y-auto" role="navigation" aria-label="Primary">
          <SidebarItem to="/">
            <Home size={16} />
            {!collapsed && <span>Home</span>}
          </SidebarItem>

          <SidebarItem to="/stores">
            <ShoppingBag size={16} />
            {!collapsed && <span>Stores</span>}
          </SidebarItem>

          {role === 'NORMAL_USER' && userLinks.map((it) => (
            <SidebarItem key={it.to} to={it.to}>
              {it.icon}
              {!collapsed && <span>{it.label}</span>}
            </SidebarItem>
          ))}

          {role === 'STORE_OWNER' && ownerLinks.map((it) => (
            <SidebarItem key={it.to} to={it.to}>
              {it.icon}
              {!collapsed && <span>{it.label}</span>}
            </SidebarItem>
          ))}

          {role === 'SYSTEM_ADMIN' && adminLinks.map((it) => (
            <SidebarItem key={it.to} to={it.to}>
              {it.icon}
              {!collapsed && <span>{it.label}</span>}
            </SidebarItem>
          ))}

          {/* <div className="mt-4 border-t pt-4">
            <SidebarItem to="/profile">
              <User size={16} />
              {!collapsed && <span>Profile</span>}
            </SidebarItem>

            <SidebarItem to="/settings">
              <Settings size={16} />
              {!collapsed && <span>Settings</span>}
            </SidebarItem>
          </div> */}
        </nav>

        <div className="px-3 py-3 border-t">
          {currentUser ? (
            <div className="flex items-center justify-between gap-3">
              <div className={`flex-1 ${collapsed ? 'text-center' : ''}`}>
                {!collapsed ? (
                  <>
                    <div className="text-[11px] text-gray-500">Logged in as</div>
                    <div className="mt-1 font-medium text-gray-800 truncate">{currentUser?.name}</div>
                    <div className="text-[11px] text-gray-500 truncate">{currentUser?.email}</div>
                  </>
                ) : (
                  <div className="text-xs text-gray-500">Account</div>
                )}
              </div>

              <div className="flex-shrink-0">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-2 py-1 rounded text-sm text-red-600 hover:bg-red-50"
                  aria-label="Logout"
                >
                  <LogOut size={16} />
                  {!collapsed && <span>Logout</span>}
                </button>
              </div>
            </div>
          ) : (
            <div className={`flex items-center justify-center ${collapsed ? '' : 'flex-col gap-2'}`}>
              <Link
                to="/auth/login"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-indigo-600 hover:bg-indigo-50"
              >
                <LogIn size={16} />
                {!collapsed && <span>Login</span>}
              </Link>
              {!collapsed && (
                <Link
                  to="/auth/signup"
                  className="mt-2 block text-sm text-gray-600 hover:underline"
                >
                  Create account
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
