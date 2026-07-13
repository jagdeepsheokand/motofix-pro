import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(formData);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        {/* Header / Branding */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-orange-500/50">
            <span className="text-6xl">🏍️</span>
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tighter">MotoFix Pro</h1>
          <p className="text-zinc-400 text-xl mt-3">Expert Motorcycle Care</p>
        </div>

        {/* Login Card */}
        <div className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-700 rounded-3xl p-10 shadow-2xl">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-semibold text-white">Welcome Back</h2>
            <p className="text-zinc-400 mt-3 text-lg">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm text-zinc-400 mb-2 font-medium">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="mechanic@motofix.pro"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm text-zinc-400 mb-2 font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 transition-all text-white font-semibold text-lg py-4 rounded-2xl shadow-lg shadow-orange-600/30"
            >
              Login
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center mt-8 text-zinc-400">
            New to MotoFix Pro?{' '}
            <Link to="/register" className="text-orange-500 hover:text-orange-400 font-medium">
              Create an account
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-zinc-500 mt-8">
          © 2026 MotoFix Pro • Secure Authentication
        </p>
      </div>
    </div>
  );
};

export default Login;