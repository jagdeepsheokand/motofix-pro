// Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { LoadingSpinner } from "../components/common";
import { toast } from "react-toastify";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);

   try {
  await register({
    name: formData.name,
    email: formData.email,
    password: formData.password,
  });

  toast.success("Account created successfully!");

  setSuccess("Account created successfully! Redirecting to login...");
  setFormData({ name: "", email: "", password: "", confirmPassword: "" });

  setTimeout(() => navigate("/login"), 1800);
}catch (err) {
  const errorMsg =
    err.response?.data?.message ||
    err.response?.data?.error ||
    "Registration failed. Please try again.";

  toast.error(errorMsg);
  setError(errorMsg);
}finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0F172A] to-[#1E1B4B] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      
      {/* ===== DECORATIVE ELEMENTS ===== */}
      <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-200px] left-[-200px] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-md relative z-10">
        
        {/* ===== HEADER ===== */}
        <div className="flex flex-col items-center mb-12 group">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full scale-150 group-hover:scale-200 transition-all duration-700"></div>
            <img
              src="src/assets/logomp-Photoroom.png"
              alt="MotoFix Pro Logo"
              className="w-44 h-auto mb-4 relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          <div className="text-center">
            <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent font-['Orbitron']">
              MotoFix Pro
            </h1>
            <p className="text-zinc-400 text-sm mt-2 tracking-widest uppercase">Expert Motorcycle Care</p>
            <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-transparent mx-auto mt-4 rounded-full"></div>
          </div>
        </div>

        {/* ===== REGISTER CARD ===== */}
        <div className="card card-glass rounded-3xl p-10 hover:border-orange-500/20 transition-all duration-500">
          
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
            <p className="text-zinc-400 mt-2 text-sm">Join the MotoFix Pro workshop</p>
          </div>

          {/* ===== ERROR MESSAGE ===== */}
          {error && (
            <div className="mb-6 p-4 bg-red-950/50 border border-red-900/50 text-red-400 rounded-2xl text-sm flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {error}
            </div>
          )}

          {/* ===== SUCCESS MESSAGE ===== */}
          {success && (
            <div className="mb-6 p-4 bg-emerald-950/50 border border-emerald-900/50 text-emerald-400 rounded-2xl text-sm flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-7">
            
            {/* ===== NAME FIELD ===== */}
            <div className="group">
              <label className="block text-sm font-medium text-zinc-400 mb-2 transition-colors group-focus-within:text-orange-400">
                Full Name
              </label>
              <div className="input-icon-wrapper">
                <svg className="input-icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="input-field"
                  required
                />
              </div>
            </div>

            {/* ===== EMAIL FIELD ===== */}
            <div className="group">
              <label className="block text-sm font-medium text-zinc-400 mb-2 transition-colors group-focus-within:text-orange-400">
                Email Address
              </label>
              <div className="input-icon-wrapper">
                <svg className="input-icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                </svg>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="mechanic@motofix.pro"
                  className="input-field"
                  required
                />
              </div>
            </div>

            {/* ===== PASSWORD FIELD ===== */}
            <div className="group">
              <label className="block text-sm font-medium text-zinc-400 mb-2 transition-colors group-focus-within:text-orange-400">
                Password
              </label>
              <div className="input-icon-wrapper">
                <svg className="input-icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field"
                  required
                />
              </div>
              <p className="text-xs text-zinc-500 mt-2">Must be at least 6 characters</p>
            </div>

            {/* ===== CONFIRM PASSWORD FIELD ===== */}
            <div className="group">
              <label className="block text-sm font-medium text-zinc-400 mb-2 transition-colors group-focus-within:text-orange-400">
                Confirm Password
              </label>
              <div className="input-icon-wrapper">
                <svg className="input-icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field"
                  required
                />
              </div>
            </div>

            {/* ===== REGISTER BUTTON ===== */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-lg py-4 rounded-2xl"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" text={null} />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Join MotoFix Pro</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                    </svg>
                  </>
                )}
              </span>
              <div className="shimmer"></div>
            </button>
          </form>

          {/* ===== DIVIDER ===== */}
          <div className="divider-text my-8">
            <span>Already have an account?</span>
          </div>

          {/* ===== LOGIN LINK ===== */}
          <Link 
            to="/login" 
            className="block w-full text-center py-4 px-6 bg-[#1E293B] hover:bg-[#334155] border-2 border-zinc-700/50 hover:border-orange-500/30 rounded-2xl transition-all duration-300 group"
          >
            <span className="text-zinc-300 group-hover:text-white transition-colors">
              Sign in to your account
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </Link>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="flex justify-between items-center mt-8 text-xs text-zinc-600">
          <span>© 2026 MotoFix Pro</span>
          <span className="flex items-center gap-2">
            <span className="status-dot online"></span>
            Secure Authentication
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;