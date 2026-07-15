import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

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

      setSuccess("Account created successfully! Redirecting to login...");
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });

      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 
                      err.response?.data?.error || 
                      "Registration failed. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        {/* Logo Header */}
        <div className="flex flex-col items-center mb-10">
          <img
            src="src/assets/logomp-Photoroom.png"
            alt="MotoFix Pro Logo"
            className="w-40 h-auto mb-6 drop-shadow-2xl"
          />
          <p className="text-zinc-400 text-lg">Expert Motorcycle Care</p>
        </div>

        {/* Register Card */}
        <div className="bg-zinc-950 border border-zinc-800/80 rounded-3xl p-10 shadow-2xl shadow-black/90">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-semibold text-white">Create Account</h2>
            <p className="text-zinc-400 mt-3">Join MotoFix Pro</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-950 border border-red-900 text-red-400 rounded-2xl text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-950 border border-emerald-900 text-emerald-400 rounded-2xl text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-zinc-400 mb-2 font-medium">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-orange-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2 font-medium">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="mechanic@motofix.pro"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-orange-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2 font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-orange-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2 font-medium">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-orange-500 transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:opacity-70 transition-all text-white font-semibold text-lg py-4 rounded-2xl shadow-lg shadow-orange-600/30"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center mt-8 text-zinc-400">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-500 hover:text-orange-400 font-medium">
              Sign in
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

export default Register;