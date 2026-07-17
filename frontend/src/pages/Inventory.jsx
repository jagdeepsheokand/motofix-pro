// pages/Inventory.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import inventoryService from '../services/inventoryService';
import InventoryTable from '../components/inventory/InventoryTable';
import StockAdjustmentModal from '../components/inventory/StockAdjustmentModal'; // ✅ Import modal

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState('all'); // 'all' or 'lowStock'
  
  // ✅ Modal state
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
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete inventory item. Please try again.");
    }
  };

  // ✅ Handler for stock adjustment
  const handleAdjustStock = (item, type = 'increase') => {
    setSelectedItem(item);
    setAdjustmentType(type);
    setShowAdjustmentModal(true);
  };

  // ✅ Handler for modal success
  const handleModalSuccess = async () => {
    await fetchInventoryItems();
  };

  // Fetch items when filter changes
  useEffect(() => {
    fetchInventoryItems();
  }, [filterType]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Inventory</h1>
        
        <div className="flex gap-3">
          <button
            onClick={fetchInventoryItems}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            Refresh
          </button>
          
          <button
            onClick={() => navigate('/inventory/new')}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2 font-medium"
          >
            + Add Item
          </button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => handleFilterChange('all')}
          className={`px-4 py-2 rounded transition font-medium ${
            filterType === 'all'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Items
        </button>
        <button
          onClick={() => handleFilterChange('lowStock')}
          className={`px-4 py-2 rounded transition font-medium flex items-center gap-2 ${
            filterType === 'lowStock'
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <span className="text-lg">⚠️</span>
          Low Stock
          {filterType === 'lowStock' && inventoryItems.length > 0 && (
            <span className="ml-1 bg-white text-red-600 px-2 py-0.5 rounded-full text-xs font-bold">
              {inventoryItems.length}
            </span>
          )}
        </button>
      </div>

      {loading && (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-lg text-gray-600 mt-4">Loading inventory items...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
          <button
            onClick={fetchInventoryItems}
            className="ml-4 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && inventoryItems.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-3xl">
            {filterType === 'lowStock' ? '✅' : '📦'}
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {filterType === 'lowStock' 
              ? 'No low stock items'
              : 'No inventory items yet'
            }
          </h3>
          <p className="text-gray-500 mb-6">
            {filterType === 'lowStock'
              ? 'All items are well stocked! 🎉'
              : 'Get started by adding your first inventory item'
            }
          </p>
          {filterType === 'all' && (
            <button
              onClick={() => navigate('/inventory/new')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Add Your First Item
            </button>
          )}
          {filterType === 'lowStock' && (
            <button
              onClick={() => handleFilterChange('all')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              View All Items
            </button>
          )}
        </div>
      )}

      {!loading && !error && inventoryItems.length > 0 && (
        <>
          <div className="mb-4 text-sm text-gray-600">
            {filterType === 'lowStock' ? (
              <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full">
                Showing {inventoryItems.length} low stock item{inventoryItems.length !== 1 ? 's' : ''}
              </span>
            ) : (
              <span className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full">
                Showing all {inventoryItems.length} item{inventoryItems.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* ✅ Pass onAdjustStock prop */}
          <InventoryTable
            inventoryItems={inventoryItems}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdjustStock={handleAdjustStock}
          />
        </>
      )}

      {/* ✅ Render Modal */}
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