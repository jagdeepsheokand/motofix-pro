import React from "react";
import useAuth from '../hooks/useAuth';
import { useNavigate } from "react-router-dom";
const Navbar =() =>{
    const {user, logout} = useAuth();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {await logout();
        navigate("/login");
        }
        catch(err){
            console.error("Logout failed:",err);
        }
    };
    return(
       
         <nav className="navbar">
            <div className="navbar-brand">
                <h1>MotoFix Pro</h1>
            </div>
            <div className="navbar-user">
                <span className="user-name">
                   👤{user?.name || 'Guest'} 
                </span>
                <button onClick={handleLogout} className="logout-btn">
                    Logout
                </button>
            </div>
        </nav>
    );
};
export default Navbar;