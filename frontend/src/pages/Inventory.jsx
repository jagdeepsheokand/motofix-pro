// pages/Inventory.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import inventoryService from '../services/inventoryService';
import InventoryTable from '../components/inventory/inventoryTable';
import StockAdjustmentModal from '../components/inventory/StockAdjustmentModal';
import { LoadingSpinner, ErrorMessage } from '../components/common';

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState('increase');
  
  const navigate = useNavigate();

  const fetchInventoryItems = async () => {
    try {
      setLoading(true);
      setError("");

      let items;
      if (filterType === 'lowStock') {
        items = await inventoryService.getLowStockItems();
      } else {
        items = await inventoryService.getInventoryItems();
      }
      
      setInventoryItems(items);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load inventory items.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
  };

  const handleEdit = (id) => {
    navigate(`/inventory/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inventory item?")) {
      return;
    }

    try {
      await inventoryService.deleteInventoryItem(id);
      await fetchInventoryItems();
      toast.success("Inventory item deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(
  err.response?.data?.message ||
  "Failed to delete inventory item."
);
    }
  };

  const handleAdjustStock = (item, type = 'increase') => {
    setSelectedItem(item);
    setAdjustmentType(type);
    setShowAdjustmentModal(true);
  };

  const handleModalSuccess = async () => {
    await fetchInventoryItems();
  };

  useEffect(() => {
    fetchInventoryItems();
  }, [filterType]);

  // Filter items based on search
  const filteredItems = inventoryItems.filter(item =>
    item.partName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const totalItems = inventoryItems.length;
  const lowStockItems = inventoryItems.filter(item => item.quantity <= item.minimumStock).length;
  const outOfStockItems = inventoryItems.filter(item => item.quantity === 0).length;
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0);

  return (
    <div className="animate-slideUp">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Inventory</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Manage your inventory • <span className="text-orange-400 font-medium">{totalItems}</span> total items
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={fetchInventoryItems}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 transition-all duration-200 flex items-center gap-2 justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <button
            onClick={() => navigate('/inventory/new')}
            className="btn-primary px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 whitespace-nowrap w-full sm:w-auto justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Item
          </button>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-4 hover:border-orange-500/30 transition-all duration-300">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Total Items</p>
          <p className="text-2xl font-bold text-white">{totalItems}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-4 hover:border-yellow-500/30 transition-all duration-300">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Low Stock</p>
          <p className="text-2xl font-bold text-yellow-400">{lowStockItems}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-4 hover:border-red-500/30 transition-all duration-300">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Out of Stock</p>
          <p className="text-2xl font-bold text-red-400">{outOfStockItems}</p>
        </div>
        {/* <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-4 hover:border-emerald-500/30 transition-all duration-300">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Total Value</p>
          <p className="text-2xl font-bold text-emerald-400">₹{totalValue.toLocaleString()}</p>
        </div> */}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              filterType === 'all'
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                : 'bg-slate-800/50 text-zinc-400 hover:text-white border border-slate-700/50 hover:border-slate-600/50'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => handleFilterChange('lowStock')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              filterType === 'lowStock'
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                : 'bg-slate-800/50 text-zinc-400 hover:text-white border border-slate-700/50 hover:border-slate-600/50'
            }`}
          >
            ⚠️ Low Stock
            {filterType === 'lowStock' && inventoryItems.length > 0 && (
              <span className="bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full text-xs font-bold">
                {inventoryItems.length}
              </span>
            )}
          </button>
        </div>
        
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by part name, SKU, category or supplier..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-white placeholder-zinc-500 transition-all duration-200"
          />
        </div>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="px-4 py-2.5 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="min-h-[60vh] flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading inventory items..." />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <ErrorMessage 
          title="Failed to load inventory"
          message={error}
          onRetry={fetchInventoryItems}
        />
      )}

      {/* Empty State */}
      {!loading && !error && inventoryItems.length === 0 && (
        <div className="bg-slate-800/30 border border-dashed border-slate-700/50 rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
            {filterType === 'lowStock' ? '✅' : '📦'}
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {filterType === 'lowStock' 
              ? 'No low stock items'
              : 'No inventory items yet'
            }
          </h3>
          <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto">
            {filterType === 'lowStock'
              ? 'All items are well stocked! 🎉'
              : 'Get started by adding your first inventory item'
            }
          </p>
          {filterType === 'all' && (
            <button
              onClick={() => navigate('/inventory/new')}
              className="btn-primary px-6 py-3 rounded-xl text-sm"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Your First Item
              </span>
            </button>
          )}
          {filterType === 'lowStock' && (
            <button
              onClick={() => handleFilterChange('all')}
              className="btn-primary px-6 py-3 rounded-xl text-sm"
            >
              View All Items
            </button>
          )}
        </div>
      )}

      {/* No Search Results */}
      {!loading && !error && inventoryItems.length > 0 && filteredItems.length === 0 && (
        <div className="bg-slate-800/30 border border-dashed border-slate-700/50 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-semibold text-white mb-1">No matching items</h3>
          <p className="text-zinc-400 text-sm">
            No inventory items found matching "<span className="text-orange-400">{searchTerm}</span>"
          </p>
          <button
            onClick={() => setSearchTerm('')}
            className="mt-4 text-sm text-orange-400 hover:text-orange-300 transition-colors"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Inventory Grid/Table */}
      {!loading && !error && filteredItems.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-zinc-500">
              {filterType === 'lowStock' ? (
                <span className="text-yellow-400">⚠️</span>
              ) : (
                <span>Showing <span className="text-zinc-300 font-medium">{filteredItems.length}</span> of <span className="text-zinc-300 font-medium">{inventoryItems.length}</span> items</span>
              )}
            </span>
          </div>
          <InventoryTable
            inventoryItems={filteredItems}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdjustStock={handleAdjustStock}
          />
        </>
      )}

      {/* Stock Adjustment Modal */}
      <StockAdjustmentModal
        isOpen={showAdjustmentModal}
        item={selectedItem}
        adjustmentType={adjustmentType}
        onClose={() => {
          setShowAdjustmentModal(false);
          setSelectedItem(null);
        }}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default Inventory;