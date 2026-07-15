import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "🏠" },
    { name: "Customers", path: "/customers", icon: "👥" },
    { name: "Vehicles", path: "/vehicles", icon: "🏍" },
    { name: "Repair Jobs", path: "/repair-jobs", icon: "🔧" },
    { name: "Inventory", path: "/inventory", icon: "📦" },
    { name: "Invoices", path: "/invoices", icon: "🧾" },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        Version 1.0
      </div>
    </aside>
  );
};

export default Sidebar;