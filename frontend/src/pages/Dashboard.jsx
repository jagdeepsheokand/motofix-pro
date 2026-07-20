import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import StatCard from "../components/dashboard/StatCard";
import LowStockCard from "../components/dashboard/LowStockCard";
import { LoadingSpinner, ErrorMessage } from "../components/common";
import dashboardService from "../services/dashboardService";

import RevenueChart from "../components/dashboard/RevenueChart";

function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getDashboardStats();
        
        if (response.success) {
          setStats(response.data);
        } else {
          throw new Error(response.error || 'Failed to fetch stats');
        }
      } catch (err) {
        console.error('❌ Dashboard fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchDashboardStats();
    }
  }, [authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="animate-slideUp">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-8 tracking-tight">Dashboard</h1>
        <ErrorMessage 
          title="Failed to load dashboard data"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const {
    customers = 0,
    vehicles = 0,
    activeJobs = 0,
    completedJobs = 0,
    lowStockItems = 0,
    pendingPayments = 0,
    monthlyRevenue = 0,
    revenueChart = []
  } = stats || {};

  const cards = [
    { title: "Total Customers", value: customers, icon: "👥" },
    { title: "Total Vehicles", value: vehicles, icon: "🏍" },
    { title: "Active Repair Jobs", value: activeJobs, icon: "🔧" },
    { title: "Completed Jobs", value: completedJobs, icon: "✅" },
    { title: "Monthly Revenue", value: `₹${monthlyRevenue.toLocaleString()}`, icon: "💰" },
    { title: "Pending Payments", value: pendingPayments, icon: "⏳" },
    { title: "Low Stock Items", value: lowStockItems, icon: "📦" },
  ];

  return (
    <div className=" animate-slideUp pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">Welcome back, {user?.name || 'Admin'} 👋</p>
        </div>
        <div className="self-start sm:self-auto text-[11px] sm:text-xs text-zinc-500 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
          Last updated: Today
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
        {cards.map((card, index) => (
          <StatCard 
            key={index} 
            title={card.title} 
            value={card.value}
            icon={card.icon}
          />
        ))}
      </div>

      {/* Charts & Side Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Chart - Takes more space */}
        <div className="lg:col-span-8">
          <RevenueChart data={revenueChart} />
        </div>

        {/* Low Stock Card */}
        <div className="lg:col-span-4">
          <LowStockCard />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;