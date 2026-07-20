// src/components/Sidebar.jsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = ({ onNavigate }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "🏠" },
    { name: "Customers", path: "/customers", icon: "👥" },
    { name: "Vehicles", path: "/vehicles", icon: "🏍" },
    { name: "Repair Jobs", path: "/repair-jobs", icon: "🔧" },
    { name: "Inventory", path: "/inventory", icon: "📦" },
    { name: "Invoices", path: "/invoices", icon: "🧾" },
  ];

  // Close mobile sidebar when route changes
  React.useEffect(() => {
    if (onNavigate) {
      onNavigate();
    }
  }, [location.pathname]);

  return (
    <div className="h-full flex flex-col">
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800/60">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-white tracking-tight">
            Workshop<span className="text-orange-400">Manager</span>
          </h1>
          <p className="text-xs text-zinc-500 truncate">Auto Repair Shop</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto sidebar-scroll">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={() => {
                  // Close sidebar on mobile when clicked
                  if (window.innerWidth <= 768 && onNavigate) {
                    onNavigate();
                  }
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group
                  ${isActive
                    ? 'bg-orange-500/15 text-orange-400 shadow-lg shadow-orange-500/10'
                    : 'text-zinc-400 hover:text-white hover:bg-slate-800/70 hover:translate-x-1'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-orange-400 to-orange-600 rounded-r-full" />
                    )}
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <span className="flex-1">{item.name}</span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-6 border-t border-slate-800/60 bg-slate-900/50">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-400 font-medium">Online</span>
          </div>
          <span className="text-zinc-600 font-mono">v1.0.0</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;