// components/dashboard/LowStockCard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import inventoryService from '../../services/inventoryService';

const LowStockCard = () => {
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLowStockItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const items = await inventoryService.getLowStockItems();
        setLowStockItems(items);
      } catch (err) {
        console.error('Error fetching low stock items:', err);
        setError('Failed to load low stock items');
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockItems();
  }, []);

  const handleViewInventory = () => {
    navigate('/inventory');
  };

  // Loading state
  if (loading) {
    return (
      <div className="card card-glass rounded-2xl p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white tracking-wide">Low Stock Parts</h3>
          <div className="animate-pulse bg-orange-500/20 h-6 w-16 rounded-full"></div>
        </div>
        <div className="space-y-3">
          <div className="animate-pulse bg-slate-700/50 h-10 rounded-xl"></div>
          <div className="animate-pulse bg-slate-700/50 h-10 rounded-xl"></div>
          <div className="animate-pulse bg-slate-700/50 h-10 rounded-xl"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="card card-glass rounded-2xl p-5 md:p-6 border-red-500/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white tracking-wide">Low Stock Parts</h3>
          <span className="text-red-400 text-xl">⚠️</span>
        </div>
        <p className="text-sm text-red-400/80">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 text-sm text-orange-400 hover:text-orange-300 transition-colors font-medium"
        >
          Retry →
        </button>
      </div>
    );
  }

  // No low stock items
  if (lowStockItems.length === 0) {
    return (
      <div className="card card-glass rounded-2xl p-5 md:p-6 hover:border-orange-500/20 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white tracking-wide">Low Stock Parts</h3>
          <span className="text-2xl">✅</span>
        </div>
        <p className="text-zinc-400 text-sm">All parts are well stocked!</p>
        <button
          onClick={handleViewInventory}
          className="mt-4 text-sm text-orange-400 hover:text-orange-300 font-medium inline-flex items-center gap-1.5 transition-colors group"
        >
          View Inventory
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    );
  }

  // Display low stock items
  return (
    <div className="card card-glass rounded-2xl p-5 md:p-6 hover:border-orange-500/20 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-sm font-semibold text-white tracking-wide">Low Stock Parts</h3>
        </div>
        <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-2.5 py-1 rounded-full border border-orange-500/20">
          {lowStockItems.length}
        </span>
      </div>

      {/* List of low stock items */}
      <div className="space-y-2 mb-4 max-h-[240px] overflow-y-auto custom-scroll">
        {lowStockItems.slice(0, 5).map((item) => (
          <div 
            key={item._id}
            className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-all duration-200 cursor-pointer border border-slate-700/30 hover:border-orange-500/20 group"
            onClick={() => navigate(`/inventory/edit/${item._id}`)}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {item.partName}
              </p>
              <p className="text-xs text-zinc-500">
                SKU: {item.sku || 'N/A'} • {item.category || 'Uncategorized'}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-2 flex-shrink-0">
              <span className="text-sm font-bold text-orange-400">
                {item.quantity}
              </span>
              <span className="text-xs text-zinc-500">
                / {item.minimumStock}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Show "View All" if more than 5 items */}
      {lowStockItems.length > 5 && (
        <button
          onClick={handleViewInventory}
          className="text-xs text-orange-400 hover:text-orange-300 font-medium inline-flex items-center gap-1.5 mb-3 transition-colors group"
        >
          View all {lowStockItems.length} low stock items
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      )}

      {/* View Inventory Button */}
      <button
        onClick={handleViewInventory}
        className="w-full mt-1 px-4 py-2.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 hover:text-orange-300 rounded-xl transition-all duration-300 font-medium text-sm border border-orange-500/20 hover:border-orange-500/40 flex items-center justify-center gap-2 group"
      >
        <span>View Full Inventory</span>
        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
    </div>
  );
};

export default LowStockCard;