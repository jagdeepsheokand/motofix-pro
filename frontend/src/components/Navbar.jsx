// Navbar.jsx
import React from 'react';
import { useNavigate } from "react-router-dom";
import useAuth from '../hooks/useAuth';

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
        <nav className="sticky top-0 z-40 w-full bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/60 px-6 py-4 transition-all duration-300">
            <div className="max-w-[1440px] mx-auto flex items-center justify-between">
                
                {/* ===== BRANDING (Logo + Text) ===== */}
                <div className="flex items-center gap-3 group">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full scale-125 group-hover:scale-150 transition-all duration-500"></div>
                        <img 
                            src="src/assets/logomp-Photoroom.png" 
                            alt="MotoFix Pro Logo" 
                            className="w-10 h-auto relative z-10 drop-shadow-md group-hover:rotate-12 transition-transform duration-300"
                        />
                    </div>
                    <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent font-['Orbitron']">
                        MotoFix Pro
                    </h1>
                </div>

                {/* ===== USER INFO & LOGOUT ACTION ===== */}
                <div className="flex items-center gap-6">
                    <span className="text-sm font-semibold text-slate-200 tracking-tight flex items-center gap-2">
                        <span className="text-base select-none">👨‍🔧</span>
                        {user?.name || 'Guest'}
                    </span>
                    
                    <button 
                        onClick={handleLogout} 
                        className="px-4 py-2 bg-slate-800/60 hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 border border-slate-700/50 hover:border-rose-500/30 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                    </button>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;