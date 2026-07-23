// src/components/Layout/Layout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';

const Layout = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Check if current page is print page
  const isPrintPage = location.pathname.includes('/print/');

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when route changes (mobile only)
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]); // ✅ Auto-close on route change

  // If print page, render minimal layout without navbar/sidebar
  if (isPrintPage) {
    return (
      <div className="print-mode min-h-screen bg-white">
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0F172A] to-[#1E1B4B]">
      {/* Fixed Navbar */}
      <Navbar />

      <div className="flex pt-[72px]">
        {/* Desktop Sidebar - Always visible on desktop */}
        {!isMobile && (
          <div className="layout-sidebar md:block w-[280px] fixed h-[calc(100vh-72px)] border-r border-slate-800/60 bg-slate-900/95 backdrop-blur-xl z-20 overflow-y-auto sidebar-scroll">
            <Sidebar onNavigate={() => {}} />
          </div>
        )}

        {/* Mobile Sidebar with Overlay */}
        {isMobile && (
          <>
            {/* Overlay */}
            {isSidebarOpen && (
              <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 transition-opacity duration-300"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            {/* Mobile Sidebar Panel */}
            <div
              className={`fixed left-0 top-[72px] z-40 w-[280px] h-[calc(100vh-72px)]
                bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/60
                transition-transform duration-300 ease-in-out shadow-2xl
                overflow-y-auto sidebar-scroll
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
              <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
            </div>
          </>
        )}

        {/* Main Content Area */}
        <main
          className={`flex-1 min-w-0
    ${!isMobile ? 'md:ml-[280px]' : ''}
    p-4 md:p-6 lg:p-8`}
        >
          <div className="max-w-7xl mx-auto">
            <div >
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Floating Toggle Button */}
      {isMobile && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`fixed bottom-6 left-6 z-50 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-xl 
            border border-slate-700 text-zinc-400 hover:text-orange-400 
            hover:border-orange-500/50 hover:scale-105 transition-all duration-300 shadow-xl
            ${isSidebarOpen ? 'rotate-90' : ''}`}
          aria-label="Toggle Sidebar"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isSidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      )}
    </div>
  );
};

export default Layout;