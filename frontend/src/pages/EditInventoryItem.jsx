// pages/EditInventoryItem.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import inventoryService from '../services/inventoryService';
import InventoryForm from '../components/inventory/InventoryForm';

const EditInventoryItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);

  // Fetch inventory item data on mount
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setIsFetching(true);
        setError(null);
        
        const item = await inventoryService.getInventoryItem(id);
        setInitialData(item);
      } catch (err) {
        console.error('Error fetching inventory item:', err);
        setError('Failed to load inventory item. Please try again.');
      } finally {
        setIsFetching(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await inventoryService.updateInventoryItem(id, formData);
      
      // Navigate back to inventory list on success
      navigate('/inventory');
    } catch (err) {
      console.error('Error updating inventory item:', err);
      setError(err.response?.data?.message || 'Failed to update inventory item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/inventory');
  };

  // Retry function
  const handleRetry = async () => {
    try {
      setIsFetching(true);
      setError(null);
      
      const item = await inventoryService.getInventoryItem(id);
      setInitialData(item);
    } catch (err) {
      console.error('Error fetching inventory item:', err);
      setError('Failed to load inventory item. Please try again.');
    } finally {
      setIsFetching(false);
    }
  };

  // Loading state
  if (isFetching) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !initialData) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <p className="font-medium">Error loading inventory item</p>
          <p className="mt-1">{error}</p>
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Retry
            </button>
            <button
              onClick={() => navigate('/inventory')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              Return to Inventory
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Edit Inventory Item</h1>
        <p className="text-gray-600 mt-1">Update details for {initialData?.partName || 'inventory item'}</p>
      </div>

      <InventoryForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        buttonText="Update Item"
        cancelText="Cancel"
        error={error}
      />
    </div>
  );
};

export default EditInventoryItem;