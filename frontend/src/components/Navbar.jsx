import React from 'react';
import { useNavigate } from "react-router-dom";
import useAuth from '../hooks/useAuth';
import logo from "../assets/logomp-Photoroom.png";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <nav className="navbar print:hidden fixed top-0 left-0 right-0 z-30 w-full bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/60 px-3 sm:px-6 py-3 sm:py-4 transition-all duration-300 h-[56px] sm:h-[72px]">
            <div className="max-w-[1440px] mx-auto flex items-center justify-between h-full">
                
                {/* Branding - Always shows MotoFix Pro */}
                <div className="flex items-center gap-2 sm:gap-3 group flex-shrink-0 min-w-0">
                    <div className="relative flex items-center justify-center flex-shrink-0">
                        <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full scale-125 group-hover:scale-150 transition-all duration-500"></div>
                        <img 
                            src={logo} 
                            alt="MotoFix Pro Logo" 
                            className="w-7 sm:w-10 h-auto relative z-10 drop-shadow-md group-hover:rotate-12 transition-transform duration-300"
                        />
                    </div>
                    {/* Always visible - just smaller on mobile */}
                    <h1 className="text-sm sm:text-xl lg:text-2xl font-black tracking-tight bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent font-['Orbitron'] truncate">
                        MotoFix Pro
                    </h1>
                </div>

                {/* User Info & Logout */}
                <div className="flex items-center gap-1.5 sm:gap-4 flex-shrink-0">
                    <span className="text-xs sm:text-sm font-semibold text-slate-200 tracking-tight flex items-center gap-1 sm:gap-2">
                        <span className="text-sm sm:text-base select-none">👨‍🔧</span>
                        <span className="hidden sm:inline truncate max-w-[80px] sm:max-w-[140px]">
                            {user?.name || 'Guest'}
                        </span>
                    </span>
                    
                    <button 
                        onClick={handleLogout} 
                        className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-slate-800/60 hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 border border-slate-700/50 hover:border-rose-500/30 rounded-lg sm:rounded-xl font-medium text-[11px] sm:text-sm transition-all duration-300 flex items-center gap-1 sm:gap-2 whitespace-nowrap"
                    >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;