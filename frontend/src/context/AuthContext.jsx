import { createContext, useEffect, useState } from "react";
import api from "../services/axios";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // NEW: Function to check if user is already logged in
 const checkAuth = async () => {
  try {
    console.log("🔍 Checking authentication..."); // ← Says "I'm checking!"
    
    const response = await api.get("/auth/profile");
    
    console.log("✅ Profile Response:", response.data); // ← Shows what came back
    
    setUser(response.data);
  } catch (error) {
    console.log("❌ Not authenticated:", error.response?.data); // ← Shows error
    
    setUser(null);
  } finally {
    console.log("⏰ Loading finished");
    setLoading(false);
  }
};
  // NEW: Run checkAuth when the app starts
  useEffect(() => {
    checkAuth();
  }, []);

  // UPDATED: Added checkAuth to the value object
  const value = {
    user,
    setUser,
    loading,
    setLoading,
    checkAuth, // ← NEW: Expose this so components can use it
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;