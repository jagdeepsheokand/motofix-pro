import { createContext, useEffect, useState } from "react";
import api from "../services/axios";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  const checkAuth = async () => {
    try {
      console.log("🔍 Checking authentication...");
      
      const response = await api.get("/auth/profile");
      
      console.log("✅ Profile Response:", response.data);
      
      setUser(response.data);
    } catch (error) {
      console.log("❌ Not authenticated:", error.response?.data);
      setUser(null);
    } finally {
      console.log("⏰ Loading finished");
      setLoading(false);
    }
  };

  // Run checkAuth when the app starts
  useEffect(() => {
    checkAuth();
  }, []);

  // Login function
  const login = async (formData) => {
    try {
      const response = await api.post("/auth/login", formData);
      // Refresh auth status
      await checkAuth();

      return response; // Return full response for component to handle (success/error)
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error; // Let Login component handle the error
    }
  };
  //Register
const register = async (formData) => {
    try {
      console.log("📝 Registering new user...");
      
      const response = await api.post("/auth/register", formData);
      
      console.log("✅ Registration successful:", response.data);
      return response;
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      throw error;
    }
  };


  // Logout function
  const logout = async () => {
    try {
      console.log("🔄 Logging out...");

      const response = await api.post("/auth/logout");   

      // Clear local user state
      setUser(null);

      console.log("✅ Logged out successfully:", response.data);
      return response;
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
      throw error;
    }
  };

  const value = {
    user,
    setUser,
    loading,
    setLoading,
    checkAuth,
    login,
    logout,  
    register      
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;