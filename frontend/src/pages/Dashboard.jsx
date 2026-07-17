// pages/Dashboard.jsx
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import StatCard from "../components/dashboard/StatCard";
import LowStockCard from "../components/dashboard/LowStockCard"; 
import dashboardService from "../services/dashboardService";

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
          console.log('✅ Dashboard stats loaded:', response.data);
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

  // Loading State
  if (authLoading || loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-4"></div>
          <p className="text-xl">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error && !stats) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl max-w-md mx-auto">
          <h2 className="font-semibold mb-2">Failed to load dashboard data</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  // Destructure stats
  const {
    customers = 0,
    vehicles = 0,
    activeJobs = 0,
    completedJobs = 0,
    lowStockItems = 0,
    pendingPayments = 0,
    monthlyRevenue = 0
  } = stats || {};

  // Cards configuration
  const cards = [
    { title: "Customers", value: customers },
    { title: "Vehicles", value: vehicles },
    { title: "Active Repair Jobs", value: activeJobs },
    { title: "Completed Jobs", value: completedJobs },
    { title: "Monthly Revenue", value: `₹${monthlyRevenue.toLocaleString()}` },
    { title: "Pending Payments", value: pendingPayments },
    { title: "Low Stock Items", value: lowStockItems },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Stats Grid - First row with cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        {cards.map((card, index) => (
          <StatCard 
            key={index} 
            title={card.title} 
            value={card.value} 
          />
        ))}
      </div>

      {/* ✅ Second row with Low Stock Card (full width) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* You can add other cards here like Recent Activity, Top Customers, etc. */}
        </div>
        <div className="lg:col-span-1">
          <LowStockCard />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;