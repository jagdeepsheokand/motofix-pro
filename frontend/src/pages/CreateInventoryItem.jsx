// pages/CreateInventoryItem.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import inventoryService from '../services/inventoryService';
import InventoryForm from '../components/inventory/InventoryForm';

const CreateInventoryItem = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await inventoryService.createInventoryItem(formData);
      
      // Navigate back to inventory list on success
      navigate('/inventory');
    } catch (err) {
      console.error('Error creating inventory item:', err);
      setError(err.response?.data?.message || 'Failed to create inventory item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/inventory');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Create Inventory Item</h1>
        <p className="text-gray-600 mt-1">Add a new part or accessory to your inventory</p>
      </div>

      <InventoryForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        buttonText="Create Item"
        cancelText="Cancel"
        error={error}
      />
    </div>
  );
};

export default CreateInventoryItem;