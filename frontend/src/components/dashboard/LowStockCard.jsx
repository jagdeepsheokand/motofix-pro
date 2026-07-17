// components/dashboard/LowStockCard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import inventoryService from '../../services/inventoryService';
import { ExclamationTriangleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

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
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Low Stock Parts</h3>
          <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
        </div>
        <div className="space-y-3">
          <div className="animate-pulse bg-gray-200 h-5 w-3/4 rounded"></div>
          <div className="animate-pulse bg-gray-200 h-5 w-1/2 rounded"></div>
          <div className="animate-pulse bg-gray-200 h-5 w-2/3 rounded"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Low Stock Parts</h3>
          <span className="text-red-500">⚠️</span>
        </div>
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          Retry
        </button>
      </div>
    );
  }

  // No low stock items
  if (lowStockItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Low Stock Parts</h3>
          <span className="text-2xl">✅</span>
        </div>
        <p className="text-gray-600">All parts are well stocked!</p>
        <button
          onClick={handleViewInventory}
          className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
        >
          View Inventory
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // Display low stock items
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-800">Low Stock Parts</h3>
        </div>
        <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-1 rounded-full">
          {lowStockItems.length}
        </span>
      </div>

      {/* List of low stock items */}
      <div className="space-y-2 mb-4">
        {lowStockItems.slice(0, 5).map((item) => (
          <div 
            key={item._id}
            className="flex items-center justify-between p-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
            onClick={() => navigate(`/inventory/edit/${item._id}`)}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {item.partName}
              </p>
              <p className="text-xs text-gray-600">
                SKU: {item.sku} • {item.category || 'Uncategorized'}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <span className="text-sm font-semibold text-red-600">
                {item.quantity}
              </span>
              <span className="text-xs text-gray-500">
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
          className="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 mb-3"
        >
          View all {lowStockItems.length} low stock items
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      )}

      {/* View Inventory Button */}
      <button
        onClick={handleViewInventory}
        className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
      >
        View Inventory →
      </button>
    </div>
  );
};

export default LowStockCard;